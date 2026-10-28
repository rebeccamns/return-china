
"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock3,
  Eye,
  FileClock,
  Search,
  XCircle,
  RotateCcw,
} from "lucide-react";

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
import type { TranslationKey } from "@/i18n";

type MOStatus = "Completed" | "Rejected" | "Resubmitted";
type ProcessStatus = "Completed" | "Rejected" | "Pending" | "Resubmitted";

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

type ProcessEvent = {
  process: string;
  status: ProcessStatus;
  timestamp: string;
  performedBy: string;
  remarks: string;
};

const PROCESS_NAMES = [
  "PMC Entry",
  "IQC Scan",
  "PMC Open WO",
  "Staff Return",
  "Exim",
  "Staff Return Sticker",
  "IQC QA Pass",
];

const STATUS_STYLES: Record<MOStatus, string> = {
  Completed: "bg-[#E6F4EA] text-[#0B5934]",
  Rejected: "bg-red-50 text-red-600",
  Resubmitted: "bg-amber-50 text-amber-700",
};

const PROCESS_STATUS_STYLES: Record<ProcessStatus, string> = {
  Completed: "bg-[#E6F4EA] text-[#0B5934]",
  Rejected: "bg-red-50 text-red-600",
  Resubmitted: "bg-amber-50 text-amber-700",
  Pending: "bg-slate-100 text-slate-500",
};

// Mock data for frontend demonstration.
// Replace with API data when the backend is available.
const historyRows: HistoryRow[] = [
  {
    id: "h-1",
    code: "T2026090410261301048",
    model: "Latte-M",
    projectNumber: "9991028",
    task: "BATCH202609 - Return Idle Latte M",
    status: "Completed",
    notes: "-",
    submittedBy: "Bagus Saputra",
    dateSubmitted: "Sep 20, 2026 14:32",
  },
  {
    id: "h-2",
    code: "T2026090410261301041",
    model: "A58",
    projectNumber: "9991027",
    task: "BATCH202609 - Receive Material A58",
    status: "Rejected",
    notes: "Quantity mismatch on Camera Module (expected 7, received 5)",
    submittedBy: "Bagus Saputra",
    dateSubmitted: "Sep 19, 2026 09:15",
  },
  {
    id: "h-3",
    code: "T2026090410261301039",
    model: "A77",
    projectNumber: "9991026",
    task: "BATCH202608 - Verify Material A77",
    status: "Resubmitted",
    notes: "Previously rejected: wrong material code on Display Panel",
    submittedBy: "Bagus Saputra",
    dateSubmitted: "Sep 18, 2026 16:48",
  },
  {
    id: "h-4",
    code: "T2026090410261301033",
    model: "Latte-M",
    projectNumber: "9991025",
    task: "BATCH202608 - Return Idle Latte M",
    status: "Completed",
    notes: "-",
    submittedBy: "Bagus Saputra",
    dateSubmitted: "Sep 17, 2026 11:02",
  },
  {
    id: "h-5",
    code: "T2026090410261301028",
    model: "A98",
    projectNumber: "9991024",
    task: "BATCH202608 - Receive Material A98",
    status: "Rejected",
    notes: "China name does not match the master list",
    submittedBy: "Bagus Saputra",
    dateSubmitted: "Sep 16, 2026 08:40",
  },
];

// Demonstration timeline only.
// These events are examples, not actual recorded process history.
function getMockEvents(row: HistoryRow): ProcessEvent[] {
  const completedCount =
    row.status === "Completed"
      ? 7
      : row.status === "Rejected"
        ? 4
        : 5;

  return PROCESS_NAMES.map((process, index) => {
    let status: ProcessStatus = "Pending";

    if (index < completedCount) {
      status = "Completed";
    }

    if (row.status === "Rejected" && index === completedCount - 1) {
      status = "Rejected";
    }

    if (row.status === "Resubmitted" && index === completedCount - 1) {
      status = "Resubmitted";
    }

    return {
      process,
      status,
      timestamp:
        status === "Pending" ? "—" : row.dateSubmitted,
      performedBy: status === "Pending" ? "—" : row.submittedBy,
      remarks:
        status === "Rejected"
          ? row.notes
          : status === "Resubmitted"
            ? row.notes
            : status === "Pending"
              ? "Process not recorded as completed"
              : "Process completed",
    };
  });
}

