package playit

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/fs"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
)

type githubRelease struct {
	Assets []githubAsset `json:"assets"`
}

type githubAsset struct {
	Name               string `json:"name"`
	BrowserDownloadURL string `json:"browser_download_url"`
	Digest             string `json:"digest"`
}

func InstallPlayit(path string) error {
	release, err := fetchLatestRelease()
	if err != nil {
		return err
	}

	asset, sha, err := selectAsset(release.Assets)
	if err != nil {
		return err
	}

	if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
		return err
	}

	resp, err := http.Get(asset.BrowserDownloadURL)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return fmt.Errorf("download failed: %s", resp.Status)
	}

	tmp := path + ".tmp"
	out, err := os.Create(tmp)
	if err != nil {
		return err
	}

	hasher := sha256.New()
	w := io.MultiWriter(out, hasher)

	if _, err := io.Copy(w, resp.Body); err != nil {
		out.Close()
		return err
	}
	out.Close()

	sum := hex.EncodeToString(hasher.Sum(nil))
	if sum != sha {
		os.Remove(tmp)
		return fmt.Errorf("sha256 mismatch: expected %s got %s", sha, sum)
	}

	if err := os.Rename(tmp, path); err != nil {
		return err
	}

	if runtime.GOOS != "windows" {
		return os.Chmod(path, 0755)
	}

	return nil
}

func fetchLatestRelease() (*githubRelease, error) {
	req, err := http.NewRequest(
		"GET",
		"https://api.github.com/repos/playit-cloud/playit-agent/releases/latest",
		nil,
	)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("User-Agent", "playit-installer")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("github api error: %s", resp.Status)
	}

	var rel githubRelease
	if err := json.NewDecoder(resp.Body).Decode(&rel); err != nil {
		return nil, err
	}

	return &rel, nil
}

func selectAsset(assets []githubAsset) (*githubAsset, string, error) {
	var wanted string

	switch runtime.GOOS {
	case "linux":
		switch runtime.GOARCH {
		case "amd64":
			wanted = "playit-linux-amd64"
		case "arm64":
			wanted = "playit-linux-aarch64"
		case "arm":
			wanted = "playit-linux-armv7"
		case "386":
			wanted = "playit-linux-i686"
		default:
			return nil, "", errors.New("unsupported linux arch")
		}

	case "windows":
		switch runtime.GOARCH {
		case "amd64":
			wanted = "playit-windows-x86_64.exe"
		case "386":
			wanted = "playit-windows-x86.exe"
		default:
			return nil, "", errors.New("unsupported windows arch")
		}

	default:
		return nil, "", errors.New("unsupported OS")
	}

	for _, a := range assets {
		if a.Name == wanted {
			if !strings.HasPrefix(a.Digest, "sha256:") {
				return nil, "", errors.New("missing sha256 digest")
			}
			return &a, strings.TrimPrefix(a.Digest, "sha256:"), nil
		}
	}

	return nil, "", errors.New("playit binary not found in release")
}

func FindPlayit() (string, error) {
	bin := "playit"
	if runtime.GOOS == "windows" {
		bin = "playit.exe"
	}

	if p, err := exec.LookPath(bin); err == nil {
		return p, nil
	}

	var candidates []string

	switch runtime.GOOS {
	case "linux":
		candidates = []string{
			"/rexon",
			"/usr/local/bin/playit",
			"/usr/bin/playit",
			"/opt/playit/playit",
			filepath.Join(os.Getenv("HOME"), ".local/bin/playit"),
		}

	case "windows":
		candidates = []string{
			"E:\\rexon",
			`C:\Program Files\playit\playit.exe`,
			`C:\Program Files (x86)\playit\playit.exe`,
		}
	}

	for _, p := range candidates {
		if info, err := os.Stat(p); err == nil && !info.IsDir() {
			return p, nil
		}
	}

	var roots []string

	if runtime.GOOS == "windows" {
		roots = []string{`C:\`}
	} else {
		roots = []string{"/usr", "/opt", os.Getenv("HOME")}
	}

	for _, root := range roots {
		if p := walkFind(root, bin); p != "" {
			return p, nil
		}
	}

	return "", os.ErrNotExist
}

func walkFind(root, target string) string {
	filepath.WalkDir(root, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return nil
		}

		if !d.IsDir() && d.Name() == target {
			return filepath.SkipDir
		}

		return nil
	})

	var found string
	filepath.WalkDir(root, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return nil
		}

		if !d.IsDir() && d.Name() == target {
			found = path
			return filepath.SkipAll
		}

		return nil
	})

	return found
}
