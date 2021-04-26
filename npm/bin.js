#!/usr/bin/env node

const os = require("os");
const { spawnSync, execSync } = require("child_process");
const { mkdirSync } = require("fs");
const { join } = require("path");

const platformFiles = {
  "darwin x64": "darwin-amd64",
  "linux x64": "linux-amd64",
  "linux 386": "linux-386",
  "win32 x64": "windows-amd64",
  "win32 ia32": "windows-386",
};

const binDir = "bin";
const currentPlatform = platformFiles[`${process.platform} ${os.arch()}`];

const getFileName = (p) => (p.includes("windows") ? `${p}.exe` : p);

const build = () => {
  const buildDir = join(process.cwd(), "/" + binDir);
  mkdirSync(buildDir);

  Object.values(platformFiles).forEach(p => {
    const [platform, arch] = p.split("-");
    const options = {
      cwd: buildDir,
      env: {
        GOPATH: process.env.GOPATH,
        GOCACHE: process.env.GOCACHE,
        GOROOT: process.env.GOROOT,
        HOME: process.env.HOME,
        GOOS: platform,
        GOARCH: arch,
      },
    };

    const fileName = getFileName(p);
    execSync(`go build -o ${fileName} ../...`, options);
  });
};

const run = () => {
  if (!currentPlatform) {
    throw new Error(`Unsupported platform ${currentPlatform}`);
  }
  const runFile = join(__dirname, "../" + binDir, getFileName(currentPlatform));

  const [, , ...args] = process.argv;
  const { error, status } = spawnSync(runFile, args, { stdio: "inherit" });
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
