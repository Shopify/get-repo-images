"use client";

import { Search } from "./search";
import { Combobox } from "./combobox";
import { Sort } from "./sort";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const sortItems = {
  "usage-desc": "Most references",
  usage: "Least references",
  "date-desc": "Newest",
  date: "Oldest",
  "size-desc": "Largest file size",
  size: "Smallest file size",
  "name-desc": "Alphabetical Z to A",
  name: "Alphabetical A to Z",
};

interface SearchFormParams {
  repos: string[];
  totalImages: number;
}

export function SearchForm({ repos, totalImages }: SearchFormParams) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;

  const createQueryString = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(key, value);
      params.set("page", "0");

      return params.toString();
    },
    [searchParams]
  );

  const updateParams = (key: string, value: string) => {
    router.push(pathname + "?" + createQueryString(key, value));
  };

  return (
    <div className="flex-1 flex gap-2">
      <Search
        defaultValue={searchParams.get("search")}
        placeholder={`Search ${totalImages} images`}
        onChange={(value) => updateParams("search", value)}
      />
      {repos.length === 1 ? null : (
        <Combobox
          defaultValue={searchParams.get("repo")}
          name="repo"
          items={repos}
          onChange={(value) => updateParams("repo", value)}
        />
      )}
      <Sort
        defaultValue={searchParams.get("sort")}
        name="Sort by"
        items={sortItems}
        onChange={(value) => updateParams("sort", value)}
      />
    </div>
  );
}
