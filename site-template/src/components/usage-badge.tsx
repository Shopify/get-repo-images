"use client";

import { ImageUsage } from "@/app/page";
import {
  ExternalLinkIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
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
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-zinc-600 text-sm font-semibold">
            <span className="font-mono">{imageName}</span> used {usage.length}{" "}
            times
          </DialogTitle>
          <DialogDescription className="text-xs">
            <ul className="grid gap-4 mt-2 w-full overflow-auto max-h-96 max-w-[60rem]">
              {usage.map(({ line, lineNumber, path }) => (
                <li key={`usage-${imageName}-${path}-${lineNumber}`}>
                  <Link
                    rel="noopener noreferrer"
                    target="_blank"
                    className="text-blue-500 font-medium hover:underline inline-flex gap-1"
                    href={`https://github.com/${repo}/blob/master/${path}#L${lineNumber}`}
                  >
                    {path} - L{lineNumber} <ExternalLinkIcon />
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
            <p className="text-xs mt-8 text-yellow-600 inline-flex gap-1">
              <ExclamationTriangleIcon />
              The usage feature is in alpha and can have inaccurate results
            </p>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
