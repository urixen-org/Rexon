package mc

import (
	"compress/gzip"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"

	"github.com/midnightfreddie/nbt2json"
)

func readPlayerFile(filePath string) (map[string]interface{}, error) {
	f, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	gz, err := gzip.NewReader(f)
	if err != nil {
		return nil, err
	}
	defer gz.Close()

	nbtBytes, err := io.ReadAll(gz)
	if err != nil {
		return nil, err
	}

	nbt2json.UseJavaEncoding()
	jsonBytes, err := nbt2json.Nbt2Json(nbtBytes, "")
	if err != nil {
		return nil, err
	}

	var decoded map[string]interface{}
	if err := json.Unmarshal(jsonBytes, &decoded); err != nil {
		return nil, err
	}

	return decoded, nil
}

func LoadPlayer(worldPath, uuid string) (map[string]interface{}, error) {
	playerFile := filepath.Join(worldPath, "playerdata", uuid+".dat")
	return readPlayerFile(playerFile)
}

func LoadAllPlayers(worldPath string) ([]map[string]interface{}, error) {
	dir := filepath.Join(worldPath, "playerdata")
	files, err := os.ReadDir(dir)
	if err != nil {
		return nil, err
	}

	var players []map[string]interface{}
	for _, f := range files {
		if f.IsDir() {
			continue
		}
		if filepath.Ext(f.Name()) != ".dat" {
			continue
		}

		data, err := readPlayerFile(filepath.Join(dir, f.Name()))
		if err != nil {
			fmt.Printf("Failed to load %s: %v\n", f.Name(), err)
			continue
		}
		players = append(players, data)
	}

	return players, nil
}
