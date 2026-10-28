"use client";

import { useEffect, useState } from "react";
import { Check, ScanLine, X } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sticker-scan-title"
        className="w-full max-w-[380px] rounded-2xl bg-white p-5 shadow-xl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#E6F4EA]">
              <ScanLine className="h-5 w-5 text-[#075D32]" />
            </div>
            <h2 id="sticker-scan-title" className="text-lg font-semibold">
              {t("staffReturnSticker.scanModal.title")}
            </h2>
            <p className="mt-1 text-sm text-[#777777]">
              {t("staffReturnSticker.scanModal.cartonLabel", { code: carton.code })}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("staffReturnSticker.scanModal.closeDialog")}
            className="rounded-md p-1 text-[#8F8F8E] hover:bg-[#F5F5F5]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm leading-6 text-[#666666]">
          {t("staffReturnSticker.scanModal.description")}
        </p>

        <label
          htmlFor="carton-sticker-code"
          className="mb-1.5 mt-5 block text-sm font-medium text-[#444444]"
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
          className="h-11 w-full rounded-lg border border-[#D5D5D3] bg-white px-3 text-sm outline-none focus:border-[#007A3D] focus:ring-2 focus:ring-[#007A3D]/15"
        />

        {error && (
          <p role="alert" className="mt-2 text-xs leading-5 text-red-600">
            {error}
          </p>
        )}

        <div className="mt-4 flex items-start gap-2 rounded-lg bg-[#F6F8F6] p-3">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#007A3D]" />
          <p className="text-xs leading-5 text-[#666666]">
            {t("staffReturnSticker.scanModal.prototypeNote")}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-lg border border-[#DDDDDD] text-sm font-medium text-[#444444] hover:bg-[#F8F8F8]"
          >
            {t("common.cancel")}
          </button>
          <button
            type="button"
            onClick={verifySticker}
            className="h-11 rounded-lg bg-[#007A3D] text-sm font-semibold text-white hover:bg-[#006532]"
          >
            {t("staffReturnSticker.scanModal.verify")}
          </button>
        </div>
      </div>
    </div>
  );
}
