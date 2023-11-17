"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface PaginationProps {
  page: number;
  limit: number;
  totalImages: number;
}

export function Pagination({ page, limit, totalImages }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;

  const createQueryString = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(key, value);

      return params.toString();
    },
    [searchParams]
  );

  const updateParams = (key: string, value: string) => {
    router.push(pathname + "?" + createQueryString(key, value));
  };

  const imagesShown =
    (page + 1) * limit > totalImages ? totalImages : (page + 1) * limit;

  return (
    <div className="flex gap-4">
      <div className="flex flex-1 items-center">
        <p className="text-xs text-zinc-500 font-medium">
          Browsing {imagesShown}/{totalImages} images
        </p>
      </div>

      <div className="flex gap-1">
        <Button
          variant="outline"
          size="xs"
          onClick={() => updateParams("page", (page - 1).toString())}
          disabled={page === 0}
        >
          <ChevronLeftIcon className="mr-1 h-4 w-4 shrink-0 opacity-50" />{" "}
          Previous
        </Button>
        <Button
          variant="outline"
          size="xs"
          disabled={imagesShown === totalImages}
          onClick={() => updateParams("page", (page + 1).toString())}
        >
          Next
          <ChevronRightIcon className="ml-1 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </div>
    </div>
  );
}
