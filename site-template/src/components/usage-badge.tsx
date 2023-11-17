"use client";

import { ImageUsage } from "@/app/page";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

interface UsageBadgeProps {
  repo: string;
  imageName: string;
  usage: ImageUsage[];
}

export function UsageBadge({ imageName, repo, usage }: UsageBadgeProps) {
  return (
    <Dialog>
      <DialogTrigger className="bg-blue-50 py-px px-1 rounded-md text-blue-500 font-medium hover:underline">
        {usage.length}
        {usage.length === 1 ? " time" : " times"}
      </DialogTrigger>
      <DialogContent className="max-w-screen-xl">
        <DialogHeader>
          <DialogTitle className="text-zinc-600 text-sm font-semibold">
            <span className="font-mono">{imageName}</span> used {usage.length}{" "}
            times
          </DialogTitle>
          <DialogDescription className="text-xs">
            <ul className="grid gap-4 mt-4 w-full">
              {usage.map(({ line, lineNumber, path }) => (
                <li key={`usage-${imageName}-${path}-${lineNumber}`}>
                  <Link
                    rel="noopener noreferrer"
                    target="_blank"
                    className="text-blue-500 font-medium hover:underline"
                    href={`https://github.com/${repo}/blob/master/${path}#L${lineNumber}`}
                  >
                    {path} - L{lineNumber}
                  </Link>
                  <pre className="font-mono bg-zinc-100 p-2">
                    <code>
                      <span>{lineNumber}</span>{" "}
                      <span className="truncate">{line}</span>
                    </code>
                  </pre>
                </li>
              ))}
            </ul>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
