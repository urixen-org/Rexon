package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"rexon/ancii"
	"rexon/config"
	"rexon/filemanager"
	"rexon/filemanager/ftp"
	"rexon/handlers"
	"rexon/setup"
	"rexon/sql"
	"rexon/types"

	"github.com/fatih/color"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/commander"
	"github.com/stretchr/objx"
	"go.uber.org/ratelimit"
	"golang.ngrok.com/ngrok/v2"
)

var (
	limit ratelimit.Limiter
	rps   = flag.Int("rps", 100, "Requests per second")
)

func leakBucket() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		limit.Take()
		ctx.Next()
	}
}

func validatePath() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		path := ctx.Query("path")
		if path == "" {
			path = ctx.PostForm("path")
		}
		if path == "" {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "path required"})
			return
		}
		ctx.Next()
	}
}

func runNgrok(env config.Env) string {
	ctx := context.Background()
	ngrokToken := sql.GetValue("ngrok_token")
	ngrokEndpoint := sql.GetValue("ngrok_endpoint")
	if ngrokToken == "" {
		return ""
	}

	agent, err := ngrok.NewAgent(ngrok.WithAuthtoken(ngrokToken))
	if err != nil {
		panic(err)
	}

	var ln ngrok.EndpointForwarder
	if ngrokEndpoint != "" {
		ln, err = agent.Forward(ctx,
			ngrok.WithUpstream(env.WebListenOn),
			ngrok.WithURL(ngrokEndpoint),
		)
		if err != nil {
			ln, err = agent.Forward(ctx, ngrok.WithUpstream(env.WebListenOn))
			if err != nil {
				panic(err)
			}
		}
	} else {
		ln, err = agent.Forward(ctx, ngrok.WithUpstream(env.WebListenOn))
		if err != nil {
			panic(err)
		}
	}

	fmt.Println("Ngrok URL:", ln.URL())
	ancii.Print(ln.URL().Host, env.FTPHost+":"+fmt.Sprint(env.FTPPort), env.FTPUser, sql.GetValue("passcode"))
	return ln.URL().Host
}

func runServer() {
	flag.Parse()
	limit = ratelimit.New(*rps)

	env := config.LoadEnv()
	filemanager.BaseDir = env.ServerFolder

	sql.Init("./data.rexon")
	defer sql.Close()

	if sql.GetValue("passcode") == "" {
		panic("The passcode is not set please run in setup mode \n CMD: rexon setup \n Crashed: passcode not found in database")
	}

	ngrokCh := make(chan string)
	go func() {
		ngrokURL := runNgrok(*env)
		log.Println(color.GreenString("Ngrok tunnel available at %s", ngrokURL))
	}()
	ancii.Print(env.WebListenOn, env.FTPHost+":"+fmt.Sprint(env.FTPPort), env.FTPUser, sql.GetValue("passcode"))

	go ftp.Start()

	route := gin.New()
	r := route.Group("/api")

	r.Use(gin.LoggerWithFormatter(func(params gin.LogFormatterParams) string {
		rexon := color.New(color.FgBlue).Sprint("[REXON]")
		var statusColor *color.Color
		switch {
		case params.StatusCode >= 200 && params.StatusCode < 300:
			statusColor = color.New(color.FgGreen)
		case params.StatusCode >= 400 && params.StatusCode < 500:
			statusColor = color.New(color.FgYellow)
		case params.StatusCode >= 500:
			statusColor = color.New(color.FgRed)
		default:
			statusColor = color.New(color.FgWhite)
		}
		return fmt.Sprintf(
			"%s [%s] [%s]: {%s} {%s} {%s}\n",
			rexon,
			params.Method,
			params.Path,
			statusColor.Sprintf("%d", params.StatusCode),
			params.Latency.String(),
			params.ClientIP,
		)
	}))
	r.Use(leakBucket())

	r.POST("/start", handlers.HandleStart)
	r.POST("/stop", handlers.HandleStop)
	r.POST("/status", handlers.HandleStatus)
	r.GET("/ws", handlers.HandleWebSocket)
	r.POST("/verify", handlers.HandlePasscodeVerify)
	r.GET("/ping", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, types.MsgFormat{
			Type:    "cmd",
			Payload: "pong, server is running",
			Status:  "running",
		})
	})
	r.GET("/config", handlers.HandleConfig)
	r.POST("/config", handlers.HandleConfigUpdate)

	fGroup := r.Group("/filemanager")
	fGroup.Use(validatePath())
	{
		fGroup.GET("/list", handlers.HandleFileManagerList)
		fGroup.GET("/read", handlers.HandleFileManagerRead)
		fGroup.POST("/write", handlers.HandleFileManagerWrite)
		fGroup.GET("/download", handlers.HandleFileManagerDownload)
		fGroup.POST("/upload", handlers.HandleFileManagerUpload)
		fGroup.DELETE("/unlink", handlers.HandleFileManagerDelete)
		fGroup.POST("/create-dir", handlers.HandleFileManagerCreateDir)
		fGroup.POST("/copy", handlers.HandleFileManagerCopy)
		fGroup.POST("/move", handlers.HandleFileManagerMove)
		fGroup.POST("/rename", handlers.HandleFileManagerRename)
		fGroup.POST("/compress", handlers.HandleFileManagerCompress)
		fGroup.POST("/extract", handlers.HandleFileManagerExtract)
	}

	srv := &http.Server{
		Addr:    env.WebListenOn,
		Handler: route,
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server failed: %v", err)
		}
	}()

	log.Println(color.GreenString("Server running on %s", env.WebListenOn))
	ngrokURL := <-ngrokCh
	log.Println(color.GreenString("Ngrok tunnel available at %s", ngrokURL))

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	log.Println(color.YellowString("Shutting down server..."))
	timeoutCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(timeoutCtx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}
	log.Println(color.GreenString("Server exited gracefully"))
}

func main() {
	commander.Go(func() {
		commander.Map(
			"",
			"Run server",
			"Start Rexon server",
			func(args objx.Map) {
				runServer()
			},
		)
		commander.Map(
			"setup",
			"Setup",
			"Setup Rexon",
			func(args objx.Map) {
				setup.Setup()
			},
		)
	})
}
