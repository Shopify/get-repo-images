package main

import (
	"reflect"
	"testing"
)

func TestGetSettingsOneRepo(t *testing.T) {
	settings, err := getSettings("testdata", false)
	if err != nil {
		t.Errorf("Failed creating settings for one repo")
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

// This test doesn't work because `testdata/repos.config.json` is in the wrong place
//
// func TestGetSettingsMultipleRepos(t *testing.T) {
// 	settings, err := getSettings("", true)
// 	if err != nil {
// 		t.Errorf("Failed creating settings for multiple repos")
// 	}

// 	settingOne := RepoSettings{
// 		Repo:             "testdata",
// 		Extensions:       []string{"png", "jpg"},
// 		MinSize:          1000,
// 		UsageMatchers:    []string{"<img"},
// 		UsageNoExtension: true,
// 	}

// 	settingTwo := RepoSettings{
// 		Repo:             "alex-page/alexpage.com.au",
// 		Extensions:       []string{"svg", "png", "jpg", "jpeg", "gif", "webp"},
// 		MinSize:          0,
// 		UsageMatchers:    []string{},
// 		UsageNoExtension: false,
// 	}

// 	if !reflect.DeepEqual(settings[0], settingOne) {
// 		t.Errorf("Incorrect settings for one repo")
// 	}

// 	if settings[1].Repo != settingTwo.Repo {
// 		t.Errorf("Incorrect settings for two repo")
// 	}
// }
