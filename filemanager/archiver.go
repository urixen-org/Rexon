package filemanager

import (
	"archive/zip"
	"errors"
	"io"
	"os"
	"path/filepath"
	"strings"
)

func CompressPaths(paths []string, dstZip string) error {
	zipFile, err := os.Create(dstZip)
	if err != nil {
		return err
	}
	defer zipFile.Close()

	archive := zip.NewWriter(zipFile)
	defer archive.Close()

	for _, p := range paths {
		fullPath := filepath.Join(BaseDir, filepath.Clean(p))
		if !strings.HasPrefix(fullPath, filepath.Clean(BaseDir)) {
			return errors.New("invalid path: " + p)
		}

		info, err := os.Stat(fullPath)
		if err != nil {
			return err
		}

		if info.IsDir() {
			if err := addDirToZip(archive, fullPath, filepath.Base(fullPath)); err != nil {
				return err
			}
		} else {
			if err := addFileToZip(archive, fullPath, info.Name()); err != nil {
				return err
			}
		}
	}

	return nil
}

func addDirToZip(archive *zip.Writer, dirPath, zipPath string) error {
	entries, err := os.ReadDir(dirPath)
	if err != nil {
		return err
	}

	for _, entry := range entries {
		fullPath := filepath.Join(dirPath, entry.Name())
		zipEntryPath := filepath.Join(zipPath, entry.Name())

		info, err := entry.Info()
		if err != nil {
			return err
		}

		if info.IsDir() {
			if err := addDirToZip(archive, fullPath, zipEntryPath); err != nil {
				return err
			}
		} else {
			if err := addFileToZip(archive, fullPath, zipEntryPath); err != nil {
				return err
			}
		}
	}

	return nil
}

func addFileToZip(archive *zip.Writer, filePath, zipPath string) error {
	file, err := os.Open(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	info, err := file.Stat()
	if err != nil {
		return err
	}

	header, err := zip.FileInfoHeader(info)
	if err != nil {
		return err
	}

	header.Name = zipPath
	header.Method = zip.Deflate

	writer, err := archive.CreateHeader(header)
	if err != nil {
		return err
	}

	_, err = io.Copy(writer, file)
	return err
}

func ExtractZip(zipPath, destDir string) error {
	r, err := zip.OpenReader(zipPath)
	if err != nil {
		return err
	}
	defer r.Close()

	for _, f := range r.File {
		fpath := filepath.Join(destDir, f.Name)
		if !strings.HasPrefix(fpath, filepath.Clean(BaseDir)) {
			return errors.New("invalid path in zip")
		}

		if f.FileInfo().IsDir() {
			os.MkdirAll(fpath, 0755)
			continue
		}

		if err := os.MkdirAll(filepath.Dir(fpath), 0755); err != nil {
			return err
		}

		dstFile, err := os.OpenFile(fpath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, f.Mode())
		if err != nil {
			return err
		}

		rc, err := f.Open()
		if err != nil {
			return err
		}

		_, err = io.Copy(dstFile, rc)

		dstFile.Close()
		rc.Close()

		if err != nil {
			return err
		}
	}
	return nil
}
