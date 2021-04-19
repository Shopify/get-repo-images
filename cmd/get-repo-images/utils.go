package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"strings"
)

func checkError(err error) {
	if err == nil {
		return
	}

	fmt.Println()
	fmt.Println(err)
	os.Exit(1)
}

func printStatus(remainingRepos []string, totalRepos int) {
	fmt.Printf("\033[2K\r") // clear the previous line
	fmt.Printf("Cloned %d/%d", clonedCount, totalRepos)
	fmt.Printf(" Images %d/%d", imageCount, totalRepos)
	fmt.Printf(" Usage %d/%d", doneCount, totalRepos)

	if len(remainingRepos) <= 3 && len(remainingRepos) != 0 {
		fmt.Printf(" waiting for %s", strings.Join(remainingRepos, " "))
	}
}

func WriteJsonFile(jsonRaw interface{}, dest string) error {
	buffer := &bytes.Buffer{}
	encoder := json.NewEncoder(buffer)
	encoder.SetEscapeHTML(false)
	//Format with indentation
	encoder.SetIndent("", "  ")
	err := encoder.Encode(jsonRaw)
	if err != nil {
		return err
	}

	err = ioutil.WriteFile(dest, buffer.Bytes(), 0644)
	if err != nil {
		return err
	}

	return nil
}
