
"use client";

import { useState } from "react";
import {
  CircleCheck,
  CircleX,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Package,
  Send,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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

export default function EximPage() {
  const { t } = useI18n();

  const [mos, setMos] = useState<EximMo[]>(pendingMos);
  const [expanded, setExpanded] = useState<ExpandedMo | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

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
              model: "",
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
  ) {
    setMos((prev) => prev.filter((mo) => mo.code !== code));
    setExpanded(null);
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

          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold text-[#111111]">
                {t("exim.title")}
              </h1>
              <p className="mt-1 text-sm text-[#8F8F8E]">
                Review pending MOs and complete their brand and model
                information.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 rounded-lg border border-strokestroke-gray bg-white px-3 py-2">
              <ClipboardList className="h-4 w-4 text-[#0B5934]" />
              <span className="text-sm text-[#5F5F5E]">
                Pending MOs
              </span>
              <span className="text-sm font-semibold text-[#111111]">
                {mos.length}
              </span>
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
            ) : (
              <div className="divide-y divide-strokestroke-gray">
                {mos.map((mo) => {
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
                        <div className="border-t border-strokestroke-gray bg-[#FAFBFA] px-[18px] py-5">
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
                                variant="outline"
                                onClick={() => {
                                  setRejectReason("");
                                  setRejectOpen(true);
                                }}
                                className="h-10 gap-2 rounded-md border-strokestroke-gray bg-white px-4 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-600"
                              >
                                <X className="h-4 w-4" />
                                {t("exim.reject")}
                              </Button>

                              <Button
                                type="button"
                                disabled={!canSubmit}
                                onClick={handleSubmit}
                                className={cn(
                                  "h-10 gap-2 rounded-md px-5 text-sm font-semibold text-white",
                                  canSubmit
                                    ? "bg-gradient-to-b from-[#058346] to-[#0B5934] hover:opacity-90"
                                    : "cursor-not-allowed bg-slate-300 hover:bg-slate-300",
                                )}
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
              variant="outline"
              onClick={() => setRejectOpen(false)}
            >
              {t("common.cancel")}
            </Button>

            <Button
              type="button"
              disabled={!rejectReason.trim()}
              onClick={handleReject}
              className="bg-red-600 text-white hover:bg-red-700 disabled:bg-slate-300"
            >
              {t("exim.rejectDialog.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
