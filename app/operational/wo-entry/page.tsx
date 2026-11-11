"use client";

import * as React from "react";
import { useState } from "react";
import { Minus, Plus, Search, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import { DEMO, demoMoNumber } from "@/lib/demo-data";
import SubmitFlowDialog, { type SubmitStep } from "../_components/SubmitFlowDialog";

const nestedHeadClass =
  "bg-[#F8F8F8] px-3 text-xs font-semibold text-slate-700";

type Material = {
  code: string;
  englishName: string;
  chinaName: string;
  qty: string;
  category: "Wait repair" | "Idle OK";
  transportation: "Air" | "Sea";
  locator: string;
  projectCode: string;
};

type WoRow = {
  id: string;
  code: string;
  model: string;
  iqcStatus: "Passed" | "Failed";
  materials: Material[];
};

type IqcFilter = "All" | "Passed" | "Failed";

type RemovableFileInputProps = {
  name: string;
  ariaLabel: string;
  accept: string;
  removeLabel: string;
};

function RemovableFileInput({
  name,
  ariaLabel,
  accept,
  removeLabel,
}: RemovableFileInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [hasFile, setHasFile] = useState(false);

  function removeFile() {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setHasFile(false);
  }

  return (
    <div className="flex min-w-0 items-center gap-1">
      <Input
        ref={inputRef}
        aria-label={ariaLabel}
        name={name}
        type="file"
        accept={accept}
        onChange={(event) =>
          setHasFile(Boolean(event.currentTarget.files?.length))
        }
        className=" min-w-0 flex-1 rounded-md border-strokestroke-gray px-1.5 py-1 text-[11px] file:mr-1.5 file:rounded file:border-0 file:bg-[#F3F4F6] file:px-1.5 file:py-1 file:text-[11px] file:font-medium"
      />
      {hasFile && (
        <button
          type="button"
          aria-label={removeLabel}
          title={removeLabel}
          onClick={removeFile}
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[#666666] hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

const initialMaterials: Material[] = [
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

// TODO: replace with real data from your API once it exists
const initialRows: WoRow[] = [
  {
    id: "wo-1",
    code: demoMoNumber(0),
    model: DEMO.model,
    iqcStatus: "Passed",
    materials: initialMaterials,
  },
  {
    id: "wo-2",
    code: demoMoNumber(1),
    model: DEMO.model,
    iqcStatus: "Passed",
    materials: initialMaterials,
  },
  {
    id: "wo-3",
    code: demoMoNumber(2),
    model: DEMO.model,
    iqcStatus: "Passed",
    materials: initialMaterials,
  },
];

export default function WoEntryPage() {
  const { t } = useI18n();
  const [rows, setRows] = useState<WoRow[]>(initialRows);
  const [woValues, setWoValues] = useState<Record<string, string>>({
    "wo-1": DEMO.workOrder,
    "wo-2": DEMO.workOrder,
    "wo-3": DEMO.workOrder,
  });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [submitStep, setSubmitStep] = useState<SubmitStep>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [listSearch, setListSearch] = useState("");
  const [iqcFilter, setIqcFilter] = useState<IqcFilter>("All");

  const filteredRows = rows.filter((row) => {
    if (iqcFilter !== "All" && row.iqcStatus !== iqcFilter) return false;
    const query = listSearch.trim().toLowerCase();
    if (!query) return true;

    const searchableText = [
      row.code,
      row.model,
      row.iqcStatus,
      woValues[row.id] ?? "",
      ...row.materials.flatMap((material) => [
        material.code,
        material.englishName,
        material.chinaName,
      ]),
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(query);
  });

  function updateWo(id: string, value: string) {
    setWoValues((prev) => ({ ...prev, [id]: value }));
  }

  function submitWo(id: string) {
    if (!woValues[id]?.trim()) return;
    setPendingId(id);
    setSubmitStep("confirm");
  }

  function confirmSubmitWo() {
    // TODO: send { moId: pendingId, wo: woValues[pendingId] } to your API here
    if (pendingId) {
      setRows((currentRows) => currentRows.filter((row) => row.id !== pendingId));
      setWoValues((currentValues) => {
        const nextValues = { ...currentValues };
        delete nextValues[pendingId];
        return nextValues;
      });
      setExpandedId((currentId) => (currentId === pendingId ? null : currentId));
    }
    setSubmitStep("success");
  }

  function closeDialog() {
    setSubmitStep(null);
    setPendingId(null);
  }

  return (
    <main className="min-h-screen w-full bg-backgroundbg-gray">
      <SubmitFlowDialog
        step={submitStep}
        confirmTitle={t("submitFlow.woConfirmTitle")}
        confirmDescription={t("submitFlow.woConfirmDescription", {
          wo: pendingId ? (woValues[pendingId] ?? "").trim() : "",
          id: pendingId ?? "",
        })}
        successTitle={t("submitFlow.woSuccessTitle")}
        successDescription={t("submitFlow.woSuccessDescription")}
        onConfirm={confirmSubmitWo}
        onClose={closeDialog}
      />
      <Sidebar />
      <div className="flex min-h-screen flex-col pl-[255px]">
        <TopBar />

        <div className="mt-[52px] w-full px-[18px] py-5">
          <nav className="mb-4 flex items-center gap-2 text-xs">
            <span className="text-text-colortext-gray">{t("woEntry.breadcrumbSection")}</span>
            <span className="text-[#B5B5B3]">›</span>
            <span className="font-medium text-text-colortext-dark">
              {t("woEntry.title")}
            </span>
          </nav>

          <h1 className="mb-4 text-lg font-semibold text-[#111111]">
            {t("woEntry.title")}
          </h1>

          <div className="overflow-hidden rounded-lg border border-strokestroke-gray bg-white">
            <div className="px-[18px] py-[18px]">
              <h2 className="text-sm font-semibold text-[#111111]">{t("woEntry.moList")}</h2>
            </div>

            <div className="border-t border-strokestroke-gray" />

            <div className="flex flex-wrap items-end gap-3 px-[18px] pt-4">
              <div className="w-full sm:w-[280px]">
                <label
                  htmlFor="wo-entry-search"
                  className="mb-1.5 block text-xs font-medium text-[#5F5F5E]"
                >
                  {t("history.searchLabel")}
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A3A3A1]" />
                  <Input
                    id="wo-entry-search"
                    value={listSearch}
                    onChange={(event) => setListSearch(event.target.value)}
                    placeholder={t("woEntry.searchPlaceholder")}
                    className="h-9 rounded-md border-strokestroke-gray pl-9 text-xs placeholder:text-[#A3A3A1]"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="wo-entry-iqc-filter"
                  className="mb-1.5 block text-xs font-medium text-[#5F5F5E]"
                >
                  {t("woEntry.iqcStatus")}
                </label>
                <select
                  id="wo-entry-iqc-filter"
                  value={iqcFilter}
                  onChange={(event) =>
                    setIqcFilter(event.target.value as IqcFilter)
                  }
                  className="h-9 w-[150px] rounded-md border border-strokestroke-gray bg-white px-3 text-xs text-[#333333]"
                >
                  <option value="All">{t("history.allStatuses")}</option>
                  <option value="Passed">{t("status.passed")}</option>
                  <option value="Failed">{t("status.failed")}</option>
                </select>
              </div>
              {(listSearch || iqcFilter !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setListSearch("");
                    setIqcFilter("All");
                  }}
                  className="h-9 text-xs font-medium text-[#046A39] hover:underline"
                >
                  {t("history.clearFilters")}
                </button>
              )}
            </div>

            <div className="px-[18px] pb-[18px] pt-4">
              <p className="mb-2 text-xs text-[#8F8F8E]">
                {t("history.showingRecords", {
                  shown: filteredRows.length,
                  total: rows.length,
                })}
              </p>
              <div className="overflow-x-auto rounded-md border border-strokestroke-gray">
                <Table className="min-w-[1400px]">
                  <TableHeader className="bg-[#F8F8F8]">
                    <TableRow className="hover:bg-[#F8F8F8]">
                      <TableHead className="w-12 px-3 text-xs" />
                      <TableHead className="min-w-[180px] px-3 text-xs">{t("common.moCode")}</TableHead>
                      <TableHead className="px-3 text-xs">{t("common.model")}</TableHead>
                      <TableHead className="px-3 text-xs">{t("woEntry.iqcStatus")}</TableHead>
                      <TableHead className="px-3 text-xs">{t("common.material")}</TableHead>
                      <TableHead className="px-3 text-xs">{t("common.wo")}</TableHead>
                      <TableHead className="min-w-[250px] px-3 text-xs">{t("woEntry.bearingCost")}</TableHead>
                      <TableHead className="w-[150px] min-w-[150px] px-2 text-xs">{t("woEntry.pdfFile")}</TableHead>
                      <TableHead className="w-[150px] min-w-[150px] px-2 text-xs">{t("woEntry.ssPicture")}</TableHead>
                      <TableHead className="w-32 px-3 text-xs" />
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredRows.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={10}
                          className="px-3 py-10 text-center text-sm text-[#5F5F5E]"
                        >
                          {rows.length === 0
                            ? t("common.noData")
                            : t("history.noMatchingRecords")}
                        </TableCell>
                      </TableRow>
                    ) : filteredRows.map((row) => {
                      const woValue = woValues[row.id] ?? "";
                      const canSubmit = woValue.trim().length > 0;
                      const isExpanded = expandedId === row.id;

                      return (
                        <React.Fragment key={row.id}>
                          <TableRow
                            key={row.id}
                            className="h-14 hover:bg-[#FAFAFA]"
                          >
                            <TableCell className="px-3 py-2">
                              <Button
                                type="button"
                                variant="outline"
                                className="h-7 w-7 p-0"
                                onClick={() =>
                                  setExpandedId(isExpanded ? null : row.id)
                                }
                                aria-label={t("common.expandRow")}
                              >
                                {isExpanded ? (
                                  <Minus className="h-3.5 w-3.5" />
                                ) : (
                                  <Plus className="h-3.5 w-3.5" />
                                )}
                              </Button>
                            </TableCell>

                            <TableCell className="px-3 py-2 text-xs font-medium text-[#111111]">
                              {row.code}
                            </TableCell>

                            <TableCell className="px-3 py-2 text-xs text-[#111111]">
                              {row.model}
                            </TableCell>

                            <TableCell className="px-3 py-2 text-xs">
                              <span
                                className={
                                  row.iqcStatus === "Passed"
                                    ? "text-[#0b5934]"
                                    : "text-red-600"
                                }
                              >
                                {row.iqcStatus === "Passed"
                                  ? t("status.passed")
                                  : t("status.failed")}
                              </span>
                            </TableCell>

                            <TableCell className="px-3 py-2 text-xs text-[#111111]">
                              {t(row.materials.length === 1 ? "woEntry.itemSingular" : "woEntry.itemPlural", { count: row.materials.length })}
                            </TableCell>

                            <TableCell className="px-3 py-2">
                              <Input
                                placeholder={t("woEntry.inputWo")}
                                value={woValue}
                                onChange={(e) =>
                                  updateWo(row.id, e.target.value)
                                }
                                className="h-9 rounded-md border-strokestroke-gray px-3 text-xs placeholder:text-[#A3A3A1]"
                              />
                            </TableCell>

                            <TableCell className="px-3 py-2">
                              <Input
                                aria-label={t("woEntry.bearingCost")}
                                name={`bearingCost-${row.id}`}
                                placeholder={t("woEntry.bearingCostPlaceholder")}
                                className="h-9 rounded-md border-strokestroke-gray px-3 text-xs placeholder:text-[#A3A3A1]"
                              />
                            </TableCell>

                            <TableCell className="w-[150px] min-w-[150px] px-2 py-2">
                              <RemovableFileInput
                                ariaLabel={t("woEntry.pdfFile")}
                                name={`pdfFile-${row.id}`}
                                accept=".pdf,application/pdf"
                                removeLabel={t("woEntry.removeFile")}
                              />
                            </TableCell>

                            <TableCell className="w-[150px] min-w-[150px] px-2 py-2">
                              <RemovableFileInput
                                ariaLabel={t("woEntry.ssPicture")}
                                name={`ssPicture-${row.id}`}
                                accept="image/*"
                                removeLabel={t("woEntry.removeFile")}
                              />
                            </TableCell>

                            <TableCell className="px-3 py-2">
                              <Button
                                type="button"
                                variant="primary"
                                disabled={!canSubmit}
                                onClick={() => submitWo(row.id)}
                                className="h-9 w-full gap-2 rounded-md px-3 text-xs font-semibold"
                              >
                                <Send className="h-3.5 w-3.5" />
                                {t("woEntry.submitWo")}
                              </Button>
                            </TableCell>
                          </TableRow>

                          {isExpanded && (
                            <TableRow
                              key={`${row.id}-materials`}
                              className="bg-white hover:bg-white"
                            >
                              <TableCell colSpan={10} className="p-0">
                                <div className="overflow-x-auto border-t border-strokestroke-gray">
                                  <Table className="min-w-[1050px]">
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
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {row.materials.map((material, i) => (
                                        <TableRow
                                          key={`${row.id}-material-${i}`}
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
                                                  ? "inline-flex rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800"
                                                  : "inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
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
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
