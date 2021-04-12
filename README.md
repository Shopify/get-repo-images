# get-repo-images

## About this repo

| Status       | Owner         | Help                                                               |
| ------------ | ------------- | ------------------------------------------------------------------ |
| Experimental | @polaris-team | [New issue](https://github.com/Shopify/get-repo-images/issues/new) |

As Shopify has scaled, our usage of illustrations in code has become fragmented across 6000+ repositories. In 2019 we embarked on a journey to redesign our illustration style at Shopify. Finding the highest visibility illustrations across our codebase was a challenge.

The goal of this project is to find images and their usage across multiple repositories. We hope this tool will be useful for anyone maintaining images across repositories.

## How to use this repo

### Install

```
$ 
```

### Usage

To get all the images from `alex-page/alexpage.com.au` and `alex-page/harmonograph.art` you can run the following code:

```js

```

## API

### getRepoImages(repos, token?, callback?)

| Argument      | Description                                                                                                                                        |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **token?**    | An optional token for cloning private repositories.                                                                                                |

## Contribute

We welcome contributions to this repo, both in the content and the codebase, and are happy to help!

Have a feature request or found a bug? Submit a [new issue](https://github.com/Shopify/get-repo-images/issues/new).

**Release a new version**

Push the latest changes into the main branch then [create a release](https://github.com/Shopify/get-repo-images/releases/new?target=main).

## Technical details

get-repo-images is built using the following technologies:

- go, a programming language https://golang.org/
