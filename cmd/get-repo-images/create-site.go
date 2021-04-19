package main

import (
	"errors"
	"fmt"
	"os/exec"
)

func createSite(data Data) error {
	err := clone("alex-page/image-explorer", siteDir, "")
	if err != nil {
		return err
	}

	err = copyDir(tmpDir+"images", imgDir)
	if err != nil {
		return err
	}

	err = WriteJsonFile(data, siteDir+"db.json")
	if err != nil {
		return err
	}

	_, err = exec.LookPath("node")
	if err != nil {
		return errors.New("didn't find 'nodejs' executable")
	}

	commands := [][]string{
		{"npm", "install"},
		{"node_modules/.bin/next", "start"},
	}

	fmt.Println("Your site is building, please wait...")

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
