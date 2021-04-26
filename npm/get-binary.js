#!/usr/bin/env node
const os = require("os");
const fs = require("fs");
const {join} = require("path");
const {spawnSync} = require("child_process");
const {get} = require('https');
const {unzipSync, gzip} = require('zlib');

const { version, repository, name } = require("../package.json");

const platformFiles = {
  "darwin x64": "darwin-amd64",
  "linux x64": "linux-amd64",
  "linux 386": "linux-386",
  "win32 x64": "windows-amd64",
  "win32 ia32": "windows-386",
};
const platformKey = `${process.platform} ${os.arch()}`;
const platform = platformFiles[platformKey];
const binDir = join(__dirname, "bin");
const binaryFile = join(binDir, name);

if (!platform) {
  new Error(`Unsupported platform ${platformKey}`);
  process.exit(1);
}

const removeRecursive = (dir) => {
  for (const entry of fs.readdirSync(dir)) {
    const entryPath = join(dir, entry);
    let stats;
    try {
      stats = fs.lstatSync(entryPath);
    } catch (e) {
      continue; // Guard against https://github.com/nodejs/node/issues/4760
    }
    if (stats.isDirectory()) removeRecursive(entryPath);
    else fs.unlinkSync(entryPath);
  }
  fs.rmdirSync(dir);
}

const fetch = (url) => {
  return new Promise((resolve, reject) => {
    get(url, res => {
      if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location)
        return fetch(res.headers.location).then(resolve, reject);
      if (res.statusCode !== 200)
        return reject(new Error(`Server responded with ${res.statusCode}`));
      let chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

const extractFile = (buffer, file) => {
  try {
    buffer = unzipSync(buffer);
  } catch (err) {
    throw new Error(`Invalid gzip data in archive: ${err && err.message || err}`);
  }

  let str = (i, n) => String.fromCharCode(...buffer.subarray(i, i + n)).replace(/\0.*$/, '');
  let offset = 0;
  while (offset < buffer.length) {
    let name = str(offset, 100);
    let size = parseInt(str(offset + 124, 12), 8);
    offset += 512;
    if (!isNaN(size)) {
      if (name === file) return buffer.subarray(offset, offset + size);
      offset += (size + 511) & ~511;
    }
  }
  throw new Error(`Could not find ${file} in archive`);
}

const install = async () => {
  try {
    if (fs.existsSync(binDir)) {
      removeRecursive(binDir);
    }
    fs.mkdirSync(binDir, { recursive: true });
    const url = `${repository.url}/releases/download/v${version}/${platform}.tar.gz`;
    const fileBuffer = await fetch(url);
    const gzipFile = extractFile(fileBuffer, name);
    fs.writeFileSync(binaryFile, gzipFile, { mode: 0o755 });
  } catch (error) {
    throw new Error(error);
  }
};

const run = () => {
  const [, , ...args] = process.argv;
  const options = { cwd: process.cwd(), stdio: "inherit" };
  const { error, status } = spawnSync(binaryFile, args, options);

  if (error) {
    console.error(error);
    process.exit(1);
  }

  process.exit(status);
};

const uninstall = () => {
  removeRecursive(binDir);
};

module.exports = {
  install,
  run,
  uninstall,
};
