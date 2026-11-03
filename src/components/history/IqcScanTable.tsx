"use client";

import { useI18n } from "@/i18n";
import type { StageDataMap } from "@/lib/mo-detail/types";
import PhotoPreview from "./PhotoPreview";
import ReadOnlyTable from "./ReadOnlyTable";

export default function IqcScanTable({
  data,
}: {
  data: StageDataMap["iqcScan"];
}) {
  const { t } = useI18n();

  return (
    <ReadOnlyTable
      caption={t("history.detail.captions.iqcScan")}
      columns={[
        { label: t("history.detail.columns.number"), numeric: true },
        { label: t("common.materialCode") },
        { label: t("history.detail.columns.materialName") },
        { label: t("history.detail.columns.quantity"), numeric: true },
        { label: t("history.detail.columns.upnBarcode") },
        { label: t("history.detail.columns.upnPhoto") },
        { label: t("history.detail.columns.status") },
        { label: t("history.detail.columns.notes") },
      ]}
      rows={data.materials.map((material, index) => ({
        id: `${material.code}-${index}`,
        cells: [
          index + 1,
          material.code,
          `${material.englishName} · ${material.chinaName}`,
          material.quantity,
          material.upnBarcode || "—",
          <PhotoPreview
            key={`photo-${material.code}-${index}`}
            label={t("history.detail.fields.upnPhoto")}
            src={material.upnPhoto}
          />,
          <span
            key={`status-${material.code}-${index}`}
            className="font-semibold"
          >
            {t(material.status === "PASS" ? "status.pass" : "status.reject")}
          </span>,
          material.notes || "—",
        ],
      }))}
        minWidth="min-w-[1040px]"
    />
  );
}
