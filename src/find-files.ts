import {promises as fs} from 'fs';

import {fdir as Fdir} from 'fdir';

import {RepoSettings, FileInformation} from './index';

export const getFilePaths = (
  directory: string,
  excludedPaths?: RepoSettings['excludedPaths'],
  extensions?: RepoSettings['extensions'],
): string[] => {
  const excludes = excludedPaths?.map((path) => `${directory}/${path}`) || [];
  const exts = extensions?.map((ext) => `**/*.${ext}`) || ['**/*.*'];

  return new Fdir()
    .withBasePath()
    .exclude((dirName, dirPath) => {
      const isHidden = dirName.startsWith('.');
      const isExcluded = excludes.some((exclude) =>
        dirPath.startsWith(exclude),
      );
      return isHidden || isExcluded;
    })
    .glob(...exts)
    .crawl(directory)
    .sync() as string[];
};

export const getFileInfo = async (
  paths: string[],
  repo: string,
  repoPath: string,
): Promise<FileInformation[]> => {
  const getInfo = paths.map(async (path) => {
    const stat = await fs.stat(path);
    const {birthtime, size} = stat;
    return {
      repo,
      path: path.replace(repoPath, ''),
      birthtime: birthtime.toJSON(),
      size,
      usage: [],
    };
  });
  const info = await Promise.all(getInfo);
  return info;
};

export const filterFiles = (
  files: FileInformation[],
  createdAfter?: RepoSettings['createdAfter'],
  minSize?: RepoSettings['minSize'],
) => {
  return files.filter((file) => {
    if (createdAfter && new Date(file.birthtime) < new Date(createdAfter)) {
      return false;
    }

    if (minSize && file.size < minSize) {
      return false;
    }

    return file;
  });
};

const findFiles = async (
  repoPath: string,
  repo: string,
  settings: RepoSettings,
): Promise<FileInformation[]> => {
  const {excludedPaths, extensions, createdAfter, minSize} = settings;
  const filePaths = getFilePaths(repoPath, excludedPaths, extensions);
  const fileInfo = await getFileInfo(filePaths, repo, repoPath);
  const files = filterFiles(fileInfo, createdAfter, minSize);

  return files;
};

export default findFiles;
