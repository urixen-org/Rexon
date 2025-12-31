package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"runtime"
	"strings"
	"time"

	"rexon/config"
	"rexon/filemanager"
	"rexon/java"
	"rexon/mc"
	"rexon/playit"
	"rexon/process"
	"rexon/sql"
	"rexon/types"
	"rexon/utils"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var mgr = process.NewManager()

var upgrader = websocket.Upgrader{
	CheckOrigin:     func(r *http.Request) bool { return true },
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

var STDIN, STDOUT, STDERR = "STDIN", "STDOUT", "STDERR"

func HandleStart(ctx *gin.Context) {
	if !utils.VerifyMe(ctx) {
		return
	}

	startupCmd := sql.GetValue("startup_command")
	if startupCmd == "" {
		startupCmd = "{{java}} -jar {{serverjar}} --nogui"
	}

	replacements := map[string]string{
		"{{serverjar}}": sql.GetValue("server_jar_name"),
		"{{memory}}":    sql.GetValue("server_memory"),
		"{{port}}":      sql.GetValue("server_port"),
		"{{serverdir}}": config.LoadEnv().ServerFolder,
	}

	if replacements["{{serverjar}}"] == "" {
		replacements["{{serverjar}}"] = "server.jar"
	}
	if replacements["{{memory}}"] == "" {
		replacements["{{memory}}"] = "1G"
	}
	if replacements["{{port}}"] == "" {
		replacements["{{port}}"] = "25565"
	}

	for placeholder, value := range replacements {
		startupCmd = strings.ReplaceAll(startupCmd, placeholder, value)
	}

	cmdParts := strings.Fields(startupCmd)
	cmdParts[0] = sql.GetValue("java_default")
	if len(cmdParts) == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "startup command is empty"})
		return
	}

	command := cmdParts[0]
	args := cmdParts[1:]
	fmt.Println(command, args)

	session, err := mgr.Start(command, args...)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, types.MsgFormat{
		Type:    "action",
		Status:  "starting",
		Payload: session,
	})
}

func HandleStop(ctx *gin.Context) {
	if !utils.VerifyMe(ctx) {
		return
	}
	if err := mgr.Stop(); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"status": "stopped"})
}

func HandleStatus(ctx *gin.Context) {
	if !utils.VerifyMe(ctx) {
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"running":   mgr.IsRunning(),
		"sessionID": mgr.GetSessionID(),
	})
}

func HandleWebSocket(ctx *gin.Context) {
	ws, err := upgrader.Upgrade(ctx.Writer, ctx.Request, nil)
	if err != nil {
		return
	}
	defer ws.Close()

	logChan, err := mgr.Subscribe()
	if err != nil {
		utils.SendMsg(ws, "error", "fail", "Subscription error: "+err.Error())
		return
	}
	defer mgr.Unsubscribe(logChan)

	ws.SetReadDeadline(time.Now().Add(60 * time.Second))
	ws.SetPongHandler(func(string) error {
		ws.SetReadDeadline(time.Now().Add(60 * time.Second))
		return nil
	})

	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	wsCtx, cancel := context.WithCancel(context.Background())
	defer cancel()

	verified := false

	go func() {
		for {
			msgType, message, err := ws.ReadMessage()
			if err != nil {
				cancel()
				return
			}

			if msgType == websocket.TextMessage {
				var passcode struct {
					Passcode interface{} `json:"passcode"`
				}

				if err := json.Unmarshal(message, &passcode); err == nil && passcode.Passcode != nil {
					passcodeStr := fmt.Sprintf("%v", passcode.Passcode)
					if passcodeStr != sql.GetValue("passcode") {
						utils.SendMsg(ws, "verification", "fail", "Invalid passcode")
						cancel()
						return
					} else {
						verified = true
						utils.SendMsg(ws, "verification", "success", "Passcode verified")
						continue
					}
				}
			}

			if !verified {
				utils.SendMsg(ws, "error", "fail", "Not authenticated")
				continue
			}

			if msgType == websocket.TextMessage {
				var cmd struct {
					Command string `json:"command"`
				}
				if err := json.Unmarshal(message, &cmd); err == nil && cmd.Command != "" {
					if err := mgr.Write(cmd.Command); err != nil {
						utils.SendMsg(ws, "error", "fail", "Error sending command: "+err.Error())
					}
				} else {
					if err := mgr.Write(string(message)); err != nil {
						utils.SendMsg(ws, "error", "fail", "Error sending command: "+err.Error())
					}
				}
			}
		}
	}()

	utils.SendMsg(ws, "status", "running", mgr.GetSessionID())

	for {
		select {
		case line, ok := <-logChan:
			if !ok {
				utils.SendMsg(ws, "status", "stopped", "Process stopped")
				return
			}
			if strings.Contains(line, STDOUT) {
				utils.SendMsg(ws, "log", STDOUT, line)
			} else if strings.Contains(line, STDERR) {
				utils.SendMsg(ws, "log", STDERR, line)
			} else {
				utils.SendMsg(ws, "log", "UNKNOWN", line)
			}
		case <-ticker.C:
			if err := ws.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		case <-wsCtx.Done():
			return
		}
	}
}

