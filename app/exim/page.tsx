
"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  CircleCheck,
  CircleX,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Package,
  Search,
  Send,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import { DEMO } from "@/lib/demo-data";
import { formatDateTime, isSameLocalDay } from "@/lib/date-utils";
import MoDeadline from "@/components/history/MoDeadline";

import EximMaterialTable from "./_components/EximMaterialTable";
import { pendingMos, type EximMo, type EximRow } from "./_lib/data";

type Notice = {
  type: "success" | "reject";
  message: string;
};

type ExpandedMo = {
  code: string;
  rows: EximRow[];
};

type SubmittedEximMo = {
  code: string;
  rows: EximRow[];
  submittedAt: number;
};

const EMPTY_SUBMISSIONS: SubmittedEximMo[] = [];
let submittedEximMos = EMPTY_SUBMISSIONS;
const submissionListeners = new Set<() => void>();

function subscribeToSubmissions(listener: () => void) {
  submissionListeners.add(listener);
  return () => submissionListeners.delete(listener);
}

function getSubmissionSnapshot() {
  return submittedEximMos;
}

function useSubmittedEximMos() {
  return useSyncExternalStore(
    subscribeToSubmissions,
    getSubmissionSnapshot,
    () => EMPTY_SUBMISSIONS,
  );
}

function recordEximSubmission(code: string, rows: EximRow[]) {
  submittedEximMos = [
    { code, rows: rows.map((row) => ({ ...row })), submittedAt: Date.now() },
    ...submittedEximMos.filter((mo) => mo.code !== code),
  ];
  submissionListeners.forEach((listener) => listener());
}

