package main

import (
	"fmt"
	"os"
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

	cmd := exec.Command("npm", "install")
	cmd.Dir = siteDir
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	err = cmd.Run()
	if err != nil {
		return err
	}

	fmt.Println("Site is built and ready")
	fmt.Println("npx serve ./site/.next/")

	return nil
}
