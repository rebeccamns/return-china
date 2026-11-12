"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useI18n } from "@/i18n";
import type { MoDetail, StageRecord } from "@/lib/mo-detail/types";

type Cell = string | number;

const COLUMN_GROUPS: { label: string; columns: string[] }[] = [
  {
    label: "Initial Data / MO",
    columns: [
      "Tanggal",
      "Kategori",
      "Transportation",
      "Deadline HK",
      "MO",
      "PDF",
      "Model",
      "Kode",
      "Nama Material – English Name",
      "Nama Material – China Name",
      "Qty",
      "Locator",
      "Project Number",
      "Kode Project",
      "WO",
      "Bearing Cost by",
    ],
  },
  {
    label: "IQC",
    columns: [
      "SS Picture",
      "Tanggal (WH SKD)",
      "Kesiapan Material",
      "Tanggal (IQC)",
      "Hasil Validasi / UPN Scan",
      "Foto UPN / Photo UPN Ori",
      "LN / L/N",
      "Date",
      "Jumlah aktual",
      "Deskripsi",
      "Result",
    ],
  },
  {
    label: "Staff Return",
    columns: [
      "Verifikasi Identitas Material / Scan UPN",
      "QA Pass",
      "Tanggal",
      "MATERIAL CODE / 物料代码",
      "Qty",
      "CARTON No. / 纸箱编号",
      "THE QUANTITY OF CARTON / 箱数",
      "SINGLE NET WEIGHT (g/PCS) / 单个净重 (g/PCS)",
      "NET WEIGHT (Kg) / 净重 (Kg)",
      "GROSS WEIGHT (Kg) / 毛重 (Kg)",
      "VOLUME (mm3) / 体积 (mm3)",
      "Photo Depan",
      "Photo Belakang",
      "Photo UPN",
      "Scan UPN",
    ],
  },
  {
    label: "Exim",
    columns: ["Tanggal", "MODEL/DIMENSION / 型号/尺寸", "BRAND / 品牌"],
  },
  {
    label: "Finish Good",
    columns: ["Tanggal", "Scan Carton Luar", "Result Packing List Validasi"],
  },
];

const DASH = "—";

function formatQty(value: number): string {
  return value.toLocaleString("en-US");
}

function buildRows(mo: MoDetail): Cell[][] {
  const pmc = mo.stages.find(
    (stage): stage is StageRecord<"pmcEntry"> => stage.stageKey === "pmcEntry",
  );
  const iqc = mo.stages.find(
    (stage): stage is StageRecord<"iqcScan"> => stage.stageKey === "iqcScan",
  );
  const openWo = mo.stages.find(
    (stage): stage is StageRecord<"pmcOpenWo"> =>
      stage.stageKey === "pmcOpenWo",
  );
  const staffReturn = mo.stages.find(
    (stage): stage is StageRecord<"staffReturn"> =>
      stage.stageKey === "staffReturn",
  );
  const exim = mo.stages.find(
    (stage): stage is StageRecord<"exim"> => stage.stageKey === "exim",
  );
  const sticker = mo.stages.find(
    (stage): stage is StageRecord<"staffReturnSticker"> =>
      stage.stageKey === "staffReturnSticker",
  );
  const qaPass = mo.stages.find(
    (stage): stage is StageRecord<"iqcQaPass"> =>
      stage.stageKey === "iqcQaPass",
  );

  const materials =
    pmc?.data?.materials ?? iqc?.data?.materials ?? openWo?.data?.materials ?? [];
  const staffReturnMaterials =
    staffReturn?.data?.cartons.flatMap((carton) => carton.materials) ?? [];
  const cartonCodes = staffReturn?.data?.cartons.map((carton) => carton.code);
  const cartonCount = staffReturn?.data?.cartons.reduce(
    (sum, carton) => sum + carton.count,
    0,
  );
  const stickerCarton = sticker?.data?.cartons[0];

  return materials.map((material) => {
    const iqcMaterial = iqc?.data?.materials.find(
      (item) => item.code === material.code,
    );
    const returnMaterial = staffReturnMaterials.find(
      (item) => item.code === material.code,
    );
    const eximMaterial = exim?.data?.materials.find(
      (item) => item.code === material.code,
    );

    return [
      // Initial Data / MO
      pmc?.timestamp ?? DASH,
      DASH,
      DASH,
      DASH,
      mo.moCode,
      DASH,
      mo.model,
      material.code,
      material.englishName,
      material.chinaName,
      formatQty(material.quantity),
      DASH,
      DASH,
      mo.projectNumber,
      openWo?.data?.workOrder ?? DASH,
      DASH,
      // IQC
      DASH,
      DASH,
      iqc?.status === "completed" ? "Ready" : DASH,
      iqc?.timestamp ?? DASH,
      iqcMaterial?.upnBarcode ?? DASH,
      DASH,
      DASH,
      DASH,
      DASH,
      "/",
      iqcMaterial ? (iqcMaterial.status === "PASS" ? "Done" : "Reject") : DASH,
      // Staff Return
      returnMaterial?.upnBarcode ?? DASH,
      qaPass?.status === "completed" ? "Done" : DASH,
      staffReturn?.timestamp ?? DASH,
      DASH,
      DASH,
      cartonCodes?.length ? cartonCodes.join(", ") : DASH,
      cartonCount ?? DASH,
      returnMaterial ? formatQty(returnMaterial.singleNetWeight) : DASH,
      returnMaterial ? formatQty(returnMaterial.netWeight) : DASH,
      returnMaterial ? formatQty(returnMaterial.grossWeight) : DASH,
      returnMaterial
        ? `${returnMaterial.length}×${returnMaterial.width}×${returnMaterial.height}`
        : DASH,
      DASH,
      DASH,
      DASH,
      returnMaterial?.upnBarcode ?? DASH,
      // Exim
      exim?.timestamp ?? DASH,
      eximMaterial?.volume ?? DASH,
      exim?.data?.brand ?? DASH,
      // Finish Good
      sticker?.timestamp ?? DASH,
      stickerCarton?.code ?? DASH,
      sticker?.status === "completed" ? "Done" : DASH,
    ];
  });
}