func HandlePasscodeVerify(ctx *gin.Context) {
	var body struct {
		Passcode interface{} `json:"passcode"`
	}

	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.JSON(http.StatusBadRequest, types.MsgFormat{
			Type:    "verification",
			Status:  "failed",
			Payload: "invalid request",
		})
		return
	}

	passcodeStr := fmt.Sprintf("%v", body.Passcode)
	if passcodeStr != sql.GetValue("passcode") {
		ctx.JSON(http.StatusUnauthorized, types.MsgFormat{
			Type:    "verification",
			Status:  "failed",
			Payload: "invalid passcode",
		})
		return
	}

	ctx.JSON(http.StatusOK, types.MsgFormat{
		Type:    "verification",
		Status:  "passed",
		Payload: "success",
	})
}

func HandleFileManagerList(ctx *gin.Context) {
	if !utils.VerifyMe(ctx) {
		return
	}

	fmt.Println(ctx.Query("path"))
	list, err := filemanager.ListDir(ctx.Query("path"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, types.MsgFormat{
			Type:    "list",
			Status:  "failed",
			Payload: err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, types.MsgFormat{
		Type:    "list",
		Status:  "success",
		Payload: list,
	})
}

func HandleFileManagerRead(ctx *gin.Context) {
	if !utils.VerifyMe(ctx) {
		return
	}

	p := ctx.Query("path")
	ctx.File(filepath.Join(filemanager.BaseDir, p))
}

func HandleFileManagerWrite(ctx *gin.Context) {
	defer func() {
		if r := recover(); r != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": fmt.Sprintf("panic: %v", r),
			})
		}
	}()

	if ctx.Request.Body == nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "empty request body"})
		return
	}

	content, err := ctx.GetRawData()
	if err != nil {
		ctx.JSON(http.StatusBadRequest, types.MsgFormat{
			Type:    "write",
			Status:  "failed",
			Payload: err.Error(),
		})
		return
	}

	var body map[string]interface{}
	if err := json.Unmarshal(content, &body); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON"})
		return
	}

	ctx.Set("rawBody", body)

	if !utils.VerifyMe(ctx) {
		return
	}

	err = filemanager.WriteContent(ctx.Query("path"), content)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, types.MsgFormat{
			Type:    "write",
			Status:  "failed",
			Payload: err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, types.MsgFormat{
		Type:    "write",
		Status:  "success",
		Payload: "success",
	})
}

func HandleFileManagerDownload(ctx *gin.Context) {
	if !utils.VerifyMe(ctx) {
		return
	}

	base := filemanager.BaseDir
	relPath := ctx.Query("path")
	if relPath == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "missing path"})
		return
	}

	relPath = strings.TrimPrefix(relPath, "/")

	cleaned := filepath.Clean(relPath)
	fullpath := filepath.Join(base, cleaned)

	absBase, _ := filepath.Abs(base)
	absFull, _ := filepath.Abs(fullpath)

	if !strings.HasPrefix(absFull, absBase) {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid path"})
		return
	}

	info, err := os.Stat(absFull)
	if os.IsNotExist(err) || info.IsDir() {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "file not found"})
		return
	}

	ctx.FileAttachment(absFull, info.Name())
}

func HandleFileManagerUpload(ctx *gin.Context) {
	defer func() {
		if r := recover(); r != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": fmt.Sprintf("panic: %v", r),
			})
		}
	}()

	if !utils.VerifyMe(ctx) {
		return
	}

	base := filemanager.BaseDir

	targetDir := ctx.Query("path")
	if targetDir == "" {
		targetDir = "/"
	}

	absDir, err := utils.Resolve(base, targetDir)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid path"})
		return
	}

	info, err := os.Stat(absDir)
	if err != nil || !info.IsDir() {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "target is not a directory"})
		return
	}

	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "missing file"})
		return
	}

	savePath := filepath.Join(absDir, filepath.Base(file.Filename))

	if err := ctx.SaveUploadedFile(file, savePath); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "upload failed"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"status": "success",
		"path":   savePath,
		"name":   file.Filename,
	})
}

func HandleFileManagerDelete(ctx *gin.Context) {
	defer func() {
		if r := recover(); r != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": fmt.Sprintf("panic: %v", r),
			})
		}
	}()

	if ctx.Request.Body == nil {
		ctx.JSON(400, gin.H{"error": "empty request body"})
		return
	}

	var body map[string]interface{}
	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.JSON(400, gin.H{"error": "invalid JSON"})
		return
	}

	ctx.Set("rawBody", body)

	if !utils.VerifyMe(ctx) {
		return
	}

	path := fmt.Sprintf("%v", body["path"])
	if path == "" {
		ctx.JSON(400, gin.H{"error": "path is required"})
		return
	}

	if err := filemanager.DeletePath(path); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"status": "deleted"})
}

