package utils

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"strings"

	"rexon/sql"
	"rexon/types"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

func VerifyMe(ctx *gin.Context) bool {
	var passcodeStr string

	switch ctx.Request.Method {
	case http.MethodGet:
		passcodeStr = ctx.Query("passcode")
	default:
		contentType := ctx.GetHeader("Content-Type")

		if strings.HasPrefix(contentType, "multipart/form-data") || strings.HasPrefix(contentType, "application/x-www-form-urlencoded") {
			ctx.Request.ParseMultipartForm(32 << 20)
			passcodeStr = ctx.PostForm("passcode")
		}

		if passcodeStr == "" {
			if raw, exists := ctx.Get("rawBody"); exists {
				body := raw.(map[string]interface{})
				passcodeStr = fmt.Sprintf("%v", body["passcode"])
			} else if strings.HasPrefix(contentType, "application/json") {
				var body map[string]interface{}
				if err := ctx.ShouldBindJSON(&body); err == nil {
					ctx.Set("rawBody", body)
					passcodeStr = fmt.Sprintf("%v", body["passcode"])
				}
			}
		}

		if passcodeStr == "" {
			passcodeStr = ctx.Query("passcode")
		}
	}

	if passcodeStr == "" {
		passcodeStr = ctx.GetHeader("X-Passcode")
	}

	if passcodeStr == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "passcode required"})
		return false
	}

	passcodeStr = strings.TrimSpace(passcodeStr)
	currentPasscode := sql.GetValue("passcode")

	if passcodeStr != currentPasscode {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "invalid passcode"})
		return false
	}

	return true
}

func SendMsg(ws *websocket.Conn, msgType, status, payload string) {
	msg := types.MsgFormat{
		Type:    msgType,
		Status:  status,
		Payload: payload,
	}
	if b, err := json.Marshal(msg); err == nil {
		ws.WriteMessage(websocket.TextMessage, b)
	}
}

func Resolve(base, rel string) (string, error) {
	rel = strings.TrimPrefix(rel, "/")
	cleaned := filepath.Clean(rel)

	full := filepath.Join(base, cleaned)
	absBase, _ := filepath.Abs(base)
	absFull, _ := filepath.Abs(full)

	if !strings.HasPrefix(absFull, absBase) {
		return "", errors.New("invalid path")
	}
	return absFull, nil
}

func DownloadFile(filepath string, url string) error {
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	out, err := os.Create(filepath)
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, resp.Body)
	if err != nil {
		return err
	}

	fmt.Printf("Downloaded file to: %s\n", filepath)
	return nil
}

func GetRexonPath() string {
	var path string
	home, _ := os.UserHomeDir()
	if runtime.GOOS == "windows" {
		path = filepath.Join(home, "AppData", "Roaming", ".rexon")
	} else {
		path = filepath.Join(home, ".rexon")
	}
	return path
}
