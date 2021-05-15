package main

import (
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"sync"
	"time"

	"github.com/briandowns/spinner"
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
var clonedCount = 0
var imageCount = 0
var doneCount = 0
var green = color.New(color.FgGreen).SprintFunc()
var cwd, _ = os.Getwd()

func main() {
	var images []Image
	repoFlag := flag.String("repo", "", "the repo to search")
	configFlag := flag.Bool("config", false, "a repos.config.json file")
	token := flag.String("token", "", "a token to clone private repositories")
	siteFlag := flag.Bool("site", true, "start a site to browse images")
	jsonFlag := flag.Bool("json", false, "create a images.json file with results")
	buildFlag := flag.Bool("build", false, "build the site to the .site dir")
	flag.Parse()

	os.RemoveAll(tmpDir)

	configFile := ""
	if *configFlag {
		configFile = filepath.Join(cwd, "repos.config.json")
	}

	repos, err := getSettings(*repoFlag, configFile)
	checkError(err)
	totalRepos := len(repos)
	var remainingRepos []string
	var allRepos []string
	for _, repo := range repos {
		remainingRepos = append(remainingRepos, repo.Repo)
		allRepos = append(allRepos, repo.Repo)
	}

	spinnerIndicator := spinner.New(spinner.CharSets[14], 100*time.Millisecond)
	spinnerIndicator.Start()
	spinnerIndicator.Color("blue")
	spinnerIndicator.Suffix = getStatus(remainingRepos, totalRepos)

	var wg sync.WaitGroup
	for _, settings := range repos {
		wg.Add(1)
		go func(settings RepoSettings) {
			defer wg.Done()
			repo := settings.Repo

			err := clone(repo, filepath.Join(tmpDir, repo), *token)
			checkError(err)
			clonedCount += 1
			spinnerIndicator.Suffix = getStatus(remainingRepos, totalRepos)

			foundImages, err := findImages(settings, *siteFlag)
			checkError(err)
			imageCount += 1
			spinnerIndicator.Suffix = getStatus(remainingRepos, totalRepos)

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
			spinnerIndicator.Suffix = getStatus(remainingRepos, totalRepos)
		}(settings)
	}
	wg.Wait()

	spinnerIndicator.Stop()

	if len(images) == 0 {
		fmt.Println("No images found")
		return
	} else {
		fmt.Printf("\033[2K\r")
		fmt.Println(green("✓"), "Search complete found", len(images), "images")
	}

	data := Data{allRepos, images}

	if *jsonFlag {
		err := writeJsonFile(data, "images.json")
		checkError(err)
		spinnerIndicator.Stop()
		fmt.Println(green("✓"), "Created images.json file with results")
		return
	}

	if *siteFlag {
		err := createSite(data, *buildFlag)
		checkError(err)
		return
	}
}
