"use client";

import { CheckCircle2, X } from "lucide-react";

type Props = {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
  success?: boolean;
};

export default function InspectionModal({
  open,
  title = "Submit Inspection?",
  description = "All materials have been inspected. Do you want to submit the inspection results?",
  confirmLabel = "Submit",
  onCancel,
  onConfirm,
  success = false,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="iqc-modal-title"
        className="w-full max-w-[412px] rounded-t-xl border border-strokestroke-gray bg-backgroundbg-white p-5 shadow-lg sm:rounded-xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-primaryprimary-green" />
            <h2 id="iqc-modal-title" className="text-[16px] font-semibold text-text-colortext-black">
              {title}
            </h2>
          </div>
          <button type="button" onClick={onCancel} aria-label="Close dialog" className="rounded-md p-1 text-text-colortext-gray hover:bg-backgroundbg-gray">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-3 text-[14px] leading-5 text-text-colortext-gray">{description}</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button type="button" onClick={onCancel} className="h-11 rounded-md border border-strokestroke-gray bg-white text-[14px] font-semibold text-text-colortext-dark hover:bg-backgroundbg-gray">
            {success ? "Close" : "Cancel"}
          </button>
          {!success && (
            <button type="button" onClick={onConfirm} className="h-11 rounded-md bg-[linear-gradient(0deg,rgba(11,89,52,1)_0%,rgba(5,131,70,1)_100%)] text-[14px] font-semibold text-white hover:opacity-90">
              {confirmLabel}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
