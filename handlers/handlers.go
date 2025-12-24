package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"rexon/config"
	"rexon/filemanager"
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

	session, err := mgr.Start("java", "-jar", "server.jar", "--nogui")
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

/*
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

	data, err := client.CreateTunnel(
		body.Name,
		body.TunnelType,
		body.PortType,
		body.PortCount,
		sql.GetValue("playit_agent_id"),
		"0.0.0.0",
		body.Port,
		true,
	)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	var unified any
	_ = json.Unmarshal(data, &unified)
	ctx.JSON(200, unified)
	}*/

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

	portFloat, ok := body["port"].(float64)
	if !ok {
		ctx.JSON(400, gin.H{"error": "port must be number"})
		return
	}
	port := int(portFloat)

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

func HandleConfig(ctx *gin.Context) {
	if !utils.VerifyMe(ctx) {
		return
	}

	env := config.LoadEnv()

	ctx.JSON(http.StatusOK, gin.H{
		"server_folder": env.ServerFolder,
		"web_listen_on": env.WebListenOn,
		"ftp_host":      env.FTPHost,
		"ftp_port":      env.FTPPort,
		"ftp_user":      env.FTPUser,
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

	newPasscode := fmt.Sprintf("%v", body["new_passcode"])
	newPasscode = strings.TrimSpace(newPasscode)

	if len(newPasscode) != 6 || !isNumeric(newPasscode) {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "passcode must be exactly 6 digits"})
		return
	}

	sql.SetValue("passcode", newPasscode)
	ctx.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func isNumeric(s string) bool {
	for _, c := range s {
		if c < '0' || c > '9' {
			return false
		}
	}
	return true
}