export default function MoExportButton({ mo }: { mo: MoDetail }) {
  const { t } = useI18n();
  const rows = buildRows(mo);
  const totalColumns = COLUMN_GROUPS.reduce(
    (sum, group) => sum + group.columns.length,
    0,
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="secondary" className="gap-2">
          <Download aria-hidden="true" className="h-4 w-4" />
          {t("history.detail.export")}
        </Button>
      </DialogTrigger>

      <DialogContent className="flex h-[92vh] max-h-[92vh] w-[96vw] max-w-[96vw] flex-col">
        <DialogHeader>
          <DialogTitle>{t("history.detail.exportTitle")}</DialogTitle>
          <DialogDescription>
            {t("history.detail.exportDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-auto rounded-md border border-strokestroke-gray">
          <Table className="min-w-max border-collapse">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {COLUMN_GROUPS.map((group) => (
                  <TableHead
                    key={group.label}
                    colSpan={group.columns.length}
                    className="sticky top-0 z-10 h-8 border-l border-white/20 px-3 text-center text-[11px] uppercase tracking-wide first:border-l-0 dark:bg-backgroundbg-black dark:text-text-colortext-black"
                  >
                    {group.label}
                  </TableHead>
                ))}
              </TableRow>
              <TableRow className="hover:bg-transparent">
                {COLUMN_GROUPS.flatMap((group) =>
                  group.columns.map((column, columnIndex) => (
                    <th
                      key={`${group.label}-${column}`}
                      className={`sticky top-8 z-10 h-9 whitespace-nowrap bg-primaryprimary-green px-3 text-left align-middle text-[11px] font-medium text-white dark:bg-backgroundbg-black dark:text-text-colortext-black ${
                        columnIndex === 0 ? "border-l border-white/20" : ""
                      }`}
                    >
                      {column}
                    </th>
                  )),
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={totalColumns}
                    className="h-20 text-center text-xs text-text-colortext-gray"
                  >
                    {t("history.detail.noData")}
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, rowIndex) => (
                  <TableRow key={rowIndex} className="hover:bg-slate-50 dark:hover:bg-backgroundbg-black">
                    {row.map((cell, cellIndex) => (
                      <TableCell
                        key={cellIndex}
                        className="h-9 whitespace-nowrap border-b border-strokestroke-gray px-3 py-2 text-xs text-text-colortext-black"
                      >
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <DialogFooter showCloseButton={false} className="items-center gap-3">
          <p className="mr-auto text-xs text-text-colortext-gray">
            {t("history.detail.exportPreviewNote")}
          </p>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              {t("common.close")}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" variant="primary" className="gap-2">
              <Download aria-hidden="true" className="h-4 w-4" />
              {t("history.detail.export")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
