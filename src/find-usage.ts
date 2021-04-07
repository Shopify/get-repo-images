import {createInterface} from 'readline';
import {once} from 'events';

import {fdir as Fdir} from 'fdir';
import {createReadStream} from 'graceful-fs';
import pLimit from 'p-limit';

import {RepoSettings, FileInformation} from './index';

const limit = pLimit(10);

export const getFileName = (
  path: FileInformation['path'],
  usageNoExtension?: RepoSettings['usageNoExtension'],
): string => {
  const fileName = path.split('/')[path.split('/').length - 1];
  return usageNoExtension ? fileName.split('.')[0] : fileName;
};

const findUsage = async (
  images: FileInformation[],
  directory: string,
  settings: RepoSettings,
): Promise<FileInformation[]> => {
  const {usageMatchers, usageNoExtension} = settings;

  const files = new Fdir()
    .withBasePath()
    .exclude((dirName) => dirName.startsWith('.'))
    .crawl(directory)
    .sync() as string[];

  const searchFiles = files.map((file) =>
    limit(async () => {
      const fileStream = createReadStream(file);
      const readlines = createInterface({
        input: fileStream,
        output: process.stdout,
        terminal: false,
      });

      // eslint-disable-next-line no-param-reassign
      const lineCount = ((i = 0) => () => ++i)();

      readlines.on('line', (line, lineNumber = lineCount()) => {
        images.forEach((image) => {
          const fileName = getFileName(image.path, usageNoExtension);
          const lineMatches = line.includes(fileName);
          const additionalMatch =
            usageMatchers && usageMatchers.length
              ? usageMatchers.some((match) => line.includes(match))
              : true;

          if (lineMatches && additionalMatch) {
            image.usage.push({file, lineNumber, line: line.trim()});
          }
        });
      });

      await once(readlines, 'close');
    }),
  );

  await Promise.all(searchFiles);

  return images;
};

export default findUsage;
