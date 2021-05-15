package main

import (
	"bufio"
	"errors"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	"github.com/briandowns/spinner"
	"github.com/otiai10/copy"
)

func createSite(data Data, buildFlag bool, nodeDir string) error {
	spinnerIndicator := spinner.New(spinner.CharSets[14], 100*time.Millisecond)
	spinnerIndicator.Start()
	spinnerIndicator.Color("blue")
	spinnerIndicator.Suffix = " Your site is building, please wait..."

	templateDir := "site-template"

	os.RemoveAll(filepath.Join(templateDir, "node_modules"))
	os.RemoveAll(filepath.Join(templateDir, ".next"))

	err := copy.Copy(templateDir, siteDir)
	if err != nil {
		return err
	}

	err = copy.Copy(filepath.Join(tmpDir, "images"), imgDir)
	if err != nil {
		return err
	}

	err = writeJsonFile(data, filepath.Join(siteDir, "db.json"))
	if err != nil {
		return err
	}

	_, err = exec.LookPath("node")
	if err != nil {
		return errors.New("didn't find 'nodejs' executable")
	}

	if buildFlag {
		err = os.RemoveAll(siteBuildLocation)
		if err != nil {
			return err
		}

		err = copy.Copy(siteDir, siteBuildLocation)
		if err != nil {
			return err
		}

		spinnerIndicator.Stop()
		fmt.Println(green("✓"), "Site has been created at", siteBuildLocation)

		return nil
	}

	commands := [][]string{
		{"npm", "install"},
		{filepath.Join("node_modules", ".bin", "next"), "start"},
	}

	nextSuccessString := "started server on 0.0.0.0:3000, url: http://localhost:3000"
	for index, command := range commands {
		cmd := exec.Command(command[0], command[index+1:]...)
		cmd.Dir = siteDir

		stdout, err := cmd.StdoutPipe()
		if err != nil {
			return err
		}

		err = cmd.Start()
		if err != nil {
			return err
		}

		scanner := bufio.NewScanner(stdout)
		for scanner.Scan() {
			if strings.Contains(scanner.Text(), nextSuccessString) {
				spinnerIndicator.Stop()
				fmt.Println(green("✓"), "Browse, sort and filter your images http://localhost:3000")
			}
		}
		cmd.Wait()
	}

	return nil
}
