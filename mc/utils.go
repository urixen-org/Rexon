package mc

import (
	"encoding/json"
	"os"
)

func ReadJSONArray(path string) ([]map[string]interface{}, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var arr []map[string]interface{}
	if err := json.Unmarshal(data, &arr); err != nil {
		return nil, err
	}
	return arr, nil
}

func WriteJSONArray(path string, arr []map[string]interface{}) error {
	data, err := json.MarshalIndent(arr, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(path, data, 0644)
}

func ExistsByUUID(path string, uuid string) (bool, map[string]interface{}, error) {
	arr, err := ReadJSONArray(path)
	if err != nil {
		return false, nil, err
	}

	for _, v := range arr {
		if id, ok := v["uuid"].(string); ok && id == uuid {
			return true, v, nil
		}
	}
	return false, nil, nil
}

func RemoveByUUID(path string, uuid string) error {
	arr, err := ReadJSONArray(path)
	if err != nil {
		return err
	}

	out := make([]map[string]interface{}, 0)
	for _, v := range arr {
		if id, ok := v["uuid"].(string); !ok || id != uuid {
			out = append(out, v)
		}
	}

	return WriteJSONArray(path, out)
}
