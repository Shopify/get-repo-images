package main

import (
	"os"
	"testing"
)

func TestCopy(t *testing.T) {
	imgCopy := "./testdata/abcd/efg/copy.png"
	err := copy("./testdata/img.png", imgCopy)
	if err != nil {
		t.Errorf("Failed to copy file\n%s", err)
	}

	_, err = os.Stat(imgCopy)
	if err != nil {
		t.Errorf("File did not copy to correct place\n%s", err)
	}

	os.RemoveAll("./testdata/abcd/")
}

func TestCopyDir(t *testing.T) {
	dirCopy := "testdata/copy-dir/"
	err := copyDir("testdata/dir/", dirCopy)
	if err != nil {
		t.Errorf("Failed to copy directory\n%s", err)
	}

	_, err = os.Stat(dirCopy)
	if err != nil {
		t.Errorf("Directory did not copy to correct place\n%s", err)
	}

	os.RemoveAll(dirCopy)
}