func HandleFileManagerRename(ctx *gin.Context) {
	defer func() {
		if r := recover(); r != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": fmt.Sprintf("panic: %v", r),
			})
		}
	}()

	if ctx.Request.Body == nil {
		ctx.JSON(400, gin.H{"error": "empty request body"})
		return
	}

	var body map[string]interface{}
	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.JSON(400, gin.H{"error": "invalid JSON"})
		return
	}

	ctx.Set("rawBody", body)

	if !utils.VerifyMe(ctx) {
		return
	}

	oldPath := fmt.Sprintf("%v", body["old"])
	newPath := fmt.Sprintf("%v", body["new"])

	if oldPath == "" || newPath == "" {
		ctx.JSON(400, gin.H{"error": "old and new paths are required"})
		return
	}

	if err := filemanager.RenamePath(oldPath, newPath); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"status": "renamed"})
}

func HandleFileManagerMove(ctx *gin.Context) {
	defer func() {
		if r := recover(); r != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": fmt.Sprintf("panic: %v", r),
			})
		}
	}()

	if ctx.Request.Body == nil {
		ctx.JSON(400, gin.H{"error": "empty request body"})
		return
	}

	var body map[string]interface{}
	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.JSON(400, gin.H{"error": "invalid JSON"})
		return
	}

	ctx.Set("rawBody", body)

	if !utils.VerifyMe(ctx) {
		return
	}

	path := fmt.Sprintf("%v", body["path"])
	newDir := fmt.Sprintf("%v", body["new_dir"])

	if path == "" || newDir == "" {
		ctx.JSON(400, gin.H{"error": "path and newDir are required"})
		return
	}

	if err := filemanager.MovePath(path, newDir); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"status": "moved"})
}

func HandleFileManagerCopy(ctx *gin.Context) {
	defer func() {
		if r := recover(); r != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": fmt.Sprintf("panic: %v", r),
			})
		}
	}()

	if ctx.Request.Body == nil {
		ctx.JSON(400, gin.H{"error": "empty request body"})
		return
	}

	var body map[string]interface{}
	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.JSON(400, gin.H{"error": "invalid JSON"})
		return
	}

	ctx.Set("rawBody", body)

	if !utils.VerifyMe(ctx) {
		return
	}

	src := fmt.Sprintf("%v", body["src"])
	dst := fmt.Sprintf("%v", body["dst"])

	if src == "" || dst == "" {
		ctx.JSON(400, gin.H{"error": "src and dst are required"})
		return
	}

	if err := filemanager.CopyPath(src, dst); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"status": "copied"})
}

func HandleFileManagerCreateDir(ctx *gin.Context) {
	defer func() {
		if r := recover(); r != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": fmt.Sprintf("panic: %v", r),
			})
		}
	}()

	if ctx.Request.Body == nil {
		ctx.JSON(400, gin.H{"error": "empty request body"})
		return
	}

	var body map[string]interface{}
	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.JSON(400, gin.H{"error": "invalid JSON"})
		return
	}

	ctx.Set("rawBody", body)

	if !utils.VerifyMe(ctx) {
		return
	}

	path := fmt.Sprintf("%v", body["path"])

	if path == "" {
		ctx.JSON(400, gin.H{"error": "path is required"})
		return
	}

	if err := filemanager.CreateDir(path); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"status": "directory created"})
}

func HandleSoftwareInstall(ctx *gin.Context) {
	defer func() {
		if r := recover(); r != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": fmt.Sprintf("panic: %v", r),
			})
		}
	}()

	if ctx.Request.Body == nil {
		ctx.JSON(400, gin.H{"error": "empty request body"})
		return
	}

	var body map[string]interface{}
	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.JSON(400, gin.H{"error": "invalid JSON"})
		return
	}

	ctx.Set("rawBody", body)

	if !utils.VerifyMe(ctx) {
		return
	}

	url := fmt.Sprintf("%v", body["url"])

	if url == "" {
		ctx.JSON(400, gin.H{"error": "url is required"})
		return
	}
	go func(url, path string) {
		if err := utils.DownloadFile(path, url); err != nil {
			log.Printf("[INSTALL] download failed: %v", err)
		}
	}(url, config.LoadEnv().ServerFolder+"/server.jar")

	ctx.JSON(http.StatusAccepted, types.MsgFormat{
		Status:  "installing",
		Payload: "Download started in background",
	})

}

func HandleFileManagerMetadata(ctx *gin.Context) {
	if !utils.VerifyMe(ctx) {
		return
	}

	relPath := ctx.Query("path")
	if relPath == "" {
		ctx.JSON(400, gin.H{"error": "path is required"})
		return
	}

	fullPath := filepath.Join(filemanager.BaseDir, filepath.Clean(relPath))
	if !strings.HasPrefix(fullPath, filepath.Clean(filemanager.BaseDir)) {
		ctx.JSON(400, gin.H{"error": "invalid path"})
		return
	}

	info, err := os.Stat(fullPath)
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{
		"name":    info.Name(),
		"size":    info.Size(),
		"mode":    info.Mode().String(),
		"modTime": info.ModTime(),
		"isDir":   info.IsDir(),
	})
}

