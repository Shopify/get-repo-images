import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Select from 'react-select';
import ImageCard from '../components/image-card';
import Pagination from '../components/pagination';

const sortItems = [
  { value: 'date-desc', label: 'Newest' },
  { value: 'date', label: 'Oldest' },
  { value: 'usage', label: 'Least references' },
  { value: 'usage-desc', label: 'Most references' },
  { value: 'size', label: 'Smallest file size' },
  { value: 'size-desc', label: 'Largest file size' },
  { value: 'name-desc', label: 'Alphabetical A to Z' },
  { value: 'name', label: 'Alphabetical Z to A' }
];

function HomePage() {
  const limit = 40;
  const [tags, setTags] = useState([]);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [repo, setRepo] = useState([]);
  const [sort, setSort] = useState({});
  const [usageModal, setUsageModal] = useState({});
  const [totalImages, setTotalImages] = useState(0)

  // Get images and filter them
  useEffect(async () => {
    const newQuery = [];
    if (search) newQuery.push(`search=${search}`);
    if (repo.length) newQuery.push(`repo=${repo.map(repo => repo.value).join(',')}`);
    if (sort.value) newQuery.push(`sort=${sort.value}`);
    newQuery.push(`page=${page}`);
    newQuery.push(`limit=${limit}`);

    const url = `/api/db?${newQuery.join('&')}`;
    const response = await fetch(url);
    const { images, totalImages } = await response.json();
    setTotalImages(totalImages);
    setImages(images);
  }, [search, repo, sort, page]);

  // Load the tags
  useEffect(async () => {
    const response = await fetch(`/api/db`);
    const { tags, totalImages } = await response.json();
    setTotalImages(totalImages);
    setTags(tags.map(tag => ({value: tag, label: tag })));
  }, []);

  return (
    <>
      <Head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <title>Visual Asset Library</title>
      </Head>
      <header>
        <Image src="/logo.svg" width="32" height="32" alt="Shopify logo" />
        <div className="search">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" /><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor" /></svg>
          <input
            type="text"
            value={search}
            placeholder={`Search ${totalImages} images`}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <Select
          name="Repo"
          instanceId="repo-select"
          placeholder="Repository"
          isMulti
          options={tags}
          onChange={(value) => {
            setRepo(value)
            setPage(0)
          }}
        />
        <Select
          name="Sort"
          placeholder="Sort"
          instanceId="sort-select"
          onChange={setSort}
          defaultValue={sortItems[0]}
          options={sortItems}
        />
      </header>
      <main>
        <ul className="cards">
          {images.map(image =>
            <li key={image.path}><ImageCard image={image} referenceOnClick={setUsageModal} /></li>
          )}
        </ul>
      </main>

      <footer>
        <Pagination
          currentPage={page}
          totalPages={Math.floor(totalImages/limit)}
          setPage={setPage}
        />
      </footer>
      {
        usageModal.path &&
          <div
            className="modal"
            onClick={(event) => event.target === event.currentTarget && setUsageModal({})}
          >
            <div className="card">
              <div className="modal-header">
                <h2>{usageModal.name}</h2>
                <button onClick={() => setUsageModal({})}>X</button>
              </div>
              <h3>Code references <span className="tag">{usageModal.usage.length}</span></h3>
              <ul className="link-list">
                {usageModal.usage.map((usage, index) => (
                  <li key={`usage-${usageModal.path}-${index}`}>
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href={`https://github.com/${usageModal.repo}/blob/master/${usage.path}#L${usage.lineNumber}`}
                    >
                      {usage.path} - L{usage.lineNumber}
                    </a>
                    <pre>
                      <code>
                        <span class="lineNo">{usage.lineNumber}</span>  {usage.line}
                      </code>
                    </pre>
                  </li>
                ))}
              </ul>
            </div>
          </div>
      }
    </>
  )
}



export default HomePage;
