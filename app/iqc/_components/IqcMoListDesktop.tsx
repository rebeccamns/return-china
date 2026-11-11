"use client";

import { useMemo, useState } from "react";
import { ClipboardList, Package } from "lucide-react";

import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import { useI18n } from "@/i18n";
import { isSameLocalDay } from "@/lib/date-utils";
import { listMoSummaries } from "@/lib/mo-detail/data";

import IqcMoListFilters from "./IqcMoListFilters";
import IqcMoSelectionList from "./IqcMoSelectionList";
import { useIqcSubmissions } from "../_lib/submittedMos";
import {
  filterIqcMoSummaries,
  type IqcMoStatusFilter,
} from "../_lib/mo-list-filters";

export default function IqcMoListDesktop() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<IqcMoStatusFilter>("All");
  const submissions = useIqcSubmissions();
  const submittedCodes = new Set(submissions.map((submission) => submission.moCode));
  const allSummaries = useMemo(() => listMoSummaries(), []);
  const summaries = allSummaries.filter(
    (summary) => !submittedCodes.has(summary.moCode),
  );
  const submittedSummaries = allSummaries.filter((summary) =>
    submittedCodes.has(summary.moCode),
  );
  const filteredSummaries = filterIqcMoSummaries(
    summaries,
    search,
    statusFilter,
  );
  const filteredSubmittedSummaries = filterIqcMoSummaries(
    submittedSummaries,
    search,
    statusFilter,
  );
  const submittedAtByCode = new Map(
    submissions.map((submission) => [submission.moCode, submission.submittedAt]),
  );
  const submittedTodayCount = submissions.filter((submission) =>
    isSameLocalDay(submission.submittedAt),
  ).length;

  return (
    <main className="min-h-screen w-full bg-backgroundbg-gray">
      <Sidebar variant="iqc" />

      <div className="flex min-h-screen flex-col pl-[255px]">
        <TopBar />

        <div className="mt-[52px] w-full px-[18px] py-5">
          <nav className="mb-4 text-xs text-text-colortext-gray">
            {t("iqc.title")}
          </nav>

          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold text-[#111111]">
                {t("iqc.title")}
              </h1>
              <p className="mt-1 text-sm text-[#8F8F8E]">
                {t("iqc.selectMoDescription")}
              </p>
            </div>
          </div>

          <IqcMoListFilters
            search={search}
            statusFilter={statusFilter}
            onSearchChange={setSearch}
            onStatusFilterChange={setStatusFilter}
          />

          <section className="overflow-hidden rounded-lg border border-strokestroke-gray bg-white">
            <div className="flex items-center justify-between border-b border-strokestroke-gray px-[18px] py-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-[#111111]">
                  {t("iqc.moListTitle")}
                </h2>
                <span className="flex shrink-0 items-center gap-1.5 text-xs text-[#777775]">
                  <ClipboardList className="h-3.5 w-3.5" />
                  {t("iqc.pendingMos")}: {summaries.length}
                </span>
              </div>
              <p className="mt-1 text-xs text-[#8F8F8E]">
                {t("iqc.moListSubtitle")}
              </p>
            </div>

            {filteredSummaries.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF6EE]">
                  <Package
                    className="h-6 w-6 text-[#0B5934]"
                    strokeWidth={1.5}
                  />
                </div>
                <p className="text-sm font-medium text-[#111111]">
                  {summaries.length === 0
                    ? t("iqc.noMoWaiting")
                    : t("history.noMatchingRecords")}
                </p>
                {summaries.length === 0 && (
                  <p className="mt-1 max-w-sm text-xs text-[#8F8F8E]">
                    {t("iqc.noMoWaitingHint")}
                  </p>
                )}
              </div>
            ) : (
              <IqcMoSelectionList summaries={filteredSummaries} />
            )}
          </section>

          <section className="mt-5 overflow-hidden rounded-lg border border-strokestroke-gray bg-white">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-strokestroke-gray px-[18px] py-4">
              <h2 className="text-sm font-semibold text-[#111111]">
                {t("common.moSubmitted")}
              </h2>
              <div className="flex items-center gap-3 text-xs text-[#8F8F8E]">
                <span>
                  {t("common.submittedTodayCount", {
                    count: submittedTodayCount,
                  })}
                </span>
                <span>{submittedSummaries.length}</span>
              </div>
            </div>
            {filteredSubmittedSummaries.length > 0 ? (
              <IqcMoSelectionList
                summaries={filteredSubmittedSummaries}
                submitted
                submittedAtByCode={submittedAtByCode}
              />
            ) : (
              <p className="px-[18px] py-6 text-sm text-[#8F8F8E]">
                {submittedSummaries.length === 0
                  ? t("common.noSubmittedMos")
                  : t("history.noMatchingRecords")}
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
