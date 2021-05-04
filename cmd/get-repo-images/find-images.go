package main

import (
	"io/fs"
	"os"
	"path"
	"path/filepath"
	"strings"

	"github.com/otiai10/copy"
)

func findImages(settings RepoSettings, siteFlag bool) ([]Image, error) {
	var images []Image
	repo := settings.Repo
	extensions := settings.Extensions
	minSize := settings.MinSize
	repoDir := path.Join(tmpDir, repo)

	err := filepath.WalkDir(repoDir, func(fpath string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}

		if d.IsDir() {
			return nil
		}

		for _, extension := range extensions {
			var pattern = "*." + extension
			var fileName = strings.ToLower(filepath.Base(fpath))
			if matched, err := filepath.Match(pattern, fileName); err != nil {
				return err
			} else if matched {
				info, err := os.Lstat(fpath)
				if err != nil {
					return err
				}

				var imgPath = strings.Replace(fpath, repoDir+"/", "", 1)
				imgPath = strings.TrimSuffix(imgPath, "\n")
				imgPath = strings.TrimSuffix(imgPath, "\r")

				if minSize < info.Size() {
					images = append(images, Image{
						Name: fileName,
						Path: imgPath,
						Repo: repo,
						Size: info.Size(),
						Date: info.ModTime().String(),
					})

					if siteFlag {
						err := copy.Copy(fpath, path.Join(tmpDir, "images/", repo+"/", imgPath))
						if err != nil {
							return err
						}
					}
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
