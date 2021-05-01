package main

import (
	"os"
	"testing"
)

func TestFindUsage(t *testing.T) {
	settings := RepoSettings{
		Repo:       "testdata",
		Extensions: []string{"svg", "png", "jpg", "jpeg", "gif", "webp"},
	}

	image1 := Image{
		Name: "img-3.png",
		Path: "dir/img-3.png",
		Repo: "testdata",
		Size: 1075,
		Date: "2021-04-19 08:57:50.288509246 -0700 PDT",
	}

	image2 := Image{
		Name: "img.png",
		Path: "img.png",
		Repo: "testdata",
		Size: 1075,
		Date: "2021-04-19 08:57:50.288509246 -0700 PDT",
	}

	copyDir("testdata", os.TempDir()+"/get-repo-images/testdata/")

	usage, err := findUsage([]Image{image1, image2}, settings)
	if err != nil {
		t.Errorf("Error occured when finding usage")
	}

	if len(usage) != 2 || len(usage[0].Usage) != 1 {
		t.Errorf("Did not find usage")
	}

	os.RemoveAll(os.TempDir() + "/get-repo-images/")
}
