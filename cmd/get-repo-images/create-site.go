package main

import (
	"errors"
	"fmt"
	"os"
	"os/exec"
)

func createSite(data Data, buildFlag bool) error {
	siteTemplateDir := siteDir + "site-template/"
	err := clone("shopify/get-repo-images", siteDir, "")
	if err != nil {
		return err
	}

	err = copyDir(tmpDir+"images", imgDir)
	if err != nil {
		return err
	}

	err = writeJsonFile(data, siteTemplateDir+"db.json")
	if err != nil {
		return err
	}

	_, err = exec.LookPath("node")
	if err != nil {
		return errors.New("didn't find 'nodejs' executable")
	}

	if buildFlag {
		cwd, err := os.Getwd()
		if err != nil {
			return err
		}

		os.RemoveAll(cwd + "/" + siteBuildLocation)
		copyDir(siteTemplateDir, cwd+"/"+siteBuildLocation)
		fmt.Println("Site has been created at", siteBuildLocation)

		return nil
	}

	fmt.Println("Your site is building, please wait...")

	commands := [][]string{
		{"npm", "install"},
		{"node_modules/.bin/next", "start"},
	}

	for index, command := range commands {
		cmd := exec.Command(command[0], command[index+1:]...)
		cmd.Dir = siteTemplateDir
		err = cmd.Run()
		if err != nil {
			return err
		}

		fmt.Println("Browse, sort and filter your images http://localhost:3000")
	}

	return nil
}
