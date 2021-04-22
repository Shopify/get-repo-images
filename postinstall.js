const got = require("got");
const os = require("os");
const zlib = require("zlib");
const fs = require("fs");

const { name, version } = require("./package.json");

const releasesUrl = `https://github.com/Shopify/${name}/releases/download`;
const tagUrl = `${releasesUrl}/${version}/${name}-${version}`;

const platformKey = `${process.platform} ${os.arch()}`;

const fileMap = {
  "darwin x64": "darwin-amd64.tar.gz",
  "linux x64": "linux-amd64.tar.gz",
  "linux 386": "linux-386.tar.gz",
  "win32 x64": "windows-amd64.zip",
  "win32 ia32": "windows-386.zip",
};

if (!fileMap[platformKey]) {
  return new Error(`Unsupported platform ${platformKey}`);
}

function extractFile(buffer, file) {
  try {
    buffer = zlib.unzipSync(buffer);
  } catch (err) {
    throw new Error(
      `Invalid gzip data in archive: ${(err && err.message) || err}`
    );
  }

  let str = (i, n) =>
    String.fromCharCode(...buffer.subarray(i, i + n)).replace(/\0.*$/, "");
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

  throw new Error(`Could not find ${JSON.stringify(file)} in archive`);
}

console.log('running post install');

(async () => {
  try {
    const outFile = process.cwd() + "/.bin/get-repo-images";
    const fileUrl = `${tagUrl}-${fileMap[platformKey]}`;
    console.log(outFile, fileUrl);
    const fileBuffer = await got(fileUrl).buffer();
    const execBuffer = extractFile(fileBuffer, name);
    fs.writeFileSync(outFile, execBuffer, { mode: 0o755 });
  } catch (error) {
    throw new Error(error)
  }
})();
