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
      className="w-full rounded-2xl border border-strokestroke-gray bg-backgroundbg-white p-4 text-left transition active:bg-backgroundbg-gray"
    >
      {/* MO header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-[16px] font-semibold leading-6 text-text-colortext-black">
            {moNumber}
          </h2>

          <p className="mt-0.5 text-[12px] leading-4 text-text-colortext-gray">
            {t("common.submittedAt", { date: submittedAt })}
          </p>
        </div>

        <ChevronRight
          className="mt-0.5 h-5 w-5 shrink-0 text-[#C4C4C4]"
          strokeWidth={2}
        />
      </div>

      {/* MO information */}
      <dl className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <dt className="text-[12px] leading-4 text-text-colortext-gray">
            {t("common.returnId")}
          </dt>
          <dd className="mt-1 break-words text-[15px] font-medium leading-5 text-text-colortext-black">
            {returnId}
          </dd>
        </div>

        <div>
          <dt className="text-[12px] leading-4 text-text-colortext-gray">
            {t("common.model")}
          </dt>
          <dd className="mt-1 text-[15px] font-medium leading-5 text-text-colortext-black">
            {model}
          </dd>
        </div>
      </dl>

      {/* Progress */}
      <div className="mt-4 rounded-xl bg-slate-50 p-3">
        <div className="flex items-center justify-between">
          <p className="text-[13px] leading-[18px] text-text-colortext-gray">
            {t("iqc.materialInspected", {
              inspected: inspectedCount,
              total: totalMaterials,
            })}
          </p>

          <p className="text-[13px] font-semibold leading-[18px] text-text-colortext-black">
            {progress}%
          </p>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E6E6E6]">
          <div
            className="h-full rounded-full bg-[#008348] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </button>
  );
}