#!/usr/bin/env node
import os from "os";
import fs from "fs";
import stream from "stream";
import childProcess from "child_process";
import path from "path";
import { fileURLToPath } from "url";

import got from "got";
import tar from "tar";

const packageData = JSON.parse(fs.readFileSync("package.json", "utf8"));
const { name, version } = packageData;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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

export const uninstall = () => {
  if (fs.existsSync(binaryLocation)) {
    fs.rmSync(binaryLocation);
  }
};

export const install = () => {
  const url = `https://github.com/Shopify/${binaryFile}/releases/download/v${version}/${platform}.tar.gz`;
  stream.pipeline(
    got.stream(url),
    tar.x({ C: packageDir }),
    (err) => err && console.error(err.message)
  );
};

export const run = () => {
  const [, , ...args] = process.argv;
  args.push("-nodedir", process.cwd());
  const result = childProcess.spawnSync(binaryLocation, args, {
    stdio: "inherit",
    cwd: packageDir,
  });

  if (result.error) {
    console.error(result.error);
  }

  const statusNumber = result.status ? result.status : 1;
  process.exit(statusNumber);
};
