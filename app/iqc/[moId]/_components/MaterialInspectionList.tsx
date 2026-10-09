"use client";

import { Check, ChevronRight, Clock3 } from "lucide-react";
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
  const inspectedCount = materials.filter((item) => item.status !== null).length;
  const total = materials.length;
  const progress = total ? Math.round((inspectedCount / total) * 100) : 0;
  const allInspected = total > 0 && inspectedCount === total;

  return (
    <section className="w-full rounded-xl border border-strokestroke-gray bg-backgroundbg-white p-4">
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-[14px] text-text-colortext-gray">
          {inspectedCount}/{total} Material inspected
        </p>
        <p className="text-[14px] text-text-colortext-gray">{progress}%</p>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-[#e6e6e6]">
        <div
          className="h-full rounded-full bg-[#008348] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mb-3 mt-6 flex items-center justify-between gap-2">
        <h2 className="text-[16px] font-semibold leading-[150%] text-text-colortext-black">
          Material List
        </h2>
        <span className="text-[12px] text-text-colortext-gray">
          {total} materials
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {materials.map((material, index) => (
          <button
            key={material.id}
            type="button"
            onClick={() => onSelectMaterial(material)}
            className="flex min-h-[76px] w-full items-center gap-3 rounded-lg border border-strokestroke-gray bg-white p-3 text-left transition-colors hover:bg-backgroundbg-gray"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E7F5EC] text-[14px] font-medium text-[#006B3C]">
              {material.status === "PASS" ? (
                <Check className="h-5 w-5" strokeWidth={2.5} />
              ) : (
                index + 1
              )}
            </span>

            <span className="min-w-0 flex-1">
              <span className="block truncate text-[16px] font-semibold leading-[125%] text-text-colortext-black">
                {material.code}
              </span>
              <span className="mt-1 block truncate text-[14px] leading-[125%] text-text-colortext-gray">
                {material.englishName} {material.chinaName}
              </span>
            </span>

            {material.status ? (
              <span
                className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${
                  material.status === "PASS"
                    ? "bg-[#E7F5EC] text-[#006B3C]"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {material.status}
              </span>
            ) : (
              <Clock3 className="h-5 w-5 shrink-0 text-[#b08b00]" />
            )}

            <ChevronRight className="h-5 w-5 shrink-0 text-[#929292]" />
          </button>
        ))}
      </div>

      {allInspected && (
        <p className="mt-4 rounded-md bg-[#E7F5EC] p-3 text-[13px] leading-5 text-[#006B3C]">
          All materials have been inspected. Review the results before submitting.
        </p>
      )}

      <button
        type="button"
        disabled={!allInspected || submitted}
        onClick={onSubmit}
        className="mt-6 h-11 w-full rounded-md bg-[linear-gradient(0deg,rgba(11,89,52,1)_0%,rgba(5,131,70,1)_100%)] text-[14px] font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:bg-none"
      >
        {submitted ? "Inspection Submitted" : "Submit"}
      </button>
    </section>
  );
}
