package ftp

import (
	"log"
	"rexon/config"
	"rexon/sql"

	"github.com/fatih/color"
	"goftp.io/server/v2"
	"goftp.io/server/v2/driver/file"
)

func Start() {

	env := config.LoadEnv()

	drv, err := file.NewDriver(env.ServerFolder)
	if err != nil {
		log.Fatalf("driver error: %v", err)
	}

	auth := &server.SimpleAuth{
		Name:     env.FTPUser,
		Password: sql.GetValue("passcode"),
	}

	rexon := color.New(color.FgBlue).Sprint("[REXON]")

	logger := &CustomLogger{Prefix: rexon}

	opts := &server.Options{
		Driver:         drv,
		Auth:           auth,
		Perm:           server.NewSimplePerm("admin", "admin"),
		Hostname:       env.FTPHost,
		Port:           env.FTPPort,
		WelcomeMessage: "Welcome to Rexon FTP server",
		Logger:         logger,
	}

	srv, err := server.NewServer(opts)
	if err != nil {
		log.Fatalf("server error: %v", err)
	}

	if err := srv.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}
