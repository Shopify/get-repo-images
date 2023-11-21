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

	cloneOpts := &git.CloneOptions{
		URL:           url,
		SingleBranch:  true,
		Depth:         1,
		Progress:      os.Stdout,
	}

	if token != "" {
		cloneOpts.Auth = &http.BasicAuth{
			Username: "abc123",
			Password: token,
		}
	}

	_, err := git.PlainClone(tmpDir, false, cloneOpts)

	if err != nil {
		fmt.Println(repo, "failed to clone or authenticate")
		return err
	}

	return nil
}
