#!/usr/bin/env node
const os = require("os");
const stream = require("stream");
const { promisify } = require("util");
const fs = require("fs");
const got = require("got");
const tar = require("tar");
const path = require("path");
const childProcess = require("child_process");

const pipeline = promisify(stream.pipeline);

const { version, name, repository } = require("../package.json");
const rimraf = require("rimraf");

const platformFiles = {
  "darwin x64": "darwin-amd64",
  "linux x64": "linux-amd64",
  "linux 386": "linux-386",
  "win32 x64": "windows-amd64",
  "win32 ia32": "windows-386",
};
const platformKey = `${process.platform} ${os.arch()}`;
const platform = platformFiles[platformKey];
const binDir = path.join(__dirname, "bin");
const binaryFile = path.join(binDir, name);

if (!platform) {
  new Error(`Unsupported platform ${platformKey}`);
  process.exit(1);
}

const install = async () => {
  if (fs.existsSync(binDir)) {
    rimraf.sync(binDir);
  }
  fs.mkdirSync(binDir, { recursive: true });
  const url = `${repository.url}/releases/download/v${version}/${platform}.tar.gz`;
  console.log("downloading binary", url);
  await pipeline(got.stream(url), tar.x({ C: binDir }));
};

const run = () => {
  const [, , ...args] = process.argv;
  const options = { cwd: process.cwd(), stdio: "inherit" };
  const result = childProcess.spawnSync(binaryFile, args, options);

  if (result.error) {
    error(result.error);
  }

  process.exit(result.status);
};

const uninstall = () => {
  rimraf.sync(binDir);
};

module.exports = {
  install,
  run,
  uninstall,
};
