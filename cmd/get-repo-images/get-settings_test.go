package main

import (
	"reflect"
	"testing"
)

func TestGetSettingsOneRepo(t *testing.T) {
	settings, err := getSettings("testdata", "")
	if err != nil {
		t.Errorf("Failed creating settings for one repo\n%s", err)
	}

	settingsFixture := RepoSettings{
		Repo:             "testdata",
		Extensions:       []string{"svg", "png", "jpg", "jpeg", "gif", "webp"},
		MinSize:          0,
		UsageMatchers:    []string{},
		UsageNoExtension: false,
	}

	if reflect.DeepEqual(settings[0], settingsFixture) {
		t.Errorf("Incorrect settings for one repo")
	}
}
func TestGetSettingsMultipleRepos(t *testing.T) {
	settings, err := getSettings("", "testdata/repos.config.json")
	if err != nil {
		t.Errorf("Failed creating settings for multiple repos\n%s", err)
	}

	settingOne := RepoSettings{
		Repo:             "testdata",
		Extensions:       []string{"png", "jpg"},
		MinSize:          1000,
		UsageMatchers:    []string{"<img"},
		UsageNoExtension: true,
	}

	settingTwo := RepoSettings{
		Repo:             "alex-page/alexpage.com.au",
		Extensions:       []string{"svg", "png", "jpg", "jpeg", "gif", "webp"},
		MinSize:          0,
		UsageMatchers:    []string{},
		UsageNoExtension: false,
	}

	if !reflect.DeepEqual(settings[0], settingOne) {
		t.Errorf("Incorrect settings for one repo")
	}

	if settings[1].Repo != settingTwo.Repo {
		t.Errorf("Incorrect settings for two repo")
	}
}
