"use client";

import { useEffect, useState } from "react";
import { ClipboardList, FileUp, Plus, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarPickerModal } from "@/components/history/CalendarPickerModal";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { DEMO } from "@/lib/demo-data";
import {
  getMaterialCodeOption,
  MATERIAL_CODE_OPTIONS,
} from "@/lib/mo-entry/material-options";
import SubmitFlowDialog, { type SubmitStep } from "../_components/SubmitFlowDialog";
import CategorySelectValue from "../_components/CategorySelectValue";
import StatusToast, {
  type StatusToastMessage,
} from "../_components/StatusToast";

type MaterialRow = {
  code: string;
  englishName: string;
  chinaName: string;
  qty: string;
  category: string;
  transportation: string;
  locator: string;
  projectCode: string;
};

const initialRows: MaterialRow[] = [
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

export default function MoEntryPage() {
  const { t } = useI18n();

  const [moNumber, setMoNumber] = useState<string>(DEMO.moNumber);
  const [model, setModel] = useState<string>(DEMO.model);
  const [projectNumber, setProjectNumber] = useState<string>(
    DEMO.projectNumber,
  );
  const [targetDeliveryDate, setTargetDeliveryDate] = useState("");
  const [rows, setRows] = useState<MaterialRow[]>([]);
  const [checkedRows, setCheckedRows] = useState<Set<number>>(new Set());
  const [statusMessage, setStatusMessage] = useState<StatusToastMessage | null>(
    null,
  );
  const [submitStep, setSubmitStep] = useState<SubmitStep>(null);

  useEffect(() => {
    if (!statusMessage) return;

    const timeoutId = window.setTimeout(() => setStatusMessage(null), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [statusMessage]);

  function updateRow(index: number, field: keyof MaterialRow, value: string) {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  }

  function handleCodeChange(index: number, code: string) {
    const match = getMaterialCodeOption(code);

    setRows((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              code,
              englishName: match?.englishName ?? row.englishName,
              chinaName: match?.chinaName ?? row.chinaName,
            }
          : row,
      ),
    );
  }

  function toggleCheck(index: number) {
    setCheckedRows((prev) => {
      const next = new Set(prev);

      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }

      return next;
    });
  }

  function deleteRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));

    setCheckedRows((prev) => {
      const next = new Set<number>();

      prev.forEach((i) => {
        if (i < index) next.add(i);
        if (i > index) next.add(i - 1);
      });

      return next;
    });
  }

  function addRow() {
    setRows((prev) => [
      ...prev,
      {
        code: "",
        englishName: "",
        chinaName: "",
        qty: "",
        category: "",
        transportation: "",
        locator: "",
        projectCode: "",
      },
    ]);
    setStatusMessage({ message: t("moEntry.rowAdded"), type: "success" });
  }

  function getDeliveryDayCount() {
    if (!targetDeliveryDate) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = new Date(`${targetDeliveryDate}T00:00:00`);

    if (Number.isNaN(target.getTime())) return null;

    return Math.round((target.getTime() - today.getTime()) / 86_400_000);
  }

  const deliveryDayCount = getDeliveryDayCount();

  function createTask() {
    if (
      !moNumber.trim() ||
      !model.trim() ||
      !projectNumber.trim() ||
      !targetDeliveryDate
    ) {
      setStatusMessage({
        message:
          "Please complete MO Number, Model, Project Number, and Target Pengiriman.",
        type: "error",
      });
      return;
    }

    if (rows.length === 0) {
      setRows(initialRows);
    }
    setStatusMessage({
      message: `Task created for MO ${moNumber.trim()} · Model ${model.trim()} · Project ${projectNumber.trim()}.`,
      type: "success",
    });
  }

  function submitMo() {
    const hasIncompleteRow = rows.some(
      (row) =>
        !row.code.trim() ||
        !row.englishName.trim() ||
        !row.chinaName.trim() ||
        !row.qty.trim(),
    );

    if (rows.length === 0 || hasIncompleteRow) {
      setStatusMessage({
        message: t("moEntry.completeAllRows"),
        type: "error",
      });
      return;
    }

    setSubmitStep("confirm");
  }

  function confirmSubmitMo() {
    // TODO: send the MO to your API here
    setStatusMessage({
      message: t(
        rows.length === 1
          ? "moEntry.moSubmittedSingular"
          : "moEntry.moSubmittedPlural",
        { count: rows.length },
      ),
      type: "success",
    });
    setRows([]);
    setCheckedRows(new Set());
    setMoNumber("");
    setModel("");
    setProjectNumber("");
    setTargetDeliveryDate("");
    setSubmitStep("success");
  }

  return (
    <main className="min-h-screen w-full bg-backgroundbg-gray">
      <SubmitFlowDialog
        step={submitStep}
        confirmTitle={t("submitFlow.moConfirmTitle")}
        confirmDescription={t("submitFlow.moConfirmDescription")}
        successTitle={t("submitFlow.moSuccessTitle")}
        successDescription={t("submitFlow.moSuccessDescription")}
        onConfirm={confirmSubmitMo}
        onClose={() => setSubmitStep(null)}
      />
      <Sidebar />

      <div className="flex min-h-screen flex-col pl-[255px]">
        <TopBar />
        <StatusToast
          message={statusMessage}
          onDismiss={() => setStatusMessage(null)}
        />

        <div className="mt-[52px] w-full px-[18px] py-5">
          <nav className="mb-4 flex items-center gap-2 text-xs">
            <span className="text-text-colortext-gray">
              {t("moEntry.breadcrumbSection")}
            </span>
            <span className="text-[#B5B5B3]">›</span>
            <span className="font-medium text-text-colortext-dark">
              {t("moEntry.title")}
            </span>
          </nav>

          <h1 className="mb-4 text-lg font-semibold text-text-colortext-black">
            {t("moEntry.title")}
          </h1>

          <div className="overflow-hidden rounded-lg border border-strokestroke-gray bg-backgroundbg-white">
            <div className="px-[18px] py-[18px]">
              <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 xl:grid-cols-[1.15fr_1fr_0.8fr_1.4fr_auto]">
                <div className="min-w-0">
                  <label className="mb-1.5 block text-xs font-medium text-text-colortext-black">
                    {t("moEntry.moNumberLabel")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder={t("moEntry.moNumberPlaceholder")}
                    value={moNumber}
                    onChange={(e) => setMoNumber(e.target.value)}
                    className="h-9 rounded-md border-strokestroke-gray px-3 text-xs placeholder:text-text-colortext-gray"
                  />
                </div>

                <div className="min-w-0">
                  <label className="mb-1.5 block text-xs font-medium text-text-colortext-black">
                    {t("moEntry.modelLabel")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder={t("moEntry.modelPlaceholder")}
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="h-9 rounded-md border-strokestroke-gray px-3 text-xs placeholder:text-text-colortext-gray"
                  />
                </div>

                <div className="min-w-0">
                  <label className="mb-1.5 block text-xs font-medium text-text-colortext-black">
                    Project Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder={DEMO.projectNumber}
                    value={projectNumber}
                    onChange={(e) => setProjectNumber(e.target.value)}
                    className="h-9 rounded-md border-strokestroke-gray px-3 text-xs placeholder:text-text-colortext-gray"
                  />
                </div>

                <div className="min-w-0">
                  <label className="mb-1.5 block text-xs font-medium text-text-colortext-black">
                    Target Pengiriman <span className="text-red-500">*</span>
                  </label>

                  {/* Keep the day count beside the date input on the same row. */}
                  <div className="flex h-9 items-center gap-2">
                    <CalendarPickerModal
                      mode="single"
                      value={targetDeliveryDate}
                      onChange={setTargetDeliveryDate}
                      ariaLabel="Target Pengiriman"
                      buttonClassName="h-9 w-[180px] shrink-0 rounded-md border-strokestroke-gray px-3 text-xs"
                    />

                    <span
                      className={`shrink-0 whitespace-nowrap text-[11px] ${
                        deliveryDayCount !== null && deliveryDayCount < 0
                          ? "text-red-600"
                          : deliveryDayCount === 0
                            ? "text-amber-600"
                            : "text-text-colortext-gray"
                      }`}
                      aria-live="polite"
                    >
                      {deliveryDayCount === null
                        ? "Lead-time reference"
                        : deliveryDayCount > 1
                          ? `${deliveryDayCount} days remaining`
                          : deliveryDayCount === 1
                            ? "1 day remaining"
                            : deliveryDayCount === 0
                              ? "Due today"
                              : `${Math.abs(deliveryDayCount)} day${
                                  Math.abs(deliveryDayCount) === 1 ? "" : "s"
                                } overdue`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-9 shrink-0 gap-2 rounded-md px-3 text-xs font-semibold"
                      >
                        <FileUp className="h-3.5 w-3.5" />
                        {t("moEntry.importFile")}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <FileUp className="mr-2 h-3.5 w-3.5" />
                        {t("moEntry.importCsvExcel")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={createTask}
                    className="h-9 shrink-0 gap-2 rounded-md px-4 text-xs font-semibold"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {t("moEntry.createTask")}
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-t border-strokestroke-gray" />

            {rows.length === 0 ? (
              <div className="flex flex-col items-center px-[18px] py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-backgroundbg-green text-text-colortext-green">
                  <ClipboardList className="h-6 w-6" />
                </div>
                <h2 className="mt-3 text-sm font-semibold text-text-colortext-black">
                  {t("moEntry.emptyTitle")}
                </h2>
                <p className="mt-1 max-w-sm text-xs text-text-colortext-gray">
                  {t("moEntry.emptyDescription")}
                </p>
              </div>
            ) : (
            <div className="px-[18px] pb-[18px] pt-4">
              <div className="mb-3">
                <h2 className="text-sm font-semibold text-text-colortext-black">
                  {t("common.materialList")}
                </h2>
              </div>

              <div className="mb-3 flex items-center justify-between gap-4">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <div className="flex h-8 max-w-full items-center rounded-full bg-backgroundbg-bluish-gray px-3 text-xs">
                    <span className="shrink-0 text-text-colortext-gray">
                      {t("common.mo")}
                    </span>
                    <span className="ml-2 truncate font-medium text-text-colortext-black">
                      {moNumber.trim() || "—"}
                    </span>
                  </div>

                  <div className="flex h-8 max-w-[220px] items-center rounded-full bg-backgroundbg-bluish-gray px-3 text-xs">
                    <span className="shrink-0 text-text-colortext-gray">
                      {t("moEntry.modelLabel")}
                    </span>
                    <span className="ml-2 truncate font-medium text-text-colortext-black">
                      {model.trim() || "—"}
                    </span>
                  </div>

                  <div className="flex h-8 max-w-[220px] items-center rounded-full bg-backgroundbg-bluish-gray px-3 text-xs">
                    <span className="shrink-0 text-text-colortext-gray">Project No.</span>
                    <span className="ml-2 truncate font-medium text-text-colortext-black">
                      {projectNumber.trim() || "—"}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-xs text-text-colortext-dark">
                    {t(
                      rows.length === 1
                        ? "common.itemSingular"
                        : "common.itemPlural",
                      { count: rows.length },
                    )}
                  </span>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addRow}
                    className="h-8 gap-1.5 rounded-md px-3 text-xs font-medium"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {t("moEntry.addNewMaterial")}
                  </Button>

                  <Button
                    type="button"
                    variant="primary"
                    onClick={submitMo}
                    className="h-8 gap-2 rounded-md px-3.5 text-xs font-semibold"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {t("moEntry.submitMo")}
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-md border border-strokestroke-gray">
                <Table className="min-w-[1450px]">
                  <TableHeader className="bg-[#F8F8F8]">
                    <TableRow className="hover:bg-backgroundbg-bluish-gray">
                      <TableHead className="w-12 px-3 text-xs" />
                      <TableHead className="px-3 text-xs">
                        {t("common.materialCode")}
                      </TableHead>
                      <TableHead className="px-3 text-xs">
                        {t("common.englishName")}
                      </TableHead>
                      <TableHead className="px-3 text-xs">
                        {t("common.chinaName")}
                      </TableHead>
                      <TableHead className="px-3 text-xs">
                        {t("common.qtyPcs")}
                      </TableHead>
                      <TableHead className="px-3 text-xs">
                        {t("common.category")}
                      </TableHead>
                      <TableHead className="px-3 text-xs">
                        {t("common.transportation")}
                      </TableHead>
                      <TableHead className="px-3 text-xs">
                        {t("common.locator")}
                      </TableHead>
                      <TableHead className="px-3 text-xs">
                        {t("common.projectCode")}
                      </TableHead>
                      <TableHead className="w-20 px-3 text-xs" />
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {rows.map((row, index) => {
                      const isChecked = checkedRows.has(index);

                      return (
                        <TableRow
                          key={index}
                          className={`h-12 ${
                            isChecked
                              ? "bg-backgroundbg-green hover:bg-backgroundbg-green"
                              : "hover:bg-backgroundbg-bluish-gray"
                          }`}
                        >
                          <TableCell className="px-3 py-2">
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={() => toggleCheck(index)}
                            />
                          </TableCell>

                          <TableCell className="px-3 py-2">
                            <Select
                              value={row.code || undefined}
                              onValueChange={(value) =>
                                handleCodeChange(index, value)
                              }
                            >
                              <SelectTrigger className="h-8 w-full rounded-md border-strokestroke-gray text-xs">
                                <SelectValue
                                  placeholder={t("moEntry.chooseMaterialCode")}
                                />
                              </SelectTrigger>

                              <SelectContent>
                                {MATERIAL_CODE_OPTIONS.map((option) => (
                                  <SelectItem
                                    key={option.code}
                                    value={option.code}
                                    className="text-xs"
                                  >
                                    {option.code}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>

                          <TableCell className="px-3 py-2">
                            <Input
                              placeholder={t("moEntry.inputEnglishName")}
                              value={row.englishName}
                              onChange={(e) =>
                                updateRow(index, "englishName", e.target.value)
                              }
                              className="h-8 rounded-md border-strokestroke-gray px-2 text-xs placeholder:text-text-colortext-gray"
                            />
                          </TableCell>

                          <TableCell className="px-3 py-2">
                            <Input
                              placeholder={t("moEntry.inputChinaName")}
                              value={row.chinaName}
                              onChange={(e) =>
                                updateRow(index, "chinaName", e.target.value)
                              }
                              className="h-8 rounded-md border-strokestroke-gray px-2 text-xs placeholder:text-text-colortext-gray"
                            />
                          </TableCell>

                          <TableCell className="px-3 py-2">
                            <Input
                              placeholder={t("moEntry.inputQuantity")}
                              type="number"
                              value={row.qty}
                              onChange={(e) =>
                                updateRow(index, "qty", e.target.value)
                              }
                              className="h-8 rounded-md border-strokestroke-gray px-2 text-xs placeholder:text-text-colortext-gray"
                            />
                          </TableCell>

                          <TableCell className="px-3 py-2">
                            <Select
                              value={row.category || undefined}
                              onValueChange={(value) =>
                                updateRow(index, "category", value)
                              }
                            >
                              <SelectTrigger
                                className="h-8 w-full border-strokestroke-gray bg-backgroundbg-white text-xs"
                              >
                                <CategorySelectValue
                                  value={row.category}
                                  placeholder={t("common.category")}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Wait repair" className="text-xs">
                                  {t("common.waitRepair")}
                                </SelectItem>
                                <SelectItem value="Idle OK" className="text-xs">
                                  {t("common.idleOk")}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>

                          <TableCell className="px-3 py-2">
                            <Select
                              value={row.transportation || undefined}
                              onValueChange={(value) =>
                                updateRow(index, "transportation", value)
                              }
                            >
                              <SelectTrigger className="h-8 w-full border-strokestroke-gray text-xs">
                                <SelectValue placeholder={t("common.transportation")} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Air" className="text-xs">
                                  {t("common.air")}
                                </SelectItem>
                                <SelectItem value="Sea" className="text-xs">
                                  {t("common.sea")}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>

                          <TableCell className="px-3 py-2">
                            <Input
                              placeholder="e.g. 110100"
                              value={row.locator}
                              onChange={(e) =>
                                updateRow(index, "locator", e.target.value)
                              }
                              className="h-8 rounded-md border-strokestroke-gray px-2 text-xs placeholder:text-text-colortext-gray"
                            />
                          </TableCell>

                          <TableCell className="px-3 py-2">
                            <Input
                              placeholder="e.g. 9992026"
                              value={row.projectCode}
                              onChange={(e) =>
                                updateRow(index, "projectCode", e.target.value)
                              }
                              className="h-8 rounded-md border-strokestroke-gray px-2 text-xs placeholder:text-text-colortext-gray"
                            />
                          </TableCell>

                          <TableCell className="px-3 py-2 text-right">
                            {isChecked && (
                              <button
                                type="button"
                                onClick={() => deleteRow(index)}
                                className="text-xs font-medium text-text-colortext-red hover:underline"
                              >
                                {t("moEntry.delete")}
                              </button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
