package ftp

import (
	"fmt"
	"time"
)

type CustomLogger struct {
	Prefix string
}

func (l *CustomLogger) Print(sessionID string, message interface{}) {
	fmt.Println(l.base(sessionID, fmt.Sprint(message)))
}

func (l *CustomLogger) Printf(sessionID, format string, v ...interface{}) {
	fmt.Println(l.base(sessionID, fmt.Sprintf(format, v...)))
}

func (l *CustomLogger) PrintCommand(sessionID, command, params string) {
	fmt.Println(l.base(
		sessionID,
		fmt.Sprintf("CMD %s %s", command, params),
	))
}

func (l *CustomLogger) PrintResponse(sessionID string, code int, message string) {
	fmt.Println(l.base(
		sessionID,
		fmt.Sprintf("RES %d %s", code, message),
	))
}

func (l *CustomLogger) base(sessionID, msg string) string {
	now := time.Now().Format("15:04:05")

	return fmt.Sprintf(
		"%s [%s] [%s]: %s",
		l.Prefix,
		now,
		sessionID,
		msg,
	)
}
