## Contribute

We welcome contributions to this repo, both in the content and the codebase, and are happy to help! Have a feature request or found a bug? Submit a [new issue](https://github.com/Shopify/get-repo-images/issues/new).

### Local environment

Make sure you have [Node.js version 14](https://nodejs.org/en/download/) installed. You can then:

Run the local project
```
go run ./... --repo alex-page/alexpage.com.au
```

Run the tests and check for race conditions
```
go test ./... && go test -race ./...
```

Build the binary executable for your operating system
```
go build ./...
```

### Release a new version**

1. Update the `package.json` file to the next [semantic version](https://semver.org).
1. Push the changes to GitHub and then [create a release](https://github.com/Shopify/get-repo-images/releases/new?target=main) to build the binary files and create a tag.
1. Publish the NPM package through [shipit](https://shipit.shopify.io/shopify/get-repo-images/production).