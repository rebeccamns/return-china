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
import type { SidebarVariant } from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import { DEMO, demoMoNumber } from "@/lib/demo-data";

type MOStatus = "Completed" | "Rejected" | "Resubmitted";
type DateRange = "7" | "30" | "custom" | "all";

type HistoryRow = {
  id: string;
  code: string;
  model: string;
  projectNumber: string;
  task: string;
  status: MOStatus;
  notes: string;
  submittedBy: string;
  dateSubmitted: string;
};

const STATUS_STYLES: Record<MOStatus, string> = {
  Completed: "bg-[#E6F4EA] text-[#0B5934]",
  Rejected: "bg-red-50 text-red-600",
  Resubmitted: "bg-amber-50 text-amber-700",
};

const STATUS_LABEL_KEYS = {
  Completed: "status.completed",
  Rejected: "status.rejected",
  Resubmitted: "status.resubmitted",
} as const;

const headClass =
  "h-10 whitespace-nowrap bg-primaryprimary-green px-3 text-xs font-semibold text-white";

const filterInputClass =
  "h-9 w-full rounded-md border border-strokestroke-gray bg-white px-3 text-xs text-[#333] outline-none focus:border-[#046A39] focus:ring-1 focus:ring-[#046A39]/20";

function parseStatusFilter(value: string): "All" | MOStatus {
  switch (value) {
    case "Completed":
    case "Rejected":
    case "Resubmitted":
      return value;
    default:
      return "All";
  }
}

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

// Mock data for frontend demonstration.
// Replace with API data when the backend is available.
const historyRows: HistoryRow[] = [
  {
    id: "h-1",
    code: DEMO.moNumber,
    model: DEMO.model,
    projectNumber: DEMO.projectNumber,
    task: "BATCH202609 - Return Idle Lychee F4",
    status: "Completed",
    notes: "-",
    submittedBy: "Bagus Saputra",
    dateSubmitted: "Sep 20, 2026 14:32",
  },
  {
    id: "h-2",
    code: demoMoNumber(1),
    model: DEMO.model,
    projectNumber: DEMO.projectNumber,
    task: "BATCH202609 - Receive Material Lychee F4",
    status: "Rejected",
    notes: "Quantity mismatch on Camera Module (expected 7, received 5)",
    submittedBy: "Bagus Saputra",
    dateSubmitted: "Sep 19, 2026 09:15",
  },
  {
    id: "h-3",
    code: demoMoNumber(2),
    model: DEMO.model,
    projectNumber: DEMO.projectNumber,
    task: "BATCH202608 - Verify Material Lychee F4",
    status: "Resubmitted",
    notes: "Previously rejected: wrong material code on Display Panel",
    submittedBy: "Bagus Saputra",
    dateSubmitted: "Sep 18, 2026 16:48",
  },
  {
    id: "h-4",
    code: demoMoNumber(3),
    model: DEMO.model,
    projectNumber: DEMO.projectNumber,
    task: "BATCH202608 - Return Idle Lychee F4",
    status: "Completed",
    notes: "-",
    submittedBy: "Bagus Saputra",
    dateSubmitted: "Sep 17, 2026 11:02",
  },
  {
    id: "h-5",
    code: demoMoNumber(4),
    model: DEMO.model,
    projectNumber: DEMO.projectNumber,
    task: "BATCH202608 - Receive Material Lychee F4",
    status: "Rejected",
    notes: "China name does not match the master list",
    submittedBy: "Bagus Saputra",
    dateSubmitted: "Sep 16, 2026 08:40",
  },
];

function StatusBadge({ status }: { status: MOStatus }) {
  const { t } = useI18n();

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold",
        STATUS_STYLES[status],
      )}
    >
      {t(STATUS_LABEL_KEYS[status])}
    </span>
  );
}

