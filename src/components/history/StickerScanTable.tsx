"use client";

import { useI18n } from "@/i18n";
import type { StageDataMap } from "@/lib/mo-detail/types";
import ReadOnlyTable from "./ReadOnlyTable";

export default function StickerScanTable({
  data,
}: {
  data: StageDataMap["staffReturnSticker"];
}) {
  const { t } = useI18n();
  const scannedCount = data.cartons.filter((carton) => carton.scanned).length;

  return (
    <ReadOnlyTable
      caption={t("history.detail.captions.staffReturnSticker")}
      columns={[
        { label: t("history.detail.columns.carton") },
        { label: t("history.detail.columns.cartonStickerScanned") },
      ]}
      rows={data.cartons.map((carton) => ({
        id: carton.code,
        cells: [
          carton.code,
          t(carton.scanned ? "history.detail.yes" : "history.detail.no"),
        ],
      }))}
      totalRow={{
        id: "sticker-scan-total",
        cells: [
          t("history.detail.totalCartons", { count: data.cartons.length }),
          `${scannedCount} / ${data.cartons.length}`,
        ],
      }}
      minWidth="min-w-[480px]"
    />
  );
}
