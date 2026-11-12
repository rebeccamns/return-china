"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Search } from "lucide-react";

import BackTitle from "@/components/layout/BackTitle";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/i18n";
import type { MOStatus, MoSummary } from "@/lib/mo-detail/types";
import { CalendarPickerModal } from "@/components/history/CalendarPickerModal";
import {
  ALL_CALENDAR_RANGE,
  isWithinHistoryDateRange,
  type CalendarRange,
} from "@/components/history/date-range";

import HistoryStatus from "./HistoryStatus";

type Filter = "all" | MOStatus;

const FILTERS: {
  id: Filter;
  key: "all" | "completed" | "inProgress" | "rejected" | "notStarted";
}[] = [
  { id: "all", key: "all" },
  { id: "Completed", key: "completed" },
  { id: "In Progress", key: "inProgress" },
  { id: "Rejected", key: "rejected" },
  { id: "Pending", key: "notStarted" },
];

export default function HistoryList({
  summaries,
  basePath,
}: {
  summaries: MoSummary[];
  basePath: string;
}) {
  const { t } = useI18n();
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<CalendarRange>(ALL_CALENDAR_RANGE);

  const query = search.trim().toLowerCase();
  const filtered = summaries.filter((summary) => {
    if (filter !== "all" && summary.overallStatus !== filter) return false;

    if (query) {
      const haystack =
        `${summary.moCode} ${summary.model} ${summary.returnId}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    if (
      !isWithinHistoryDateRange(summary.submittedAt, dateRange)
    ) {
      return false;
    }

    return true;
  });
  const statusLabel = (status: MOStatus) =>
    status === "Completed"
      ? t("iqcHistory.completed")
      : status === "Rejected"
        ? t("iqcHistory.rejected")
        : status === "In Progress"
          ? t("iqcHistory.inProgress")
          : t("status.notStarted");

  return (
    <>
      <div className="mb-3">
        <BackTitle title={t("iqcHistory.title")} />
      </div>

      <div className="mb-3 grid grid-cols-[minmax(0,1fr)_150px] gap-2">
        <div className="relative min-w-0 flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-colortext-gray"
          />
          <Input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("iqcHistory.searchPlaceholder")}
            aria-label={t("iqcHistory.searchPlaceholder")}
            className="h-11 rounded-xl border-strokestroke-gray bg-backgroundbg-white pl-9 text-[13px] placeholder:text-text-colortext-gray"
          />
        </div>
        <CalendarPickerModal
          value={dateRange}
          onChange={setDateRange}
          ariaLabel={t("iqcHistory.dateFilterLabel")}
          buttonClassName="h-11 w-full rounded-xl px-2 text-[12px]"
        />
      </div>

      <div
        aria-label={t("iqcHistory.title")}
        className="mb-3 flex gap-2 overflow-x-auto py-0.5"
      >
        {FILTERS.map((item) => {
          const active = filter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(item.id)}
              className="flex h-11 shrink-0 items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryprimary-green"
            >
              <span
                className={`flex h-9 items-center rounded-full border px-3 text-[13px] font-semibold ${
                  active
                    ? "border-[#006B3C]/25 bg-[#E7F5EC] text-[#006B3C] dark:border-emerald-900 dark:bg-backgroundbg-green dark:text-text-colortext-green"
                    : "border-strokestroke-gray bg-backgroundbg-white text-text-colortext-gray"
                }`}
              >
                {item.key === "notStarted"
                  ? t("status.notStarted")
                  : t(`iqcHistory.${item.key}`)}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-strokestroke-gray bg-backgroundbg-white px-4 py-5 text-center text-[13px] leading-[18px] text-text-colortext-gray">
          {summaries.length === 0
            ? t("iqcHistory.empty")
            : t("iqcHistory.noResults")}
        </p>
      ) : (
        <ul className="overflow-hidden rounded-2xl border border-strokestroke-gray bg-backgroundbg-white divide-y divide-strokestroke-gray">
          {filtered.map((summary) => (
            <li key={summary.moCode}>
              <Link
                href={`${basePath}/${summary.moCode}`}
                className="flex min-h-[88px] items-stretch gap-2 px-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primaryprimary-green"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-semibold leading-5 text-text-colortext-black">
                    {summary.moCode}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] leading-[14px] text-text-colortext-gray">
                    {summary.submittedAt}
                  </span>
                </span>
                <span className="flex shrink-0 flex-col items-end">
                  <HistoryStatus
                    status={summary.overallStatus}
                    label={statusLabel(summary.overallStatus)}
                  />
                  <span className="flex flex-1 items-center">
                    <ChevronRight
                      aria-hidden="true"
                      className="h-5 w-5 text-text-colortext-gray"
                    />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
