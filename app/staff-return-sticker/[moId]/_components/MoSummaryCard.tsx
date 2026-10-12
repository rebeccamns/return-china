
"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronRight } from "lucide-react";

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
    <section className="w-full rounded-lg border border-strokestroke-gray bg-backgroundbg-white shadow-none">
      <button
        type="button"
        onClick={toggleExpanded}
        aria-expanded={expanded}
        className="flex w-full items-start justify-between gap-3 p-4 text-left"
      >
        <div className="min-w-0">
          <h2 className="break-words text-[16px] font-semibold leading-[150%] text-text-colortext-black">
            {moNumber}
          </h2>

          <p className="mt-1 text-[14px] font-medium leading-[125%] text-text-colortext-gray">
            Submitted at {submittedAt}
          </p>
        </div>

        {expanded ? (
          <ChevronDown className="mt-1 h-5 w-5 shrink-0 text-text-colortext-gray" />
        ) : (
          <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-text-colortext-gray" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4">
          <dl className="grid grid-cols-2 gap-4 border-b border-strokestroke-gray pb-4">
            <div className="flex min-w-0 flex-col gap-1">
              <dt className="text-[14px] font-medium leading-[125%] text-text-colortext-dark">
                Return ID
              </dt>
              <dd className="break-words text-[16px] font-medium leading-[125%] text-text-colortext-black">
                {returnId}
              </dd>
            </div>

            <div className="flex min-w-0 flex-col gap-1">
              <dt className="text-[14px] font-medium leading-[125%] text-text-colortext-dark">
                Model
              </dt>
              <dd className="break-words text-[16px] font-medium leading-[125%] text-text-colortext-black">
                {model}
              </dd>
            </div>

            <div className="col-span-2 flex min-w-0 flex-col gap-1">
              <dt className="text-[14px] font-medium leading-[125%] text-text-colortext-dark">
                WO
              </dt>
              <dd className="break-words text-[16px] font-medium leading-[125%] text-text-colortext-black">
                {wo}
              </dd>
            </div>
          </dl>
        </div>
      )}

      {showScanProgress && (
        <div className="px-4 pb-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-[14px] font-medium leading-[125%] text-text-colortext-gray">
              {scannedCount}/{totalCartons} Carton Stickers Scanned
            </span>
            <span className="text-[14px] font-medium leading-[125%] text-text-colortext-gray">
              {progress}%
            </span>
          </div>

          <div
            role="progressbar"
            aria-label="Carton sticker scan progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            className="h-2.5 overflow-hidden rounded-full bg-[#E7E7E7]"
          >
            <div
              className="h-full rounded-full bg-primaryprimary-green transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {totalCartons > 0 && scannedCount >= totalCartons && (
            <div className="mt-3 flex items-center gap-2 text-sm font-medium text-primaryprimary-green">
              <Check className="h-4 w-4" />
              All carton stickers scanned
            </div>
          )}
        </div>
      )}

      {showCreateButton && (
        <div className="px-4 pb-4">
          <button
            type="button"
            onClick={onCreatePackingList}
            className="h-10 w-full rounded-md bg-[linear-gradient(0deg,rgba(11,89,52,1)_0%,rgba(5,131,70,1)_100%)] px-3 text-[12px] font-semibold leading-[125%] text-white shadow-none hover:opacity-90"
          >
            Create Packing List
          </button>
        </div>
      )}
    </section>
  );
}
