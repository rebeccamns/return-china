"use client";

import { cn } from "@/lib/utils";
import type { MoStatus } from "../../_lib/types";

type Props = {
  status: MoStatus | string;
  className?: string;
};

const STYLE: Record<string, string> = {
  "In Progress":
    "bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-backgroundbg-yellow dark:text-text-colortext-yellow dark:border-strokestroke-yellow",
  Pending:
    "bg-gray-100 text-gray-600 border border-gray-200 dark:bg-backgroundbg-bluish-gray dark:text-text-colortext-gray dark:border-strokestroke-gray",
  Completed:
    "bg-green-50 text-green-700 border border-green-200 dark:bg-backgroundbg-green dark:text-text-colortext-green dark:border-strokestroke-green",
  Blocked:
    "bg-red-50 text-red-600 border border-red-200 dark:bg-backgroundbg-red dark:text-text-colortext-red dark:border-strokestroke-red",
  Rejected:
    "bg-red-50 text-red-600 border border-red-200 dark:bg-backgroundbg-red dark:text-text-colortext-red dark:border-strokestroke-red",
  Started:
    "bg-blue-50 text-blue-600 border border-blue-200 dark:bg-backgroundbg-blue dark:text-text-colortext-blue dark:border-strokestroke-blue",
};

export default function StatusBadge({ status, className }: Props) {
  const cls =
    STYLE[status] ??
    "bg-gray-100 text-gray-600 border border-gray-200 dark:bg-backgroundbg-bluish-gray dark:text-text-colortext-gray dark:border-strokestroke-gray";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        cls,
        className,
      )}
    >
      {status}
    </span>
  );
}
