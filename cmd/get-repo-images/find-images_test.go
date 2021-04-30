package main

import (
	"os"
	"testing"
)

func TestFindImages(t *testing.T) {
	settings := RepoSettings{
		Repo:       "testdata",
		Extensions: []string{"svg", "png", "jpg", "jpeg", "gif", "webp"},
	}

	copyDir("testdata", "/tmp/get-repo-images/testdata/")

	images, err := findImages(settings, false)
	if err != nil {
		t.Errorf("Error occured when finding images")
	}

	if len(images) != 3 {
		t.Errorf("Did not find images")
	}

	os.RemoveAll("/tmp/get-repo-images/")
}