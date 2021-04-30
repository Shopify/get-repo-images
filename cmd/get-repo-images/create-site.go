package main

import (
	"errors"
	"fmt"
	"os"
	"os/exec"
)

func createSite(data Data, buildFlag bool) error {
	templateDir := "site-template/"

	os.RemoveAll(templateDir + "node_modules")
	os.RemoveAll(templateDir + ".next")

	err := copyDir("site-template/", siteDir)
	if err != nil {
		return err
	}

	err = copyDir(tmpDir+"images", imgDir)
	if err != nil {
		return err
	}

	err = writeJsonFile(data, siteDir+"db.json")
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
		copyDir(siteDir, cwd+"/"+siteBuildLocation)
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
		cmd.Dir = siteDir
		err = cmd.Run()
		if err != nil {
			return err
		}

		fmt.Println("Browse, sort and filter your images http://localhost:3000")
	}

	return nil
}