export default function EximPage() {
  const { t, locale } = useI18n();

  const [mos, setMos] = useState<EximMo[]>(() =>
    pendingMos.filter(
      (mo) => !submittedEximMos.some((submitted) => submitted.code === mo.code),
    ),
  );
  const submittedMos = useSubmittedEximMos();
  const [expanded, setExpanded] = useState<ExpandedMo | null>(null);
  const [expandedSubmittedCode, setExpandedSubmittedCode] = useState<
    string | null
  >(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [listSearch, setListSearch] = useState("");

  const filteredMos = useMemo(() => {
    const query = listSearch.trim().toLowerCase();

    return mos.filter((mo) => {
      const searchableText = [
        mo.code,
        ...mo.materials.flatMap((material) => [
          material.code,
          material.englishName,
          material.chinaName,
        ]),
      ]
        .join(" ")
        .toLowerCase();

      return !query || searchableText.includes(query);
    });
  }, [mos, listSearch]);

  const filteredSubmittedMos = useMemo(() => {
    const query = listSearch.trim().toLowerCase();

    return submittedMos.filter((mo) => {
      const searchableText = [
        mo.code,
        ...mo.rows.flatMap((row) => [row.code, row.model, row.brand]),
      ]
        .join(" ")
        .toLowerCase();

      return !query || searchableText.includes(query);
    });
  }, [submittedMos, listSearch]);

  const submittedTodayCount = submittedMos.filter((mo) =>
    isSameLocalDay(mo.submittedAt),
  ).length;

  const total = expanded?.rows.length ?? 0;

  const filled =
    expanded?.rows.filter(
      (row) => row.model.trim() && row.brand.trim(),
    ).length ?? 0;

  const canSubmit = total > 0 && filled === total;

  function toggleMo(mo: EximMo) {
    setNotice(null);

    if (expanded?.code === mo.code) {
      setExpanded(null);
      return;
    }

    setExpanded({
      code: mo.code,
      rows:
        expanded?.code === mo.code
          ? expanded.rows
          : mo.materials.map((material) => ({
              ...material,
              model: DEMO.eximModelDimension,
              brand: "",
            })),
    });
  }

  function updateRow(
    id: string,
    field: "model" | "brand",
    value: string,
  ) {
    setExpanded((prev) =>
      prev
        ? {
            ...prev,
            rows: prev.rows.map((row) =>
              row.id === id ? { ...row, [field]: value } : row,
            ),
          }
        : prev,
    );
  }

  function finish(
    code: string,
    type: Notice["type"],
    message: string,
    submittedRows?: EximRow[],
  ) {
    setMos((prev) => prev.filter((mo) => mo.code !== code));
    setExpanded(null);
    if (type === "success" && submittedRows) {
      recordEximSubmission(code, submittedRows);
    }
    setNotice({ type, message });
  }

  function handleSubmit() {
    if (!expanded || !canSubmit) return;

    // TODO: Connect to the backend.
    // POST {
    //   moCode: expanded.code,
    //   materials: expanded.rows.map((row) => ({
    //     id: row.id,
    //     model: row.model,
    //     brand: row.brand,
    //   })),
    // }

    finish(
      expanded.code,
      "success",
      t("exim.submitSuccess", { code: expanded.code }),
      expanded.rows,
    );
  }

  function handleReject() {
    if (!expanded || !rejectReason.trim()) return;

    const code = expanded.code;

    // TODO: Connect to the backend.
    // POST { moCode: code, reason: rejectReason }

    finish(
      code,
      "reject",
      t("exim.rejectSuccess", { code }),
    );

    setRejectOpen(false);
    setRejectReason("");
  }

  return (
    <main className="min-h-screen w-full bg-backgroundbg-gray">
      <Sidebar variant="exim" />

      <div className="flex min-h-screen flex-col pl-[255px]">
        <TopBar />

        <div className="mt-[52px] w-full px-[18px] py-5">
          <nav className="mb-4 text-xs text-text-colortext-gray">
            {t("exim.title")}
          </nav>

          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold text-[#111111]">
                {t("exim.title")}
              </h1>
              <p className="mt-1 text-sm text-[#8F8F8E]">
                Review pending MOs and complete their brand and model
                information.
              </p>
            </div>

            <div className="flex w-full flex-wrap items-end justify-end gap-3 sm:w-auto">
              <div className="relative w-full sm:w-[280px]">
                <label htmlFor="exim-list-search" className="sr-only">
                  {t("history.searchLabel")}
                </label>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A3A3A1]" />
                <Input
                  id="exim-list-search"
                  value={listSearch}
                  onChange={(event) => setListSearch(event.target.value)}
                  placeholder={t("exim.searchPlaceholder")}
                  className="h-9 rounded-md border-strokestroke-gray pl-9 text-xs placeholder:text-[#A3A3A1]"
                />
              </div>
              <div className="flex h-9 shrink-0 items-center gap-2 rounded-lg border border-strokestroke-gray bg-white px-3">
                <ClipboardList className="h-4 w-4 text-[#0B5934]" />
                <span className="text-sm text-[#5F5F5E]">
                  {t("common.pendingMos")}
                </span>
                <span className="text-sm font-semibold text-[#111111]">
                  {mos.length}
                </span>
              </div>
            </div>
          </div>

          {notice && (
            <div
              role="status"
              className={cn(
                "mb-4 flex items-start gap-3 rounded-lg border px-4 py-3 text-xs",
                notice.type === "success"
                  ? "border-[#B7DEC4] bg-[#EAF6EE] text-[#0b5934]"
                  : "border-red-200 bg-red-50 text-red-700",
              )}
            >
              {notice.type === "success" ? (
                <CircleCheck className="mt-px h-4 w-4 shrink-0" />
              ) : (
                <CircleX className="mt-px h-4 w-4 shrink-0" />
              )}

              <span className="flex-1">{notice.message}</span>

              <button
                type="button"
                aria-label={t("common.dismiss")}
                onClick={() => setNotice(null)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <section className="overflow-hidden rounded-lg border border-strokestroke-gray bg-white">
            <div className="flex items-center justify-between border-b border-strokestroke-gray px-[18px] py-4">
              <div>
                <h2 className="text-sm font-semibold text-[#111111]">
                  Task / MO List
                </h2>
                <p className="mt-1 text-xs text-[#8F8F8E]">
                  Select an MO to view and complete its material details.
                </p>
              </div>
            </div>

            {mos.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF6EE]">
                  <Package
                    className="h-6 w-6 text-[#0B5934]"
                    strokeWidth={1.5}
                  />
                </div>

                <p className="text-sm font-medium text-[#111111]">
                  {t("exim.noMoWaiting")}
                </p>

                <p className="mt-1 max-w-sm text-xs text-[#8F8F8E]">
                  {t("exim.noMoWaitingHint")}
                </p>
              </div>
            ) : filteredMos.length === 0 ? (
              <p className="px-6 py-10 text-center text-sm text-[#8F8F8E]">
                {t("history.noMatchingRecords")}
              </p>
            ) : (
              <div className="divide-y divide-strokestroke-gray">
                {filteredMos.map((mo) => {
                  const isExpanded = expanded?.code === mo.code;
                  const rowCount = mo.materials.length;

                  const completedCount = isExpanded
                    ? expanded.rows.filter(
                        (row) =>
                          row.model.trim() && row.brand.trim(),
                      ).length
                    : 0;

                  return (
                    <div key={mo.code}>
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        onClick={() => toggleMo(mo)}
                        className={cn(
                          "flex w-full items-center gap-4 px-[18px] py-4 text-left transition-colors",
                          isExpanded
                            ? "bg-[#F7FBF8]"
                            : "bg-white hover:bg-slate-50",
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                            isExpanded
                              ? "bg-[#EAF6EE]"
                              : "bg-[#F4F4F4]",
                          )}
                        >
                          <Package
                            className={cn(
                              "h-5 w-5",
                              isExpanded
                                ? "text-[#0B5934]"
                                : "text-[#737373]",
                            )}
                            strokeWidth={1.7}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-[#111111]">
                            {mo.code}
                          </p>
                          <MoDeadline moCode={mo.code} />

                          <p className="mt-1 text-xs text-[#8F8F8E]">
                            {rowCount}{" "}
                            {rowCount === 1 ? "material" : "materials"}
                          </p>
                        </div>

                        {isExpanded ? (
                          <span className="hidden text-xs text-[#0B5934] sm:block">
                            {completedCount} / {rowCount} completed
                          </span>
                        ) : (
                          <span className="hidden text-xs text-[#8F8F8E] sm:block">
                            View materials
                          </span>
                        )}

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-[#0B5934]" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-[#737373]" />
                          )}
                        </div>
                      </button>

                      {isExpanded && expanded && (
                        <div className="border-t border-strokestroke-gray bg-white px-[18px] py-5">
                          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-[#111111]">
                                Material Details
                              </p>
                              <p className="mt-1 text-xs text-[#8F8F8E]">
                                Enter the brand and model for every
                                material before submitting this MO.
                              </p>
                            </div>

                            <div className="inline-flex h-8 items-center gap-3 rounded-full bg-white px-4 text-xs">
                              <span className="text-[#8F8F8E]">
                                {t("common.mo")}
                              </span>
                              <span className="font-medium text-[#111111]">
                                {expanded.code}
                              </span>
                            </div>
                          </div>

                          <div className="overflow-x-auto rounded-lg border border-strokestroke-gray bg-white">
                            <EximMaterialTable
                              rows={expanded.rows}
                              onChange={updateRow}
                            />
                          </div>

                          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <span className="text-xs text-[#5F5F5E]">
                              {t("exim.materialsComplete", {
                                filled,
                                total,
                              })}
                            </span>

                            <div className="flex items-center gap-3">
                              <Button
                                type="button"
                                variant="destructive"
                                onClick={() => {
                                  setRejectReason("");
                                  setRejectOpen(true);
                                }}
                                className="h-10 gap-2 rounded-md px-4 text-sm font-medium"
                              >
                                <X className="h-4 w-4" />
                                {t("exim.reject")}
                              </Button>

                              <Button
                                type="button"
                                variant="primary"
                                disabled={!canSubmit}
                                onClick={handleSubmit}
                                className="h-10 gap-2 rounded-md px-5 text-sm font-semibold"
                              >
                                <Send className="h-4 w-4" />
                                {t("common.submit")}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
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
                <span>{submittedMos.length}</span>
              </div>
            </div>
            {submittedMos.length === 0 ? (
              <p className="px-[18px] py-6 text-sm text-[#8F8F8E]">
                {t("common.noSubmittedMos")}
              </p>
            ) : filteredSubmittedMos.length === 0 ? (
              <p className="px-[18px] py-6 text-sm text-[#8F8F8E]">
                {t("history.noMatchingRecords")}
              </p>
            ) : (
              <div className="divide-y divide-strokestroke-gray">
                {filteredSubmittedMos.map((mo) => {
                  const isExpanded = expandedSubmittedCode === mo.code;

                  return (
                    <div key={mo.code}>
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        onClick={() =>
                          setExpandedSubmittedCode(
                            isExpanded ? null : mo.code,
                          )
                        }
                        className="flex w-full items-center gap-4 bg-white px-[18px] py-4 text-left transition-colors hover:bg-slate-50"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EAF6EE]">
                          <Package className="h-5 w-5 text-[#0B5934]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-[#111111]">
                            {mo.code}
                          </p>
                          <p className="mt-1 text-xs text-[#8F8F8E]">
                            {t("common.materialPlural", {
                              count: mo.rows.length,
                            })}
                          </p>
                          <MoDeadline moCode={mo.code} />
                          <p className="mt-1 text-[11px] text-[#8F8F8E]">
                            {formatDateTime(mo.submittedAt, locale)}
                          </p>
                        </div>
                        <span className="hidden text-xs text-[#0B5934] sm:block">
                          {t("common.viewSubmittedDetails")}
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-[#0B5934]" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-[#737373]" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="border-t border-strokestroke-gray bg-white px-[18px] py-5">
                          <div className="mb-3 text-xs text-[#5F5F5E]">
                            {t("common.submitted")}
                          </div>
                          <div className="overflow-x-auto rounded-lg border border-strokestroke-gray">
                            <EximMaterialTable rows={mo.rows} readOnly />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>

      <Dialog
        open={rejectOpen}
        onOpenChange={(open) => {
          setRejectOpen(open);
          if (!open) setRejectReason("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("exim.rejectDialog.title")}
            </DialogTitle>
            <DialogDescription>
              {t("exim.rejectDialog.description", {
                code: expanded?.code ?? "",
              })}
            </DialogDescription>
          </DialogHeader>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#111111]">
              {t("exim.rejectDialog.reasonLabel")}{" "}
              <span className="text-red-500">*</span>
            </label>

            <textarea
              rows={4}
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
              placeholder={t("exim.rejectDialog.reasonPlaceholder")}
              className="w-full resize-none rounded-md border border-strokestroke-gray px-3 py-2 text-xs outline-none placeholder:text-[#A3A3A1] focus:border-primaryprimary-green"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setRejectOpen(false)}
            >
              {t("common.cancel")}
            </Button>

            <Button
              type="button"
              variant="destructiveSolid"
              disabled={!rejectReason.trim()}
              onClick={handleReject}
            >
              {t("exim.rejectDialog.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
