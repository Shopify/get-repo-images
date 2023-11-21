package main

import (
	"fmt"
	"os"

	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing/transport/http"
)

func clone(repo string, tmpDir string, token string) error {
	url := "https://github.com/" + repo + ".git"
	if len(token) > 0 {
		url = "https://" + token + "@github.com/" + repo + ".git"
	}

	_, err := git.PlainClone(tmpDir, false, &git.CloneOptions{
		Auth: &http.BasicAuth{
			Username: "abc123",
			Password: token,
		},
		URL:           url,
		SingleBranch:  true,
		Depth:         1,
		Progress:      os.Stdout,
	})

	if err != nil {
		fmt.Println(repo, "failed to clone or authenticate")
		return err
	}

	return nil
}
