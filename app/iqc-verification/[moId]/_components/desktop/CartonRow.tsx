"use client";

import { useState, type FocusEvent, type KeyboardEvent } from "react";
import { Check, ChevronDown, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/i18n";

import { matchesScan } from "../../_lib/scan-match";
import {
  type VerificationCarton,
  allMaterialsScanned,
  scannedCount,
} from "../verification-types";
import MaterialScanTable from "./MaterialScanTable";

type Props = {
  carton: VerificationCarton;
  expanded: boolean;
  onToggle: () => void;
  onScanMaterial: (cartonId: string, materialId: string) => void;
  onScanSticker: (cartonId: string) => void;
  onComplete: (cartonId: string) => void;
};

export default function CartonRow({
  carton,
  expanded,
  onToggle,
  onScanMaterial,
  onScanSticker,
  onComplete,
}: Props) {
  const { t } = useI18n();
  const [stickerValue, setStickerValue] = useState(carton.scannedSticker);
  const [stickerError, setStickerError] = useState("");

  const scanned = scannedCount(carton);
  const materialsReady = allMaterialsScanned(carton);
  const stickerScanned = carton.scannedSticker !== "";
  const panelId = `${carton.id}-verification-panel`;
  const stickerInputId = `${carton.id}-sticker-input`;

  function handleStickerBlur(event: FocusEvent<HTMLInputElement>) {
    if (!materialsReady) return;

    const value = event.currentTarget.value.trim();
    if (!value) {
      setStickerError(t("iqc.verify.errorStickerRequired"));
      return;
    }

    if (!matchesScan(value, carton.code)) {
      setStickerError(t("iqc.verify.errorStickerMismatch"));
      return;
    }

    setStickerError("");
    onScanSticker(carton.id);
  }

  function handleEnter(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    event.currentTarget.blur();
  }

  return (
    <div>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={onToggle}
        className={`flex w-full items-center gap-4 px-[18px] py-4 text-left transition-colors ${
          expanded
            ? "bg-[#F7FBF8] dark:bg-backgroundbg-black"
            : "bg-backgroundbg-white hover:bg-slate-50 dark:hover:bg-backgroundbg-black"
        }`}
      >
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
            expanded
              ? "bg-[#EAF6EE] dark:bg-backgroundbg-green"
              : "bg-[#F4F4F4] dark:bg-backgroundbg-bluish-gray"
          }`}
        >
          <Package
            className={`h-5 w-5 ${
              expanded
                ? "text-[#0B5934] dark:text-text-colortext-green"
                : "text-[#737373] dark:text-text-colortext-gray"
            }`}
            strokeWidth={1.7}
          />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-text-colortext-black">
            {carton.code}
          </span>
          <span className="mt-1 block text-xs text-text-colortext-gray">
            {t("iqc.verify.materialsCount", {
              count: carton.materials.length,
            })}
          </span>
        </span>

        <span className="shrink-0 text-xs text-text-colortext-gray">
          {t("iqc.verify.materialScanProgress", {
            scanned,
            total: carton.materials.length,
          })}
        </span>

        {carton.verified && (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E7F5EC]">
            <Check
              className="h-4 w-4 text-primaryprimary-green"
              strokeWidth={3}
            />
          </span>
        )}

        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md">
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              expanded               ? "text-[#0B5934] dark:text-text-colortext-green" : "rotate-[-90deg] text-[#737373] dark:text-text-colortext-gray"
            }`}
          />
        </span>
      </button>

      {expanded && (
        <div
          id={panelId}
          className="border-t border-strokestroke-gray bg-backgroundbg-white px-[18px] py-5"
        >
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-text-colortext-black">
                {t("iqc.verify.step1Title")}
              </p>
              <p className="mt-1 text-xs text-text-colortext-gray">
                {t("iqc.verify.desktopMaterialsHint")}
              </p>
            </div>
            <span className="inline-flex h-8 items-center rounded-full bg-backgroundbg-white px-4 text-xs">
              <span className="text-text-colortext-gray">
                {t("common.cartonSingular", { count: 1 })}
              </span>
              <span className="ml-2 font-medium text-text-colortext-black">
                {carton.code}
              </span>
            </span>
          </div>

          <MaterialScanTable
            carton={carton}
            onScanMaterial={onScanMaterial}
          />

          <div className="mt-5 flex flex-wrap items-end justify-between gap-4 rounded-lg border border-strokestroke-gray bg-[#FAFAFA] px-4 py-4 dark:bg-backgroundbg-bluish-gray">
            <div className="w-full max-w-[360px]">
              <label
                htmlFor={stickerInputId}
                className="mb-2 block text-xs font-medium text-text-colortext-gray"
              >
                {t("iqc.verify.cartonStickerLabel")}
              </label>
              <Input
                id={stickerInputId}
                value={stickerValue}
                disabled={!materialsReady}
                aria-invalid={Boolean(stickerError)}
                aria-describedby={
                  stickerError ? `${stickerInputId}-error` : undefined
                }
                onChange={(event) => {
                  setStickerValue(event.target.value);
                  setStickerError("");
                }}
                onBlur={handleStickerBlur}
                onKeyDown={handleEnter}
                placeholder={t("common.scanOrTypePlaceholder")}
                className="h-9 w-full border-strokestroke-gray bg-backgroundbg-white px-3 text-xs text-text-colortext-black placeholder:text-text-colortext-gray"
              />
              {stickerError && (
                <p
                  id={`${stickerInputId}-error`}
                  role="alert"
                  className="mt-1 text-xs leading-4 text-red-700 dark:text-red-300"
                >
                  {stickerError}
                </p>
              )}
              {!materialsReady && (
                <p className="mt-1 text-xs text-text-colortext-gray">
                  {t("iqc.verify.stickerScanGateHint")}
                </p>
              )}
              {stickerScanned && (
                <p className="mt-1 text-xs font-medium text-primaryprimary-green">
                  {t("iqc.verify.stickerScanned")}
                </p>
              )}
            </div>

            <Button
              type="button"
              variant="primary"
              disabled={!stickerScanned}
              onClick={() => onComplete(carton.id)}
              className="h-10 gap-2 rounded-md px-5 text-sm font-semibold"
            >
              <Check className="h-4 w-4" />
              {t("iqc.verify.completeCarton")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
