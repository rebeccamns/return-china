"use client";

import { useState } from "react";
import { ScanLine } from "lucide-react";

import {
  primaryButton,
  secondaryButton,
} from "@/components/layout/StickyActionBar";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/i18n";

type Props = {
  title: string;
  /** Main line of the "what to scan" card (code). */
  targetTitle: string;
  /** Secondary line of the card (name). */
  targetSubtitle?: string;
  label: string;
  /** The value the scan must match. */
  expected: string;
  requiredError: string;
  mismatchError: string;
  onConfirm: () => void;
  onClose: () => void;
};

/**
 * Bottom sheet with one scan input (works with hardware scanners: Enter confirms).
 * Mount it with a `key` per target so its input state resets.
 */
export default function ScanSheet({
  title,
  targetTitle,
  targetSubtitle,
  label,
  expected,
  requiredError,
  mismatchError,
  onConfirm,
  onClose,
}: Props) {
  const { t } = useI18n();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function handleConfirm() {
    const scanned = value.trim();

    if (!scanned) {
      setError(requiredError);
      return;
    }

    if (scanned.toLowerCase() !== expected.trim().toLowerCase()) {
      setError(mismatchError);
      return;
    }

    onConfirm();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 backdrop-blur-[2px] sm:items-center sm:p-4"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="scan-sheet-title"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[412px] rounded-t-3xl bg-backgroundbg-white px-5 max-md:px-4 pt-3 shadow-[0_8px_30px_rgba(0,0,0,0.18)] sm:rounded-3xl sm:pb-5"
        style={{ paddingBottom: "max(20px, env(safe-area-inset-bottom, 0px))" }}
      >
        <div
          aria-hidden="true"
          className="mx-auto mb-4 max-md:mb-2 h-1 w-9 rounded-full bg-[#D9D9D9] sm:hidden"
        />

        <h2
          id="scan-sheet-title"
          className="text-[16px] max-md:text-heading font-semibold leading-6 text-text-colortext-black"
        >
          {title}
        </h2>

        <div className="mt-3 rounded-xl bg-slate-50 px-4 py-3 max-md:px-3.5 max-md:py-3.5">
          <p className="break-words text-[15px] max-md:text-body font-semibold leading-5 text-text-colortext-black">
            {targetTitle}
          </p>
          {targetSubtitle && (
            <p className="mt-0.5 text-[13px] max-md:text-secondary leading-[18px] text-text-colortext-gray">
              {targetSubtitle}
            </p>
          )}
        </div>

        <label
          htmlFor="scan-sheet-input"
          className="mb-2 max-md:mb-1.5 mt-4 max-md:mt-3 block text-[12px] max-md:text-caption font-medium leading-4 text-text-colortext-gray"
        >
          {label} <span className="text-red-500">*</span>
        </label>

        <div className="relative">
          <Input
            id="scan-sheet-input"
            value={value}
            autoFocus
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            onChange={(event) => {
              setValue(event.target.value);
              setError("");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleConfirm();
            }}
            placeholder={t("common.scanOrTypePlaceholder")}
            className="h-12 max-md:h-11 rounded-xl border-strokestroke-gray px-4 pr-12 text-[16px] max-md:text-field"
          />
          <ScanLine className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-colortext-gray" />
        </div>

        {error && (
          <p
            role="alert"
            className="mt-3 rounded-xl bg-red-50 px-4 py-3 max-md:px-3.5 max-md:py-3.5 text-[13px] max-md:text-secondary leading-[18px] text-red-700"
          >
            {error}
          </p>
        )}

        <div className="mt-5 max-md:mt-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleConfirm}
            className={`${primaryButton} w-full`}
          >
            {t("iqc.verify.confirmScan")}
          </button>

          <button
            type="button"
            onClick={onClose}
            className={`${secondaryButton} w-full`}
          >
            {t("common.cancel")}
          </button>
        </div>
      </section>
    </div>
  );
}
