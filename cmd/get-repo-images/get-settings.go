package main

import (
	"encoding/json"
	"io/ioutil"
	"os"
)

func getSettings(repoFlag string, settingsFile string) ([]RepoSettings, error) {
	var settings []RepoSettings
	extensions := []string{"svg", "png", "jpg", "jpeg", "gif", "webp"}

	if repoFlag != "" {
		settings := append(settings, RepoSettings{
			Repo:       repoFlag,
			Extensions: extensions,
		})

		return settings, nil
	}

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

	for _, repo := range jsonData["repos"] {
		var extensions []string
		if len(repo.Extensions) >= 1 {
			extensions = repo.Extensions
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
