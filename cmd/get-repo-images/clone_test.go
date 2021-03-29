package main

import (
	"os"
	"testing"
)

func TestClone(t *testing.T) {
	testCloneDir := "testdata/clone-test"
	repo := "alex-page/alexpage.com.au"
	os.RemoveAll(testCloneDir)

	err := clone(repo, testCloneDir, "")
	if err != nil {
		t.Errorf("Failed to clone")
	}

	_, err = os.Stat(testCloneDir + "/README.md")
	if err != nil {
		t.Errorf("Files are not in correct place")
	}

	os.RemoveAll(testCloneDir)
}
