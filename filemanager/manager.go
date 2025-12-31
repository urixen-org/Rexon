package filemanager

import (
	"errors"
	"io"
	"os"
	"path/filepath"
	"strings"

	"rexon/config"
	"rexon/types"
)

var BaseDir = config.LoadEnv().ServerFolder

func sanitizePath(p string) (string, error) {
	full := filepath.Join(BaseDir, p)
	clean := filepath.Clean(full)
	return clean, nil
}

func ListDir(p string) ([]types.FileInfo, error) {
	root, err := sanitizePath(p)
	if err != nil {
		return nil, err
	}

	entries, err := os.ReadDir(root)
	if err != nil {
		return nil, err
	}

	var result []types.FileInfo

	for _, entry := range entries {
		info, _ := entry.Info()

		itemType := "file"
		if entry.IsDir() {
			itemType = "dir"
		}

		name := entry.Name()

		ext := ""
		if itemType == "file" {
			ext = strings.ToLower(filepath.Ext(name))
		}

		relative := filepath.Join(p, name)

		result = append(result, types.FileInfo{
			Name: name,
			Type: itemType,
			Size: info.Size(),
			Ext:  ext,
			Path: filepath.ToSlash(relative),
		})
	}

	return result, nil
}

func WriteContent(p string, data []byte) error {
	return os.WriteFile(filepath.Join(BaseDir, p), data, 0644)
}

func DeletePath(relPath string) error {

	cleanPath := filepath.Clean(relPath)
	fullPath := filepath.Join(BaseDir, cleanPath)

	if !filepath.HasPrefix(fullPath, filepath.Clean(BaseDir)) {
		return errors.New("invalid path")
	}

	_, err := os.Stat(fullPath)
	if os.IsNotExist(err) {
		return errors.New("file or directory does not exist")
	} else if err != nil {
		return err
	}

	return os.RemoveAll(fullPath)
}

func RenamePath(oldRel, newRel string) error {
	oldPath := filepath.Join(BaseDir, filepath.Clean(oldRel))
	newPath := filepath.Join(BaseDir, filepath.Clean(newRel))

	if !filepath.HasPrefix(oldPath, filepath.Clean(BaseDir)) || !filepath.HasPrefix(newPath, filepath.Clean(BaseDir)) {
		return errors.New("invalid path")
	}

	return os.Rename(oldPath, newPath)
}

func MovePath(relPath, newDir string) error {
	src := filepath.Join(BaseDir, filepath.Clean(relPath))
	dst := filepath.Join(BaseDir, filepath.Clean(newDir), filepath.Base(relPath))

	if !filepath.HasPrefix(src, filepath.Clean(BaseDir)) || !filepath.HasPrefix(dst, filepath.Clean(BaseDir)) {
		return errors.New("invalid path")
	}

	return os.Rename(src, dst)
}

func CopyPath(srcRel, dstRel string) error {
	src := filepath.Join(BaseDir, filepath.Clean(srcRel))
	dst := filepath.Join(BaseDir, filepath.Clean(dstRel))

	if !filepath.HasPrefix(src, filepath.Clean(BaseDir)) || !filepath.HasPrefix(dst, filepath.Clean(BaseDir)) {
		return errors.New("invalid path")
	}

	info, err := os.Stat(src)
	if err != nil {
		return err
	}

	if info.IsDir() {
		return copyDir(src, dst)
	}
	return copyFile(src, dst)
}

func copyFile(src, dst string) error {
	srcFile, err := os.Open(src)
	if err != nil {
		return err
	}
	defer srcFile.Close()

	dstFile, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer dstFile.Close()

	_, err = io.Copy(dstFile, srcFile)
	return err
}

func copyDir(srcDir, dstDir string) error {
	entries, err := os.ReadDir(srcDir)
	if err != nil {
		return err
	}

	if err := os.MkdirAll(dstDir, 0755); err != nil {
		return err
	}

	for _, entry := range entries {
		srcPath := filepath.Join(srcDir, entry.Name())
		dstPath := filepath.Join(dstDir, entry.Name())

		if entry.IsDir() {
			if err := copyDir(srcPath, dstPath); err != nil {
				return err
			}
		} else {
			if err := copyFile(srcPath, dstPath); err != nil {
				return err
			}
		}
	}
	return nil
}

func CreateDir(relPath string) error {
	dirPath := filepath.Join(BaseDir, filepath.Clean(relPath))
	if !filepath.HasPrefix(dirPath, filepath.Clean(BaseDir)) {
		return errors.New("invalid path")
	}
	return os.MkdirAll(dirPath, 0755)
}
