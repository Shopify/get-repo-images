package main

import (
	"errors"
	"fmt"

	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing/transport"
	"github.com/go-git/go-git/v5/plumbing/transport/client"
)

func clone(repo string, tmpDir string, token string) error {
	url := "https://github.com/" + repo + ".git"
	if len(token) > 0 {
		url = "https://" + token + "@github.com/" + repo + ".git"
	}

	// Get the HEAD reference for non master branches
	// https://github.com/go-git/go-git/issues/249#issuecomment-772354474
	e, err := transport.NewEndpoint(url)
	if err != nil {
		return err
	}

	cli, err := client.NewClient(e)
	if err != nil {
		return err
	}

	s, err := cli.NewUploadPackSession(e, nil)
	if err != nil {
		return err
	}

	info, err := s.AdvertisedReferences()
	if err != nil {
		return errors.New("Could not find or authenticate repo " + repo)
	}

	refs, err := info.AllReferences()
	if err != nil {
		return err
	}

	headReference := refs["HEAD"].Target()

	_, err = git.PlainClone(tmpDir, false, &git.CloneOptions{
		URL:           url,
		SingleBranch:  true,
		Depth:         1,
		ReferenceName: headReference,
	})

	if err != nil {
		fmt.Println(repo, "failed to clone")
		return err
	}

	return nil
}
