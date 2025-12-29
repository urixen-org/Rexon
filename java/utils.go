package java

import (
	"os"
	"path/filepath"
	"runtime"
)

func ListInstalledJREs(baseDir string) ([]string, error) {
	entries, err := os.ReadDir(baseDir)
	if err != nil {
		return nil, err
	}

	javaBin := "java"
	if runtime.GOOS == "windows" {
		javaBin = "java.exe"
	}

	var installs []string

	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}

		javaPath := filepath.Join(
			baseDir,
			entry.Name(),
			"bin",
			javaBin,
		)

		if _, err := os.Stat(javaPath); err == nil {
			installs = append(installs, entry.Name())
		}
	}

	return installs, nil
}
