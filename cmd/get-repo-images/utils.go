package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os"
	"strconv"
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

func getStatus(remainingRepos []string, totalRepos int) string {
	var status string
	if len(remainingRepos) <= 3 && len(remainingRepos) != 0 {
		status += " Searching " + strings.Join(remainingRepos, " ")
	} else {
		status += " Searching " + strconv.Itoa(len(remainingRepos)) + " repos"
	}

	status += " cloned (" + strconv.Itoa(clonedCount) + "/" + strconv.Itoa(totalRepos) + ")"
	status += " images (" + strconv.Itoa(clonedCount) + "/" + strconv.Itoa(totalRepos) + ")"
	status += " usage (" + strconv.Itoa(doneCount) + "/" + strconv.Itoa(totalRepos) + ")"

	return status
}

func writeJsonFile(jsonRaw interface{}, dest string) error {
	buffer := &bytes.Buffer{}
	encoder := json.NewEncoder(buffer)
	encoder.SetEscapeHTML(false)
	//Format with indentation
	encoder.SetIndent("", "  ")
	err := encoder.Encode(jsonRaw)
	if err != nil {
		return err
	}

	err = os.WriteFile(dest, buffer.Bytes(), 0644)
	if err != nil {
		return err
	}

	return nil
}