func HandleFileManagerSearch(ctx *gin.Context) {
	if !utils.VerifyMe(ctx) {
		return
	}

	query := ctx.Query("query")
	base := ctx.Query("path")
	if base == "" {
		base = "."
	}

	fullBase := filepath.Join(filemanager.BaseDir, filepath.Clean(base))
	if !strings.HasPrefix(fullBase, filepath.Clean(filemanager.BaseDir)) {
		ctx.JSON(400, gin.H{"error": "invalid path"})
		return
	}

	var results []string
	filepath.Walk(fullBase, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return nil
		}
		if strings.Contains(info.Name(), query) {
			rel, _ := filepath.Rel(filemanager.BaseDir, path)
			results = append(results, rel)
		}
		return nil
	})

	ctx.JSON(200, gin.H{"results": results})
}

func HandleFileManagerCompress(ctx *gin.Context) {
	defer func() {
		if r := recover(); r != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": fmt.Sprintf("panic: %v", r),
			})
		}
	}()

	if ctx.Request.Body == nil {
		ctx.JSON(400, gin.H{"error": "empty request body"})
		return
	}

	var body map[string]interface{}
	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.JSON(400, gin.H{"error": "invalid JSON"})
		return
	}

	ctx.Set("rawBody", body)

	if !utils.VerifyMe(ctx) {
		return
	}

	pathsRaw, ok := body["paths"].([]interface{})
	if !ok {
		ctx.JSON(400, gin.H{"error": "paths must be an array"})
		return
	}

	var paths []string
	for _, p := range pathsRaw {
		paths = append(paths, fmt.Sprintf("%v", p))
	}

	dst := fmt.Sprintf("%v", body["dst"])

	if len(paths) == 0 || dst == "" {
		ctx.JSON(400, gin.H{"error": "paths and dst are required"})
		return
	}

	dstPath := filepath.Join(filemanager.BaseDir, filepath.Clean(dst))
	if !strings.HasPrefix(dstPath, filepath.Clean(filemanager.BaseDir)) {
		ctx.JSON(400, gin.H{"error": "invalid destination path"})
		return
	}

	if err := filemanager.CompressPaths(paths, dstPath); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"status": "compressed", "zip": dst})
}

func HandleFileManagerExtract(ctx *gin.Context) {
	defer func() {
		if r := recover(); r != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": fmt.Sprintf("panic: %v", r),
			})
		}
	}()

	if ctx.Request.Body == nil {
		ctx.JSON(400, gin.H{"error": "empty request body"})
		return
	}

	var body map[string]interface{}
	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.JSON(400, gin.H{"error": "invalid JSON"})
		return
	}

	ctx.Set("rawBody", body)

	if !utils.VerifyMe(ctx) {
		return
	}

	zipRel := fmt.Sprintf("%v", body["zip"])
	dstRel := fmt.Sprintf("%v", body["dst"])

	if zipRel == "" || dstRel == "" {
		ctx.JSON(400, gin.H{"error": "zip and dst are required"})
		return
	}

	zipPath := filepath.Join(filemanager.BaseDir, filepath.Clean(zipRel))
	dstPath := filepath.Join(filemanager.BaseDir, filepath.Clean(dstRel))

	if !strings.HasPrefix(zipPath, filepath.Clean(filemanager.BaseDir)) ||
		!strings.HasPrefix(dstPath, filepath.Clean(filemanager.BaseDir)) {
		ctx.JSON(400, gin.H{"error": "invalid path"})
		return
	}

	if err := filemanager.ExtractZip(zipPath, dstPath); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"status": "extracted", "to": dstRel})
}

func HandleListTunnel(ctx *gin.Context) {
	if !utils.VerifyMe(ctx) {
		return
	}
	tunnelId := ctx.Query("tunnel")
	var client = playit.NewClient(sql.GetValue("playit_secret"))
	var data []byte
	var err error
	if tunnelId != "" {
		data, err = client.ListTunnels(tunnelId, sql.GetValue("playit_agent_id"))
	} else {
		data, err = client.ListTunnels(nil, sql.GetValue("playit_agent_id"))
	}
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	var unified types.Tunnel
	json.Unmarshal(data, &unified)
	ctx.JSON(200, unified)

}

func HandleAgentRunData(ctx *gin.Context) {
	if !utils.VerifyMe(ctx) {
		return
	}
	var client = playit.NewClient(sql.GetValue("playit_secret"))
	data, err := client.GetAgentRunData()
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	var unified types.AgentRunData
	json.Unmarshal(data, &unified)
	ctx.JSON(200, unified)
}

func HandleQueryRegion(ctx *gin.Context) {
	if !utils.VerifyMe(ctx) {
		return
	}
	var client = playit.NewClient(sql.GetValue("playit_secret"))
	var data []byte
	var err error

	data, err = client.QueryRegion(nil)

	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	var unified any
	json.Unmarshal(data, &unified)
	ctx.JSON(200, unified)

}

