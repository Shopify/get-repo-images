import {promises as fs} from 'fs';

import clone from 'git-clone-repos';

import findFiles from './find-files';
import findUsage from './find-usage';

export interface RepoSettings {
  name: string;
  excludedPaths?: string[];
  extensions?: string[];
  minSize?: number;
  createdAfter?: string;
  usageNoExtension?: boolean;
  usageMatchers?: string[];
}

export interface FileInformation {
  path: string;
  birthtime: string;
  size: number;
  usage: any[];
}

const defaultSettings = {
  extensions: ['svg', 'png', 'gif', 'jpg', 'jpeg', 'webp', 'pdf'],
  excludedPaths: [],
  minSize: 0,
  createdAfter: undefined,
  usageNoExtension: false,
  usageMatchers: [],
};

const getUrl = (repoName: string, token?: string) =>
  `https://${token && `${token}@`}github.com/${repoName}.git`;

const tmpClonePath = '.repo';
const getRepoImages = async (
  repos: RepoSettings[] | string[],
  token?: string,
  callback?: () => void,
) => {
  try {
    if (typeof repos[0] === 'string') {
      repos.map((repo) => ({name: repo}));
    }

    const cloneUrls = repos.map((repo) => getUrl(repo.name, token));
    await clone(cloneUrls, tmpClonePath);

    const getImages = repos.map(async (repo) => {
      const settings = {...defaultSettings, ...repo};
      const repoName = repo.name.split('/')[1];
      const repoPath = `${tmpClonePath}/${repoName}`;
      const images = await findFiles(repoPath, repoName, settings);
      const usage = await findUsage(images, repoPath, settings);
      return usage;
    });

    const results = await Promise.all(getImages);
    if (callback) {
      await callback();
    }
    await fs.rmdir(tmpClonePath, {recursive: true});
    return results;
  } catch (error) {
    await fs.rmdir(tmpClonePath, {recursive: true});
    throw new Error(error.message);
  }
};

export default getRepoImages;
