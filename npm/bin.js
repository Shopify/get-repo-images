#!/usr/bin/env node
const os = require("os");
const { spawnSync, execSync } = require("child_process");
const { mkdirSync } = require("fs");
const {join} = require("path");

const platformFiles = {
  "darwin x64": "darwin-amd64",
  "linux x64": "linux-amd64",
  "linux 386": "linux-386",
  "win32 x64": "windows-amd64",
  "win32 ia32": "windows-386",
};

const binDir = join(process.cwd() + "/bin");
const currentPlatform = platformFiles[`${process.platform} ${os.arch()}`];

const getFileName = p => p.includes("windows") ? `${p}.exe` : p;

const build = async () => {
  mkdirSync(binDir);

  for (const p of Object.values(platformFiles)) {
    const [platform, arch] = p.split("-");
    const options = {
      cwd: binDir,
      env: {
        GOPATH: process.env.GOPATH,
        GOCACHE: process.env.GOCACHE,
        HOME: process.env.HOME,
        GOOS: platform,
        GOARCH: arch,
      },
    };

    const fileName = getFileName(p);

    execSync(`go build -o ${fileName} ../...`, options);
  }
};

const run = () => {
  if (!currentPlatform) {
    throw new Error(`Unsupported platform ${currentPlatform}`);
  }

  const binFile = binDir + "/" + getFileName(currentPlatform);

  const [, , ...args] = process.argv;
  const options = { cwd: process.cwd(), stdio: "inherit" };
  const { error, status } = spawnSync(binFile, args, options);
  if (error) {
    console.error(error);
    process.exit(1);
  }

  process.exit(status);
};

module.exports = {
  run,
  build,
};
