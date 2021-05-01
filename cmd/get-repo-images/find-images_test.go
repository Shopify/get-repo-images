package main

import (
	"os"
	"path"
	"testing"
)

func TestFindImages(t *testing.T) {
	settings := RepoSettings{
		Repo:       "testdata",
		Extensions: []string{"svg", "png", "jpg", "jpeg", "gif", "webp"},
	}

	copyDir("testdata", path.Join(os.TempDir(), "/get-repo-images/testdata/"))

	images, err := findImages(settings, false)
	if err != nil {
		t.Errorf("Error occured when finding images\n%s", err)
	}

	if len(images) != 3 {
		t.Errorf("Did not find images")
	}

	os.RemoveAll(path.Join(os.TempDir(), "/get-repo-images/"))
}
