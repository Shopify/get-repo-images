package main

import (
	"encoding/json"
	"io"
	"os"
	"testing"
)

func TestWriteJsonFile(t *testing.T) {
	jsonFile := "testdata/file.json"
	image1 := Image{
		Name: "img-3.png",
		Path: "dir/img-3.png",
		Repo: "testdata",
		Size: 1075,
		Date: "2021-04-19 08:57:50.288509246 -0700 PDT",
	}

	err := writeJsonFile(image1, jsonFile)
	if err != nil {
		t.Errorf("Error occured when writing JSON file\n%s", err)
	}

	file, err := os.Open(jsonFile)
	if err != nil {
		t.Errorf("Error occured when opening JSON file\n%s", err)
	}
	defer file.Close()

	byteValue, err := io.ReadAll(file)
	if err != nil {
		t.Errorf("Error occured when reading JSON file\n%s", err)
	}

	var jsonData Image
	err = json.Unmarshal([]byte(byteValue), &jsonData)
	if err != nil {
		t.Errorf("Error occured when unmarshalling json\n%s", err)
	}

	os.RemoveAll("testdata/file.json")
}
