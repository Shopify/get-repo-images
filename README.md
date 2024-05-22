> [!CAUTION]
> This repository is no longer under active development. Shopify occasionally uses the published package internally.

<p align="center">
  <img src="https://github.com/Shopify/get-repo-images/blob/main/example.png" alt="A screenshot of the get-repo-images command being ran" width="690px">
</p>

<p align="center">
  <a href="https://github.com/Shopify/get-repo-images/actions/workflows/ci.yml">
    <img src="https://github.com/Shopify/get-repo-images/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI badge">
  </a>
</p>

# @shopify/get-repo-images

- ⚡️ An extremely fast repository crawler to find images across multiple repos
- 🌌 Find where the images are referenced in code... or not!
- 💾 Save the results to a JSON file
- 🌏 Generate a Next.js website to browse, sort and filter images
- 🪆 Sort by the file size, date created and number of references
- 🔗 [Read about Shopify's journey](https://shopify.engineering/updating-illustrations-shopify-scale)

As Shopify has scaled, our usage of illustrations in code has become fragmented across 6000+ repositories. We recently updated our illustration style and finding the illustrations, prioritising them, removing or updating them across our codebase was a challenge. We hope that `@shopify/get-repo-images` will be useful for anyone maintaining images at scale.

| Status       | Owner      | Help                                                               |
| ------------ | ---------- | ------------------------------------------------------------------ |
| Unmaintained | @alex-page | [New issue](https://github.com/Shopify/get-repo-images/issues/new) |

## How to use

Make sure you have [Node.js version 20](https://nodejs.org/en/download/) or later, then run this command from your terminal to to browse, sort and filter images from `alex-page/alexpage.com.au` on a Next.js website at [http://localhost:3000](http://localhost:3000)

```bash
npx @shopify/get-repo-images -repo alex-page/alexpage.com.au
```

Create the files for a Next.js website into the `./repo-images-site` directory

```bash
npx @shopify/get-repo-images -build -repo alex-page/alexpage.com.au
```

> Note: If you want to run the website you can run `cd repo-images-site && npm i && npm run dev`

Generate a JSON file with results to `./images.json`

```bash
npx @shopify/get-repo-images -json -repo alex-page/alexpage.com.au
```

**Private repositories**

Add a [personal access token](https://github.com/settings/tokens/new?description=get-repo-images&scopes=repo) for private repositories. Replace `TOKEN` with your token.

```shell
npx @shopify/get-repo-images -repo alex-page/alexpage.com.au -token TOKEN
```

**Advanced usage**

Create a `repos.config.json` file and use the `-config` flag to access advanced options. These allow you to get the images from multiple repositories, specific image extensions or allow minimum image sizes.

```shell
npx @shopify/get-repo-images -config
```

```json
{
  "repos": [
    {
      "repo": "shopify/mobile",
      "minSize": 1000,
      "extensions": ["webp"],
      "usageMatchers": ["drawable"],
      "usageNoExtension": true
    },
    { "repo": "alex-page/harmonograph.art" }
  ]
}
```

## Technical details

@shopify/get-repo-images is built using the following technologies:

- go, a programming language https://golang.org/
- go-git, git implementation for go https://github.com/go-git/go-git
- Next.js, a react framework https://nextjs.org
