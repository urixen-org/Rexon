package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"os/signal"
	"regexp"
	"strconv"
	"strings"
	"syscall"
	"time"

	"rexon/ancii"
	"rexon/config"
	"rexon/filemanager"
	"rexon/filemanager/ftp"
	"rexon/handlers"
	"rexon/playit"
	"rexon/setup"
	"rexon/sql"
	"rexon/types"

	"github.com/fatih/color"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/commander"
	"github.com/stretchr/objx"
	"go.uber.org/ratelimit"
	"golang.ngrok.com/ngrok"
	ngrokconfig "golang.ngrok.com/ngrok/config"
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

func runNgrok(env *config.Env, handler http.Handler, ngrokCh chan<- string) {
	ctx := context.Background()
	ngrokToken := sql.GetValue("ngrok_token")
	ngrokEndpoint := sql.GetValue("ngrok_endpoint")

	if ngrokToken == "" {
		log.Println("No ngrok token found, skipping ngrok tunnel")
		close(ngrokCh)
		return
	}

	opts := []ngrok.ConnectOption{
		ngrok.WithAuthtoken(ngrokToken),
	}

	var tunnelOpts []ngrokconfig.HTTPEndpointOption
	if ngrokEndpoint != "" {
		tunnelOpts = append(tunnelOpts, ngrokconfig.WithDomain(ngrokEndpoint))
	}

	listener, err := ngrok.Listen(ctx,
		ngrokconfig.HTTPEndpoint(tunnelOpts...),
		opts...,
	)
	if err != nil {
		log.Printf("Failed to create ngrok tunnel: %v", err)
		close(ngrokCh)
		return
	}

	ngrokURL := listener.URL()
	log.Println(color.GreenString("Ngrok tunnel created at %s", ngrokURL))
	ancii.Print(ngrokURL, env.FTPHost+":"+fmt.Sprint(env.FTPPort), env.FTPUser, sql.GetValue("passcode"))

	ngrokCh <- ngrokURL

	go func() {
		if err := http.Serve(listener, handler); err != nil {
			log.Printf("Ngrok tunnel error: %v", err)
		}
	}()
}

type MyWriter struct {
	Prefix   string
	Color    *color.Color
	lastLine string
}

var ansi = regexp.MustCompile(`\x1b\[[0-9;]*[a-zA-Z]`)

func (w *MyWriter) Write(p []byte) (int, error) {
	c := w.Color
	if c == nil {
		c = color.New(color.FgWhite)
	}

	output := strings.TrimSpace(cleanANSI(string(p)))
	if output == "" {
		return len(p), nil
	}

	// Skip printing if it's identical to the last line
	if output == w.lastLine {
		return len(p), nil
	}
	w.lastLine = output

	skipKeywords := []string{"0 tunnels registered"}

	for _, kw := range skipKeywords {
		if strings.Contains(output, kw) {
			return len(p), nil
		}
	}

	ts := time.Now().Format("15:04:05")
	c.Printf("[%s] %s: %s\n", ts, w.Prefix, output+"\n")
	return len(p), nil
}

func cleanANSI(input string) string {
	return ansi.ReplaceAllString(input, "")
}

func startPlayit() {
	if sql.GetValue("playit_path") == "" || sql.GetValue("playit_secret") == "" {
		panic("Playit is not setup \n please setup it by adding setup -skip-to=3")
	}
	cmd := exec.Command(sql.GetValue("playit_path"), "--secret", sql.GetValue("playit_secret"))
	cmd.Stdout = &MyWriter{
		Prefix: "PLAYIT",
		Color:  color.New(color.FgGreen),
	}
	cmd.Stderr = &MyWriter{
		Prefix: "PLAYIT",
		Color:  color.New(color.FgRed),
	}

	if err := cmd.Start(); err != nil {
		panic(err)
	}
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

	ancii.Print(env.WebListenOn, env.FTPHost+":"+fmt.Sprint(env.FTPPort), env.FTPUser, sql.GetValue("passcode"))

	go ftp.Start()
	startPlayit()

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
	r.POST("/software", handlers.HandleSoftwareInstall)
	player := r.Group("/player")
	{
		player.GET("/", handlers.HandleGetAllPlayer)
		player.GET("/:UUID", handlers.HandleGetPlayerData)

		player.POST("/:UUID/ban", handlers.HandlePlayerBan)
		player.DELETE("/:UUID/ban", handlers.HandlePlayerUnban)

		player.POST("/:UUID/whitelist", handlers.HandlePlayerWhitelist)
	}

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
	playitGroup := r.Group("playit")
	{
		playitGroup.GET("/tunnel/list", handlers.HandleListTunnel)
		playitGroup.GET("/region/query", handlers.HandleQueryRegion)
		playitGroup.GET("/agent/rundata", handlers.HandleAgentRunData)
		playitGroup.POST("/tunnel/create", handlers.HandleCreateTunnel)
		playitGroup.DELETE("/tunnel/delete", handlers.HandleTunnelDelete)
		playitGroup.PATCH("/tunnel/update", handlers.HandleUpdateTunnel)
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

	ngrokCh := make(chan string, 1)
	go runNgrok(env, route, ngrokCh)

	select {
	case ngrokURL := <-ngrokCh:
		if ngrokURL != "" {
			log.Println(color.GreenString("Ngrok tunnel available at %s", ngrokURL))
		}
	case <-time.After(10 * time.Second):
		log.Println(color.YellowString("Ngrok tunnel setup timed out or not configured"))
	}

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
			"setup [-skip-to=(int)]",
			"Setup",
			"Setup Rexon",
			func(args objx.Map) {
				count := 0
				if v, ok := args["-skip-to"]; ok {
					str := v.(string)
					if strings.Contains(str, "=") {
						parts := strings.SplitN(str, "=", 2)
						str = parts[1]
					}
					n, err := strconv.Atoi(str)
					if err != nil {
						fmt.Println("Invalid number for -skip-to:", str)
					} else {
						count = n
					}
				}
				setup.Setup(count)
			},
		)
		commander.Map("test", "test", "test", func(args objx.Map) {
			sql.Init("./data.rexon")
			defer sql.Close()
			fmt.Println(sql.GetValue("playit_secret"))
			fmt.Println(sql.GetValue("playit_agent_id"))
			client := playit.NewClient(sql.GetValue("playit_secret"))
			//client.CreateTunnel("")
			// CreateTunnel(name string, tunnelType string, portType string, portCount int, agentID string, localIP string, localPort int, enabled bool
			data, err := client.ListTunnels(nil, "30d5e759-16ca-40fd-9006-a4632cce710e")
			if err != nil {
				fmt.Println(err)
			}
			fmt.Println(string(data))
		})
	})
}
