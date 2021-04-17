package main

import (
	"io/fs"
	"os"
	"path/filepath"
	"strings"
)

func FindImages(settings RepoSettings, generateSite bool) ([]Image, error) {
	var images []Image
	repo := settings.Repo
	extensions := settings.Extensions
	minSize := settings.MinSize
	repoDir := tmpDir + repo

	err := filepath.WalkDir(repoDir, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}

		if d.IsDir() {
			return nil
		}

		for _, extension := range extensions {
			var pattern = "*." + extension
			var fileName = filepath.Base(path)
			if matched, err := filepath.Match(pattern, fileName); err != nil {
				return err
			} else if matched {
				info, err := os.Lstat(path)
				if err != nil {
					return err
				}

				var imgPath = strings.Replace(path, repoDir+"/", "", 1)

				if generateSite {
					err := Copy(path, siteDir+"/"+repo+"/"+imgPath)
					if err != nil {
						return err
					}
				}

				if minSize < info.Size() {
					images = append(images, Image{
						Name: fileName,
						Path: "./" + imgPath,
						Repo: repo,
						Size: info.Size(),
						Date: info.ModTime().String(),
					})
				}
			}
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return images, nil
}
