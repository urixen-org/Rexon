package java

import (
	"archive/tar"
	"archive/zip"
	"compress/gzip"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"strings"
)

type AdoptiumAsset struct {
	Binary struct {
		OS           string `json:"os"`
		Architecture string `json:"architecture"`
		JvmImpl      string `json:"jvm_impl"`
		ImageType    string `json:"image_type"`
		Package      struct {
			Link string `json:"link"`
			Name string `json:"name"`
		} `json:"package"`
	} `json:"binary"`
}

func InstallJRE(version string) (string, bool, error) {
	baseDir := getBaseDir()
	destFolder := filepath.Join(baseDir, fmt.Sprintf("jre-%s", version))
	var javaPath string
	if runtime.GOOS == "windows" {
		javaPath = filepath.Join(destFolder, "bin", "java.exe")
	} else {
		javaPath = filepath.Join(destFolder, "bin", "java")
	}

	if info, err := os.Stat(javaPath); err == nil && !info.IsDir() {
		return javaPath, true, nil
	}

	asset, err := getAdoptiumJRE(version)
	if err != nil {
		return "", false, err
	}

	os.MkdirAll(baseDir, os.ModePerm)

	tmpDir := filepath.Join(baseDir, "tmp_jre")
	os.RemoveAll(tmpDir)
	os.MkdirAll(tmpDir, os.ModePerm)

	downloadPath := filepath.Join(tmpDir, asset.Binary.Package.Name)
	if err := downloadFile(asset.Binary.Package.Link, downloadPath); err != nil {
		return "", false, err
	}

	if strings.HasSuffix(asset.Binary.Package.Name, ".zip") {
		if err := unzip(downloadPath, tmpDir); err != nil {
			return "", false, err
		}
	} else if strings.HasSuffix(asset.Binary.Package.Name, ".tar.gz") {
		if err := untarGz(downloadPath, tmpDir); err != nil {
			return "", false, err
		}
	} else {
		return "", false, fmt.Errorf("unsupported archive format")
	}

	extractedFolder, err := findJavaFolder(tmpDir)
	if err != nil {
		return "", false, err
	}

	os.RemoveAll(destFolder)
	if err := os.Rename(extractedFolder, destFolder); err != nil {
		return "", false, err
	}

	if err := os.Chmod(javaPath, 0755); err != nil {
		return "", false, err
	}

	os.RemoveAll(tmpDir)

	return javaPath, true, nil
}
func getBaseDir() string {
	if runtime.GOOS == "windows" {
		base := os.Getenv("APPDATA")
		if base == "" {
			base = filepath.Join(os.Getenv("USERPROFILE"), "AppData", "Roaming")
		}
		return filepath.Join(base, ".rexon", "java")
	}
	return filepath.Join(os.Getenv("HOME"), ".rexon", "java")
}

func getAdoptiumJRE(version string) (*AdoptiumAsset, error) {
	url := fmt.Sprintf("https://api.adoptium.net/v3/assets/latest/%s/hotspot?vendor=eclipse", version)
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var assets []AdoptiumAsset
	if err := json.NewDecoder(resp.Body).Decode(&assets); err != nil {
		return nil, err
	}

	for _, a := range assets {
		if a.Binary.OS == mapOS(runtime.GOOS) &&
			a.Binary.Architecture == mapArch(runtime.GOARCH) &&
			a.Binary.JvmImpl == "hotspot" &&
			a.Binary.ImageType == "jre" {
			return &a, nil
		}
	}
	return nil, fmt.Errorf("no matching JRE found for %s %s", runtime.GOOS, runtime.GOARCH)
}

func mapOS(goos string) string {
	switch goos {
	case "windows":
		return "windows"
	case "linux":
		return "linux"
	case "darwin":
		return "mac"
	default:
		return goos
	}
}

func mapArch(goarch string) string {
	if goarch == "amd64" {
		return "x64"
	}
	return goarch
}

func downloadFile(url, filepath string) error {
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
	return err
}

func unzip(src, dest string) error {
	r, err := zip.OpenReader(src)
	if err != nil {
		return err
	}
	defer r.Close()

	for _, f := range r.File {
		fpath := filepath.Join(dest, f.Name)
		if f.FileInfo().IsDir() {
			os.MkdirAll(fpath, os.ModePerm)
			continue
		}
		os.MkdirAll(filepath.Dir(fpath), os.ModePerm)
		outFile, err := os.OpenFile(fpath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, f.Mode())
		if err != nil {
			return err
		}
		rc, err := f.Open()
		if err != nil {
			return err
		}
		_, err = io.Copy(outFile, rc)
		outFile.Close()
		rc.Close()
		if err != nil {
			return err
		}
	}
	return nil
}

func untarGz(src, dest string) error {
	file, err := os.Open(src)
	if err != nil {
		return err
	}
	defer file.Close()

	gzr, err := gzip.NewReader(file)
	if err != nil {
		return err
	}
	defer gzr.Close()

	tr := tar.NewReader(gzr)
	for {
		hdr, err := tr.Next()
		if err == io.EOF {
			break
		}
		if err != nil {
			return err
		}

		target := filepath.Join(dest, hdr.Name)
		switch hdr.Typeflag {
		case tar.TypeDir:
			os.MkdirAll(target, os.ModePerm)
		case tar.TypeReg:
			os.MkdirAll(filepath.Dir(target), os.ModePerm)
			outFile, err := os.Create(target)
			if err != nil {
				return err
			}
			_, err = io.Copy(outFile, tr)
			outFile.Close()
			if err != nil {
				return err
			}
		}
	}
	return nil
}

func findJavaFolder(root string) (string, error) {
	var javaFolder string
	err := filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
		if err != nil || !info.IsDir() {
			return nil
		}

		javaPath := filepath.Join(path, "bin", "java")
		if runtime.GOOS == "windows" {
			javaPath += ".exe"
		}

		if _, err := os.Stat(javaPath); err == nil {
			javaFolder = path
			return io.EOF
		}
		return nil
	})

	if err != nil && err != io.EOF {
		return "", fmt.Errorf("error scanning JRE folder: %w", err)
	}

	if javaFolder != "" {
		return javaFolder, nil
	}
	return "", fmt.Errorf("no java executable found in extracted folder")
}
