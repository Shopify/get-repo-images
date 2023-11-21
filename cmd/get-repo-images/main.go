package main

import (
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"sync"

	"github.com/fatih/color"
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

var tmpDir = filepath.Join(os.TempDir(), "get-repo-images")
var siteDir = filepath.Join(os.TempDir(), "get-repo-images/site")
var imgDir = filepath.Join(siteDir, "public/repo-images")
var siteBuildLocation = "get-repo-site"
var green = color.New(color.FgGreen).SprintFunc()

func main() {
	var images []Image

	repoFlag := flag.String("repo", "", "the repo to search")
	configFlag := flag.Bool("config", false, "a repos.config.json file")
	token := flag.String("token", "", "a token to clone private repositories")
	siteFlag := flag.Bool("site", true, "start a site to browse images")
	jsonFlag := flag.Bool("json", false, "create a images.json file with results")
	buildFlag := flag.Bool("build", false, "build the site to the .site dir")
	nodeDir := flag.String("nodedir", "", "path where NodeJS is ran")
	flag.Parse()

	os.RemoveAll(tmpDir)
	siteBuildLocation = filepath.Join(*nodeDir, siteBuildLocation)

	configFile := ""
	if *configFlag {
		configFile = filepath.Join(*nodeDir, "repos.config.json")
	}

	repos, err := getSettings(*repoFlag, configFile)
	checkError(err)

	var allRepos []string

	for _, repo := range repos {
		allRepos = append(allRepos, repo.Repo)
	}

	var wg sync.WaitGroup
	for _, settings := range repos {
		wg.Add(1)

		go func(settings RepoSettings) {
			defer wg.Done()
			repo := settings.Repo
			fmt.Println("Cloning", repo+"...")
			err := clone(repo, filepath.Join(tmpDir, repo), *token)
			checkError(err)

			fmt.Println("Finding images", repo+"...")
			foundImages, err := findImages(settings, *siteFlag)
			checkError(err)

			fmt.Println("Finding usage for", len(foundImages), "images in", repo+"...")
			usage, err := findUsage(foundImages, settings)
			checkError(err)

			fmt.Println(green("✓"), "Completed", repo)
			images = append(images, usage...)
		}(settings)
	}
	wg.Wait()

	if len(images) == 0 {
		fmt.Println("No images found")
		return
	}

	data := Data{allRepos, images}

	if *jsonFlag {
		jsonFile := filepath.Join(*nodeDir, "images.json")
		err := writeJsonFile(data, jsonFile)
		checkError(err)
		fmt.Println(green("✓"), "Created images.json file with results")
		return
	}

	if *siteFlag {
		err := createSite(data, *buildFlag, *nodeDir)
		checkError(err)
		return
	}
}
