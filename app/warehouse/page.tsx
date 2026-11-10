"use client";

import * as React from "react";
import { useState } from "react";
import {
  CheckCircle2,
  ClipboardList,
  Minus,
  Plus,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import { useI18n } from "@/i18n";
import { DEMO, demoMoNumber } from "@/lib/demo-data";

type WarehouseMaterial = {
  id: string;
  code: string;
  englishName: string;
  chinaName: string;
  qty: string;
  category: "Wait repair" | "Idle OK";
  transportation: "Air" | "Sea";
  locator: string;
  projectCode: string;
  ready: boolean;
};

type WarehouseMo = {
  id: string;
  moCode: string;
  model: string;
  iqcStatus: "Passed" | "Failed";
  wo: string;
  bearingCost: string;
  materials: WarehouseMaterial[];
};

const materialTemplates: Omit<WarehouseMaterial, "id" | "ready">[] = [
  {
    code: DEMO.materialCodes.batteryCover,
    englishName: "Battery cover Lychee F4",
    chinaName: "电池盖组件 AC175 绿",
    qty: "5",
    category: "Wait repair",
    transportation: "Air",
    locator: "110100",
    projectCode: DEMO.projectCode,
  },
  {
    code: DEMO.materialCodes.displayPanel,
    englishName: "Display Panel Lychee F4",
    chinaName: "显示屏面板",
    qty: "10",
    category: "Idle OK",
    transportation: "Sea",
    locator: "110101",
    projectCode: DEMO.projectCode,
  },
  {
    code: DEMO.materialCodes.cameraModule,
    englishName: "Camera Module Lychee F4",
    chinaName: "相机模组",
    qty: "7",
    category: "Idle OK",
    transportation: "Air",
    locator: "110102",
    projectCode: DEMO.projectCode,
  },
  {
    code: DEMO.materialCodes.cameraModule,
    englishName: "Camera Module Lychee F4",
    chinaName: "相机模组",
    qty: "7",
    category: "Wait repair",
    transportation: "Sea",
    locator: "110103",
    projectCode: DEMO.projectCode,
  },
  {
    code: DEMO.materialCodes.displayPanel,
    englishName: "Display Panel Lychee F4",
    chinaName: "显示屏面板",
    qty: "10",
    category: "Idle OK",
    transportation: "Air",
    locator: "110104",
    projectCode: DEMO.projectCode,
  },
];

function createMaterials(moId: string): WarehouseMaterial[] {
  return materialTemplates.map((material, index) => ({
    ...material,
    id: `${moId}-material-${index + 1}`,
    ready: false,
  }));
}

const initialMos: WarehouseMo[] = [
  {
    id: "warehouse-mo-1",
    moCode: demoMoNumber(0),
    model: DEMO.model,
    iqcStatus: "Passed",
    wo: DEMO.workOrder,
    bearingCost:
      "集成交付部 · Integrated Delivery Department · 314156 · 王晓亮 (Leon)",
    materials: createMaterials("warehouse-mo-1"),
  },
  {
    id: "warehouse-mo-2",
    moCode: demoMoNumber(1),
    model: DEMO.model,
    iqcStatus: "Passed",
    wo: DEMO.workOrder,
    bearingCost:
      "集成交付部 · Integrated Delivery Department · 314156 · 王晓亮 (Leon)",
    materials: createMaterials("warehouse-mo-2"),
  },
  {
    id: "warehouse-mo-3",
    moCode: demoMoNumber(2),
    model: DEMO.model,
    iqcStatus: "Passed",
    wo: DEMO.workOrder,
    bearingCost:
      "集成交付部 · Integrated Delivery Department · 314156 · 王晓亮 (Leon)",
    materials: createMaterials("warehouse-mo-3"),
  },
];

const nestedHeadClass =
  "whitespace-nowrap bg-[#F8F8F8] px-3 text-xs font-semibold text-slate-700";

export default function WarehousePage() {
  const { t } = useI18n();
  const [mos, setMos] = useState(initialMos);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function toggleMaterialReady(
    moId: string,
    materialId: string,
    ready: boolean,
  ) {
    setMos((current) =>
      current.map((mo) =>
        mo.id === moId
          ? {
              ...mo,
              materials: mo.materials.map((material) =>
                material.id === materialId
                  ? { ...material, ready }
                  : material,
              ),
            }
          : mo,
      ),
    );
    setNotice(null);
  }

  function submitMo(moId: string) {
    const mo = mos.find((item) => item.id === moId);
    if (!mo || !mo.materials.length || !mo.materials.every((item) => item.ready)) {
      return;
    }

    setMos((current) => current.filter((item) => item.id !== moId));
    setExpandedId((current) => (current === moId ? null : current));
    setNotice(t("warehouse.submitSuccess", { code: mo.moCode }));
  }

  return (
    <main className="min-h-screen w-full bg-backgroundbg-gray">
      <Sidebar variant="warehouse" />
      <div className="flex min-h-screen flex-col pl-[255px]">
        <TopBar />

        <div className="mt-[52px] w-full px-[18px] py-5">
          <nav className="mb-4 text-xs text-text-colortext-gray">
            {t("navigation.moList")}
          </nav>

          <div className="mb-5">
            <h1 className="text-lg font-semibold text-[#111111]">
              {t("warehouse.title")}
            </h1>
            <p className="mt-1 text-sm text-[#8F8F8E]">
              {t("warehouse.subtitle")}
            </p>
          </div>

          {notice && (
            <div
              role="status"
              className="mb-4 flex items-center gap-2 rounded-lg border border-[#B7DEC4] bg-[#EAF6EE] px-4 py-3 text-xs text-[#0b5934]"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{notice}</span>
            </div>
          )}

          <section className="overflow-hidden rounded-lg border border-strokestroke-gray bg-white">
            <div className="flex items-center gap-2 border-b border-strokestroke-gray px-[18px] py-4">
              <ClipboardList className="h-4 w-4 text-[#0B5934]" />
              <h2 className="text-sm font-semibold text-[#111111]">
                {t("warehouse.title")}
              </h2>
            </div>

            <div className="p-[18px]">
              <div className="overflow-x-auto rounded-md border border-strokestroke-gray">
                <Table className="min-w-[1100px]">
                  <TableHeader className="bg-[#F8F8F8]">
                    <TableRow className="hover:bg-[#F8F8F8]">
                      <TableHead className="w-12 px-3 text-xs" />
                      <TableHead className="min-w-[180px] px-3 text-xs">
                        {t("common.moCode")}
                      </TableHead>
                      <TableHead className="min-w-[110px] px-3 text-xs">
                        {t("common.model")}
                      </TableHead>
                      <TableHead className="min-w-[100px] px-3 text-xs">
                        {t("woEntry.iqcStatus")}
                      </TableHead>
                      <TableHead className="min-w-[120px] px-3 text-xs">
                        {t("common.material")}
                      </TableHead>
                      <TableHead className="min-w-[170px] px-3 text-xs">
                        {t("common.wo")}
                      </TableHead>
                      <TableHead className="min-w-[240px] px-3 text-xs">
                        {t("woEntry.bearingCost")}
                      </TableHead>
                      <TableHead className="w-32 px-3 text-xs">
                        {t("warehouse.submit")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {mos.map((mo) => {
                      const readyCount = mo.materials.filter(
                        (material) => material.ready,
                      ).length;
                      const allReady =
                        mo.materials.length > 0 &&
                        readyCount === mo.materials.length;
                      const isExpanded = expandedId === mo.id;

                      return (
                        <React.Fragment key={mo.id}>
                          <TableRow className="h-14 hover:bg-[#FAFAFA]">
                            <TableCell className="px-3 py-2">
                              <Button
                                type="button"
                                variant="outline"
                                className="h-7 w-7 p-0"
                                onClick={() =>
                                  setExpandedId(isExpanded ? null : mo.id)
                                }
                                aria-expanded={isExpanded}
                                aria-label={
                                  isExpanded
                                    ? t("common.collapseRow")
                                    : t("common.expandRow")
                                }
                              >
                                {isExpanded ? (
                                  <Minus className="h-3.5 w-3.5" />
                                ) : (
                                  <Plus className="h-3.5 w-3.5" />
                                )}
                              </Button>
                            </TableCell>
                            <TableCell className="px-3 py-2 text-xs font-medium text-[#111111]">
                              {mo.moCode}
                            </TableCell>
                            <TableCell className="px-3 py-2 text-xs text-[#111111]">
                              {mo.model}
                            </TableCell>
                            <TableCell className="px-3 py-2 text-xs">
                              <span
                                className={
                                  mo.iqcStatus === "Passed"
                                    ? "text-[#0b5934]"
                                    : "text-red-600"
                                }
                              >
                                {mo.iqcStatus === "Passed"
                                  ? t("status.passed")
                                  : t("status.failed")}
                              </span>
                            </TableCell>
                            <TableCell className="px-3 py-2 text-xs">
                              <span>
                                {t(
                                  mo.materials.length === 1
                                    ? "common.materialSingular"
                                    : "common.materialPlural",
                                  { count: mo.materials.length },
                                )}
                              </span>
                              <span className="mt-1 block text-[11px] text-[#777777]">
                                {t("warehouse.readyCount", {
                                  ready: readyCount,
                                  total: mo.materials.length,
                                })}
                              </span>
                            </TableCell>
                            <TableCell className="px-3 py-2 text-xs text-[#111111]">
                              {mo.wo}
                            </TableCell>
                            <TableCell
                              className="max-w-[240px] px-3 py-2 text-xs text-[#111111]"
                              title={mo.bearingCost}
                            >
                              <span className="block truncate">
                                {mo.bearingCost}
                              </span>
                            </TableCell>
                            <TableCell className="px-3 py-2">
                              <Button
                                type="button"
                                variant="primary"
                                disabled={!allReady}
                                onClick={() => submitMo(mo.id)}
                                className="h-9 w-full gap-2 rounded-md px-3 text-xs font-semibold"
                              >
                                <Send className="h-3.5 w-3.5" />
                                {t("warehouse.submit")}
                              </Button>
                            </TableCell>
                          </TableRow>

                          {isExpanded && (
                            <TableRow className="bg-white hover:bg-white">
                              <TableCell colSpan={8} className="p-0">
                                <div className="overflow-x-auto border-t border-strokestroke-gray">
                                  <Table className="min-w-[1150px]">
                                    <TableHeader className="bg-[#F8F8F8]">
                                      <TableRow className="hover:bg-[#F8F8F8]">
                                        <TableHead className={nestedHeadClass}>
                                          {t("common.materialCode")}
                                        </TableHead>
                                        <TableHead className={nestedHeadClass}>
                                          {t("common.englishName")}
                                        </TableHead>
                                        <TableHead className={nestedHeadClass}>
                                          {t("common.chinaName")}
                                        </TableHead>
                                        <TableHead className={nestedHeadClass}>
                                          {t("common.qtyPcs")}
                                        </TableHead>
                                        <TableHead className={nestedHeadClass}>
                                          {t("common.category")}
                                        </TableHead>
                                        <TableHead className={nestedHeadClass}>
                                          {t("common.transportation")}
                                        </TableHead>
                                        <TableHead className={nestedHeadClass}>
                                          {t("common.locator")}
                                        </TableHead>
                                        <TableHead className={nestedHeadClass}>
                                          {t("common.projectCode")}
                                        </TableHead>
                                        <TableHead className={nestedHeadClass}>
                                          {t("warehouse.ready")}
                                        </TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {mo.materials.map((material) => (
                                        <TableRow
                                          key={material.id}
                                          className="bg-white hover:bg-white"
                                        >
                                          <TableCell className="text-xs">
                                            {material.code}
                                          </TableCell>
                                          <TableCell className="text-xs">
                                            {material.englishName}
                                          </TableCell>
                                          <TableCell className="text-xs">
                                            {material.chinaName}
                                          </TableCell>
                                          <TableCell className="text-xs">
                                            {material.qty}
                                          </TableCell>
                                          <TableCell>
                                            <span
                                              className={
                                                material.category === "Wait repair"
                                                  ? "inline-flex whitespace-nowrap rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800"
                                                  : "inline-flex whitespace-nowrap rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
                                              }
                                            >
                                              {material.category === "Wait repair"
                                                ? t("common.waitRepair")
                                                : t("common.idleOk")}
                                            </span>
                                          </TableCell>
                                          <TableCell className="text-xs">
                                            {material.transportation === "Air"
                                              ? t("common.air")
                                              : t("common.sea")}
                                          </TableCell>
                                          <TableCell className="text-xs">
                                            {material.locator}
                                          </TableCell>
                                          <TableCell className="text-xs">
                                            {material.projectCode}
                                          </TableCell>
                                          <TableCell>
                                            <div className="flex items-center gap-2 text-xs">
                                              <Checkbox
                                                checked={material.ready}
                                                onCheckedChange={(checked) =>
                                                  toggleMaterialReady(
                                                    mo.id,
                                                    material.id,
                                                    checked === true,
                                                  )
                                                }
                                                aria-label={t(
                                                  "warehouse.readyForMaterial",
                                                  { material: material.code },
                                                )}
                                              />
                                              <span>{t("warehouse.ready")}</span>
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}

                    {mos.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="py-12 text-center text-sm text-[#777777]"
                        >
                          {t("warehouse.noPendingMos")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
