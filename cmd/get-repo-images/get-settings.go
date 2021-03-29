package main

import (
	"encoding/json"
	"io/ioutil"
	"os"
)

func getSettings(repoFlag string, configFlag bool) ([]RepoSettings, error) {
	var settings []RepoSettings
	defaultExtensions := []string{"svg", "png", "jpg", "jpeg", "gif", "webp"}

	if repoFlag != "" {
		settings := append(settings, RepoSettings{
			Repo:       repoFlag,
			Extensions: defaultExtensions,
		})

		return settings, nil
	}

	file, err := os.Open("repos.config.json")
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
		extensions := repo.Extensions
		if len(extensions) == 0 {
			extensions = defaultExtensions
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