function StatusBadge({ status }: { status: MOStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold",
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

function ProcessStatusBadge({ status }: { status: ProcessStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
        PROCESS_STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

export default function HistoryPage() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [selectedMO, setSelectedMO] = useState<HistoryRow | null>(null);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return historyRows;

    return historyRows.filter((row) =>
      [
        row.code,
        row.model,
        row.projectNumber,
        row.task,
        row.status,
        row.notes,
        row.submittedBy,
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [search]);

  return (
    <main className="min-h-screen w-full bg-backgroundbg-gray">
      <Sidebar />

      <div className="flex min-h-screen flex-col pl-[255px]">
        <TopBar />

        <div className="mt-[52px] w-full px-[18px] py-5">
          <nav className="mb-4 flex items-center gap-2 text-xs">
            <span className="text-text-colortext-gray">
              {t("history.breadcrumbSection")}
            </span>
            <span className="text-[#B5B5B3]">›</span>
            <span className="font-medium text-text-colortext-dark">
              {t("history.title")}
            </span>
            {selectedMO && (
              <>
                <span className="text-[#B5B5B3]">›</span>
                <span className="font-medium text-text-colortext-dark">
                  MO Detail
                </span>
              </>
            )}
          </nav>

          {selectedMO ? (
            <HistoryDetail
              mo={selectedMO}
              onBack={() => setSelectedMO(null)}
            />
          ) : (
            <>
              <h1 className="mb-4 text-lg font-semibold text-[#111111]">
                {t("history.title")}
              </h1>

              <section className="overflow-hidden rounded-lg border border-strokestroke-gray bg-white">
                <div className="flex flex-wrap items-center justify-between gap-4 px-[18px] py-[18px]">
                  <h2 className="text-sm font-semibold text-[#111111]">
                    {t("history.submittedMo")}
                  </h2>

                  <div className="relative w-full sm:w-80">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A3A3A1]" />
                    <Input
                      placeholder={t("history.searchPlaceholder")}
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      className="h-9 rounded-md border-strokestroke-gray pl-9 text-xs placeholder:text-[#A3A3A1]"
                    />
                  </div>
                </div>

                <div className="border-t border-strokestroke-gray" />

                <div className="px-[18px] pb-[18px] pt-4">
                  <div className="overflow-x-auto rounded-md border border-strokestroke-gray">
                    <Table className="min-w-[1100px]">
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t("common.moCode")}</TableHead>
                          <TableHead>{t("common.model")}</TableHead>
                          <TableHead>Project No.</TableHead>
                          <TableHead>{t("common.task")}</TableHead>
                          <TableHead>{t("common.status")}</TableHead>
                          <TableHead>{t("common.notes")}</TableHead>
                          <TableHead>{t("history.submittedBy")}</TableHead>
                          <TableHead>{t("history.dateSubmitted")}</TableHead>
                          <TableHead className="text-center">Action</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {filteredRows.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={9}
                              className="px-3 py-8 text-center text-xs text-[#8F8F8E]"
                            >
                              {t("history.noMatching")}
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredRows.map((row) => (
                            <TableRow
                              key={row.id}
                              className="h-12 hover:bg-[#FAFAFA]"
                            >
                              <TableCell className="whitespace-nowrap text-xs font-medium text-[#111111]">
                                {row.code}
                              </TableCell>
                              <TableCell className="text-xs">
                                {row.model}
                              </TableCell>
                              <TableCell className="text-xs">
                                {row.projectNumber}
                              </TableCell>
                              <TableCell className="max-w-[240px] text-xs">
                                {row.task}
                              </TableCell>
                              <TableCell>
                                <StatusBadge status={row.status} />
                              </TableCell>
                              <TableCell className="max-w-[260px] text-xs text-[#5F5F5E]">
                                {row.notes}
                              </TableCell>
                              <TableCell className="whitespace-nowrap text-xs">
                                {row.submittedBy}
                              </TableCell>
                              <TableCell className="whitespace-nowrap text-xs text-[#5F5F5E]">
                                {row.dateSubmitted}
                              </TableCell>
                              <TableCell className="text-center">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="h-8 gap-1.5 text-xs"
                                  onClick={() => setSelectedMO(row)}
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  View Detail
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function HistoryDetail({
  mo,
  onBack,
}: {
  mo: HistoryRow;
  onBack: () => void;
}) {
  const events = getMockEvents(mo);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-[#111111]">
            MO Detail
          </h1>
          <p className="mt-1 text-xs text-[#8F8F8E]">
            Read-only overview of the MO workflow and activity history.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-9 gap-2"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to History
        </Button>
      </div>

      {/* MO overview */}
      <section className="rounded-lg border border-strokestroke-gray bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs text-[#8F8F8E]">MO Code</p>
            <h2 className="break-all text-base font-semibold text-[#111111]">
              {mo.code}
            </h2>
            <p className="text-xs text-[#5F5F5E]">{mo.task}</p>
          </div>
          <StatusBadge status={mo.status} />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-strokestroke-gray pt-5 sm:grid-cols-2 lg:grid-cols-4">
          <InfoItem label="Model" value={mo.model} />
          <InfoItem label="Project Number" value={mo.projectNumber} />
          <InfoItem label="Submitted By" value={mo.submittedBy} />
          <InfoItem label="Date Submitted" value={mo.dateSubmitted} />
        </div>

        {mo.notes !== "-" && (
          <div
            className={cn(
              "mt-5 rounded-md border p-3",
              mo.status === "Rejected"
                ? "border-red-200 bg-red-50"
                : "border-amber-200 bg-amber-50",
            )}
          >
            <p className="text-xs font-semibold text-[#111111]">
              {mo.status === "Rejected" ? "Rejection Reason" : "Notes"}
            </p>
            <p className="mt-1 text-xs leading-5 text-[#5F5F5E]">
              {mo.notes}
            </p>
          </div>
        )}
      </section>

      {/* Process timeline */}
      <section className="rounded-lg border border-strokestroke-gray bg-white p-5">
        <div className="mb-5 flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-primaryprimary-green" />
          <div>
            <h2 className="text-sm font-semibold text-[#111111]">
              Process Timeline
            </h2>
            <p className="mt-1 text-xs text-[#8F8F8E]">
              Overview of the seven workflow stages.
            </p>
          </div>
        </div>

        <div className="space-y-0">
          {events.map((event, index) => {
            const isLast = index === events.length - 1;

            const Icon =
              event.status === "Completed"
                ? CheckCircle2
                : event.status === "Rejected"
                  ? XCircle
                  : event.status === "Resubmitted"
                    ? RotateCcw
                    : Circle;

            const iconColor =
              event.status === "Completed"
                ? "text-[#087443]"
                : event.status === "Rejected"
                  ? "text-red-500"
                  : event.status === "Resubmitted"
                    ? "text-amber-600"
                    : "text-slate-300";

            return (
              <div key={event.process} className="flex gap-3">
                <div className="flex w-5 shrink-0 flex-col items-center">
                  <Icon className={cn("mt-0.5 h-5 w-5", iconColor)} />
                  {!isLast && (
                    <div className="my-1 min-h-8 w-px flex-1 bg-slate-200" />
                  )}
                </div>

                <div
                  className={cn(
                    "mb-3 min-w-0 flex-1 rounded-md border p-3",
                    event.status === "Rejected"
                      ? "border-red-200 bg-red-50/50"
                      : event.status === "Completed"
                        ? "border-slate-200 bg-white"
                        : "border-slate-200 bg-slate-50/60",
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-medium text-[#111111]">
                      {event.process}
                    </h3>
                    <ProcessStatusBadge status={event.status} />
                  </div>

                  <div className="mt-2 grid grid-cols-1 gap-2 text-xs text-[#5F5F5E] sm:grid-cols-2">
                    <p>
                      <span className="text-[#8F8F8E]">Timestamp: </span>
                      {event.timestamp}
                    </p>
                    <p>
                      <span className="text-[#8F8F8E]">Performed by: </span>
                      {event.performedBy}
                    </p>
                  </div>

                  {event.status !== "Pending" && (
                    <p className="mt-2 text-xs leading-5 text-[#5F5F5E]">
                      {event.remarks}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-2 rounded-md bg-slate-50 p-3 text-xs leading-5 text-[#64748B]">
          Demo timeline: process events and timestamps are illustrative.
          Replace this data with recorded workflow activity before using
          the page for operational decisions.
        </p>
      </section>

      {/* Activity log */}
      <section className="overflow-hidden rounded-lg border border-strokestroke-gray bg-white">
        <div className="flex items-center gap-2 border-b border-strokestroke-gray px-5 py-4">
          <FileClock className="h-4 w-4 text-primaryprimary-green" />
          <div>
            <h2 className="text-sm font-semibold text-[#111111]">
              Activity Log
            </h2>
            <p className="mt-1 text-xs text-[#8F8F8E]">
              Process events recorded for this MO.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table className="min-w-[760px]">
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Process</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Performed By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events
                .filter((event) => event.status !== "Pending")
                .slice()
                .reverse()
                .map((event) => (
                  <TableRow key={`log-${event.process}`}>
                    <TableCell className="whitespace-nowrap text-xs text-[#5F5F5E]">
                      {event.timestamp}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-[#111111]">
                      {event.process}
                    </TableCell>
                    <TableCell className="max-w-[280px] text-xs text-[#5F5F5E]">
                      {event.remarks}
                    </TableCell>
                    <TableCell>
                      <ProcessStatusBadge status={event.status} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs">
                      {event.performedBy}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-xs text-[#8F8F8E]">{label}</p>
      <p className="break-words text-sm font-medium text-[#111111]">
        {value || "—"}
      </p>
    </div>
  );
}
