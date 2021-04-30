import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Select from 'react-select';
import ImageCard from '../components/image-card';
import Modal from '../components/modal';
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
        <title>@shopify/get-repo-images</title>
      </Head>
      <header>
        <Image src="/logo.svg" width="32" height="32" alt="Shopify logo" />
        <div className="search">
          <div className="icon">
            <svg viewBox="0 0 20 20" width="20px" height="20px" xmlns="http://www.w3.org/2000/svg"><path d="M2 8c0-3.309 2.691-6 6-6s6 2.691 6 6-2.691 6-6 6-6-2.691-6-6zm17.707 10.293l-5.395-5.396A7.946 7.946 0 0016 8c0-4.411-3.589-8-8-8S0 3.589 0 8s3.589 8 8 8a7.954 7.954 0 004.897-1.688l5.396 5.395A.998.998 0 0020 19a1 1 0 00-.293-.707z" fill="currentColor"/></svg>
          </div>
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
          <Modal usageModal={usageModal} closeHandler={setUsageModal} />
      }
    </>
  )
}



export default HomePage;
