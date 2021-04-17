package main

import (
	"encoding/json"
	"io/ioutil"
	"os"
)

func GetSettings(settingsFile string) ([]RepoSettings, error) {
	file, err := os.Open(settingsFile)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	byteValue, err := ioutil.ReadAll(file)
	if err != nil {
		return nil, err
	}

	var jsonData map[string][]RepoSettings
	err = json.Unmarshal([]byte(byteValue), &jsonData)
	if err != nil {
		return nil, err
	}

	var settings []RepoSettings
	var extensions []string
	for _, repo := range jsonData["repos"] {
		if len(repo.Extensions) >= 1 {
			extensions = repo.Extensions
		} else {
			extensions = []string{"svg", "png", "jpg", "jpeg", "gif", "webp"}
		}

		settings = append(settings, RepoSettings{
			Repo:             repo.Repo,
			Extensions:       extensions,
			MinSize:          repo.MinSize,
			UsageMatchers:    repo.UsageMatchers,
			UsageNoExtension: repo.UsageNoExtension,
		})
	}

	return settings, nil
}
