"use client";

import {
  useState,
  useMemo,
  useEffect,
  useRef,
  type KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Minus,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import StatusBadge from "./StatusBadge";
import type { MoRecord, MoStatus, StepName } from "../../_lib/types";
import { MO_STEPS, STEP_DISPLAY, getModelOptions, getStatusOptions, getStepOptions } from "../../_lib/mo-data";
import { exportMoCsv } from "../../_lib/export";

// ─── helpers ────────────────────────────────────────────────────────────────

const TODAY = new Date(2026, 8, 22); // Sep 22 2026

function daysAgo(n: number): Date {
  return new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() - n);
}

const DATE_RANGE_OPTIONS = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "all", label: "All time" },
];

const ROWS_OPTIONS = [10, 20, 50];

// ─── Progress bar ────────────────────────────────────────────────────────────

function ProgressBar({ completed, total = 7 }: { completed: number; total?: number }) {
  const pct = Math.min(100, Math.round((completed / total) * 100));
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#058346] to-[#7ed957]"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={completed}
          aria-valuemin={0}
          aria-valuemax={total}
        />
      </div>
      <span className="text-xs tabular-nums text-gray-500">
        {completed}/{total}
      </span>
    </div>
  );
}

// ─── Expand panel ────────────────────────────────────────────────────────────

function ExpandedRow({ mo }: { mo: MoRecord }) {
  return (
    <tr>
      <td colSpan={8} className="bg-gray-50 px-10 py-3">
        <div className="flex flex-wrap gap-3">
          {mo.timeline.map((step, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  step.status === "completed" || step.status === "reopened"
                    ? "bg-green-500"
                    : step.status === "in_progress"
                      ? "bg-yellow-400"
                      : "bg-gray-300",
                )}
              />
              <span className="text-xs text-gray-600">{STEP_DISPLAY[step.step]}</span>
              {step.time && (
                <span className="text-xs text-gray-400">{step.time}</span>
              )}
            </div>
          ))}
        </div>
      </td>
    </tr>
  );
}

// ─── Row action dropdown ──────────────────────────────────────────────────────

