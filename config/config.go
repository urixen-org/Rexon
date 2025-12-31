package config

import (
	"log"
	"os"
	"rexon/utils"
	"strconv"

	"github.com/joho/godotenv"
)

type Env struct {
	ServerFolder string
	Passcode     string
	WebListenOn  string
	FTPHost      string
	FTPPort      int
	FTPUser      string
}

func LoadEnv() *Env {
	envFile := utils.GetRexonPath() + "/.env"
	if err := godotenv.Load(envFile, "./.env"); err != nil {
		log.Println("Warning: .env file not found, using system environment variables")
	}

	ftpPortStr := os.Getenv("ftp_port")
	ftpPort, err := strconv.Atoi(ftpPortStr)
	if err != nil {
		log.Fatalf("Invalid FTP port: %v", err)
	}

	return &Env{
		ServerFolder: os.Getenv("server_folder"),
		Passcode:     os.Getenv("passcode"),
		WebListenOn:  os.Getenv("web_listen_on"),
		FTPHost:      os.Getenv("ftp_host"),
		FTPPort:      ftpPort,
		FTPUser:      os.Getenv("ftp_user"),
	}
}

func GetPasscode() string {
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found, using system environment variables")
	}
	passcode := os.Getenv("passcode")
	if passcode == "" {
		log.Println("Warning: passcode is empty!")
	}
	return passcode
}
