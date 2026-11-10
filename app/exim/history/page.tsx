"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, ChevronDown, Eye, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import { DEMO, demoMoNumber } from "@/lib/demo-data";
import type { TranslationKey } from "@/i18n";

type Status = "Completed" | "Rejected" | "Resubmitted";
type DateRange = "7" | "30" | "custom" | "all";

type HistoryRow = {
  id: string;
  code: string;
  model: string;
  projectNumber: string;
  task: string;
  status: Status;
  notes: string;
  submittedBy: string;
  submittedAt: string;
};

const STATUS_STYLES: Record<Status, string> = {
  Completed: "bg-[#E6F4EA] text-[#0b5934]",
  Rejected: "bg-red-50 text-red-600",
  Resubmitted: "bg-amber-50 text-amber-700",
};

const STATUS_LABEL_KEYS: Record<Status, TranslationKey> = {
  Completed: "status.completed",
  Rejected: "status.rejected",
  Resubmitted: "status.resubmitted",
};

const headClass =
  "h-10 whitespace-nowrap bg-primaryprimary-green px-3 text-xs font-semibold text-white";

// Demo data. Replace with your API data when available.
const rows: HistoryRow[] = [
  {
    id: "h-1",
    code: DEMO.moNumber,
    model: DEMO.eximModelDimension,
    projectNumber: DEMO.projectNumber,
    task: "BATCH202609 - Return Idle Lychee F4",
    status: "Completed",
    notes: "-",
    submittedBy: "Bagus Saputra",
    submittedAt: "Sep 20, 2026 14:32",
  },
  {
    id: "h-2",
    code: demoMoNumber(1),
    model: DEMO.eximModelDimension,
    projectNumber: DEMO.projectNumber,
    task: "BATCH202609 - Receive Material Lychee F4",
    status: "Rejected",
    notes: "Quantity mismatch on Camera Module (expected 7, received 5)",
    submittedBy: "Bagus Saputra",
    submittedAt: "Sep 19, 2026 09:15",
  },
  {
    id: "h-3",
    code: demoMoNumber(2),
    model: DEMO.eximModelDimension,
    projectNumber: DEMO.projectNumber,
    task: "BATCH202608 - Verify Material Lychee F4",
    status: "Resubmitted",
    notes: "Previously rejected: wrong material code on Display Panel",
    submittedBy: "Bagus Saputra",
    submittedAt: "Sep 18, 2026 16:48",
  },
  {
    id: "h-4",
    code: demoMoNumber(3),
    model: DEMO.eximModelDimension,
    projectNumber: DEMO.projectNumber,
    task: "BATCH202608 - Return Idle Lychee F4",
    status: "Completed",
    notes: "-",
    submittedBy: "Bagus Saputra",
    submittedAt: "Sep 17, 2026 11:02",
  },
  {
    id: "h-5",
    code: demoMoNumber(4),
    model: DEMO.eximModelDimension,
    projectNumber: DEMO.projectNumber,
    task: "BATCH202608 - Receive Material Lychee F4",
    status: "Rejected",
    notes: "China name does not match the master list",
    submittedBy: "Bagus Saputra",
    submittedAt: "Sep 16, 2026 08:40",
  },
];

const inputClass =
  "h-9 w-full rounded-md border border-strokestroke-gray bg-white px-3 text-xs text-[#333] outline-none focus:border-[#046A39] focus:ring-1 focus:ring-[#046A39]/20";

function toLocalDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDateValue(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getToday() {
  return toLocalDateString(new Date());
}

export default function EximHistoryPage() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modelFilter, setModelFilter] = useState("All");
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const models = useMemo(
    () => Array.from(new Set(rows.map((row) => row.model))).sort(),
    [],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const now = new Date();
    const today = toLocalDateString(now);

    const startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);

    if (dateRange === "7") {
      startDate.setDate(startDate.getDate() - 6);
    } else if (dateRange === "30") {
      startDate.setDate(startDate.getDate() - 29);
    }

    return rows.filter((row) => {
      const matchesSearch =
        !query ||
        row.code.toLowerCase().includes(query) ||
        row.model.toLowerCase().includes(query) ||
        row.projectNumber.toLowerCase().includes(query) ||
        row.task.toLowerCase().includes(query) ||
        row.status.toLowerCase().includes(query) ||
        row.notes.toLowerCase().includes(query) ||
        row.submittedBy.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || row.status === statusFilter;

      const matchesModel = modelFilter === "All" || row.model === modelFilter;

      const submittedDate = getDateValue(row.submittedAt);
      let matchesDate = true;

      if (dateRange === "7" || dateRange === "30") {
        matchesDate =
          submittedDate !== null &&
          submittedDate >= startDate &&
          submittedDate <= now;
      } else if (dateRange === "custom") {
        const rowDate = submittedDate ? toLocalDateString(submittedDate) : "";

        matchesDate =
          !!rowDate &&
          (!customStart || rowDate >= customStart) &&
          (!customEnd || rowDate <= customEnd) &&
          (!customStart || customStart <= today);
      }

      return matchesSearch && matchesStatus && matchesModel && matchesDate;
    });
  }, [search, statusFilter, modelFilter, dateRange, customStart, customEnd]);

  function resetFilters() {
    setSearch("");
    setStatusFilter("All");
    setModelFilter("All");
    setDateRange("all");
    setCustomStart("");
    setCustomEnd("");
  }

  return (
    <main className="min-h-screen w-full bg-backgroundbg-gray">
      <Sidebar variant="exim" />

      <div className="flex min-h-screen flex-col pl-[255px]">
        <TopBar />

        <div className="mt-[52px] w-full px-[18px] py-5">
          <nav className="mb-4 flex items-center gap-2 text-xs">
            <span className="text-text-colortext-gray">{t("exim.title")}</span>
            <span className="text-[#B5B5B3]">›</span>
            <span className="font-medium text-text-colortext-dark">
              {t("exim.history.title")}
            </span>
          </nav>

          <h1 className="mb-4 text-lg font-semibold text-[#111111]">{t("exim.history.title")}</h1>

          <div className="overflow-hidden rounded-lg border border-strokestroke-gray bg-white">
            
            {/* Search and filters */}

            {/* Search and filters */}
            <div className="border-b border-strokestroke-gray px-[18px] py-4">
              {/* Search on the left, filters on the right */}
              <div className="flex flex-wrap items-end justify-between gap-4">
                {/* Search */}
                <div className="w-full sm:w-[280px] sm:shrink-0">
                  <label
                    htmlFor="history-search"
                    className="mb-1.5 block text-xs font-medium text-[#5F5F5E]"
                  >
                    {t("exim.history.searchLabel")}
                  </label>

                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A3A3A1]" />
                    <Input
                      id="history-search"
                      placeholder={t("exim.history.searchPlaceholder")}
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      className="h-9 rounded-md border-strokestroke-gray pl-9 text-xs placeholder:text-[#A3A3A1]"
                    />
                  </div>
                </div>

                {/* Filters — aligned to the far right */}
                <div className="flex flex-wrap items-end gap-3 sm:ml-auto">
                  {(search ||
                    statusFilter !== "All" ||
                    modelFilter !== "All" ||
                    dateRange !== "all") && (
                    <div className="flex h-9 items-center">
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="text-xs font-medium text-[#046A39] hover:underline"
                      >
                        {t("exim.history.clearFilters")}
                      </button>
                    </div>
                  )}

                  {/* Status */}
                  <div className="w-[140px]">
                    <label
                      htmlFor="status-filter"
                      className="mb-1.5 block text-xs font-medium text-[#5F5F5E]"
                      >
                        {t("exim.history.statusLabel")}
                      </label>
                    <div className="relative">
                      <select
                        id="status-filter"
                        value={statusFilter}
                        onChange={(event) =>
                          setStatusFilter(event.target.value)
                        }
                        className={cn(inputClass, "appearance-none pr-8")}
                      >
                        <option value="All">{t("exim.history.allStatuses")}</option>
                        <option value="Completed">{t("status.completed")}</option>
                        <option value="Rejected">{t("status.rejected")}</option>
                        <option value="Resubmitted">{t("status.resubmitted")}</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8F8F8E]" />
                    </div>
                  </div>

                  {/* Model */}
                  <div className="w-[140px]">
                    <label
                      htmlFor="model-filter"
                      className="mb-1.5 block text-xs font-medium text-[#5F5F5E]"
                      >
                        {t("exim.history.modelLabel")}
                      </label>
                    <div className="relative">
                      <select
                        id="model-filter"
                        value={modelFilter}
                        onChange={(event) => setModelFilter(event.target.value)}
                        className={cn(inputClass, "appearance-none pr-8")}
                      >
                        <option value="All">{t("exim.history.allModels")}</option>
                        {models.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8F8F8E]" />
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="w-[165px]">
                    <label
                      htmlFor="date-range"
                      className="mb-1.5 block text-xs font-medium text-[#5F5F5E]"
                      >
                        {t("exim.history.dateRangeLabel")}
                      </label>
                    <div className="relative">
                      <select
                        id="date-range"
                        value={dateRange}
                        onChange={(event) =>
                          setDateRange(event.target.value as DateRange)
                        }
                        className={cn(inputClass, "appearance-none pr-8")}
                      >
                        <option value="7">{t("exim.history.last7Days")}</option>
                        <option value="30">{t("exim.history.last30Days")}</option>
                        <option value="custom">{t("exim.history.customRange")}</option>
                        <option value="all">{t("exim.history.allTime")}</option>
                      </select>
                      <CalendarDays className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8F8F8E]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom date inputs */}
              {dateRange === "custom" && (
                <div className="mt-4 flex flex-wrap items-end gap-3 rounded-md bg-[#FAFAFA] p-3">
                  <div className="w-[180px]">
                    <label
                      htmlFor="date-start"
                      className="mb-1.5 block text-xs font-medium text-[#5F5F5E]"
                      >
                        {t("exim.history.from")}
                      </label>
                    <Input
                      id="date-start"
                      type="date"
                      value={customStart}
                      max={customEnd || getToday()}
                      onChange={(event) => setCustomStart(event.target.value)}
                      className="h-9 border-strokestroke-gray text-xs"
                    />
                  </div>

                  <div className="w-[180px]">
                    <label
                      htmlFor="date-end"
                      className="mb-1.5 block text-xs font-medium text-[#5F5F5E]"
                      >
                        {t("exim.history.to")}
                      </label>
                    <Input
                      id="date-end"
                      type="date"
                      value={customEnd}
                      min={customStart || undefined}
                      max={getToday()}
                      onChange={(event) => setCustomEnd(event.target.value)}
                      className="h-9 border-strokestroke-gray text-xs"
                    />
                  </div>

                  {customStart && customEnd && customStart > customEnd && (
                    <p className="pb-2 text-xs text-red-600">
                      {t("exim.history.dateError")}
                    </p>
                  )}
                </div>
              )}


            </div>

            {/* History table */}
            <div className="px-[18px] pb-[18px] pt-2">
            {/* Result count and reset */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <p className="h-8 text-xs text-[#8F8F8E]">
                  {t("exim.history.showingRecords", { shown: filtered.length, total: rows.length })}
                </p>
              </div>

              <div className="overflow-x-auto rounded-md border border-strokestroke-gray">
                
                <Table className="min-w-[1100px]">
                  <TableHeader>
                    <TableRow className="hover:bg-[#F8F8F8]">
                      <TableHead className={headClass}>{t("common.moCode")}</TableHead>
                      <TableHead className={headClass}>{t("common.model")}</TableHead>
                      <TableHead className={headClass}>{t("history.detail.projectNumber")}</TableHead>
                      <TableHead className={headClass}>{t("common.task")}</TableHead>
                      <TableHead className={headClass}>{t("common.status")}</TableHead>
                      <TableHead className={headClass}>{t("common.notes")}</TableHead>
                      <TableHead className={headClass}>{t("history.submittedBy")}</TableHead>
                      <TableHead className={headClass}>{t("history.dateSubmitted")}</TableHead>
                      <TableHead className={headClass}>{t("common.action")}</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={9}
                          className="px-3 py-10 text-center"
                        >
                          <p className="text-sm font-medium text-[#333333]">
                            {t("exim.history.noMatchingRecords")}
                          </p>
                          <p className="mt-1 text-xs text-[#8F8F8E]">
                            {t("exim.history.noMatchingHint")}
                          </p>
                          <button
                            type="button"
                            onClick={resetFilters}
                            className="mt-3 text-xs font-medium text-[#046A39] hover:underline"
                          >
                            {t("exim.history.resetFilters")}
                          </button>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filtered.map((row) => {
                        const detailHref = `/exim/history/${encodeURIComponent(row.code)}`;

                        return (
                        <TableRow
                          key={row.id}
                          className="h-12 hover:bg-[#FAFAFA]"
                        >
                          <TableCell className="whitespace-nowrap px-3 py-2 text-xs font-medium text-[#111111]">
                            <Link
                              href={detailHref}
                              className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryprimary-green"
                            >
                              {row.code}
                            </Link>
                          </TableCell>

                          <TableCell className="px-3 py-2 text-xs text-[#111111]">
                            {row.model}
                          </TableCell>

                          <TableCell className="whitespace-nowrap px-3 py-2 text-xs text-[#111111]">
                            {row.projectNumber}
                          </TableCell>

                          <TableCell className="px-3 py-2 text-xs text-[#111111]">
                            {row.task}
                          </TableCell>

                          <TableCell className="px-3 py-2">
                            <span
                              className={cn(
                                "inline-flex whitespace-nowrap rounded px-2 py-0.5 text-xs font-semibold",
                                STATUS_STYLES[row.status],
                              )}
                            >
                              {t(STATUS_LABEL_KEYS[row.status])}
                            </span>
                          </TableCell>

                          <TableCell className="max-w-[260px] px-3 py-2 text-xs text-[#5F5F5E]">
                            {row.notes}
                          </TableCell>

                          <TableCell className="whitespace-nowrap px-3 py-2 text-xs text-[#111111]">
                            {row.submittedBy}
                          </TableCell>

                          <TableCell className="whitespace-nowrap px-3 py-2 text-xs text-[#5F5F5E]">
                            {row.submittedAt}
                          </TableCell>

                          <TableCell className="px-3 py-2">
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1.5 text-xs"
                            >
                              <Link
                                href={detailHref}
                                aria-label={`${t("history.viewDetail")}: ${row.code}`}
                              >
                                <Eye className="h-3.5 w-3.5" />
                                {t("history.viewDetail")}
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
