package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"os"
	"sync"
)

type Usage struct {
	Path       string `json:"path"`       // the path to the file that references the image
	LineNumber int    `json:"lineNumber"` // the line number that references the image
	Line       string `json:"line"`       // the line of code
}

type Image struct {
	Name  string  `json:"name"`  // the name of the file
	Path  string  `json:"path"`  // the location of the file
	Repo  string  `json:"repo"`  // the repo the image is from
	Size  int64   `json:"size"`  // length in bytes for regular files; system-dependent for others
	Date  string  `json:"date"`  // modification time
	Usage []Usage `json:"usage"` // the images usage in code
}

type RepoSettings struct {
	Repo             string   // the name of the repo
	Extensions       []string // the extensions to find
	MinSize          int64    // the minimum size of the file
	UsageMatchers    []string // strings that must be on the usage line of code
	UsageNoExtension bool     // search usage without extension
}

var tmpDir = "/tmp/get-repo-images/"
var siteDir = "./site/"

func checkError(err error) {
	if err == nil {
		return
	}

	os.RemoveAll(tmpDir)
	fmt.Println(err)
	os.Exit(1)
}

func main() {
	var images []Image
	settingsFile := flag.String("settings", "repos.json", "a settings file")
	token := flag.String("token", "", "a token to clone private repositories")
	generateSite := flag.Bool("site", false, "create a site to browse images")
	flag.Parse()

	repos, err := GetSettings(*settingsFile)
	checkError(err)

	var wg sync.WaitGroup
	for _, settings := range repos {
		wg.Add(1)
		go func(settings RepoSettings) {
			defer wg.Done()
			repo := settings.Repo
			fmt.Println("Searching " + repo)
			err := Clone(repo, tmpDir, *token)
			checkError(err)
			fmt.Println("Cloned " + repo)

			foundImages, err := FindImages(settings, *generateSite)
			checkError(err)
			fmt.Printf("Found %v images in "+repo+"\n", len(foundImages))

			usage, err := FindUsage(foundImages, repo)
			fmt.Println("Finished search  " + repo)
			checkError(err)

			images = append(images, usage...)
		}(settings)
	}
	wg.Wait()

	os.RemoveAll(tmpDir)

	file, _ := json.MarshalIndent(images, "", " ")
	_ = ioutil.WriteFile("images.json", file, 0644)
}
