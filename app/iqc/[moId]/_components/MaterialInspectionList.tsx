"use client";

import { Check, ChevronRight, Clock3 } from "lucide-react";

import StickyActionBar, {
  primaryButton,
} from "@/components/layout/StickyActionBar";
import { useI18n } from "@/i18n";

import type { IQCMaterial } from "./iqc-types";

type Props = {
  materials: IQCMaterial[];
  onSelectMaterial: (material: IQCMaterial) => void;
  onSubmit: () => void;
  submitted: boolean;
};

export default function MaterialInspectionList({
  materials,
  onSelectMaterial,
  onSubmit,
  submitted,
}: Props) {
  const { t } = useI18n();

  const inspectedCount = materials.filter((m) => m.status !== null).length;
  const total = materials.length;
  const progress = total ? Math.round((inspectedCount / total) * 100) : 0;
  const allInspected = total > 0 && inspectedCount === total;

  return (
    <div>
      {/* Progress */}
      <section className="rounded-2xl border border-strokestroke-gray bg-backgroundbg-white p-4 max-md:p-3.5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[13px] max-md:text-secondary leading-[18px] text-text-colortext-gray">
            {t("iqc.materialInspected", { inspected: inspectedCount, total })}
          </p>
          <p className="text-[13px] max-md:text-secondary font-semibold leading-[18px] text-text-colortext-black">
            {progress}%
          </p>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E6E6E6]">
          <div
            className="h-full rounded-full bg-[#008348] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      {/* Material list */}
      <div className="mb-3 max-md:mb-2 mt-5 max-md:mt-3 flex items-center justify-between gap-2">
        <h2 className="text-[16px] max-md:text-heading font-semibold leading-6 text-text-colortext-black">
          {t("common.materialList")}
        </h2>
        <span className="text-[12px] max-md:text-caption leading-4 text-text-colortext-gray">
          {t(total === 1 ? "common.materialSingular" : "common.materialPlural", {
            count: total,
          })}
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-strokestroke-gray bg-backgroundbg-white">
        <ul className="divide-y divide-strokestroke-gray">
          {materials.map((material, index) => (
            <li key={material.id}>
              <button
                type="button"
                onClick={() => onSelectMaterial(material)}
                className="flex min-h-[60px] max-md:min-h-[52px] w-full items-center gap-3 px-4 py-2.5 max-md:px-3.5 max-md:py-2 text-left transition-colors active:bg-backgroundbg-gray"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E7F5EC] text-[13px] max-md:text-secondary font-semibold text-[#006B3C]">
                  {material.status === "PASS" ? (
                    <Check className="h-4 w-4" strokeWidth={3} />
                  ) : (
                    index + 1
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] max-md:text-body font-semibold leading-5 text-text-colortext-black">
                    {material.code}
                  </span>
                  <span className="mt-0.5 block truncate text-[13px] max-md:text-secondary leading-[18px] text-text-colortext-gray">
                    {material.englishName} {material.chinaName}
                  </span>
                </span>

                {material.status ? (
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] max-md:text-pill font-semibold leading-4 ${
                      material.status === "PASS"
                        ? "bg-[#E7F5EC] text-[#006B3C]"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {material.status === "PASS"
                      ? t("status.pass")
                      : t("status.reject")}
                  </span>
                ) : (
                  <Clock3 className="h-5 w-5 shrink-0 text-[#b08b00]" />
                )}

                <ChevronRight
                  className="h-5 w-5 shrink-0 text-[#C4C4C4]"
                  strokeWidth={2}
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {allInspected && (
        <p className="mt-4 max-md:mt-3 rounded-xl bg-[#E7F5EC] px-4 py-3 max-md:px-3.5 max-md:py-3.5 text-[13px] max-md:text-secondary leading-[18px] text-[#006B3C]">
          {t("iqc.allInspected")}
        </p>
      )}

      {/* Sticky submit (sits above the bottom nav) */}
      <StickyActionBar aboveNav>
        <button
          type="button"
          disabled={!allInspected || submitted}
          onClick={onSubmit}
          className={`${primaryButton} flex-1`}
        >
          {submitted ? t("iqc.inspectionSubmitted") : t("common.submit")}
        </button>
      </StickyActionBar>
    </div>
  );
}