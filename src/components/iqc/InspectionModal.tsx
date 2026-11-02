"use client";

import { CheckCircle2, ClipboardCheck } from "lucide-react";

import { primaryButton, secondaryButton } from "@/components/layout/StickyActionBar";
import { useI18n } from "@/i18n";

type Props = {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
  success?: boolean;
};

/** Bottom sheet on mobile, centered dialog from sm and up. */
export default function InspectionModal({
  open,
  title,
  description,
  confirmLabel,
  onCancel,
  onConfirm,
  success = false,
}: Props) {
  const { t } = useI18n();

  if (!open) return null;

  const resolvedTitle = title ?? t("iqc.modal.defaultTitle");
  const resolvedDescription = description ?? t("iqc.modal.defaultDescription");
  const resolvedConfirmLabel = confirmLabel ?? t("common.submit");

  const Icon = success ? CheckCircle2 : ClipboardCheck;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
      onClick={onCancel}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="iqc-modal-title"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[412px] rounded-t-3xl bg-backgroundbg-white px-5 max-md:px-4 pt-3 shadow-lg sm:rounded-3xl sm:pb-5"
        style={{ paddingBottom: "max(20px, env(safe-area-inset-bottom, 0px))" }}
      >
        {/* Grabber */}
        <div
          aria-hidden="true"
          className="mx-auto mb-4 max-md:mb-2 h-1 w-9 rounded-full bg-[#D9D9D9] sm:hidden"
        />

        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 max-md:h-12 max-md:w-12 items-center justify-center rounded-full bg-[#E7F5EC]">
            <Icon
              className="h-7 w-7 text-primaryprimary-green"
              strokeWidth={1.8}
            />
          </span>

          <h2
            id="iqc-modal-title"
            className="mt-4 max-md:mt-3 text-[18px] max-md:text-heading font-semibold leading-6 text-text-colortext-black"
          >
            {resolvedTitle}
          </h2>

          <p className="mt-1.5 text-[14px] max-md:text-secondary leading-5 text-text-colortext-gray">
            {resolvedDescription}
          </p>
        </div>

        <div className="mt-6 max-md:mt-3 flex flex-col gap-2">
          {!success && (
            <button
              type="button"
              onClick={onConfirm}
              className={`${primaryButton} w-full`}
            >
              {resolvedConfirmLabel}
            </button>
          )}

          <button
            type="button"
            onClick={onCancel}
            className={`${success ? primaryButton : secondaryButton} w-full`}
          >
            {success ? t("common.close") : t("common.cancel")}
          </button>
        </div>
      </section>
    </div>
  );
}
