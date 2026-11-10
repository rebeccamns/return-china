"use client";

import { ChevronRight } from "lucide-react";

import { useI18n } from "@/i18n";

type MoInspectionCardProps = {
  moNumber: string;
  submittedAt: string;
  returnId: string;
  model: string;
  inspectedCount: number;
  totalMaterials: number;
  progressPercent: number;
  onClick: () => void;
};

export default function MoInspectionCard({
  moNumber,
  submittedAt,
  returnId,
  model,
  inspectedCount,
  totalMaterials,
  progressPercent,
  onClick,
}: MoInspectionCardProps) {
  const { t } = useI18n();

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border border-strokestroke-gray bg-backgroundbg-white p-4 max-md:p-3.5 text-left transition active:bg-backgroundbg-gray"
    >
      {/* MO header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-[16px] max-md:text-heading font-semibold leading-6 text-text-colortext-black">
            {moNumber}
          </h2>

          <p className="mt-0.5 text-[12px] max-md:text-caption leading-4 text-text-colortext-gray">
            {t("common.submittedAt", { date: submittedAt })}
          </p>
        </div>

        <ChevronRight
          className="mt-0.5 h-5 w-5 shrink-0 text-[#C4C4C4]"
          strokeWidth={2}
        />
      </div>

      {/* MO information */}
      <dl className="mt-4 max-md:mt-3 grid grid-cols-2 gap-4 max-md:gap-3">
        <div>
          <dt className="text-[12px] max-md:text-caption leading-4 text-text-colortext-gray">
            {t("common.returnId")}
          </dt>
          <dd className="mt-1 break-words text-[15px] max-md:text-body font-medium max-md:font-normal leading-5 text-text-colortext-black">
            {returnId}
          </dd>
        </div>

        <div>
          <dt className="text-[12px] max-md:text-caption leading-4 text-text-colortext-gray">
            {t("common.model")}
          </dt>
          <dd className="mt-1 text-[15px] max-md:text-body font-medium max-md:font-normal leading-5 text-text-colortext-black">
            {model}
          </dd>
        </div>
      </dl>

      {/* Progress */}
      <div className="mt-4 max-md:mt-3 rounded-xl bg-slate-50 p-3 max-md:p-3.5">
        <div className="flex items-center justify-between">
          <p className="text-[13px] max-md:text-secondary leading-[18px] text-text-colortext-gray">
            {t("iqc.materialInspected", {
              inspected: inspectedCount,
              total: totalMaterials,
            })}
          </p>

          <p className="text-[13px] max-md:text-secondary font-semibold leading-[18px] text-text-colortext-black">
            {progressPercent}%
          </p>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E6E6E6]">
          <div
            className="h-full rounded-full bg-[#008348] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </button>
  );
}