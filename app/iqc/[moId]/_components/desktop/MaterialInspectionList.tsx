"use client";

import { useState } from "react";
import { Check, ChevronRight, Clock3, Package, X } from "lucide-react";

import { useI18n } from "@/i18n";

import type { UseIqcIdentityReturn } from "../../_hooks/useIqcIdentity";
import type { IQCMaterial } from "../iqc-types";
import MaterialInspectionFormModal from "./MaterialInspectionFormModal";

type Props = {
  identity: UseIqcIdentityReturn;
};

function getStatusLabel(material: IQCMaterial, t: ReturnType<typeof useI18n>["t"]) {
  if (material.status === "PASS") return t("status.pass");
  if (material.status === "REJECT") return t("status.reject");
  return t("status.notStarted");
}

export default function MaterialInspectionList({ identity }: Props) {
  const { t } = useI18n();
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(
    null,
  );
  const selectedMaterial =
    identity.materials.find((material) => material.id === selectedMaterialId) ??
    null;

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-strokestroke-gray bg-white">
        <div className="divide-y divide-strokestroke-gray">
          {identity.materials.map((material) => (
            <button
              key={material.id}
              type="button"
              onClick={() => setSelectedMaterialId(material.id)}
              className="flex min-h-[72px] w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-[#FAFCFB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primaryprimary-green"
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  material.status === "PASS"
                    ? "bg-[#EAF6EE]"
                    : material.status === "REJECT"
                      ? "bg-red-50"
                      : "bg-[#F4F4F4]"
                }`}
              >
                {material.status === "PASS" ? (
                  <Check className="h-5 w-5 text-[#0B5934]" />
                ) : material.status === "REJECT" ? (
                  <X className="h-5 w-5 text-red-600" />
                ) : (
                  <Package
                    className="h-5 w-5 text-[#737373]"
                    strokeWidth={1.7}
                  />
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-[#111111]">
                  {material.code}
                </span>
                <span className="mt-1 block truncate text-xs text-[#8F8F8E]">
                  {material.englishName} · {material.chinaName}
                </span>
              </span>

              <span className="hidden text-xs text-[#5F5F5E] sm:block">
                {material.qty} {t("common.units.pcs")}
              </span>
              <span
                className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  material.status === "PASS"
                    ? "bg-[#E7F5EC] text-[#006B3C]"
                    : material.status === "REJECT"
                      ? "bg-red-50 text-red-600"
                      : "bg-slate-100 text-slate-600"
                }`}
              >
                {material.status === "PASS" ? (
                  <Check className="h-3.5 w-3.5" />
                ) : material.status === "REJECT" ? (
                  <X className="h-3.5 w-3.5" />
                ) : (
                  <Clock3 className="h-3.5 w-3.5" />
                )}
                {getStatusLabel(material, t)}
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-[#737373]" />
              <span className="sr-only">
                {t("common.edit")} {material.code}
              </span>
            </button>
          ))}
        </div>
      </div>

      {selectedMaterial && (
        <MaterialInspectionFormModal
          key={selectedMaterial.id}
          material={selectedMaterial}
          readOnly={identity.submitted}
          onClose={() => setSelectedMaterialId(null)}
          onSave={identity.saveMaterial}
        />
      )}
    </>
  );
}
