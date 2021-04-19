package main

import (
	"errors"
	"flag"
	"fmt"
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

type Data struct {
	Tags   []string `json:"tags"`   // the repos found
	Images []Image  `json:"images"` // the images found
}

var tmpDir = "/tmp/get-repo-images/"
var siteDir = "./.site/"
var imgDir = siteDir + "public/repo-images/"
var clonedCount = 0
var imageCount = 0
var doneCount = 0

func main() {
	var images []Image
	repoFlag := flag.String("repo", "", "the repo to search")
	settingsFile := flag.String("settings", "", "a settings file")
	token := flag.String("token", "", "a token to clone private repositories")
	siteFlag := flag.Bool("site", true, "create a site to browse images")
	jsonFlag := flag.Bool("json", false, "create a JSON file of image data")
	flag.Parse()

	if len(*repoFlag) == 0 && len(*settingsFile) == 0 {
		err := errors.New("make sure a --repo or --settings is provided")
		checkError(err)
	}

	os.RemoveAll(imgDir)
	os.RemoveAll(siteDir)
	os.RemoveAll(tmpDir)

	repos, err := getSettings(*repoFlag, *settingsFile)
	checkError(err)
	totalRepos := len(repos)
	var remainingRepos []string
	var allRepos []string
	for _, repo := range repos {
		remainingRepos = append(remainingRepos, repo.Repo)
		allRepos = append(allRepos, repo.Repo)
	}

	printStatus(remainingRepos, totalRepos)

	var wg sync.WaitGroup
	for _, settings := range repos {
		wg.Add(1)
		go func(settings RepoSettings) {
			defer wg.Done()
			repo := settings.Repo

			err := clone(repo, tmpDir+repo, *token)
			checkError(err)
			clonedCount += 1
			printStatus(remainingRepos, totalRepos)

			foundImages, err := findImages(settings, *siteFlag)
			checkError(err)
			imageCount += 1
			printStatus(remainingRepos, totalRepos)

			usage, err := findUsage(foundImages, settings)
			checkError(err)

			images = append(images, usage...)

			// Remove the repo from remaining repos
			for index, remainingRepo := range remainingRepos {
				if remainingRepo == repo {
					remainingRepos = append(remainingRepos[:index], remainingRepos[index+1:]...)
				}
			}

			doneCount += 1
			printStatus(remainingRepos, totalRepos)
		}(settings)
	}
	wg.Wait()

	if len(images) == 0 {
		fmt.Println("No images found")
		return
	} else {
		fmt.Printf("\033[2K\r")
		fmt.Println("Search complete found", len(images), "images")
	}

	data := Data{allRepos, images}

	if *siteFlag {
		err := createSite(data)
		checkError(err)
	}

	if *jsonFlag {
		fmt.Println("Creating JSON file")
		err := WriteJsonFile(data, "images.json")
		checkError(err)
	}
}
