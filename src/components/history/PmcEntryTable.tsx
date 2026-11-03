"use client";

import { useI18n } from "@/i18n";
import type { StageDataMap } from "@/lib/mo-detail/types";
import DetailFields from "./DetailFields";
import ReadOnlyTable from "./ReadOnlyTable";

export default function PmcEntryTable({
  data,
}: {
  data: StageDataMap["pmcEntry"];
}) {
  const { t } = useI18n();

  return (
    <>
      <DetailFields
        fields={[
          { label: t("common.model"), value: data.model },
          {
            label: t("history.detail.columns.projectNumber"),
            value: data.projectNumber,
          },
          {
            label: t("history.detail.fields.targetDeliveryDate"),
            value: data.targetDeliveryDate,
          },
        ]}
      />
      <ReadOnlyTable
        caption={t("history.detail.captions.pmcEntry")}
        columns={[
          { label: t("history.detail.columns.number"), numeric: true },
          { label: t("common.materialCode") },
          { label: t("history.detail.columns.materialName") },
          { label: t("history.detail.columns.quantity"), numeric: true },
        ]}
        rows={data.materials.map((material, index) => ({
          id: `${material.code}-${index}`,
          cells: [
            index + 1,
            material.code,
            `${material.englishName} · ${material.chinaName}`,
            material.quantity,
          ],
        }))}
        minWidth="min-w-[560px]"
      />
    </>
  );
}
