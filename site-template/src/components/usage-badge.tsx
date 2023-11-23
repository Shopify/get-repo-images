"use client";

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
  usage: string[];
}

export function UsageBadge({ imageName, repo, usage }: UsageBadgeProps) {
  return (
    <Dialog>
      <DialogTrigger className="bg-blue-50 py-px px-1 rounded-md text-blue-500 font-medium hover:underline">
        {usage.length}
        {usage.length === 1 ? " time" : " times"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-zinc-600 text-sm font-semibold px-2">
            <span className="font-mono">{imageName}</span> used {usage.length}{" "}
            times
          </DialogTitle>
          <DialogDescription className="text-xs">
            <ul className="grid mt-4 overflow-y-auto max-h-96">
              {usage.map((use) => (
                <li key={`usage-${imageName}-${use}`}>
                  <Link
                    rel="noopener noreferrer"
                    target="_blank"
                    className="block hover:bg-blue-50 p-2 rounded-md"
                    href={`https://github.com/${repo}/blob/master/${use}`}
                  >
                    <p className="font-semibold inline-flex gap-2 text-blue-500">
                      {use.split("/")[use.split("/").length - 1]}{" "}
                      <ExternalLinkIcon />
                    </p>
                    <p className="truncate max-w-xl">{use}</p>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-xs px-2 mt-4 text-yellow-600 inline-flex gap-1">
              <ExclamationTriangleIcon />
              The usage feature is in alpha and can have inaccurate results
            </p>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
