package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
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
	status := " cloned (" + strconv.Itoa(clonedCount) + "/" + strconv.Itoa(totalRepos) + ")"
	status += " images (" + strconv.Itoa(clonedCount) + "/" + strconv.Itoa(totalRepos) + ")"
	status += " usage (" + strconv.Itoa(doneCount) + "/" + strconv.Itoa(totalRepos) + ")"

	if len(remainingRepos) <= 3 && len(remainingRepos) != 0 {
		status += " waiting for " + strings.Join(remainingRepos, " ")
	}

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

	err = ioutil.WriteFile(dest, buffer.Bytes(), 0644)
	if err != nil {
		return err
	}

	return nil
}
