import findFiles, {
  getFilePaths,
  getFileInfo,
  filterFiles,
} from '../src/find-files';

describe('getFilePaths', () => {
  it('returns all files in directory', () => {
    const paths = getFilePaths('test/fixtures');
    expect(paths).toStrictEqual([
      'test/fixtures/images/image.html',
      'test/fixtures/images/image.jpg',
      'test/fixtures/images/image.png',
      'test/fixtures/mock-1.html',
      'test/fixtures/mock-2.html',
      'test/fixtures/mock.md',
      'test/fixtures/ohno/test.png',
    ]);
  });

  it('returns all files in directory without exclusions', () => {
    const paths = getFilePaths('test/fixtures', ['images', 'ohno']);
    expect(paths).toStrictEqual([
      'test/fixtures/mock-1.html',
      'test/fixtures/mock-2.html',
      'test/fixtures/mock.md',
    ]);
  });

  it('returns all files in directory with matching extensions', () => {
    const paths = getFilePaths('test/fixtures', [], ['html']);
    expect(paths).toStrictEqual([
      'test/fixtures/images/image.html',
      'test/fixtures/mock-1.html',
      'test/fixtures/mock-2.html',
    ]);
  });
});

describe('getFileInfo', () => {
  it('gets file info from paths', async () => {
    const fileInfo = await getFileInfo(
      ['test/fixtures/mock-1.html', 'test/fixtures/mock-2.html'],
      'repo/repo',
      'test/fixtures',
    );

    expect(fileInfo.sort()).toStrictEqual([
      {
        birthtime: '2021-04-04',
        path: '/mock-1.html',
        repo: 'repo/repo',
        size: 275,
        usage: [],
      },
      {
        birthtime: '2021-04-04',
        path: '/mock-2.html',
        repo: 'repo/repo',
        size: 348,
        usage: [],
      },
    ]);
  });
});

describe('filterFiles', () => {
  it('returns files that are meet the size and date requirements', () => {
    const files = filterFiles(
      [
        {
          birthtime: '2021-04-04',
          path: '/mock-1.html',
          size: 275,
          usage: [],
        },
        {
          birthtime: '2021-04-04',
          path: '/mock-2.html',
          size: 281,
          usage: [],
        },
        {
          birthtime: '2021-04-04',
          path: '/mock-2.html',
          size: 100,
          usage: [],
        },
      ],
      '2021-04-04.900Z',
      280,
    );

    expect(files).toStrictEqual([
      {
        birthtime: '2021-04-04',
        path: '/mock-2.html',
        size: 281,
        usage: [],
      },
    ]);
  });
});

describe('findFiles', () => {
  it('returns the matching file information', async () => {
    const files = await findFiles('test/fixtures', 'repo/repo', {
      name: 'not-used',
      excludedPaths: ['ohno'],
      extensions: ['jpg', 'png'],
      minSize: 150,
    });

    expect(files).toStrictEqual([
      {
        birthtime: '2021-04-04',
        path: '/images/image.jpg',
        repo: 'repo/repo',
        size: 379,
        usage: [],
      },
    ]);
  });
});
