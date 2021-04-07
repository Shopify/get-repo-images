import {promises as fs} from 'fs';

import ora from 'ora';
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
  `https://${token ? `${token}@` : ''}github.com/${repoName}.git`;

const message = (foundImages, searchedRepos, totalRepos) =>
  `Found ${foundImages} images in ${searchedRepos}/${totalRepos} repos`;

const tmpClonePath = '.repo';
const getRepoImages = async (
  _repos: RepoSettings[] | string[],
  token?: string,
  callback?: (results) => void,
) => {
  const spinner = ora().start();

  try {
    const repos =
      typeof _repos[0] === 'string' ? _repos.map((name) => ({name})) : _repos;

    let totalRepos = 0;
    let totalImages = 0;
    const getMessage = () => message(totalImages, totalRepos, repos.length);
    const getImages = repos.map(async (repo) => {
      spinner.text = `${getMessage()} | cloning ${repo.name}`;
      const url = getUrl(repo.name, token);
      await clone([url], tmpClonePath);
      const settings = {...defaultSettings, ...repo};
      const repoName = repo.name.split('/')[1];
      const repoPath = `${tmpClonePath}/${repoName}`;
      spinner.text = `${getMessage()} | searching images ${repo.name} `;
      const images = await findFiles(repoPath, repo.name, settings);
      spinner.text = `${getMessage()} | finding usage ${repo.name}`;
      const usage = await findUsage(images, repoPath, settings);
      totalRepos += 1;
      totalImages += usage.length;
      return usage;
    });

    const results = (await Promise.all(getImages)).flat();

    if (callback) {
      await callback(results);
    }
    await fs.rmdir(tmpClonePath, {recursive: true});
    spinner.succeed(`Found ${results.length} images`);
    return results;
  } catch (error) {
    await fs.rmdir(tmpClonePath, {recursive: true});
    spinner.fail(error.message);
    throw new Error(error.message);
  }
};

export default getRepoImages;
