#!/usr/bin/env node
const os = require("os");
const fs = require("fs");
const got = require("got");
const tar = require("tar");

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

const writeFile = entry => {

}

const install = async () => {
  const url = `${repository.url}/releases/download/v${version}/${platform}.tar.gz`;
  const options = { responseType: "buffer", resolveBodyOnly: true };
  const fileBuffer = await got(url, options);

	const tStream = tar.t({
		sync: true,
		onentry: entry => fs.writeFileSync('', entry),
	})
	tStream.end(fileBuffer);

};

(async () => {
  await install();
})();
