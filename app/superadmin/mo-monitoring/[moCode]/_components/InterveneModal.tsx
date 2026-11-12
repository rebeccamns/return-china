"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useI18n } from "@/i18n";
import { STEP_DISPLAY } from "../../../_lib/mo-data";
import type { StepName } from "../../../_lib/types";

export type InterveneItem = { code: string; name: string };

export type IntervenePayload = {
  stage: StepName;
  items: string[];
  reason: string;
};

type Props = {
  open: boolean;
  moCode: string;
  currentStep: StepName;
  stageOptions: StepName[];
  items: InterveneItem[];
  onClose: () => void;
  onConfirm: (payload: IntervenePayload) => void;
};

export default function InterveneModal({
  open,
  moCode,
  currentStep,
  stageOptions,
  items,
  onClose,
  onConfirm,
}: Props) {
  const { t } = useI18n();
  const [stage, setStage] = useState<StepName | "">("");
  const [selected, setSelected] = useState<string[]>([]);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [stageError, setStageError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const allSelected = items.length > 0 && selected.length === items.length;

  // Reset state and focus textarea when opened
  useEffect(() => {
    if (open) {
      setStage("");
      setSelected([]);
      setReason("");
      setError("");
      setStageError("");
    }
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  function toggleItem(code: string) {
    setSelected((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  }

  function handleConfirm() {
    const missingStage = !stage;
    const missingReason = !reason.trim();
    setStageError(missingStage ? t("moMonitoring.intervene.stageRequired") : "");
    setError(missingReason ? t("moMonitoring.intervene.reasonRequired") : "");
    if (missingStage || missingReason || !stage) return;
    onConfirm({ stage, items: selected, reason: reason.trim() });
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-4 dark:bg-black/60"
      aria-modal="true"
      role="dialog"
      aria-labelledby="intervene-modal-title"
    >
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:border dark:border-strokestroke-gray dark:bg-backgroundbg-white">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label={t("common.close")}
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:text-text-colortext-gray dark:hover:bg-backgroundbg-bluish-gray dark:hover:text-text-colortext-black"
        >
          <X className="h-4 w-4" />
        </button>

        <h2
          id="intervene-modal-title"
          className="mb-1 text-base font-semibold text-gray-900 dark:text-text-colortext-black"
        >
          {t("moMonitoring.intervene.modalTitle")}
        </h2>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-4 text-sm dark:border-strokestroke-gray">
          <span className="font-semibold text-gray-800 dark:text-text-colortext-dark">{moCode}</span>
          <span className="text-gray-500 dark:text-text-colortext-gray">
            {t("moMonitoring.intervene.currentlyAt", { step: STEP_DISPLAY[currentStep] })}
          </span>
        </div>

        <label
          htmlFor="intervene-stage"
          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-text-colortext-dark"
        >
          {t("moMonitoring.intervene.reflowToStage")}
          <span className="ml-1 text-red-500">*</span>
        </label>
        <select
          id="intervene-stage"
          value={stage}
          onChange={(e) => { setStage(e.target.value as StepName); setStageError(""); }}
          aria-invalid={!!stageError}
          className="mb-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-[#058346] focus:outline-none focus:ring-1 focus:ring-[#058346] dark:border-strokestroke-gray dark:bg-backgroundbg-white dark:text-text-colortext-black"
        >
          <option value="">{t("moMonitoring.intervene.selectStage")}</option>
          {stageOptions.map((s) => (
            <option key={s} value={s}>{STEP_DISPLAY[s]}</option>
          ))}
        </select>
        {stageError && <p className="text-xs text-red-600 dark:text-text-colortext-red">{stageError}</p>}

        <div className="mb-1.5 mt-4">
          <span className="text-sm font-medium text-gray-700 dark:text-text-colortext-dark">
            {t("moMonitoring.intervene.itemsLabel")}
            <span className="ml-1 text-xs font-normal text-gray-400 dark:text-text-colortext-gray">
              ({t("moMonitoring.intervene.itemsOptional")})
            </span>
          </span>
        </div>
        <div className="mb-4 max-h-48 overflow-y-auto rounded-lg border border-gray-200 dark:border-strokestroke-gray">
          {items.length === 0 ? (
            <p className="px-3 py-3 text-sm text-gray-400 dark:text-text-colortext-gray">{t("moMonitoring.intervene.noItems")}</p>
          ) : (
            <>
              <label className="flex cursor-pointer items-center gap-3 border-b border-gray-200 bg-[#F8F8F8] px-3 py-2 text-sm font-medium text-gray-700 dark:border-strokestroke-gray dark:bg-backgroundbg-bluish-gray dark:text-text-colortext-dark">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => setSelected(allSelected ? [] : items.map((i) => i.code))}
                  className="h-4 w-4 accent-[#058346]"
                />
                {t("moMonitoring.intervene.selectAll")}
              </label>
              {items.map((item) => (
                <label
                  key={item.code}
                  className="flex cursor-pointer items-center gap-3 border-b border-gray-100 px-3 py-2 text-sm text-gray-800 last:border-b-0 hover:bg-slate-50 dark:border-strokestroke-gray dark:text-text-colortext-dark dark:hover:bg-backgroundbg-bluish-gray"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(item.code)}
                    onChange={() => toggleItem(item.code)}
                    className="h-4 w-4 accent-[#058346]"
                  />
                  <span className="font-medium">{item.code}</span>
                  <span className="truncate text-gray-500 dark:text-text-colortext-gray">{item.name}</span>
                </label>
              ))}
            </>
          )}
        </div>

        <label
          htmlFor="intervene-reason"
          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-text-colortext-dark"
        >
          {t("moMonitoring.intervene.reasonLabel")}
          <span className="ml-1 text-red-500">*</span>
        </label>
        <textarea
          ref={textareaRef}
          id="intervene-reason"
          value={reason}
          onChange={(e) => { setReason(e.target.value); setError(""); }}
          placeholder={t("moMonitoring.intervene.reasonPlaceholder")}
          rows={4}
          className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#058346] focus:outline-none focus:ring-1 focus:ring-[#058346] dark:border-strokestroke-gray dark:bg-backgroundbg-white dark:text-text-colortext-black dark:placeholder:text-text-colortext-gray"
          aria-invalid={!!error}
          aria-describedby={error ? "intervene-reason-error" : undefined}
        />
        {error && (
          <p id="intervene-reason-error" className="mt-1 text-xs text-red-600 dark:text-text-colortext-red">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 dark:border-strokestroke-gray dark:bg-backgroundbg-bluish-gray dark:text-text-colortext-dark dark:hover:bg-backgroundbg-black"
          >
            {t("moMonitoring.intervene.cancelBtn")}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-lg bg-[#058346] px-4 py-2 text-sm font-semibold text-white hover:bg-[#047038] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#058346]"
          >
            {t("moMonitoring.intervene.confirmBtn")}
          </button>
        </div>
      </div>
    </div>
  );
}
