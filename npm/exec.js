#!/usr/bin/env node
const os = require("os");
const fs = require("fs");
const stream = require("stream");
const childProcess = require("child_process");
const path = require("path");

const got = require("got");
const tar = require("tar");

const { name, version } = require("../package.json");
const binaryFile = name.split("/")[1];
const packageDir = path.join(__dirname, "..");
const binaryLocation = path.join(packageDir, binaryFile);

const platformFiles = {
  "darwin x64": "darwin-amd64",
  "darwin arm64": "darwin-arm64",
  "linux x64": "linux-amd64",
  "linux 386": "linux-386",
  "win32 x64": "windows-amd64",
  "win32 ia32": "windows-386",
};
const platformKey = `${process.platform} ${os.arch()}`;
const platform = platformFiles[platformKey];
if (!platform) {
  new Error(`Unsupported platform ${platformKey}`);
  process.exit(1);
}

const uninstall = () => {
  if (fs.existsSync(binaryLocation)) {
    fs.rmSync(binaryLocation);
  }
};

const install = () => {
  const url = `https://github.com/Shopify/${binaryFile}/releases/download/v${version}/${platform}.tar.gz`;
  stream.pipeline(
    got.stream(url),
    tar.x({ C: packageDir }),
    (err) => err && console.error(err.message)
  );
};

const run = () => {
  const [, , ...args] = process.argv;
  args.push("-nodedir", process.cwd());
  const result = childProcess.spawnSync(binaryLocation, args, {
    stdio: "inherit",
    cwd: packageDir,
  });

  if (result.error) {
    console.error(result.error);
  }
  process.exit(result.status);
};

module.exports = {
  uninstall,
  install,
  run,
};
