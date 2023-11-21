package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os"
)

func checkError(err error) {
	if err == nil {
		return
	}

	fmt.Println()
	fmt.Println(err)
	os.Exit(1)
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