type CreateTunnelReq struct {
	Name       string `json:"name" binding:"required"`
	TunnelType string `json:"tunnel_type" binding:"required"`
	PortType   string `json:"port_type" binding:"required"`
	PortCount  int    `json:"port_count" binding:"required"`
	Port       int    `json:"port" binding:"required"`
}

func HandleCreateTunnel(ctx *gin.Context) {
	defer func() {
		if r := recover(); r != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": fmt.Sprintf("panic: %v", r),
			})
		}
	}()

	if ctx.Request.Body == nil {
		ctx.JSON(400, gin.H{"error": "empty request body"})
		return
	}

	var body map[string]interface{}
	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.JSON(400, gin.H{"error": "invalid JSON"})
		return
	}

	ctx.Set("rawBody", body)

	if !utils.VerifyMe(ctx) {
		return
	}

	client := playit.NewClient(sql.GetValue("playit_secret"))

	name, ok := body["name"].(string)
	if !ok {
		ctx.JSON(400, gin.H{"error": "name must be string"})
		return
	}

	tunnelType, ok := body["tunnel_type"].(string)
	if !ok {
		ctx.JSON(400, gin.H{"error": "tunnel_type must be string"})
		return
	}

	portType, ok := body["port_type"].(string)
	if !ok {
		ctx.JSON(400, gin.H{"error": "port_type must be string"})
		return
	}

	portCountFloat, ok := body["port_count"].(float64)
	if !ok {
		ctx.JSON(400, gin.H{"error": "port_count must be number"})
		return
	}
	portCount := int(portCountFloat)

	port, ok := body["port"].(int)
	if !ok {
		ctx.JSON(400, gin.H{"error": "port must be number"})
		return
	}

	if tunnelType == "minecraft-java" {
		data, err := client.CreateJavaTunnel(
			sql.GetValue("playit_agent_id"),
			"172.0.0.1",
			port,
			"tcp",
			portCount,
		)

		if err != nil {
			ctx.JSON(500, gin.H{"error": err.Error()})
			return
		}
		var unified any
		json.Unmarshal(data, &unified)
		ctx.JSON(200, unified)
	} else {
		data, err := client.CreateTunnel(
			name,
			tunnelType,
			portType,
			portCount,
			sql.GetValue("playit_agent_id"),
			"0.0.0.0",
			port,
			true,
		)

		if err != nil {
			ctx.JSON(500, gin.H{"error": err.Error()})
			return
		}
		var unified any
		json.Unmarshal(data, &unified)
		ctx.JSON(200, unified)
	}
}

func HandleTunnelDelete(ctx *gin.Context) {
	defer func() {
		if r := recover(); r != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": fmt.Sprintf("panic: %v", r),
			})
		}
	}()

	if ctx.Request.Body == nil {
		ctx.JSON(400, gin.H{"error": "empty request body"})
		return
	}

	var body map[string]interface{}
	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.JSON(400, gin.H{"error": "invalid JSON"})
		return
	}

	ctx.Set("rawBody", body)

	if !utils.VerifyMe(ctx) {
		return
	}
	tunnelId := body["tunnel_id"].(string)
	client := playit.NewClient(sql.GetValue("playit_secret"))
	data, err := client.DeleteTunnel(tunnelId)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	var unified any
	json.Unmarshal(data, &unified)
	ctx.JSON(200, unified)
}

func HandleUpdateTunnel(ctx *gin.Context) {
	defer func() {
		if r := recover(); r != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": fmt.Sprintf("panic: %v", r),
			})
		}
	}()

	if ctx.Request.Body == nil {
		ctx.JSON(400, gin.H{"error": "empty request body"})
		return
	}

	var body map[string]interface{}
	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.JSON(400, gin.H{"error": "invalid JSON"})
		return
	}

	ctx.Set("rawBody", body)

	if !utils.VerifyMe(ctx) {
		return
	}

	client := playit.NewClient(sql.GetValue("playit_secret"))

	tunnelid, ok := body["tunnel_id"].(string)
	if !ok {
		ctx.JSON(400, gin.H{"error": "tunnel_id must be string"})
		return
	}

	enabled, ok := body["enabled"].(bool)
	if !ok {
		ctx.JSON(400, gin.H{"error": "name must be string"})
		return
	}

	portFloat, ok := body["port"].(float64)
	if !ok {
		ctx.JSON(400, gin.H{"error": "port must be number"})
		return
	}
	port := int(portFloat)

	data, err := client.UpdateTunnel(
		tunnelid,
		"0.0.0.0",
		port,
		sql.GetValue("playit_agent_id"),
		enabled,
	)

	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	var unified any
	json.Unmarshal(data, &unified)
	ctx.JSON(200, unified)
}

type Player struct {
	UUID      string `json:"uuid"`
	Name      string `json:"name"`
	ExpiresOn string `json:"expiresOn"`
}

