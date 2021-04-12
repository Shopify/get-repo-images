package findUsage

import (
	"bufio"
	"io/fs"
	"os"
	"path/filepath"
	"strings"
	"unicode/utf8"
)

func FindUsage(images []image, repo string) ([]image, error) {
	var repoDir = tmpDir + repo

	err := filepath.WalkDir(repoDir, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}

		if d.IsDir() {
			return nil
		}

		var file *os.File
		if file, err = os.Open(path); err != nil {
			return err
		}
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
				if strings.Contains(line, images[index].Name) {
					images[index].Usage = append(images[index].Usage, usage{
						LineNumber: lineNumber,
						Line:       strings.TrimSpace(line),
						Path:       strings.Replace("./"+path, repoDir+"/", "", 1),
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

	if err != nil {
		return nil, err
	}

	return images, nil
}
