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
  onClick: () => void;
};

export default function MoInspectionCard({
  moNumber,
  submittedAt,
  returnId,
  model,
  inspectedCount,
  totalMaterials,
  onClick,
}: MoInspectionCardProps) {
  const { t } = useI18n();
  const progress =
    totalMaterials > 0
      ? Math.round((inspectedCount / totalMaterials) * 100)
      : 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border border-strokestroke-gray bg-backgroundbg-white p-4 text-left transition-colors hover:bg-backgroundbg-gray"
    >
      {/* MO Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-semibold leading-[125%] text-text-colortext-black">
            {moNumber}
          </h2>

          <p className="mt-1 text-[14px] font-medium leading-[125%] text-text-colortext-gray">
            {t("common.submittedAt", { date: submittedAt })}
          </p>
        </div>

        <ChevronRight
          className="mt-1 h-7 w-7 shrink-0 text-text-colortext-gray"
          strokeWidth={2}
        />
      </div>

      {/* MO Information */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[14px] font-medium leading-[125%] text-text-colortext-dark">
            {t("common.returnId")}
          </p>

          <p className="text-[16px] font-medium leading-[125%] text-text-colortext-black">
            {returnId}
          </p>
        </div>

        <div>
          <p className="text-[14px] font-medium leading-[125%] text-text-colortext-dark">
            {t("common.model")}
          </p>

          <p className="mt-1 text-[16px] font-medium leading-[125%] text-text-colortext-black">
            {model}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 h-px bg-strokestroke-gray" />

      {/* Progress */}
      <div className="flex items-center justify-between">
        <p className="text-[14px] font-medium leading-[150%] text-text-colortext-gray">
          {t("iqc.materialInspected", { inspected: inspectedCount, total: totalMaterials })}
        </p>

        <p className="text-[14px] font-medium leading-[150%] text-text-colortext-gray">
          {progress}%
        </p>
      </div>

      {/* Progress bar */}
      <div className="mt-2 h-4 overflow-hidden rounded-full bg-[#E5E5E5]">
        <div
          className="h-full rounded-full bg-primaryprimary-green transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </button>
  );
}