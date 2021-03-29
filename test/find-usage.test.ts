import findUsage, {getFileName} from '../src/find-usage';

describe('getFileName', () => {
  it('returns the file name', () => {
    const fileName = getFileName('test/fixtures/image.png');
    expect(fileName).toStrictEqual('image.png');
  });

  it('returns the file name without extension', () => {
    const fileName = getFileName('test/fixtures/image.png', true);
    expect(fileName).toStrictEqual('image');
  });
});

describe('findUsage', () => {
  it('returns the image info with usage', async () => {
    const fileInfo = await findUsage(
      [
        {
          birthtime: '2021-04-04',
          path: '/image.png',
          size: 281,
          usage: [],
        },
      ],
      'test/fixtures',
      {name: 'not-used'},
    );

    expect(fileInfo.sort()).toStrictEqual([
      {
        birthtime: '2021-04-04',
        path: '/image.png',
        size: 281,
        usage: [
          {
            file: 'test/fixtures/mock-2.html',
            line: '<img src="image.png">',
            lineNumber: 11,
          },
          {
            file: 'test/fixtures/mock-2.html',
            line: '<img src="image.png">',
            lineNumber: 12,
          },
          {
            file: 'test/fixtures/mock-2.html',
            line: '<img src="image.png">',
            lineNumber: 13,
          },
        ],
      },
    ]);
  });

  it('returns the matching images without extensions and matcher', async () => {
    const fileInfo = await findUsage(
      [
        {
          birthtime: '2021-04-04',
          path: '/image.png',
          size: 281,
          usage: [],
        },
      ],
      'test/fixtures',
      {
        name: 'not-used',
        usageNoExtension: true,
        usageMatchers: ['<img src="'],
      },
    );

    expect(fileInfo.sort()).toStrictEqual([
      {
        birthtime: '2021-04-04',
        path: '/image.png',
        size: 281,
        usage: [
          {
            file: 'test/fixtures/mock-1.html',
            line: '<img src="image.jpg">',
            lineNumber: 10,
          },
          {
            file: 'test/fixtures/mock-2.html',
            line: '<img src="image.webp">',
            lineNumber: 10,
          },
          {
            file: 'test/fixtures/mock-2.html',
            line: '<img src="image.png">',
            lineNumber: 11,
          },
          {
            file: 'test/fixtures/mock-2.html',
            line: '<img src="image.png">',
            lineNumber: 12,
          },
          {
            file: 'test/fixtures/mock-2.html',
            line: '<img src="image.png">',
            lineNumber: 13,
          },
        ],
      },
    ]);
  });
});
