package getSettings

import (
	"encoding/json"
	"io/ioutil"
	"os"
)

func GetSettings(settingsFile string) ([]repoSettings, error) {
	file, err := os.Open(settingsFile)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	byteValue, err := ioutil.ReadAll(file)
	if err != nil {
		return nil, err
	}

	var jsonData map[string][]repoSettings
	err = json.Unmarshal([]byte(byteValue), &jsonData)
	if err != nil {
		return nil, err
	}

	var settings []repoSettings
	var extensions []string
	for _, repo := range jsonData["repos"] {
		if len(repo.Extensions) >= 1 {
			extensions = repo.Extensions
		} else {
			extensions = []string{"svg", "png", "jpg", "jpeg", "gif", "webp"}
		}

		settings = append(settings, repoSettings{
			Repo:             repo.Repo,
			Extensions:       extensions,
			MinSize:          repo.MinSize,
			UsageMatchers:    repo.UsageMatchers,
			UsageNoExtension: repo.UsageNoExtension,
		})
	}

	return settings, nil
}
