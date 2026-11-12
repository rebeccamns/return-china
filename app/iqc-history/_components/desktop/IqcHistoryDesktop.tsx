"use client";

import { useMemo, useState } from "react";

import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import { useI18n } from "@/i18n";
import { listMoSummaries } from "@/lib/mo-detail/data";
import {
  ALL_CALENDAR_RANGE,
  isWithinHistoryDateRange,
  type CalendarRange,
} from "@/components/history/date-range";
import IqcHistoryTable, { type StatusFilter } from "./IqcHistoryTable";

export default function IqcHistoryDesktop() {
  const { t } = useI18n();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<CalendarRange>(ALL_CALENDAR_RANGE);
  const summaries = useMemo(() => listMoSummaries(), []);

  const filteredSummaries = useMemo(() => {
    const query = search.trim().toLowerCase();

    return summaries.filter((summary) => {
      if (
        statusFilter !== "All" &&
        summary.overallStatus !== statusFilter
      ) {
        return false;
      }

      if (query) {
        const searchableText =
          `${summary.moCode} ${summary.returnId} ${summary.model}`.toLowerCase();
        if (!searchableText.includes(query)) return false;
      }

      return isWithinHistoryDateRange(summary.submittedAt, dateRange);
    });
  }, [summaries, statusFilter, search, dateRange]);

  function resetFilters() {
    setStatusFilter("All");
    setSearch("");
    setDateRange(ALL_CALENDAR_RANGE);
  }

  return (
    <main className="min-h-screen w-full bg-backgroundbg-gray">
      <Sidebar variant="iqc" />

      <div className="flex min-h-screen flex-col pl-[255px]">
        <TopBar />

        <div className="mt-[52px] w-full px-[18px] py-5">
          <nav className="mb-4 flex items-center gap-2 text-xs">
            <span className="text-text-colortext-gray">{t("iqc.title")}</span>
            <span aria-hidden="true" className="text-[#B5B5B3]">
              ›
            </span>
            <span className="font-medium text-text-colortext-dark">
              {t("iqcHistory.title")}
            </span>
          </nav>

          <h1 className="mb-5 text-lg font-semibold text-text-colortext-black">
            {t("iqcHistory.title")}
          </h1>

          <IqcHistoryTable
            summaries={summaries}
            filteredSummaries={filteredSummaries}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            search={search}
            onSearchChange={setSearch}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onResetFilters={resetFilters}
          />
        </div>
      </div>
    </main>
  );
}
