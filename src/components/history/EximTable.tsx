"use client";

import { useI18n } from "@/i18n";
import type { StageDataMap } from "@/lib/mo-detail/types";
import DetailFields from "./DetailFields";
import PhotoGroup from "./PhotoGroup";
import ReadOnlyTable from "./ReadOnlyTable";

export default function EximTable({
  data,
}: {
  data: StageDataMap["exim"];
}) {
  const { t } = useI18n();

  return (
    <>
      <DetailFields
        fields={[
          { label: t("common.model"), value: data.model },
          { label: t("common.brand"), value: data.brand },
        ]}
      />
      <ReadOnlyTable
        caption={t("history.detail.captions.exim")}
        columns={[
          { label: t("common.materialCode") },
          { label: t("history.detail.columns.materialName") },
          { label: t("history.detail.columns.quantity"), numeric: true },
          {
            label: t("history.detail.columns.singleNetWeight"),
            numeric: true,
          },
          { label: t("history.detail.columns.netWeight"), numeric: true },
          { label: t("history.detail.columns.grossWeight"), numeric: true },
          { label: t("history.detail.columns.volume") },
          { label: t("history.detail.columns.photos") },
          { label: t("history.detail.columns.upnBarcode") },
        ]}
        rows={data.materials.map((material, index) => ({
          id: `${material.code}-${index}`,
          cells: [
            material.code,
            `${material.englishName} · ${material.chinaName}`,
            material.quantity,
            material.singleNetWeight,
            material.netWeight.toFixed(3),
            material.grossWeight.toFixed(3),
            material.volume,
            <PhotoGroup
              key={`photos-${material.code}-${index}`}
              photos={material.photos}
            />,
            material.upnBarcode || "—",
          ],
        }))}
        minWidth="min-w-[1120px]"
      />
    </>
  );
}