func HandleGetAllPlayer(ctx *gin.Context) {
	if !utils.VerifyMe(ctx) {
		return
	}
	serverdir := config.LoadEnv().ServerFolder
	filePath := filepath.Join(serverdir, "usercache.json")

	data, err := ioutil.ReadFile(filePath)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to read usercache.json",
			"msg":   err.Error(),
		})
		return
	}

	var players []Player
	if err := json.Unmarshal(data, &players); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to parse JSON",
			"msg":   err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"players": players,
	})
}

var dashedUUID = regexp.MustCompile(
	`^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$`,
)

func requireUUID(ctx *gin.Context) (string, bool) {
	uuid := ctx.Param("UUID")
	if !dashedUUID.MatchString(uuid) {
		ctx.JSON(400, gin.H{"error": "invalid uuid format"})
		return "", false
	}
	return uuid, true
}

func panicGuard(ctx *gin.Context) {
	if r := recover(); r != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Sprintf("panic: %v", r),
		})
	}
}

func bindRawBody(ctx *gin.Context) map[string]interface{} {
	if ctx.Request.Body != nil {
		var body map[string]interface{}
		_ = ctx.ShouldBindJSON(&body)
		ctx.Set("rawBody", body)
		return body
	}
	return nil
}

type BanInfo struct {
	UUID    string `json:"uuid"`
	Name    string `json:"name"`
	Created string `json:"created"`
	Source  string `json:"source"`
	Expires string `json:"expires"`
	Reason  string `json:"reason"`
}

type WhitelistInfo struct {
	UUID string `json:"uuid"`
	Name string `json:"name"`
}

type OppedInfo struct {
	UUID                string `json:"uuid"`
	Name                string `json:"name"`
	Level               int    `json:"level"`
	BypassesPlayerLimit bool   `json:"bypassesPlayerLimit"`
}

func HandleGetPlayerData(ctx *gin.Context) {
	bindRawBody(ctx)
	if !utils.VerifyMe(ctx) {
		return
	}

	uuid, ok := requireUUID(ctx)
	if !ok {
		return
	}

	env := config.LoadEnv()
	base := env.ServerFolder
	props, err := mc.LoadProperties(base + "server.properties")
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
	}
	world, _ := props.Get("level-name")

	player, err := mc.LoadPlayer(base+world, uuid)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	isBanned, banInfo, _ := mc.ExistsByUUID(base+"/banned-players.json", uuid)
	player["is_banned"] = isBanned
	if isBanned {
		player["ban_info"] = banInfo
	}

	isWhitelisted, whitelistInfo, _ := mc.ExistsByUUID(base+"/whitelist.json", uuid)
	player["is_whitelisted"] = isWhitelisted
	if isWhitelisted {
		player["whitelist_info"] = whitelistInfo
	}

	isOpped, oppInfo, _ := mc.ExistsByUUID(base+"/ops.json", uuid)
	player["is_opped"] = isOpped
	if isOpped {
		player["opped_info"] = oppInfo
	}

	ctx.JSON(200, player)
}

func HandlePlayerBan(ctx *gin.Context) {
	defer panicGuard(ctx)
	body := bindRawBody(ctx)
	if !utils.VerifyMe(ctx) {
		return
	}

	uuid, ok := requireUUID(ctx)
	if !ok {
		return
	}

	env := config.LoadEnv()
	path := env.ServerFolder + "/banned-players.json"
	arr, err := mc.ReadJSONArray(path)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	data := BanInfo{
		UUID:    uuid,
		Name:    fmt.Sprintf("%v", body["name"]),
		Created: time.Now().Format("2006-01-02 15:04:05 -0700"),
		Source:  "Rexon",
		Expires: "forever",
		Reason:  fmt.Sprintf("%v", body["reason"]),
	}

	arr = append(arr, map[string]interface{}{
		"uuid":    data.UUID,
		"name":    data.Name,
		"created": data.Created,
		"source":  data.Source,
		"expires": data.Expires,
		"reason":  data.Reason,
	})

	if err := mc.WriteJSONArray(path, arr); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"success": true})
}

func HandlePlayerUnban(ctx *gin.Context) {
	defer panicGuard(ctx)
	bindRawBody(ctx)
	if !utils.VerifyMe(ctx) {
		return
	}

	uuid, ok := requireUUID(ctx)
	if !ok {
		return
	}

	env := config.LoadEnv()
	if err := mc.RemoveByUUID(env.ServerFolder+"/banned-players.json", uuid); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"success": true})
}

func HandlePlayerWhitelist(ctx *gin.Context) {
	defer panicGuard(ctx)
	body := bindRawBody(ctx)
	if !utils.VerifyMe(ctx) {
		return
	}

	uuid, ok := requireUUID(ctx)
	if !ok {
		return
	}

	env := config.LoadEnv()
	path := env.ServerFolder + "/whitelist.json"
	arr, err := mc.ReadJSONArray(path)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	data := WhitelistInfo{
		UUID: uuid,
		Name: fmt.Sprintf("%v", body["name"]),
	}

	arr = append(arr, map[string]interface{}{
		"uuid": data.UUID,
		"name": data.Name,
	})

	if err := mc.WriteJSONArray(path, arr); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"success": true})
}

