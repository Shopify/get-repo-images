import Image from "next/image";
import { promises as fs } from "fs";
import prettyBytes from "pretty-bytes";

import { Sort } from "@/components/sort";
import Link from "next/link";
import { SearchForm } from "@/components/search-form";
import { Pagination } from "@/components/pagination";

import { UsageBadge } from "@/components/usage-badge";

type Sort = "usage" | "date" | "size" | "name";
type Desc = "desc" | undefined;

interface SearchParams {
  search?: string;
  repo?: string;
  sort?: Sort;
  page?: number;
  limit?: number;
}

export interface ImageUsage {
  path: string;
  lineNumber: number;
  line: string;
}

interface Image {
  name: string;
  path: string;
  repo: string;
  size: number;
  date: string;
  usage: ImageUsage[];
}

interface ImageData {
  tags: string[];
  images: Image[];
  totalImages: number;
}

interface PageProps {
  searchParams: SearchParams;
}

export default async function Page({ searchParams }: PageProps) {
  const jsonData = await fs.readFile(process.cwd() + "/db.json", "utf8");
  const db: ImageData = JSON.parse(jsonData);

  const {
    search = "",
    repo = "",
    sort = "" as Sort,
    page = 0,
    limit = 100,
  } = searchParams;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const lSearch = search.toString().toLowerCase();

  const matchingImages = db.images
    .filter((i) => (search === "" ? i : i.name.toLowerCase().includes(lSearch)))
    .filter((i) =>
      repo === "" ? i : repo.toString().split(",").includes(i.repo)
    )
    .sort((a, b) => {
      const [key, hasDesc] = sort.toString().split("-") as [Sort, Desc];
      const direction = hasDesc === "desc" ? -1 : 1;
      if (key === "usage") {
        const aLength = a[key] ? a[key].length : 0;
        const bLength = b[key] ? b[key].length : 0;
        return aLength < bLength ? -1 * direction : 1 * direction;
      }

      return a[key] < b[key] ? -1 * direction : 1 * direction;
    });

  const data = {
    images: matchingImages.slice(
      pageNumber * limitNumber,
      pageNumber * limitNumber + limitNumber
    ),
    repos: db.tags,
    totalMatches: matchingImages.length,
    totalImages: db.images.length,
  };

  return (
    <div className="h-screen flex flex-col justify-stretch">
      <header className="flex py-2 px-4 gap-4 border-b bg-white border-zinc-100 sticky top-0">
        <Link href="/" className="flex">
          <Image src="/logo.svg" width="24" height="24" alt="Shopify logo" />
        </Link>
        <SearchForm repos={data.repos} totalImages={data.totalImages} />
      </header>
      <main className="flex-1 bg-zinc-50 p-2">
        <ul className="grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] gap-2">
          {data.images.map((image) => (
            <li
              className="flex flex-col bg-white rounded-md p-2 shadow-sm shadow-zinc-100"
              key={image.path}
            >
              <div className="flex-1 flex justify-center items-center transparent-bg">
                <Image
                  className="rounded-lg"
                  style={{ objectFit: "contain", maxHeight: "300px" }}
                  alt=""
                  src={`/repo-images/${image.repo}${image.path}`}
                  width="500"
                  height="500"
                />
              </div>
              <div className="mt-2">
                <h2 className="font-mono text-xs truncate font-semibold text-zinc-700">
                  {image.name}
                </h2>
                <p className="flex gap-1 items-center text-[0.65rem] text-zinc-500 border-t border-zinc-100 pt-1 mt-1">
                  <span className="font-semibold w-8">Used:</span>
                  {image.usage ? (
                    <UsageBadge
                      repo={image.repo}
                      imageName={image.name}
                      usage={image.usage}
                    />
                  ) : (
                    <span className="bg-red-50 py-px px-1 rounded-md text-red-500 font-medium">
                      Not used
                    </span>
                  )}
                </p>
                <p className="flex gap-1 items-center text-[0.65rem] text-zinc-500 border-t border-zinc-100 pt-1 mt-1">
                  <span className="font-semibold w-8">Size:</span>
                  <span className="bg-zinc-100 py-px px-1 rounded-md font-mono">
                    {prettyBytes(image.size, { space: false })}
                  </span>
                </p>
                <p className="flex gap-1 items-center text-[0.65rem] text-zinc-500 border-t border-zinc-100 pt-1 mt-1">
                  <span className="font-semibold w-8">Path:</span>
                  <span
                    className="bg-zinc-100 py-px px-1 rounded-md font-mono whitespace-nowrap text-right overflow-y-auto"
                    title={image.path}
                  >
                    {image.path}
                  </span>
                </p>
                {data.repos.length === 1 ? null : (
                  <p className="flex gap-1 items-center text-[0.65rem] text-zinc-500 border-t border-zinc-100 pt-1 mt-1">
                    <span className="font-semibold w-8">Repo:</span>
                    <span className="bg-zinc-100 py-px px-1 rounded-md font-mono truncate">
                      {image.repo}
                    </span>
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </main>
      <footer className="py-2 px-4 border-t bg-white border-zinc-100 sticky bottom-0">
        <Pagination
          limit={limitNumber}
          page={Number(page)}
          totalImages={matchingImages.length}
        />
      </footer>
    </div>
  );
}