function ActionDropdown({
  mo,
  onViewDetail,
  onIntervene,
  onExportMo,
}: {
  mo: MoRecord;
  onViewDetail: () => void;
  onIntervene: () => void;
  onExportMo: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Escape") setOpen(false);
  };

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        aria-label={t("common.moreActions")}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleKey}
        className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#058346]"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-1 min-w-[160px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          {[
            { label: t("moMonitoring.viewDetail"), action: onViewDetail },
            { label: t("moMonitoring.interveneMo"), action: onIntervene },
            { label: t("moMonitoring.exportMoData"), action: onExportMo },
          ].map(({ label, action }) => (
            <button
              key={label}
              role="menuitem"
              type="button"
              onClick={() => { setOpen(false); action(); }}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:bg-gray-50"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main table component ────────────────────────────────────────────────────

type Props = {
  mos: MoRecord[];
  onIntervene: (mo: MoRecord) => void;
};

export default function MoTable({ mos, onIntervene }: Props) {
  const { t } = useI18n();
  const router = useRouter();

  // ── filters ──
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [stepFilter, setStepFilter] = useState<string>("all");
  const [modelFilter, setModelFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("7");

  // ── pagination ──
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  // ── expand ──
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const statusOptions = getStatusOptions();
  const stepOptions = getStepOptions();
  const modelOptions = getModelOptions();

  // ── derived filtered list ──
  const filtered = useMemo(() => {
    const cutoff =
      dateRange === "all"
        ? null
        : daysAgo(Number(dateRange));

    return mos.filter((m) => {
      if (
        search.trim() &&
        !m.moCode.toLowerCase().includes(search.toLowerCase()) &&
        !m.model.toLowerCase().includes(search.toLowerCase()) &&
        !m.currentStep.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      if (statusFilter !== "all" && m.status !== statusFilter) return false;
      if (stepFilter !== "all" && m.currentStep !== stepFilter) return false;
      if (modelFilter !== "all" && m.model !== modelFilter) return false;
      if (cutoff && m.lastUpdatedDate < cutoff) return false;
      return true;
    });
  }, [mos, search, statusFilter, stepFilter, modelFilter, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

  // Reset to page 1 whenever filters change
  useEffect(() => setPage(1), [search, statusFilter, stepFilter, modelFilter, dateRange, rowsPerPage]);

  const toggleExpand = (code: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });

  const handleExport = () => exportMoCsv(filtered, "mo-monitoring.csv");
  const handleExportSingle = (mo: MoRecord) => exportMoCsv([mo], `mo-${mo.moCode}.csv`);

  // ── pagination range ──
  const pageNumbers = useMemo(() => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push("...");
      for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) {
        pages.push(i);
      }
      if (safePage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, safePage]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      {/* Card header */}
      <div className="border-b border-gray-100 px-5 py-4">
        <h2 className="text-base font-semibold text-gray-900">
          {t("moMonitoring.moList")}
        </h2>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 px-5 py-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("moMonitoring.searchPlaceholder")}
            className="h-9 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#058346] focus:outline-none focus:ring-1 focus:ring-[#058346]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 ml-auto">
          {/* Status filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-auto min-w-[130px] text-sm">
              <span className="text-gray-500 mr-1">{t("moMonitoring.statusLabel")}:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("moMonitoring.statusAll")}</SelectItem>
              {statusOptions.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Step filter */}
          <Select value={stepFilter} onValueChange={setStepFilter}>
            <SelectTrigger className="h-9 w-auto min-w-[150px] text-sm">
              <span className="text-gray-500 mr-1">{t("moMonitoring.currentStepLabel")}:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("moMonitoring.currentStepAll")}</SelectItem>
              {stepOptions.map((s) => (
                <SelectItem key={s} value={s}>{STEP_DISPLAY[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Model filter */}
          <Select value={modelFilter} onValueChange={setModelFilter}>
            <SelectTrigger className="h-9 w-auto min-w-[130px] text-sm">
              <span className="text-gray-500 mr-1">{t("moMonitoring.modelLabel")}:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("moMonitoring.modelAll")}</SelectItem>
              {modelOptions.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date range */}
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="h-9 w-auto min-w-[160px] text-sm">
              <Calendar className="mr-1.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
              <span className="text-gray-500 mr-1">{t("moMonitoring.dateRangeLabel")}:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DATE_RANGE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Export */}
          <Button
            type="button"
            onClick={handleExport}
            className="h-9 gap-1.5 bg-[#058346] px-3 text-sm font-semibold text-white hover:bg-[#0b5934] focus-visible:ring-[#058346]"
          >
            <Download className="h-4 w-4" strokeWidth={1.75} />
            {t("moMonitoring.exportBtn")}
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {/* expand toggle col */}
              <th className="w-12 px-3 py-3" />
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                {t("moMonitoring.columns.moCode")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                {t("moMonitoring.columns.model")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                {t("moMonitoring.columns.currentStep")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                {t("moMonitoring.columns.progress")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                {t("moMonitoring.columns.status")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                {t("moMonitoring.columns.lastUpdated")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                {t("moMonitoring.columns.action")}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <p className="text-sm font-medium text-gray-500">{t("moMonitoring.noMoFound")}</p>
                  <p className="mt-1 text-xs text-gray-400">{t("moMonitoring.noMoFoundHint")}</p>
                </td>
              </tr>
            ) : (
              paginated.flatMap((mo) => {
                const isExpanded = expanded.has(mo.moCode);
                const rows: React.ReactNode[] = [
                  <tr
                    key={mo.moCode}
                    onClick={() => router.push(`/superadmin/mo-monitoring/${mo.moCode}`)}
                    className="cursor-pointer border-b border-gray-100 hover:bg-gray-50"
                  >
                    {/* Expand toggle */}
                    <td
                      className="w-12 px-3 py-3 text-center"
                      onClick={(e) => { e.stopPropagation(); toggleExpand(mo.moCode); }}
                    >
                      <button
                        type="button"
                        aria-label={isExpanded ? t("common.collapseRow") : t("common.expandRow")}
                        className="flex h-7 w-7 items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#058346]"
                      >
                        {isExpanded ? (
                          <Minus className="h-3.5 w-3.5" />
                        ) : (
                          <Plus className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-700">
                      {mo.moCode}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{mo.model}</td>
                    <td className="px-4 py-3 text-gray-700">{STEP_DISPLAY[mo.currentStep]}</td>
                    <td className="px-4 py-3">
                      <ProgressBar completed={mo.completedSteps} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={mo.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                      {mo.lastUpdated}
                    </td>
                    <td
                      className="px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ActionDropdown
                        mo={mo}
                        onViewDetail={() => router.push(`/superadmin/mo-monitoring/${mo.moCode}`)}
                        onIntervene={() => onIntervene(mo)}
                        onExportMo={() => handleExportSingle(mo)}
                      />
                    </td>
                  </tr>,
                ];
                if (isExpanded) {
                  rows.push(<ExpandedRow key={`${mo.moCode}-expand`} mo={mo} />);
                }
                return rows;
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-5 py-3">
        {/* Rows per page */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>{t("moMonitoring.rowsPerPage")}</span>
          <select
            value={rowsPerPage}
            onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
            className="h-8 rounded border border-gray-200 bg-white px-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#058346]"
          >
            {ROWS_OPTIONS.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {/* Pagination */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            aria-label="Previous page"
            className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#058346]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {pageNumbers.map((pg, i) =>
            pg === "..." ? (
              <span key={`ellipsis-${i}`} className="flex h-8 w-8 items-center justify-center text-sm text-gray-400">
                …
              </span>
            ) : (
              <button
                key={pg}
                type="button"
                onClick={() => setPage(pg)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#058346]",
                  pg === safePage
                    ? "border border-gray-300 bg-white font-semibold text-gray-900"
                    : "text-gray-500 hover:bg-gray-50",
                )}
              >
                {pg}
              </button>
            ),
          )}

          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            aria-label="Next page"
            className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#058346]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

