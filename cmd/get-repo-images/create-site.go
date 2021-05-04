package main

import (
	"errors"
	"fmt"
	"os"
	"os/exec"
	"path"
	"time"

	"github.com/briandowns/spinner"
	"github.com/otiai10/copy"
)

func createSite(data Data, buildFlag bool) error {
	spinnerIndicator := spinner.New(spinner.CharSets[14], 100*time.Millisecond)
	spinnerIndicator.Start()
	spinnerIndicator.Color("blue")
	spinnerIndicator.Suffix = " Your site is building, please wait..."

	templateDir := "site-template/"

	os.RemoveAll(path.Join(templateDir, "node_modules"))
	os.RemoveAll(path.Join(templateDir, ".next"))

	err := copy.Copy(templateDir, siteDir)
	if err != nil {
		return err
	}

	err = copy.Copy(path.Join(tmpDir, "images"), imgDir)
	if err != nil {
		return err
	}

	err = writeJsonFile(data, path.Join(siteDir, "db.json"))
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

		err = os.RemoveAll(path.Join(cwd, siteBuildLocation))
		if err != nil {
			return err
		}

		err = copy.Copy(siteDir, path.Join(cwd, siteBuildLocation))
		if err != nil {
			return err
		}
		fmt.Println("Site has been created at", siteBuildLocation)

		return nil
	}

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
		spinnerIndicator.Stop()

		fmt.Println(green("✔"), "Browse, sort and filter your images http://localhost:3000")
	}

	return nil
}
