package main

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/otiai10/copy"
)

func TestFindImages(t *testing.T) {
	settings := RepoSettings{
		Repo:       "testdata",
		Extensions: []string{"svg", "png", "jpg", "jpeg", "gif", "webp"},
	}

	copy.Copy("testdata", filepath.Join(os.TempDir(), "get-repo-images/testdata"))

	images, err := findImages(settings, false)
	if err != nil {
		t.Errorf("Error occured when finding images\n%s", err)
	}

	if len(images) != 3 {
		t.Errorf("Did not find images")
	}

	os.RemoveAll(filepath.Join(os.TempDir(), "get-repo-images"))
}