export default function MoHistoryPage({
  sidebarVariant,
  historyHref,
}: {
  sidebarVariant: SidebarVariant;
  historyHref: string;
}) {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | MOStatus>("All");
  const [modelFilter, setModelFilter] = useState("All");
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const models = useMemo(
    () => Array.from(new Set(historyRows.map((row) => row.model))).sort(),
    [],
  );

  const filteredRows = useMemo(() => {
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

    return historyRows.filter((row) => {
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
      const matchesModel =
        modelFilter === "All" || row.model === modelFilter;
      const submittedDate = getDateValue(row.dateSubmitted);
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
      <Sidebar variant={sidebarVariant} />

      <div className="flex min-h-screen flex-col pl-[255px]">
        <TopBar />

        <div className="mt-[52px] w-full px-[18px] py-5">
          <nav className="mb-4 flex items-center gap-2 text-xs">
            <span className="text-text-colortext-gray">
              {sidebarVariant === "superadmin"
                ? t("superadmin.dashboard")
                : sidebarVariant === "warehouse"
                  ? t("navigation.moList")
                  : t("history.breadcrumbSection")}
            </span>
            <span className="text-[#B5B5B3]">›</span>
            <span className="font-medium text-text-colortext-dark">
              {t("history.title")}
            </span>
          </nav>

          <h1 className="mb-4 text-lg font-semibold text-[#111111]">
            {t("history.title")}
          </h1>

          <section className="overflow-hidden rounded-lg border border-strokestroke-gray bg-white">
            <div className="border-b border-strokestroke-gray px-[18px] py-4">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="w-full sm:w-[280px] sm:shrink-0">
                  <label
                    htmlFor="history-search"
                    className="mb-1.5 block text-xs font-medium text-[#5F5F5E]"
                  >
                    {t("history.searchLabel")}
                  </label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A3A3A1]" />
                    <Input
                      id="history-search"
                      placeholder={t("history.searchPlaceholder")}
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      className="h-9 rounded-md border-strokestroke-gray pl-9 text-xs placeholder:text-[#A3A3A1]"
                    />
                  </div>
                </div>

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
                        {t("history.clearFilters")}
                      </button>
                    </div>
                  )}

                  <div className="w-[140px]">
                    <label
                      htmlFor="status-filter"
                      className="mb-1.5 block text-xs font-medium text-[#5F5F5E]"
                    >
                      {t("history.statusLabel")}
                    </label>
                    <div className="relative">
                      <select
                        id="status-filter"
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(parseStatusFilter(event.target.value))}
                        className={cn(filterInputClass, "appearance-none pr-8")}
                      >
                        <option value="All">{t("history.allStatuses")}</option>
                        <option value="Completed">{t(STATUS_LABEL_KEYS.Completed)}</option>
                        <option value="Rejected">{t(STATUS_LABEL_KEYS.Rejected)}</option>
                        <option value="Resubmitted">{t(STATUS_LABEL_KEYS.Resubmitted)}</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8F8F8E]" />
                    </div>
                  </div>

                  <div className="w-[140px]">
                    <label
                      htmlFor="model-filter"
                      className="mb-1.5 block text-xs font-medium text-[#5F5F5E]"
                    >
                      {t("history.modelLabel")}
                    </label>
                    <div className="relative">
                      <select
                        id="model-filter"
                        value={modelFilter}
                        onChange={(event) => setModelFilter(event.target.value)}
                        className={cn(filterInputClass, "appearance-none pr-8")}
                      >
                        <option value="All">{t("history.allModels")}</option>
                        {models.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8F8F8E]" />
                    </div>
                  </div>

                  <div className="w-[165px]">
                    <label
                      htmlFor="date-range"
                      className="mb-1.5 block text-xs font-medium text-[#5F5F5E]"
                    >
                      {t("history.dateRangeLabel")}
                    </label>
                    <div className="relative">
                      <select
                        id="date-range"
                        value={dateRange}
                        onChange={(event) =>
                          setDateRange(event.target.value as DateRange)
                        }
                        className={cn(filterInputClass, "appearance-none pr-8")}
                      >
                        <option value="7">{t("history.last7Days")}</option>
                        <option value="30">{t("history.last30Days")}</option>
                        <option value="custom">{t("history.customRange")}</option>
                        <option value="all">{t("history.allTime")}</option>
                      </select>
                      <CalendarDays className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8F8F8E]" />
                    </div>
                  </div>
                </div>
              </div>

              {dateRange === "custom" && (
                <div className="mt-4 flex flex-wrap items-end gap-3 rounded-md bg-[#FAFAFA] p-3">
                  <div className="w-[180px]">
                    <label
                      htmlFor="date-start"
                      className="mb-1.5 block text-xs font-medium text-[#5F5F5E]"
                    >
                      {t("history.from")}
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
                      {t("history.to")}
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
                      {t("history.dateError")}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="px-[18px] pb-[18px] pt-2">
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <p className="h-8 text-xs text-[#8F8F8E]">
                  {t("history.showingRecords", {
                    shown: filteredRows.length,
                    total: historyRows.length,
                  })}
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
                    {filteredRows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="px-3 py-10 text-center">
                          <p className="text-sm font-medium text-[#333333]">
                            {t("history.noMatchingRecords")}
                          </p>
                          <p className="mt-1 text-xs text-[#8F8F8E]">
                            {t("history.noMatchingHint")}
                          </p>
                          <button
                            type="button"
                            onClick={resetFilters}
                            className="mt-3 text-xs font-medium text-[#046A39] hover:underline"
                          >
                            {t("history.resetFilters")}
                          </button>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRows.map((row) => {
                        const detailHref = `${historyHref}/${encodeURIComponent(row.code)}`;

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
                            <TableCell className="px-3 py-2 text-xs">
                              {row.model}
                            </TableCell>
                            <TableCell className="whitespace-nowrap px-3 py-2 text-xs">
                              {row.projectNumber}
                            </TableCell>
                            <TableCell className="px-3 py-2 text-xs">
                              {row.task}
                            </TableCell>
                            <TableCell className="px-3 py-2">
                              <StatusBadge status={row.status} />
                            </TableCell>
                            <TableCell className="max-w-[260px] px-3 py-2 text-xs text-[#5F5F5E]">
                              {row.notes}
                            </TableCell>
                            <TableCell className="whitespace-nowrap px-3 py-2 text-xs">
                              {row.submittedBy}
                            </TableCell>
                            <TableCell className="whitespace-nowrap px-3 py-2 text-xs text-[#5F5F5E]">
                              {row.dateSubmitted}
                            </TableCell>
                            <TableCell className="px-3 py-2 text-center">
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
          </section>
        </div>
      </div>
    </main>
  );
}
