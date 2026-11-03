"use client";

import { useI18n } from "@/i18n";
import type { StageDataMap } from "@/lib/mo-detail/types";
import PhotoGroup from "./PhotoGroup";
import ReadOnlyTable from "./ReadOnlyTable";

export default function StaffReturnTable({
  data,
}: {
  data: StageDataMap["staffReturn"];
}) {
  const { t } = useI18n();
  const rows = data.cartons.flatMap((carton) =>
    carton.materials.map((material, index) => ({
      id: `${carton.code}-${material.code}-${index}`,
      carton,
      material,
    })),
  );
  const totalCartons = data.cartons.reduce(
    (total, carton) => total + carton.count,
    0,
  );
  const totalQuantity = data.cartons.reduce(
    (total, carton) =>
      total +
      carton.materials.reduce(
        (cartonTotal, material) =>
          cartonTotal + material.quantity * carton.count,
        0,
      ),
    0,
  );

  return (
    <ReadOnlyTable
      caption={t("history.detail.captions.staffReturn")}
      columns={[
        { label: t("history.detail.columns.carton") },
        { label: t("common.materialCode") },
        { label: t("history.detail.columns.materialName") },
        { label: t("history.detail.columns.quantityPerCarton"), numeric: true },
        { label: t("history.detail.columns.totalQuantity"), numeric: true },
        { label: t("history.detail.columns.singleNetWeight"), numeric: true },
        { label: t("history.detail.columns.netWeight"), numeric: true },
        { label: t("history.detail.columns.grossWeight"), numeric: true },
        { label: t("history.detail.columns.volume") },
        { label: t("history.detail.columns.photos") },
        { label: t("history.detail.columns.upnBarcode") },
      ]}
      rows={rows.map(({ carton, material, id }) => ({
        id,
        cells: [
          `${carton.code} · ${t("history.detail.totalCartons", { count: carton.count })}`,
          material.code,
          `${material.englishName} · ${material.chinaName}`,
          material.quantity,
          material.quantity * carton.count,
          material.singleNetWeight,
          material.netWeight.toFixed(3),
          material.grossWeight.toFixed(3),
          `${material.length} × ${material.width} × ${material.height}`,
          <PhotoGroup key={`photos-${id}`} photos={material.photos} />,
          material.upnBarcode || "—",
        ],
      }))}
      totalRow={{
        id: "staff-return-total",
        cells: [
          `${t("history.detail.total")} · ${t("history.detail.totalCartons", { count: totalCartons })}`,
          "",
          "",
          "",
          totalQuantity,
          "",
          "",
          "",
          "",
          "",
          "",
        ],
      }}
      minWidth="min-w-[1420px]"
    />
  );
}
