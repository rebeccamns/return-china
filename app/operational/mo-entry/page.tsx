"use client";

import { useState } from "react";
import { Plus, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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

type MaterialRow = {
  code: string;
  englishName: string;
  chinaName: string;
  qty: string;
};

const MATERIAL_CODE_OPTIONS = [
  {
    code: "621032000320",
    englishName: "Battery cover AC175",
    chinaName: "电池盖组件 AC175 绿",
  },
  {
    code: "621032000321",
    englishName: "Display Panel",
    chinaName: "显示屏面板",
  },
  {
    code: "621032000322",
    englishName: "Camera Module",
    chinaName: "相机模组",
  },
];

const initialRows: MaterialRow[] = [
  {
    code: "621032000320",
    englishName: "Battery cover AC175",
    chinaName: "电池盖组件 AC175 绿",
    qty: "5",
  },
  {
    code: "621032000320",
    englishName: "Display Panel",
    chinaName: "显示屏面板",
    qty: "10",
  },
  {
    code: "621032000320",
    englishName: "Camera Module",
    chinaName: "相机模组",
    qty: "7",
  },
  {
    code: "621032000320",
    englishName: "Camera Module",
    chinaName: "相机模组",
    qty: "7",
  },
  {
    code: "621032000320",
    englishName: "Display Panel",
    chinaName: "显示屏面板",
    qty: "10",
  },
];

export default function MoEntryPage() {
  const { t } = useI18n();

  const [moNumber, setMoNumber] = useState("");
  const [model, setModel] = useState("");
  const [projectNumber, setProjectNumber] = useState("");
  const [targetDeliveryDate, setTargetDeliveryDate] = useState("");
  const [rows, setRows] = useState<MaterialRow[]>(initialRows);
  const [checkedRows, setCheckedRows] = useState<Set<number>>(new Set());
  const [statusMessage, setStatusMessage] = useState("");

  function updateRow(index: number, field: keyof MaterialRow, value: string) {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  }

  function handleCodeChange(index: number, code: string) {
    const match = MATERIAL_CODE_OPTIONS.find((item) => item.code === code);

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
      { code: "", englishName: "", chinaName: "", qty: "" },
    ]);
    setStatusMessage(t("moEntry.rowAdded"));
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
      setStatusMessage(
        "Please complete MO Number, Model, Project Number, and Target Pengiriman.",
      );
      return;
    }

    setStatusMessage(
      `Task created for MO ${moNumber.trim()} · Model ${model.trim()} · Project ${projectNumber.trim()}.`,
    );
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
      setStatusMessage(t("moEntry.completeAllRows"));
      return;
    }

    setStatusMessage(
      t(
        rows.length === 1
          ? "moEntry.moSubmittedSingular"
          : "moEntry.moSubmittedPlural",
        { count: rows.length },
      ),
    );
  }

  return (
    <main className="min-h-screen w-full bg-backgroundbg-gray">
      <Sidebar />

      <div className="flex min-h-screen flex-col pl-[255px]">
        <TopBar />

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

          <h1 className="mb-4 text-lg font-semibold text-[#111111]">
            {t("moEntry.title")}
          </h1>

          <div className="overflow-hidden rounded-lg border border-strokestroke-gray bg-white">
            <div className="px-[18px] py-[18px]">
              <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 xl:grid-cols-[1.15fr_1fr_0.8fr_1.4fr_auto]">
                <div className="min-w-0">
                  <label className="mb-1.5 block text-xs font-medium text-[#111111]">
                    {t("moEntry.moNumberLabel")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder={t("moEntry.moNumberPlaceholder")}
                    value={moNumber}
                    onChange={(e) => setMoNumber(e.target.value)}
                    className="h-9 rounded-md border-strokestroke-gray px-3 text-xs placeholder:text-[#A3A3A1]"
                  />
                </div>

                <div className="min-w-0">
                  <label className="mb-1.5 block text-xs font-medium text-[#111111]">
                    {t("moEntry.modelLabel")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder={t("moEntry.modelPlaceholder")}
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="h-9 rounded-md border-strokestroke-gray px-3 text-xs placeholder:text-[#A3A3A1]"
                  />
                </div>

                <div className="min-w-0">
                  <label className="mb-1.5 block text-xs font-medium text-[#111111]">
                    Project Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. 9991028"
                    value={projectNumber}
                    onChange={(e) => setProjectNumber(e.target.value)}
                    className="h-9 rounded-md border-strokestroke-gray px-3 text-xs placeholder:text-[#A3A3A1]"
                  />
                </div>

                <div className="min-w-0">
                  <label className="mb-1.5 block text-xs font-medium text-[#111111]">
                    Target Pengiriman <span className="text-red-500">*</span>
                  </label>

                  {/* Keep the day count beside the date input on the same row. */}
                  <div className="flex h-9 items-center gap-2">
                    <Input
                      type="date"
                      value={targetDeliveryDate}
                      onChange={(e) => setTargetDeliveryDate(e.target.value)}
                      className="h-9 w-[180px] shrink-0 rounded-md border-strokestroke-gray px-3 text-xs"
                      aria-label="Target Pengiriman"
                      required
                    />

                    <span
                      className={`shrink-0 whitespace-nowrap text-[11px] ${
                        deliveryDayCount !== null && deliveryDayCount < 0
                          ? "text-red-600"
                          : deliveryDayCount === 0
                            ? "text-amber-600"
                            : "text-[#777776]"
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

                <Button
                  type="button"
                  onClick={createTask}
                  className="h-9 shrink-0 gap-2 rounded-md bg-gradient-to-b from-[#058346] to-[#0B5934] px-4 text-xs font-semibold text-white hover:opacity-90"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {t("moEntry.createTask")}
                </Button>
              </div>
            </div>

            <div className="border-t border-strokestroke-gray" />

            {statusMessage && (
              <div className="border-b border-strokestroke-gray bg-[#F8F8F8] px-[18px] py-2 text-xs font-medium text-[#555554]">
                {statusMessage}
              </div>
            )}

            <div className="px-[18px] pb-[18px] pt-4">
              <div className="mb-3">
                <h2 className="text-sm font-semibold text-[#111111]">
                  {t("common.materialList")}
                </h2>
              </div>

              <div className="mb-3 flex items-center justify-between gap-4">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <div className="flex h-8 max-w-full items-center rounded-full bg-[#F8F8F8] px-3 text-xs">
                    <span className="shrink-0 text-[#8F8F8E]">
                      {t("common.mo")}
                    </span>
                    <span className="ml-2 truncate font-medium text-[#111111]">
                      {moNumber.trim() || "—"}
                    </span>
                  </div>

                  <div className="flex h-8 max-w-[220px] items-center rounded-full bg-[#F8F8F8] px-3 text-xs">
                    <span className="shrink-0 text-[#8F8F8E]">
                      {t("moEntry.modelLabel")}
                    </span>
                    <span className="ml-2 truncate font-medium text-[#111111]">
                      {model.trim() || "—"}
                    </span>
                  </div>

                  <div className="flex h-8 max-w-[220px] items-center rounded-full bg-[#F8F8F8] px-3 text-xs">
                    <span className="shrink-0 text-[#8F8F8E]">Project No.</span>
                    <span className="ml-2 truncate font-medium text-[#111111]">
                      {projectNumber.trim() || "—"}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-xs text-[#5F5F5E]">
                    {t(
                      rows.length === 1
                        ? "common.itemSingular"
                        : "common.itemPlural",
                      { count: rows.length },
                    )}
                  </span>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addRow}
                    className="h-8 gap-1.5 rounded-md border-strokestroke-gray px-3 text-xs font-medium text-[#555554] hover:bg-[#F8F8F8]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {t("moEntry.addNewMaterial")}
                  </Button>

                  <Button
                    type="button"
                    onClick={submitMo}
                    className="h-8 gap-2 rounded-md bg-gradient-to-b from-[#058346] to-[#0B5934] px-3.5 text-xs font-semibold text-white hover:opacity-90"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {t("moEntry.submitMo")}
                  </Button>
                </div>
              </div>

              <div className="overflow-hidden rounded-md border border-strokestroke-gray">
                <Table>
                  <TableHeader className="bg-[#F8F8F8]">
                    <TableRow className="hover:bg-[#F8F8F8]">
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
                              ? "bg-[#EAF6EE] hover:bg-[#EAF6EE]"
                              : "hover:bg-[#FAFAFA]"
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
                              className="h-8 rounded-md border-strokestroke-gray px-2 text-xs placeholder:text-[#A3A3A1]"
                            />
                          </TableCell>

                          <TableCell className="px-3 py-2">
                            <Input
                              placeholder={t("moEntry.inputChinaName")}
                              value={row.chinaName}
                              onChange={(e) =>
                                updateRow(index, "chinaName", e.target.value)
                              }
                              className="h-8 rounded-md border-strokestroke-gray px-2 text-xs placeholder:text-[#A3A3A1]"
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
                              className="h-8 rounded-md border-strokestroke-gray px-2 text-xs placeholder:text-[#A3A3A1]"
                            />
                          </TableCell>

                          <TableCell className="px-3 py-2 text-right">
                            {isChecked && (
                              <button
                                type="button"
                                onClick={() => deleteRow(index)}
                                className="text-xs font-medium text-red-600 hover:underline"
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
          </div>
        </div>
      </div>
    </main>
  );
}
