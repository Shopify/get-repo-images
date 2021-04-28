#!/usr/bin/env node
const os = require("os");
const fs = require("fs");
const stream = require("stream");
const childProcess = require("child_process");
const path = require("path");

const got = require("got");
const tar = require("tar");

const { version, name, repository } = require("../package.json");

const platformFiles = {
  "darwin x64": "darwin-amd64",
  "linux x64": "linux-amd64",
  "linux 386": "linux-386",
  "win32 x64": "windows-amd64",
  "win32 ia32": "windows-386",
};
const platformKey = `${process.platform} ${os.arch()}`;
const platform = platformFiles[platformKey];
const binDir = "bin";
const binaryFile = path.join(binDir, name);

if (!platform) {
  new Error(`Unsupported platform ${platformKey}`);
  process.exit(1);
}

const install = () => {
  if (fs.existsSync(binDir)) {
    fs.rmdirSync(binDir, { recursive: true });
  }
  fs.mkdirSync(binDir, { recursive: true });
  const url = `${repository.url}/releases/download/v${version}/${platform}.tar.gz`;
  stream.pipeline(got.stream(url), tar.x({ C: binDir }));
};

const run = () => {
  const [, , ...args] = process.argv;
  const options = { cwd: __dirname, stdio: "inherit" };
  const result = childProcess.spawnSync(binaryFile, args, options);

  if (result.error) {
    console.error(result.error);
  }

  process.exit(result.status);
};

const uninstall = () => {
  fs.rmdirSync(binDir, { recursive: true });
};

module.exports = {
  install,
  run,
  uninstall,
};
