"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight } from "lucide-react";

import BackTitle from "@/components/layout/BackTitle";
import { useI18n } from "@/i18n";
import type { MOStatus, MoSummary } from "@/lib/mo-detail/types";

import HistoryStatus from "./HistoryStatus";

type Filter = "all" | MOStatus;

const FILTERS: { id: Filter; key: "all" | "completed" | "inProgress" | "rejected" }[] = [
  { id: "all", key: "all" },
  { id: "Completed", key: "completed" },
  { id: "In Progress", key: "inProgress" },
  { id: "Rejected", key: "rejected" },
];

export default function HistoryList({
  summaries,
}: {
  summaries: MoSummary[];
}) {
  const { t } = useI18n();
  const [filter, setFilter] = useState<Filter>("all");
  const filtered =
    filter === "all"
      ? summaries
      : summaries.filter((summary) => summary.overallStatus === filter);
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
                className={`flex h-9 items-center rounded-full px-3 text-[13px] font-semibold ${
                  active
                    ? "bg-[#E7F5EC] text-[#006B3C]"
                    : "bg-backgroundbg-white text-text-colortext-gray"
                }`}
              >
                {t(`iqcHistory.${item.key}`)}
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
                href={`/iqc-history/${summary.moCode}`}
                className="flex min-h-[76px] items-center gap-2 px-3.5 py-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primaryprimary-green"
              >
                <span className="min-w-0 flex-1">
                  <span className="flex min-w-0 items-center justify-between gap-2">
                    <span className="truncate text-[14px] font-semibold leading-5 text-text-colortext-black">
                      {summary.moCode}
                    </span>
                    <HistoryStatus
                      status={summary.overallStatus}
                      label={statusLabel(summary.overallStatus)}
                    />
                  </span>
                  <span className="mt-0.5 block truncate text-[13px] leading-[18px] text-text-colortext-gray">
                    {summary.model} · {summary.returnId}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] leading-[14px] text-text-colortext-gray">
                    {t("iqcHistory.listSummary", {
                      date: summary.submittedAt,
                      completed: summary.completedStages,
                      total: summary.totalStages,
                    })}
                  </span>
                </span>
                <ChevronRight
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-text-colortext-gray"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