func HandlePlayerUnwhitelist(ctx *gin.Context) {
	defer panicGuard(ctx)
	bindRawBody(ctx)
	if !utils.VerifyMe(ctx) {
		return
	}

	uuid, ok := requireUUID(ctx)
	if !ok {
		return
	}

	env := config.LoadEnv()
	if err := mc.RemoveByUUID(env.ServerFolder+"/whitelist.json", uuid); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"success": true})
}

type KeyValue struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

type UpdateRequest struct {
	Update   []KeyValue `json:"update"`
	Passcode string     `json:"passcode"`
}

func HandleServerProperties(ctx *gin.Context) {
	if !utils.VerifyMe(ctx) {
		return
	}

	base := config.LoadEnv().ServerFolder

	props, err := mc.LoadProperties(base + "/server.properties")
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, props.All())
}

func HandleUpdateServerProperties(ctx *gin.Context) {
	var body UpdateRequest
	ctx.ShouldBindJSON(body)

	passcodeStr := body.Passcode

	if passcodeStr == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "passcode required"})
		return
	}

	passcodeStr = strings.TrimSpace(passcodeStr)
	currentPasscode := sql.GetValue("passcode")

	if passcodeStr != currentPasscode {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "invalid passcode"})
		return
	}

	if len(body.Update) == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "no updates provided",
		})
		return
	}

	base := config.LoadEnv().ServerFolder

	props, err := mc.LoadProperties(base + "/server.properties")
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	for _, kv := range body.Update {
		if kv.Key != "" {
			props.Set(kv.Key, kv.Value)
		}
	}

	if err := props.Save(base + "server.properties"); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"updated": body.Update,
	})
}
func HandleJREInstaller(ctx *gin.Context) {
	defer panicGuard(ctx)
	bindRawBody(ctx)

	if !utils.VerifyMe(ctx) {
		return
	}

	jre := ctx.Param("JRE")
	if jre == "" {
		ctx.JSON(http.StatusBadRequest, types.MsgFormat{
			Type:    "installation",
			Status:  "error",
			Payload: "missing JRE version",
		})
		return
	}

	go func(version string) {
		if _, _, err := java.InstallJRE(version); err != nil {
			log.Printf("[JRE] install failed (%s): %v", version, err)
		}
	}(jre)

	ctx.JSON(http.StatusAccepted, types.MsgFormat{
		Type:    "installation",
		Status:  "installing",
		Payload: "Installing Java runtime. Speed depends on internet connection.",
	})
}

func HandleListJavaInstallation(ctx *gin.Context) {
	if !utils.VerifyMe(ctx) {
		return
	}
	home, _ := os.UserHomeDir()
	var javaDir string
	if runtime.GOOS == "windows" {
		javaDir = filepath.Join(home, "AppData", "Roaming", ".rexon", "java")
	} else {
		javaDir = filepath.Join(home, ".rexon", "java")
	}

	jres, err := java.ListInstalledJREs(javaDir)
	if err != nil {
		ctx.JSON(500, gin.H{
			"error": err.Error(),
		})
		return
	}
	ctx.JSON(200, jres)

}

func HandleUpdateJRE(ctx *gin.Context) {
	defer panicGuard(ctx)
	bindRawBody(ctx)

	if !utils.VerifyMe(ctx) {
		return
	}

	jre := ctx.Param("JRE")
	if jre == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "JRE required"})
		return
	}
	var jrePath string
	if runtime.GOOS == "windows" {
		jrePath = filepath.Join(utils.GetRexonPath(), "java", "jre-"+jre, "bin", "java.exe")
	} else {
		jrePath = filepath.Join(utils.GetRexonPath(), "java", "jre-"+jre, "bin", "java")
	}
	if _, err := os.Stat(jrePath); os.IsNotExist(err) {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "JRE not found"})
		return
	}
	sql.SetValue("java_default", jrePath)
	ctx.JSON(http.StatusOK, gin.H{"message": "JRE updated successfully"})

}

func HandleListWorlds(ctx *gin.Context) {
	if !utils.VerifyMe(ctx) {
		return
	}

	allFoldersAndFiles, err := filemanager.ListDir("/")
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var worlds []string

	for _, folder := range allFoldersAndFiles {
		if folder.Type == "dir" {
			folders, err := filemanager.ListDir(folder.Path)
			if err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			for _, folder := range folders {
				if folder.Type == "file" && folder.Name == "level.dat" {
					worlds = append(worlds, strings.Trim(folder.Path, "level.dat"))
				}
			}
		}
	}
	ctx.JSON(http.StatusOK, gin.H{"worlds": worlds})
}

