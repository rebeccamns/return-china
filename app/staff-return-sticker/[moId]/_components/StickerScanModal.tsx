"use client";

import { useEffect, useState } from "react";
import { Check, ScanLine, X } from "lucide-react";

import {
  primaryButton,
  secondaryButton,
} from "@/components/layout/StickyActionBar";
import { useI18n } from "@/i18n";

import type { StickerCarton } from "./StickerCartonList";

type StickerScanModalProps = {
  carton: StickerCarton;
  onClose: () => void;
  onConfirm: () => void;
};

export default function StickerScanModal({
  carton,
  onClose,
  onConfirm,
}: StickerScanModalProps) {
  const { t } = useI18n();
  const [stickerCode, setStickerCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setStickerCode("");
    setError("");
  }, [carton]);

  function verifySticker() {
    if (!stickerCode.trim()) {
      setError(t("staffReturnSticker.scanModal.errorCodeRequired"));
      return;
    }

    if (stickerCode.trim().toUpperCase() !== carton.code.toUpperCase()) {
      setError(t("staffReturnSticker.scanModal.errorCodeMismatch"));
      return;
    }

    onConfirm();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sticker-scan-title"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[380px] rounded-3xl border border-strokestroke-gray bg-backgroundbg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#E7F5EC]">
              <ScanLine className="h-4 w-4 text-[#006B3C]" />
            </div>
            <h2 id="sticker-scan-title" className="text-[16px] font-semibold leading-6 text-text-colortext-black">
              {t("staffReturnSticker.scanModal.title")}
            </h2>
            <p className="mt-1 text-[13px] leading-[18px] text-text-colortext-gray">
              {t("staffReturnSticker.scanModal.cartonLabel", { code: carton.code })}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("staffReturnSticker.scanModal.closeDialog")}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-text-colortext-gray transition active:scale-[0.98] hover:bg-backgroundbg-gray focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryprimary-green"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <p className="text-[13px] leading-[18px] text-text-colortext-dark">
          {t("staffReturnSticker.scanModal.description")}
        </p>

        <label
          htmlFor="carton-sticker-code"
          className="mb-1.5 mt-4 block text-[12px] font-medium leading-4 text-text-colortext-dark"
        >
          {t("staffReturnSticker.scanModal.codeLabel")}
        </label>
        <input
          id="carton-sticker-code"
          autoFocus
          value={stickerCode}
          onChange={(event) => {
            setStickerCode(event.target.value);
            setError("");
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") verifySticker();
          }}
          placeholder={t("staffReturnSticker.scanModal.codePlaceholder")}
          className="h-12 w-full rounded-xl border border-strokestroke-gray bg-backgroundbg-white px-3 text-[16px] text-text-colortext-black outline-none focus-visible:ring-2 focus-visible:ring-primaryprimary-green"
        />

        {error && (
          <p role="alert" className="mt-2 text-[12px] font-medium leading-4 text-text-colortext-red">
            {error}
          </p>
        )}

        {/* <div className="mt-4 flex items-start gap-2 rounded-2xl bg-[#E7F5EC] p-4">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#006B3C]" />
          <p className="text-[13px] leading-[18px] text-[#006B3C]">
            {t("staffReturnSticker.scanModal.prototypeNote")}
          </p>
        </div> */}

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className={`${secondaryButton} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryprimary-green`}
          >
            {t("common.cancel")}
          </button>
          <button
            type="button"
            onClick={verifySticker}
            className={`${primaryButton} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryprimary-green`}
          >
            {t("staffReturnSticker.scanModal.verify")}
          </button>
        </div>
      </div>
    </div>
  );
}
