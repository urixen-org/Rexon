/*=========================================================================
 * Code Converted by code converter AI from /web/src/lib/registryResolver.ts
 =========================================================================*/
package software

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
)

type Registry struct {
	Schema    int        `json:"schema"`
	Name      string     `json:"name"`
	Description string   `json:"description"`
	Author    string     `json:"author"`
	Softwares []Software `json:"softwares"`
}

type Software struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Provider    string `json:"provider"`
	Type        string `json:"type"`
	API         struct {
		Versions struct {
			URL    string   `json:"url"`
			Fields []string `json:"fields"`
		} `json:"versions"`
		Build struct {
			URL    string   `json:"url"`
			Fields []string `json:"fields"`
		} `json:"build"`
	} `json:"api"`
	Mapping struct {
		Software string `json:"software"`
		Version  string `json:"version"`
		Build    string `json:"build"`
	} `json:"mapping"`
}

type VersionEntry struct {
	Success bool   `json:"success"`
	Builds  Builds `json:"builds"`
}

type Builds map[string]struct {
	Type      string `json:"type"`
	Supported bool   `json:"supported"`
	Java      int    `json:"java"`
	Builds    int    `json:"builds"`
	Created   string `json:"created"`
	Latest    Latest `json:"latest"`
}

type Latest struct {
	VersionId        string  `json:"versionId"`
	ProjectVersionId *string `json:"projectVersionId"`
}

type BuildFile struct {
	Type string `json:"type"` // always "download"
	URL  string `json:"url"`
	File string `json:"file"`
	Size int    `json:"size"`
}

type InstallationStep []BuildFile

type Build struct {
	ID               int              `json:"id"`
	VersionId        string           `json:"versionId"`
	ProjectVersionId *string          `json:"projectVersionId"`
	Type             string           `json:"type"`
	Experimental     bool             `json:"experimental"`
	Name             string           `json:"name"`
	Installation     []InstallationStep `json:"installation"`
	Changes          []string         `json:"changes"`
	Created          string           `json:"created"` // ISO date string
}

type BuildsResponse struct {
	Success bool    `json:"success"`
	Builds  []Build `json:"builds"`
}

type BuildEntry struct {
	ID               string                 `json:"id"`
	Type             string                 `json:"type"`
	ProjectVersionId  string                 `json:"projectVersionId"`
	VersionId        string                 `json:"versionId"`
	Name             string                 `json:"name"`
	Experimental     bool                   `json:"experimental"`
	Created          string                 `json:"created"`
	Changes          interface{}            `json:"changes,omitempty"`
	Installation     map[string]interface{} `json:"installation,omitempty"`
}

func fillTemplate(template string, values map[string]string) string {
	out := template
	for key, val := range values {
		out = strings.ReplaceAll(out, "{{"+key+"}}", val)
	}
	return out
}

func fetchJson[T any](url string) (T, error) {
	var result T
	resp, err := http.Get(url)
	if err != nil {
		return result, err
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return result, fmt.Errorf("API request failed (%d)", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return result, err
	}

	err = json.Unmarshal(body, &result)
	return result, err
}

func getSoftware(registry Registry, softwareId string) (Software, error) {
	for _, s := range registry.Softwares {
		if s.ID == softwareId {
			return s, nil
		}
	}
	return Software{}, errors.New(fmt.Sprintf("Software \"%s\" not found in registry", softwareId))
}

func getVersions(registry Registry, softwareId string) (VersionEntry, error) {
	software, err := getSoftware(registry, softwareId)
	if err != nil {
		return VersionEntry{}, err
	}

	baseUrl := fillTemplate(software.API.Versions.URL, map[string]string{
		"software": software.Type,
	})

	u, err := url.Parse(baseUrl)
	if err != nil {
		return VersionEntry{}, err
	}

	q := u.Query()
	q.Set("fields", strings.Join(software.API.Versions.Fields, ","))
	u.RawQuery = q.Encode()

	return fetchJson[VersionEntry](u.String())
}

func getBuild(registry Registry, softwareId string, version string) (BuildsResponse, error) {
	software, err := getSoftware(registry, softwareId)
	if err != nil {
		return BuildsResponse{}, err
	}

	baseUrl := fillTemplate(software.API.Build.URL, map[string]string{
		"software": software.Type,
		"version":  version,
	})

	u, err := url.Parse(baseUrl)
	if err != nil {
		return BuildsResponse{}, err
	}

	q := u.Query()
	q.Set("fields", strings.Join(software.API.Build.Fields, ","))
	u.RawQuery = q.Encode()

	return fetchJson[BuildsResponse](u.String())
}