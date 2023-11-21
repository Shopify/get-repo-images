package main

import (
	"bufio"
	"errors"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/otiai10/copy"
)

func createSite(data Data, buildFlag bool, nodeDir string) error {
	fmt.Println("Creating website...")

	templateDir := "site-template"

	os.RemoveAll(filepath.Join(templateDir, "node_modules"))
	os.RemoveAll(filepath.Join(templateDir, ".next"))

	err := copy.Copy(templateDir, siteDir)
	if err != nil { return err }

	err = copy.Copy(filepath.Join(tmpDir, "images"), imgDir)
	if err != nil { return err }

	err = writeJsonFile(data, filepath.Join(siteDir, "db.json"))
	if err != nil { return err }

	_, err = exec.LookPath("node")
	if err != nil {
		return errors.New("Ensure 'nodejs' is installed no executable found")
	}

	if buildFlag {
		err = os.RemoveAll(siteBuildLocation)
		if err != nil { return err }

		err = copy.Copy(siteDir, siteBuildLocation)
		if err != nil { return err }

		fmt.Println(green("✓"), "Site has been created at", siteBuildLocation)

		return nil
	}

	fmt.Println("Running npm install && npm run dev...")

	commands := [][]string{
		{"npm", "install"},
		{filepath.Join("node_modules", ".bin", "next"), "start"},
	}

	for index, command := range commands {
		cmd := exec.Command(command[0], command[index+1:]...)
		cmd.Dir = siteDir

		stdout, err := cmd.StdoutPipe()
		if err != nil { return err }
		
		err = cmd.Start()
		if err != nil { return err }

		scanner := bufio.NewScanner(stdout)
		for scanner.Scan() {
			fmt.Println(scanner.Text())
		}

		cmd.Wait()
	}

	return nil
}
