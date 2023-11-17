package main

import (
	"bufio"
	"io/fs"
	"os"
	"path/filepath"
	"strings"
	"unicode/utf8"
)

func findUsage(images []Image, settings RepoSettings) ([]Image, error) {
	var repoDir = filepath.Join(tmpDir, settings.Repo)

	err := filepath.WalkDir(repoDir, func(path string, d fs.DirEntry, err error) error {
		if err != nil { return err }

		fileStats, err := os.Lstat(path)
		if err != nil { return err }

		if !fileStats.Mode().IsRegular() { return nil }

		// Ignore hidden directory like .git
		if strings.HasPrefix(path, ".") { return nil }

		var file *os.File
		if file, err = os.Open(path); err != nil { return err }
		defer file.Close()

		isBufferTested := false
		lineNumber := 1
		scanner := bufio.NewScanner(file)
		for scanner.Scan() {
			line := scanner.Text()

			// Check if file is utf-8 once
			if !isBufferTested && !utf8.ValidString(line) {
				return nil
			}
			isBufferTested = true

			// for each image, if line contains image add the lineNumber, line and file to usage
			for index := range images {
				imageName := images[index].Name
				if settings.UsageNoExtension {
					imageName = strings.Split(imageName, ".")[0]
				}

				// Check if the line contains the image name and any matchers
				lineMatches := strings.Contains(line, imageName)
				if len(settings.UsageMatchers) != 0 {
					containsMatcher := true
					for _, matcher := range settings.UsageMatchers {
						if !strings.Contains(line, matcher) {
							containsMatcher = false
						}
					}

					lineMatches = lineMatches && containsMatcher
				}

				if lineMatches {
					images[index].Usage = append(images[index].Usage, Usage{
						LineNumber: lineNumber,
						Line:       strings.TrimSpace(line),
						Path:       strings.Replace(path, repoDir+"/", "", 1),
					})
				}
			}
			lineNumber++
		}

		if err := scanner.Err(); err != nil && err != bufio.ErrTooLong {
			return err
		}

		return nil
	})

	if err != nil { return nil, err }

	return images, nil
}
