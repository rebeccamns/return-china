"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useI18n } from "@/i18n";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

export default function InterveneModal({ open, onClose, onConfirm }: Props) {
  const { t } = useI18n();
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reset state and focus textarea when opened
  useEffect(() => {
    if (open) {
      setReason("");
      setError("");
      setTimeout(() => textareaRef.current?.focus(), 50);
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

  function handleConfirm() {
    if (!reason.trim()) {
      setError(t("moMonitoring.intervene.reasonRequired"));
      return;
    }
    onConfirm(reason.trim());
    setReason("");
    setError("");
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="intervene-modal-title"
    >
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label={t("common.close")}
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
        >
          <X className="h-4 w-4" />
        </button>

        <h2
          id="intervene-modal-title"
          className="mb-1 text-base font-semibold text-gray-900"
        >
          {t("moMonitoring.intervene.modalTitle")}
        </h2>
        <p className="mb-5 text-sm text-gray-500">
          {t("moMonitoring.intervene.modalDescription")}
        </p>

        <label
          htmlFor="intervene-reason"
          className="mb-1.5 block text-sm font-medium text-gray-700"
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
          className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#058346] focus:outline-none focus:ring-1 focus:ring-[#058346]"
          aria-invalid={!!error}
          aria-describedby={error ? "intervene-reason-error" : undefined}
        />
        {error && (
          <p id="intervene-reason-error" className="mt-1 text-xs text-red-600">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
          >
            {t("moMonitoring.intervene.cancelBtn")}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            {t("moMonitoring.intervene.confirmBtn")}
          </button>
        </div>
      </div>
    </div>
  );
}

