"use client";

import Link from "next/link";
import { Search } from "lucide-react";

import { CalendarPickerModal } from "@/components/history/CalendarPickerModal";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useI18n, type TranslationKey } from "@/i18n";
import type { CalendarRange } from "@/components/history/date-range";
import { cn } from "@/lib/utils";
import type { MOStatus, MoSummary } from "@/lib/mo-detail/types";

export type StatusFilter = "All" | MOStatus;

const STATUS_FILTERS: { value: StatusFilter; labelKey: TranslationKey }[] = [
  { value: "All", labelKey: "iqcHistory.all" },
  { value: "Completed", labelKey: "iqcHistory.completed" },
  { value: "In Progress", labelKey: "iqcHistory.inProgress" },
  { value: "Rejected", labelKey: "iqcHistory.rejected" },
  { value: "Pending", labelKey: "status.notStarted" },
];

const STATUS_LABEL_KEYS: Record<MOStatus, TranslationKey> = {
  Completed: "status.completed",
  "In Progress": "status.inProgress",
  Rejected: "status.rejected",
  Pending: "status.notStarted",
};

const STATUS_STYLES: Record<MOStatus, string> = {
  Completed: "bg-[#E6F4EA] text-[#0B5934] dark:bg-backgroundbg-green dark:text-text-colortext-green",
  "In Progress": "bg-amber-50 text-amber-700 dark:bg-backgroundbg-yellow dark:text-text-colortext-yellow",
  Rejected: "bg-red-50 text-red-600 dark:bg-backgroundbg-red dark:text-text-colortext-red",
  Pending: "bg-slate-100 text-slate-600 dark:bg-backgroundbg-bluish-gray dark:text-text-colortext-gray",
};

const headClass =
  "h-10 whitespace-nowrap bg-[#F8F8F8] px-3 text-xs font-medium text-slate-700 dark:bg-backgroundbg-black dark:text-text-colortext-black";

const filterClass =
  "h-9 w-[180px] rounded-md border border-strokestroke-gray bg-backgroundbg-white px-3 text-xs text-text-colortext-black outline-none focus:border-[#046A39] focus:ring-1 focus:ring-[#046A39]/20";

type Props = {
  summaries: MoSummary[];
  filteredSummaries: MoSummary[];
  statusFilter: StatusFilter;
  onStatusFilterChange: (filter: StatusFilter) => void;
  search: string;
  onSearchChange: (search: string) => void;
  dateRange: CalendarRange;
  onDateRangeChange: (range: CalendarRange) => void;
  onResetFilters: () => void;
};

function parseStatusFilter(value: string): StatusFilter {
  switch (value) {
    case "Completed":
    case "In Progress":
    case "Rejected":
    case "Pending":
      return value;
    default:
      return "All";
  }
}

function StatusBadge({ status }: { status: MOStatus }) {
  const { t } = useI18n();

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-md px-2.5 py-1 text-xs font-semibold",
        STATUS_STYLES[status],
      )}
    >
      {t(STATUS_LABEL_KEYS[status])}
    </span>
  );
}

