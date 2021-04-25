const { Binary } = require("@cloudflare/binary-install");
const os = require("os");

const { version, name, repository } = require("../package.json");

const platformKey = `${process.platform} ${os.arch()}`;
const platformFiles = {
  "darwin x64": "darwin-amd64",
  "linux x64": "linux-amd64",
  "linux 386": "linux-386",
  "win32 x64": "windows-amd64",
  "win32 ia32": "windows-386",
};

const platform = platformFiles[platformKey];
if (!platform) {
  return new Error(`Unsupported platform ${platformKey}`);
}

const getBinary = () => {
  const url = `${repository.url}/releases/download/v${version}/${platform}.tar.gz`;
  return new Binary(url, { name });
};

module.exports = getBinary;
