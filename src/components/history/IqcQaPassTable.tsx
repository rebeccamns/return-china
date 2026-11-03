"use client";

import { useI18n } from "@/i18n";
import type { StageDataMap } from "@/lib/mo-detail/types";
import ReadOnlyTable from "./ReadOnlyTable";

export default function IqcQaPassTable({
  data,
}: {
  data: StageDataMap["iqcQaPass"];
}) {
  const { t } = useI18n();
  const verifiedCount = data.cartons.filter((carton) => carton.verified).length;

  return (
    <ReadOnlyTable
      caption={t("history.detail.captions.iqcQaPass")}
      columns={[
        { label: t("history.detail.columns.carton") },
        { label: t("history.detail.columns.materialsScanned"), numeric: true },
        { label: t("history.detail.columns.upnScanned") },
        { label: t("history.detail.columns.cartonStickerScanned") },
        { label: t("history.detail.columns.verified") },
      ]}
      rows={data.cartons.map((carton) => ({
        id: carton.code,
        cells: [
          carton.code,
          `${carton.materialsScanned} / ${carton.totalMaterials}`,
          t(carton.upnScanned ? "history.detail.yes" : "history.detail.no"),
          t(
            carton.cartonStickerScanned
              ? "history.detail.yes"
              : "history.detail.no",
          ),
          t(carton.verified ? "history.detail.yes" : "history.detail.no"),
        ],
      }))}
      totalRow={{
        id: "iqc-qa-total",
        cells: [
          t("history.detail.totalCartons", { count: data.cartons.length }),
          "",
          "",
          "",
          `${verifiedCount} / ${data.cartons.length}`,
        ],
      }}
      minWidth="min-w-[840px]"
    />
  );
}