export default function IqcHistoryTable({
  summaries,
  filteredSummaries,
  statusFilter,
  onStatusFilterChange,
  search,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  onResetFilters,
}: Props) {
  const { t } = useI18n();
  const hasFilters =
    search.trim() !== "" ||
    statusFilter !== "All" ||
    dateRange.type !== "all";

  return (
    <section className="overflow-hidden rounded-lg border border-strokestroke-gray bg-backgroundbg-white">
      <div className="border-b border-strokestroke-gray px-[18px] py-4">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-text-colortext-black">
            {t("history.submittedMo")}
          </h2>
          <p className="mt-1 text-xs text-text-colortext-gray">
            {t("history.showingRecords", {
              shown: filteredSummaries.length,
              total: summaries.length,
            })}
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div className="w-full sm:w-[250px]">
            <label
              htmlFor="iqc-history-search"
              className="mb-1.5 block text-xs font-medium text-text-colortext-gray"
            >
              {t("history.searchLabel")}
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-colortext-gray" />
              <Input
                id="iqc-history-search"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder={t("history.searchPlaceholder")}
                className="h-9 rounded-md border-strokestroke-gray bg-backgroundbg-white pl-9 text-xs text-text-colortext-black placeholder:text-text-colortext-gray"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="iqc-history-status"
              className="mb-1.5 block text-xs font-medium text-text-colortext-gray"
            >
              {t("history.statusLabel")}
            </label>
            <select
              id="iqc-history-status"
              value={statusFilter}
              onChange={(event) =>
                onStatusFilterChange(parseStatusFilter(event.target.value))
              }
              className={filterClass}
            >
              {STATUS_FILTERS.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {t(filter.labelKey)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-colortext-gray">
              {t("history.dateRangeLabel")}
            </label>
            <CalendarPickerModal
              value={dateRange}
              onChange={onDateRangeChange}
              buttonClassName={filterClass}
              ariaLabel={t("history.dateRangeLabel")}
            />
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="h-9 text-xs font-medium text-primaryprimary-green hover:underline"
            >
              {t("history.clearFilters")}
            </button>
          )}
        </div>

      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-[1020px]">
          <TableHeader>
            <TableRow className="hover:bg-[#F8F8F8] dark:hover:bg-backgroundbg-black">
              <TableHead className={headClass}>{t("common.moCode")}</TableHead>
              <TableHead className={headClass}>
                {t("common.returnId")}
              </TableHead>
              <TableHead className={headClass}>{t("common.model")}</TableHead>
              <TableHead className={headClass}>
                {t("history.dateSubmitted")}
              </TableHead>
              <TableHead className={headClass}>
                {t("iqcHistory.stagesDone")}
              </TableHead>
              <TableHead className={headClass}>{t("common.status")}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredSummaries.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="px-3 py-10 text-center text-sm text-text-colortext-gray"
                >
                  {summaries.length === 0
                    ? t("iqcHistory.empty")
                    : t("iqcHistory.noResults")}
                </TableCell>
              </TableRow>
            ) : (
              filteredSummaries.map((summary) => {
                const href = `/iqc-history/${encodeURIComponent(summary.moCode)}`;

                return (
                  <TableRow
                    key={summary.moCode}
                    className="h-12 hover:bg-[#FAFAFA] dark:hover:bg-backgroundbg-black"
                  >
                    <TableCell className="p-0">
                      <Link
                        href={href}
                        className="flex h-12 w-full items-center px-3 py-2 text-xs font-medium text-text-colortext-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primaryprimary-green"
                      >
                        {summary.moCode}
                      </Link>
                    </TableCell>
                    <TableCell className="p-0">
                      <Link
                        href={href}
                        className="flex h-12 w-full items-center whitespace-nowrap px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primaryprimary-green"
                      >
                        {summary.returnId}
                      </Link>
                    </TableCell>
                    <TableCell className="p-0">
                      <Link
                        href={href}
                        className="flex h-12 w-full items-center px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primaryprimary-green"
                      >
                        {summary.model}
                      </Link>
                    </TableCell>
                    <TableCell className="p-0">
                      <Link
                        href={href}
                        className="flex h-12 w-full items-center whitespace-nowrap px-3 py-2 text-xs text-text-colortext-gray focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primaryprimary-green"
                      >
                        {summary.submittedAt}
                      </Link>
                    </TableCell>
                    <TableCell className="p-0">
                      <Link
                        href={href}
                        className="flex h-12 w-full items-center whitespace-nowrap px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primaryprimary-green"
                      >
                        {t("iqcHistory.stagesCompleted", {
                          completed: summary.completedStages,
                          total: summary.totalStages,
                        })}
                      </Link>
                    </TableCell>
                    <TableCell className="p-0">
                      <Link
                        href={href}
                        className="flex h-12 w-full items-center px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primaryprimary-green"
                      >
                        <StatusBadge status={summary.overallStatus} />
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
