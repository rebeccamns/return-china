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
import { CalendarPickerModal } from "@/components/history/CalendarPickerModal";
import {
  isWithinHistoryDateRange,
  type CalendarRange,
} from "@/components/history/date-range";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import StatusBadge from "./StatusBadge";
import type { MoRecord, MoStatus, StepName, TimelineStep } from "../../_lib/types";
import { MO_STEPS, STEP_DISPLAY, getModelOptions, getStatusOptions, getStepOptions } from "../../_lib/mo-data";
import { exportMoCsv } from "../../_lib/export";

// ─── helpers ────────────────────────────────────────────────────────────────

const TODAY = new Date(2026, 8, 22); // Sep 22 2026

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

const STEP_STATUS_KEYS = {
  completed: "moMonitoring.detail.stepCompleted",
  reopened: "moMonitoring.detail.stepReopened",
  in_progress: "moMonitoring.detail.stepInProgress",
  not_started: "moMonitoring.detail.stepNotStarted",
} as const;

const STEP_STATUS_STYLE: Record<TimelineStep["status"], string> = {
  completed: "border border-green-200 bg-green-50 text-green-700",
  reopened: "border border-green-200 bg-green-50 text-green-700",
  in_progress: "border border-yellow-200 bg-yellow-50 text-yellow-700",
  not_started: "border border-gray-200 bg-gray-100 text-gray-600",
};

const nestedHeadClass = "h-9 bg-[#F8F8F8] px-4 text-xs font-semibold text-slate-700";

function ExpandedRow({
  mo,
  onViewFlow,
}: {
  mo: MoRecord;
  onViewFlow: (step: StepName) => void;
}) {
  const { t } = useI18n();

  return (
    <TableRow className="bg-white hover:bg-white">
      <TableCell colSpan={8} className="bg-white px-12 py-3">
        <div className="overflow-hidden rounded-md border border-strokestroke-gray">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-[#F8F8F8]">
                <TableHead className={nestedHeadClass}>{t("moMonitoring.columns.flow")}</TableHead>
                <TableHead className={nestedHeadClass}>{t("moMonitoring.columns.status")}</TableHead>
                <TableHead className={nestedHeadClass}>{t("moMonitoring.columns.lastEdit")}</TableHead>
                <TableHead className={cn(nestedHeadClass, "w-36")} />
              </TableRow>
            </TableHeader>
            <TableBody>
              {mo.timeline.map((step) => (
                <TableRow key={step.step} className="bg-white hover:bg-white">
                  <TableCell className="px-4 py-2 text-xs font-medium text-gray-800">
                    {STEP_DISPLAY[step.step]}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        STEP_STATUS_STYLE[step.status],
                      )}
                    >
                      {t(STEP_STATUS_KEYS[step.status])}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-2 text-xs text-gray-500">
                    {step.time ?? "—"}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-right">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-7 rounded-md px-3 text-xs font-medium"
                      onClick={() => onViewFlow(step.step)}
                    >
                      {t("moMonitoring.viewDetail")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TableCell>
    </TableRow>
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
        className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#08783F]"
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
  const [dateRange, setDateRange] = useState<CalendarRange>({
    type: "lastDays",
    days: 7,
  });

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
      return isWithinHistoryDateRange(m.lastUpdatedDate, dateRange, TODAY);
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

          <CalendarPickerModal
            value={dateRange}
            onChange={setDateRange}
            referenceDate={TODAY}
            ariaLabel={t("moMonitoring.dateRangeLabel")}
            buttonClassName="h-9 min-w-[180px] text-sm"
          />

          {/* Export */}
          <Button
            type="button"
            variant="primary"
            onClick={handleExport}
            className="h-9 gap-1.5 px-3 text-sm font-semibold"
          >
            <Download className="h-4 w-4" strokeWidth={1.75} />
            {t("moMonitoring.exportBtn")}
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="px-5 py-4">
        <div className="overflow-hidden rounded-md border border-strokestroke-gray">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow className="hover:bg-primaryprimary-green">
                <TableHead className="w-12 px-3" />
                <TableHead className="px-4">{t("moMonitoring.columns.moCode")}</TableHead>
                <TableHead className="px-4">{t("moMonitoring.columns.model")}</TableHead>
                <TableHead className="px-4">{t("moMonitoring.columns.currentStep")}</TableHead>
                <TableHead className="px-4">{t("moMonitoring.columns.progress")}</TableHead>
                <TableHead className="px-4">{t("moMonitoring.columns.status")}</TableHead>
                <TableHead className="px-4">{t("moMonitoring.columns.lastUpdated")}</TableHead>
                <TableHead className="px-4">{t("moMonitoring.columns.action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={8} className="py-16 text-center">
                    <p className="text-sm font-medium text-gray-500">{t("moMonitoring.noMoFound")}</p>
                    <p className="mt-1 text-xs text-gray-400">{t("moMonitoring.noMoFoundHint")}</p>
                  </TableCell>
                </TableRow>
              ) : (
                paginated.flatMap((mo) => {
                  const isExpanded = expanded.has(mo.moCode);
                  const rows: React.ReactNode[] = [
                    <TableRow
                      key={mo.moCode}
                      onClick={() => router.push(`/superadmin/mo-monitoring/${mo.moCode}`)}
                      className="h-12 cursor-pointer hover:bg-[#FAFAFA]"
                    >
                      <TableCell
                        className="w-12 px-3 py-2 text-center"
                        onClick={(e) => { e.stopPropagation(); toggleExpand(mo.moCode); }}
                      >
                        <button
                          type="button"
                          aria-label={isExpanded ? t("common.collapseRow") : t("common.expandRow")}
                          className="flex h-7 w-7 items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#08783F]"
                        >
                          {isExpanded ? (
                            <Minus className="h-3.5 w-3.5" />
                          ) : (
                            <Plus className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="px-4 py-2 text-xs text-gray-700">{mo.moCode}</TableCell>
                      <TableCell className="px-4 py-2 text-xs text-gray-700">{mo.model}</TableCell>
                      <TableCell className="px-4 py-2 text-xs text-gray-700">{STEP_DISPLAY[mo.currentStep]}</TableCell>
                      <TableCell className="px-4 py-2">
                        <ProgressBar completed={mo.completedSteps} />
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        <StatusBadge status={mo.status} />
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-2 text-xs text-gray-500">
                        {mo.lastUpdated}
                      </TableCell>
                      <TableCell
                        className="px-4 py-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ActionDropdown
                          mo={mo}
                          onViewDetail={() => router.push(`/superadmin/mo-monitoring/${mo.moCode}`)}
                          onIntervene={() => onIntervene(mo)}
                          onExportMo={() => handleExportSingle(mo)}
                        />
                      </TableCell>
                    </TableRow>,
                  ];
                  if (isExpanded) {
                    rows.push(
                      <ExpandedRow
                        key={`${mo.moCode}-expand`}
                        mo={mo}
                        onViewFlow={(step) =>
                          router.push(
                            `/superadmin/mo-monitoring/${mo.moCode}?flow=${encodeURIComponent(step)}`,
                          )
                        }
                      />,
                    );
                  }
                  return rows;
                })
              )}
            </TableBody>
          </Table>
        </div>
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
            className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#08783F]"
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
                  "flex h-8 w-8 items-center justify-center rounded text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#08783F]",
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
            className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#08783F]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
