#!/usr/bin/env node
import os from "os";
import fs from "fs";
import stream from "stream";
import childProcess from "child_process";
import path from "path";
import { fileURLToPath } from "url";

import got from "got";
import tar from "tar";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageDir = path.join(__dirname, "..");
const packageJsonFilePath = path.join(packageDir, "package.json");
const packageData = JSON.parse(fs.readFileSync(packageJsonFilePath, "utf8"));
const { name, version } = packageData;

const binaryFileName = name.split("/")[1];
const binaryFilePath = path.join(packageDir, binaryFileName);

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

export const uninstall = () => {
  if (fs.existsSync(binaryFilePath)) {
    fs.rmSync(binaryFilePath);
  }
};

export const install = () => {
  const url = `https://github.com/Shopify/${binaryFileName}/releases/download/v${version}/${platform}.tar.gz`;
  stream.pipeline(
    got.stream(url),
    tar.x({ C: packageDir }),
    (err) => err && console.error(err.message)
  );
};

export const run = () => {
  const [, , ...args] = process.argv;
  args.push("-nodedir", process.cwd());
  const result = childProcess.spawnSync(binaryFilePath, args, {
    stdio: "inherit",
    cwd: packageDir,
  });

  if (result.error) {
    console.error(result.error);
  }

  const statusNumber = result.status ? result.status : 1;
  process.exit(statusNumber);
};
