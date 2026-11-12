"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import BackTitle from "@/components/layout/BackTitle";
import {
  STAFF_RETURN_ITEMS,
  type MobileNavItem,
} from "@/components/layout/mobile-bottom-nav";
import HistoryShell from "@/components/mobile-history/HistoryShell";
import { useI18n } from "@/i18n";
import { listMoSummaries } from "@/lib/mo-detail/data";
import { getMoWorkOrder } from "@/lib/mo-detail/data";
import { isSameLocalDay } from "@/lib/date-utils";

import IqcMoListFilters from "./IqcMoListFilters";
import IqcMoSelectionList, {
  type IqcMoListWorkflow,
} from "./IqcMoSelectionList";
import { useIqcSubmissions } from "../_lib/submittedMos";
import {
  filterIqcMoSummaries,
  type IqcMoStatusFilter,
} from "../_lib/mo-list-filters";

export default function IqcMoListMobile({
  workflow = "identity",
}: {
  workflow?: IqcMoListWorkflow;
}) {
  const router = useRouter();
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<IqcMoStatusFilter>("All");
  const submissions = useIqcSubmissions();
  const submittedCodes = new Set(submissions.map((submission) => submission.moCode));
  const allSummaries = listMoSummaries();
  const summaries =
    workflow === "identity"
      ? allSummaries.filter((summary) => !submittedCodes.has(summary.moCode))
      : workflow === "staffReturn" || workflow === "staffReturnSticker"
        ? allSummaries.filter((summary) => getMoWorkOrder(summary.moCode) !== null)
        : allSummaries;
  const submittedSummaries =
    workflow === "identity"
      ? allSummaries.filter((summary) => submittedCodes.has(summary.moCode))
      : [];
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

  function navigate(item: MobileNavItem) {
    switch (item) {
      case "identity":
        router.push("/iqc");
        break;
      case "verification":
        router.push("/iqc-verification");
        break;
      case "history":
        router.push("/iqc-history");
        break;
      case "packing-list":
        router.push("/staff-return");
        break;
      case "carton-sticker":
        router.push("/staff-return-sticker");
        break;
    }
  }

  return (
    <HistoryShell
      activeItem={
        workflow === "staffReturn"
          ? "packing-list"
          : workflow === "staffReturnSticker"
            ? "carton-sticker"
            : workflow
      }
      items={
        workflow === "staffReturn" || workflow === "staffReturnSticker"
          ? STAFF_RETURN_ITEMS
          : undefined
      }
      onNavigate={navigate}
    >
      <div className="mb-3">
        <BackTitle
          title={
            workflow === "identity"
              ? t("iqc.identityTitle")
              : workflow === "verification"
                ? t("iqc.verify.title")
                : workflow === "staffReturn"
                  ? t("staffReturn.title")
                  : t("staffReturnSticker.title")
          }
        />
      </div>
      <IqcMoListFilters
        search={search}
        statusFilter={statusFilter}
        onSearchChange={setSearch}
        onStatusFilterChange={setStatusFilter}
      />
      <div className="overflow-hidden rounded-2xl border border-strokestroke-gray bg-backgroundbg-white">
        <div className="flex items-center justify-between gap-2 border-b border-strokestroke-gray px-4 py-3">
          <h2 className="text-sm font-semibold text-text-colortext-black">
            {t("iqc.moListTitle")}
          </h2>
          <span className="shrink-0 text-xs text-text-colortext-gray">
            {t("iqc.pendingMos")}: {summaries.length}
          </span>
        </div>
        {filteredSummaries.length > 0 ? (
          <IqcMoSelectionList summaries={filteredSummaries} workflow={workflow} />
        ) : (
          <p className="px-4 py-5 text-sm text-text-colortext-gray">
            {summaries.length === 0
              ? t("iqc.noMoWaiting")
              : t("history.noMatchingRecords")}
          </p>
        )}
      </div>
      {workflow === "identity" && (
        <section className="mt-4 overflow-hidden rounded-2xl border border-strokestroke-gray bg-backgroundbg-white">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-strokestroke-gray px-4 py-3">
            <h2 className="text-sm font-semibold text-text-colortext-black">
              {t("common.moSubmitted")}
            </h2>
            <div className="flex items-center gap-3 text-xs text-text-colortext-gray">
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
            <p className="px-4 py-5 text-sm text-text-colortext-gray">
              {submittedSummaries.length === 0
                ? t("common.noSubmittedMos")
                : t("history.noMatchingRecords")}
            </p>
          )}
        </section>
      )}
    </HistoryShell>
  );
}