func HandleConfig(ctx *gin.Context) {
	if !utils.VerifyMe(ctx) {
		return
	}

	env := config.LoadEnv()

	startupCmd := sql.GetValue("startup_command")
	if startupCmd == "" {
		startupCmd = "{{java}} -jar {{serverjar}} --nogui"
	}

	ctx.JSON(http.StatusOK, gin.H{
		"server_folder":   env.ServerFolder,
		"web_listen_on":   env.WebListenOn,
		"ftp_host":        env.FTPHost,
		"ftp_port":        env.FTPPort,
		"ftp_user":        env.FTPUser,
		"startup_command": startupCmd,
		"java_default":    sql.GetValue("java_default"),
		"server_jar_name": sql.GetValue("server_jar_name"),
		"server_memory":   sql.GetValue("server_memory"),
		"server_port":     sql.GetValue("server_port"),
	})
}

func HandleConfigUpdate(ctx *gin.Context) {
	defer func() {
		if r := recover(); r != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": fmt.Sprintf("panic: %v", r),
			})
		}
	}()

	if ctx.Request.Body == nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "empty request body"})
		return
	}

	var body map[string]interface{}
	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON"})
		return
	}

	ctx.Set("rawBody", body)

	if !utils.VerifyMe(ctx) {
		return
	}

	if newPasscode, exists := body["new_passcode"]; exists {
		passcode := fmt.Sprintf("%v", newPasscode)
		passcode = strings.TrimSpace(passcode)

		if len(passcode) != 6 || !isNumeric(passcode) {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "passcode must be exactly 6 digits"})
			return
		}
		sql.SetValue("passcode", passcode)
	}

	if startupCmd, exists := body["startup_command"]; exists {
		cmdStr := fmt.Sprintf("%v", startupCmd)
		cmdStr = strings.TrimSpace(cmdStr)
		if cmdStr != "" {
			sql.SetValue("startup_command", cmdStr)
		}
	}

	if serverJar, exists := body["server_jar_name"]; exists {
		jarName := fmt.Sprintf("%v", serverJar)
		jarName = strings.TrimSpace(jarName)
		if jarName != "" {
			sql.SetValue("server_jar_name", jarName)
		}
	}

	if serverMemory, exists := body["server_memory"]; exists {
		memory := fmt.Sprintf("%v", serverMemory)
		memory = strings.TrimSpace(memory)
		if memory != "" {
			sql.SetValue("server_memory", memory)
		}
	}

	if serverPort, exists := body["server_port"]; exists {
		port := fmt.Sprintf("%v", serverPort)
		port = strings.TrimSpace(port)
		if port != "" {
			sql.SetValue("server_port", port)
		}
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func HandleStartupCommand(ctx *gin.Context) {
	if !utils.VerifyMe(ctx) {
		return
	}

	startupCmd := sql.GetValue("startup_command")
	if startupCmd == "" {
		startupCmd = "{{java}} -jar {{serverjar}} --nogui"
	}

	ctx.JSON(http.StatusOK, gin.H{
		"startup_command": startupCmd,
		"current_values": gin.H{
			"java_default":    sql.GetValue("java_default"),
			"server_jar_name": sql.GetValue("server_jar_name"),
			"server_memory":   sql.GetValue("server_memory"),
			"server_port":     sql.GetValue("server_port"),
			"server_dir":      config.LoadEnv().ServerFolder,
		},
	})
}

func HandleUpdateStartupCommand(ctx *gin.Context) {

	var body struct {
		StartupCommand string `json:"startup_command"`
		ServerJarName  string `json:"server_jar_name,omitempty"`
		ServerMemory   string `json:"server_memory,omitempty"`
		ServerPort     string `json:"server_port,omitempty"`
		Passcode       string `json:"passcode,omitempty"`
	}

	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON: " + err.Error()})
		return
	}

	passcodeStr := body.Passcode

	if passcodeStr == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "passcode required"})
		return
	}

	passcodeStr = strings.TrimSpace(passcodeStr)
	currentPasscode := sql.GetValue("passcode")

	if passcodeStr != currentPasscode {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "invalid passcode"})
		return
	}

	if body.StartupCommand == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "startup_command cannot be empty"})
		return
	}

	cmdParts := strings.Fields(body.StartupCommand)
	if len(cmdParts) == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "startup command must contain at least one word"})
		return
	}

	sql.SetValue("startup_command", body.StartupCommand)

	if body.ServerJarName != "" {
		sql.SetValue("server_jar_name", body.ServerJarName)
	}

	if body.ServerMemory != "" {
		sql.SetValue("server_memory", body.ServerMemory)
	}

	if body.ServerPort != "" {
		sql.SetValue("server_port", body.ServerPort)
	}

	ctx.JSON(http.StatusOK, gin.H{
		"status":          "ok",
		"startup_command": body.StartupCommand,
		"server_jar_name": body.ServerJarName,
		"server_memory":   body.ServerMemory,
		"server_port":     body.ServerPort,
	})
}

func isNumeric(str string) bool {
	for _, char := range str {
		if char < '0' || char > '9' {
			return false
		}
	}
	return true
}
