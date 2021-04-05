# get-repo-images [![CI](https://github.com/Shopify/get-repo-images/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Shopify/get-repo-images/actions/workflows/ci.yml)

## About this repo

| Status       | Owner         | Help                                                               |
| ------------ | ------------- | ------------------------------------------------------------------ |
| Experimental | @polaris-team | [New issue](https://github.com/Shopify/get-repo-images/issues/new) |

As Shopify has scaled, our usage of illustrations in code has become fragmented across 6000+ repositories. In 2019 we embarked on a journey to redesign our illustration style at Shopify. Finding the highest visibility illustrations across our codebase was a challenge.

The goal of this project is to find images and their usage across multiple repositories. We hope this tool will be useful for anyone maintaining images across repositories.

## How to use this repo

### Install

```
$ npm install @shopify/get-repo-images
```

### Usage

To get all the images from `alex-page/alexpage.com.au` and `alex-page/harmonograph.art` you can run the following code:

```js
const getRepoImages = require('@shopify/get-repo-images');

(async () => {
  const images = await getRepoImages([
    'alex-page/alexpage.com.au',
    'alex-page/harmonograph.art',
  ]);

  console.log(images);
  // =>
  // [{
  //   repo: "alex-page/alexpage.com.au",
  //   path: "/src/images/alex-page.jpg",
  //   birthtime: "2021-04-05",
  //   size: 2862,
  //   usage: [
  //     {
  //       file: ".repo/alexpage.com.au/src/_includes/components/date.njk",
  //       lineNumber: 4,
  //       line:
  //         '<img src="/images/alex-page.jpg" alt="" width="50px" height="50px">',
  //     },
  //   ],
  // },{
  //   repo: "alex-page/harmonograph.art",
  //   path: "/src/_assets/icon-512.png",
  //   birthtime: "2021-04-05",
  //   size: 32485,
  //   usage: [
  //     {
  //       file: ".repo/harmonograph.art/src/_includes/meta.njk",
  //       lineNumber: 22,
  //       line:
  //         '<meta property="og:image" content="https://harmonograph.art/assets/icon-512.png">',
  //     },
  //     {
  //       file: ".repo/harmonograph.art/src/manifest.json",
  //       lineNumber: 15,
  //       line: '"src": "/assets/icon-512.png",',
  //     },
  //   ],
  // },{
  // ...
})();
```

### Advanced usage

```js
const getRepoImages = require('@shopify/get-repo-images');

(asnyc() => {
  const token = 'personal-access-token';
  const callback = async (results) => {
    await pdfToWebp(results);
    await copyImages(results);
  }

  const images = await getRepoImages([{
    repo: 'alex-page/alexpage.com.au',
    extensions: ['svg'],
    excludedPaths: ['docs/images/'],
    minSize: 1000,
    createdAfter: '2021-04-04',
    usageNoExtension: false,
    usageMatchers: ['<img src='],
  }], token, callback);
});
```

## API

### getRepoImages(repos, token?, callback?)

| Argument      | Description                                                                                                                                        |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **repos**     | An array of strings containing repositories to clone and search. Can also be an array of objects containing [advanced options](#advanced-options). |
| **token?**    | An optional token for cloning private repositories.                                                                                                |
| **callback?** | An optional callback function to run before clean up.                                                                                              |

### Advanced options

The advanced options can be set for each repository. You can replace the repo string with an object containing the following values.

| Argument              | Description                                                                                                                               |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **name**              | The name of the repository.                                                                                                               |
| **extensions?**       | The files extensions to search for in the repository. Default value: `['svg', 'png', 'gif', 'jpg', 'jpeg', 'webp', 'pdf']`                |
| **excludedPaths?**    | Any paths to exclude from the search.                                                                                                     |
| **minSize?**          | The minimum file size to include in the results (e.g. excluding icons or finding large files). Default value: `0`.                        |
| **createdAfter?**     | A date to help find recently added images (e.g. finding recently added images or excluding legacy files).                                 |
| **usageNoExtension?** | Search for usage without the extension (e.g. finding files for android repositories where the extension is ommitted).                     |
| **usageMatchers?**    | Search for usage that includes specific strings on the line as the file name (e.g. finding files that are only used in `<img src=` tags). |

## Future enhancements

- [ ] Integration test [#1](https://github.com/Shopify/get-repo-images/issues/1)
- [ ] Command line interface to get repository images [#2](https://github.com/Shopify/get-repo-images/issues/2)

## Contribute

We welcome contributions to this repo, both in the content and the codebase, and are happy to help!

Have a feature request or found a bug? Submit a [new issue](https://github.com/Shopify/get-repo-images/issues/new).

## Technical details

get-repo-images is built using the following technologies:

- fdir, a directory crawler and globber https://github.com/thecodrr/fdir
- git-clone-repos, a shell script to clone github repos https://github.com/alex-page/git-clone-repos
