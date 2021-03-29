# get-repo-images

[![CI](https://github.com/Shopify/get-repo-images/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Shopify/get-repo-images/actions/workflows/ci.yml)

[About this repo](#about-this-repo) | [How to use this repo](#how-to-use-this-repo) | [Roadmap](#roadmap) | [Contribute](#contribute) | [Technical details](#technical-details)

## About this repo

| Status       | Owner         | Help                                                               |
| ------------ | ------------- | ------------------------------------------------------------------ |
| Experimental | @polaris-team | [New issue](https://github.com/Shopify/get-repo-images/issues/new) |

As Shopify has scaled, our usage of illustrations in code has become fragmented across 6000+ repositories. In 2019 we embarked on a journey to redesign our illustration style at Shopify. Finding the highest visibility illustrations across our codebase was a challenge.

This project enables teams to find images and their usage across multiple repositories. We hope this tool will be useful for anyone maintaining images across repositories.

## How to use this repo

### Install

```
$ npm install get-repo-images
```

### Usage

```js
const getRepoImages = require('get-repo-images');

(asnyc() => {
  const images = await getRepoImages([
    'alex-page/alexpage.com.au',
    'alex-page/harmonograph.art'
  ]);
})();
```

### Advanced usage

### API

#### getRepoImages(repos, token?, callback?)

**repos**

**token**

**callback**

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
