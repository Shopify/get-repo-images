package main

import (
	"github.com/go-git/go-git/v5"
)

func Clone(repo string, tmpDir string, token string) error {
	repoDir := tmpDir + repo
	url := "https://github.com/" + repo + ".git"
	if len(token) > 0 {
		url = "https://" + token + "@github.com/" + repo + ".git"
	}

	_, err := git.PlainClone(repoDir, false, &git.CloneOptions{
		URL:          url,
		SingleBranch: true,
		Depth:        1,
	})

	if err != nil {
		return err
	}

	return nil
}
