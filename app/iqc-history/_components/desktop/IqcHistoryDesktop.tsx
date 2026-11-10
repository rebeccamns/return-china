"use client";

import { useMemo, useState } from "react";

import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import { useI18n } from "@/i18n";
import { listMoSummaries } from "@/lib/mo-detail/data";
import IqcHistoryTable, { type StatusFilter } from "./IqcHistoryTable";

export default function IqcHistoryDesktop() {
  const { t } = useI18n();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const summaries = useMemo(() => listMoSummaries(), []);

  const filteredSummaries = useMemo(
    () =>
      statusFilter === "All"
        ? summaries
        : summaries.filter(
            (summary) => summary.overallStatus === statusFilter,
          ),
    [summaries, statusFilter],
  );

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

          <h1 className="mb-5 text-lg font-semibold text-[#111111]">
            {t("iqcHistory.title")}
          </h1>

          <IqcHistoryTable
            summaries={summaries}
            filteredSummaries={filteredSummaries}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        </div>
      </div>
    </main>
  );
}
