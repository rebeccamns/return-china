
"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronRight } from "lucide-react";

import { useI18n } from "@/i18n";

type MoSummaryCardProps = {
  moNumber?: string;
  submittedAt?: string;
  returnId?: string;
  model?: string;
  wo?: string;
  scannedCount?: number;
  totalCartons?: number;
  showScanProgress?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  onCreatePackingList?: () => void;
  showCreateButton?: boolean;
};

export default function MoSummaryCard({
  moNumber = "MO-321654987",
  submittedAt = "2026-09-02 09:05",
  returnId = "RC-20260831-002",
  model = "Latte-M",
  wo = "ABC-XY12400YZ",
  scannedCount = 0,
  totalCartons = 6,
  showScanProgress = false,
  defaultExpanded = false,
  onExpandedChange,
  onCreatePackingList,
  showCreateButton = false,
}: MoSummaryCardProps) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(defaultExpanded);

  const progress =
    totalCartons > 0
      ? Math.min(100, Math.round((scannedCount / totalCartons) * 100))
      : 0;

  const toggleExpanded = () => {
    const next = !expanded;

    setExpanded(next);
    onExpandedChange?.(next);
  };

  return (
    <section className="w-full rounded-2xl border border-strokestroke-gray bg-backgroundbg-white shadow-none">
      <button
        type="button"
        onClick={toggleExpanded}
        aria-expanded={expanded}
        className="flex min-h-[60px] w-full items-center justify-between gap-3 p-4 text-left transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryprimary-green"
      >
        <div className="min-w-0">
          <span className="block break-words text-[16px] font-semibold leading-6 text-text-colortext-black">
            {moNumber}
          </span>

          <p className="mt-0.5 text-[12px] font-medium leading-4 text-text-colortext-gray">
            {t("common.submittedAt", { date: submittedAt })}
          </p>
        </div>

        {expanded ? (
          <ChevronDown className="h-5 w-5 shrink-0 text-text-colortext-gray" />
        ) : (
          <ChevronRight className="h-5 w-5 shrink-0 text-text-colortext-gray" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4">
          <dl className="grid grid-cols-2 gap-4 border-t border-strokestroke-gray pt-4">
            <div className="flex min-w-0 flex-col gap-1">
              <dt className="text-[12px] font-medium leading-4 text-text-colortext-dark">
                {t("common.returnId")}
              </dt>
              <dd className="break-words text-[15px] font-medium leading-5 text-text-colortext-black">
                {returnId}
              </dd>
            </div>

            <div className="flex min-w-0 flex-col gap-1">
              <dt className="text-[12px] font-medium leading-4 text-text-colortext-dark">
                {t("common.model")}
              </dt>
              <dd className="break-words text-[15px] font-medium leading-5 text-text-colortext-black">
                {model}
              </dd>
            </div>

            <div className="col-span-2 flex min-w-0 flex-col gap-1">
              <dt className="text-[12px] font-medium leading-4 text-text-colortext-dark">
                {t("common.wo")}
              </dt>
              <dd className="break-words text-[15px] font-semibold leading-5 text-text-colortext-black">
                {wo}
              </dd>
            </div>
          </dl>
        </div>
      )}

      {showScanProgress && (
        <div className="px-4 pb-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-[12px] font-medium leading-4 text-text-colortext-gray">
              {t("staffReturnSticker.stickersScanned", { scanned: scannedCount, total: totalCartons })}
            </span>
            <span className="text-[12px] font-medium leading-4 text-text-colortext-gray">
              {progress}%
            </span>
          </div>

          <div
            role="progressbar"
            aria-label={t("staffReturnSticker.scanProgressLabel")}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            className="h-2 overflow-hidden rounded-full bg-backgroundbg-gray"
          >
            <div
              className="h-full rounded-full bg-primaryprimary-green transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {totalCartons > 0 && scannedCount >= totalCartons && (
            <div className="mt-3 flex items-center gap-2 text-[13px] font-medium leading-[18px] text-primaryprimary-green">
              <Check className="h-4 w-4" />
              {t("staffReturnSticker.allScanned")}
            </div>
          )}
        </div>
      )}

      {showCreateButton && (
        <div className="px-4 pb-4">
          <button
            type="button"
            onClick={onCreatePackingList}
            className="h-12 w-full rounded-[14px] bg-[linear-gradient(0deg,rgba(11,89,52,1)_0%,rgba(5,131,70,1)_100%)] px-4 text-[15px] font-semibold text-white shadow-none transition active:scale-[0.98] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryprimary-green"
          >
            {t("staffReturn.createPackingList")}
          </button>
        </div>
      )}
    </section>
  );
}
