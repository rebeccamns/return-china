"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { AlertCircle, ChevronDown, Info, MoreHorizontal, Minus, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import KpiCard from "@/components/ui/kpichart";
import CategorySelectValue from "./CategorySelectValue";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import { DEMO, demoMoNumber } from "@/lib/demo-data";
import {
  getMaterialCodeOption,
  MATERIAL_CODE_OPTIONS,
} from "@/lib/mo-entry/material-options";
import TaskProgressCard from "./TaskProgressCard";
import SubmitFlowDialog, { type SubmitStep } from "./SubmitFlowDialog";

const nestedHeadClass =
  "bg-[#F8F8F8] px-3 text-xs font-semibold text-slate-700";
const materialInputClass =
  "h-8 w-full rounded-md border border-strokestroke-gray px-2 text-xs placeholder:text-[#A3A3A1]";
/* =========================================================
   PROGRESS BAR
========================================================= */

function ProgressBar({ value = 46 }: { value?: number }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-slate-200">
      <div
        className="h-1.5 rounded-full bg-gradient-to-r from-[#0b5934] to-[#15a760]"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

/* =========================================================
   TYPES
========================================================= */

type Material = {
  code: string;
  englishName: string;
  chinaName: string;
  qty?: string;
  category?: string;
  transportation?: string;
  locator?: string;
  projectCode?: string;
  isRejected?: boolean;
};

type RevisionItem = {
  id: string;
  code: string;
  reflowFrom: string;
  reason: string;
  submittedAt: string;
  returnedAt: string;
  materials: Material[];
};

type EditableMaterialField = Exclude<keyof Material, "isRejected">;

const blankMaterial: Material = {
  code: "",
  englishName: "",
  chinaName: "",
  qty: "",
  category: "",
  transportation: "",
  locator: "",
  projectCode: "",
};

function MaterialTableHeader() {
  const { t } = useI18n();

  return (
    <TableHeader>
      <TableRow className="hover:bg-[#F8F8F8]">
        <TableHead className={nestedHeadClass}>{t("common.materialCode")}</TableHead>
        <TableHead className={nestedHeadClass}>{t("common.englishName")}</TableHead>
        <TableHead className={nestedHeadClass}>{t("common.chinaName")}</TableHead>
        <TableHead className={nestedHeadClass}>{t("common.qtyPcs")}</TableHead>
        <TableHead className={nestedHeadClass}>{t("common.category")}</TableHead>
        <TableHead className={nestedHeadClass}>{t("common.transportation")}</TableHead>
        <TableHead className={nestedHeadClass}>{t("common.locator")}</TableHead>
        <TableHead className={nestedHeadClass}>{t("common.projectCode")}</TableHead>
      </TableRow>
    </TableHeader>
  );
}

function MaterialFields({
  material,
  isEditing,
  isRejected,
  onChange,
  onCodeChange,
}: {
  material: Material;
  isEditing: boolean;
  isRejected?: boolean;
  onChange: (field: EditableMaterialField, value: string) => void;
  onCodeChange: (code: string) => void;
}) {
  const { t } = useI18n();

  return (
    <>
      <TableCell className="px-3 py-2">
        {isEditing ? (
          <Select
            value={material.code || undefined}
            onValueChange={onCodeChange}
          >
            <SelectTrigger className="h-8 w-full rounded-md border-strokestroke-gray text-xs">
              <SelectValue placeholder={t("moEntry.chooseMaterialCode")} />
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
        ) : (
          <span className="inline-flex items-center gap-2 text-xs">
            {material.code || "—"}
            {isRejected && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-medium text-red-700">
                <AlertCircle className="h-3 w-3" />
                Rejected
              </span>
            )}
          </span>
        )}
      </TableCell>

      <TableCell className="px-3 py-2">
        {isEditing ? (
          <Input
            placeholder={t("moEntry.inputEnglishName")}
            value={material.englishName}
            onChange={(event) => onChange("englishName", event.target.value)}
            className={cn(materialInputClass, isRejected && "border-red-400 focus:border-red-500")}
          />
        ) : (
          <span className="text-xs">{material.englishName || "—"}</span>
        )}
      </TableCell>

      <TableCell className="px-3 py-2">
        {isEditing ? (
          <Input
            placeholder={t("moEntry.inputChinaName")}
            value={material.chinaName}
            onChange={(event) => onChange("chinaName", event.target.value)}
            className={cn(materialInputClass, isRejected && "border-red-400 focus:border-red-500")}
          />
        ) : (
          <span className="text-xs">{material.chinaName || "—"}</span>
        )}
      </TableCell>

      <TableCell className="px-3 py-2">
        {isEditing ? (
          <Input
            placeholder={t("moEntry.inputQuantity")}
            type="number"
            value={material.qty ?? ""}
            onChange={(event) => onChange("qty", event.target.value)}
            className={materialInputClass}
          />
        ) : (
          <span className="text-xs">{material.qty || "—"}</span>
        )}
      </TableCell>

      <TableCell className="px-3 py-2">
        {isEditing ? (
          <Select
            value={material.category || undefined}
            onValueChange={(value) => onChange("category", value)}
          >
            <SelectTrigger
              className="h-8 w-full rounded-md border-strokestroke-gray bg-backgroundbg-white text-xs"
            >
              <CategorySelectValue
                value={material.category ?? ""}
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
        ) : material.category ? (
          <span
            className={cn(
              "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
              material.category === "Wait repair" && "bg-yellow-100 text-yellow-800",
              material.category === "Idle OK" && "bg-green-100 text-green-800",
            )}
          >
            {material.category === "Wait repair"
              ? t("common.waitRepair")
              : t("common.idleOk")}
          </span>
        ) : (
          "—"
        )}
      </TableCell>

      <TableCell className="px-3 py-2">
        {isEditing ? (
          <Select
            value={material.transportation || undefined}
            onValueChange={(value) => onChange("transportation", value)}
          >
            <SelectTrigger className="h-8 w-full rounded-md border-strokestroke-gray text-xs">
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
        ) : (
          <span className="text-xs">
            {material.transportation === "Air"
              ? t("common.air")
              : material.transportation === "Sea"
                ? t("common.sea")
                : "—"}
          </span>
        )}
      </TableCell>

      <TableCell className="px-3 py-2">
        {isEditing ? (
          <Input
            placeholder="e.g. 110100"
            value={material.locator ?? ""}
            onChange={(event) => onChange("locator", event.target.value)}
            className={materialInputClass}
          />
        ) : (
          <span className="text-xs">{material.locator || "—"}</span>
        )}
      </TableCell>

      <TableCell className="px-3 py-2">
        {isEditing ? (
          <Input
            placeholder={DEMO.projectCode}
            value={material.projectCode ?? ""}
            onChange={(event) => onChange("projectCode", event.target.value)}
            className={materialInputClass}
          />
        ) : (
          <span className="text-xs">{material.projectCode || "—"}</span>
        )}
      </TableCell>
    </>
  );
}

/* =========================================================
   REVISION DATA
========================================================= */

const initialRevisionItems: RevisionItem[] = [
  {
    id: "rev-1",
    code: demoMoNumber(0),
    reflowFrom: "PMC Entry",
    reason: "Staff Return",
    submittedAt: "Sep 04, 10:26",
    returnedAt: "Sep 22, 08:15",
    materials: [
      {
        code: DEMO.materialCodes.batteryCover,
        englishName: "Battery cover Lychee F4",
        chinaName: "电池盖组件 AC175 绿",
        qty: "5",
        category: "Wait repair",
        transportation: "Air",
        locator: "110100",
        projectCode: DEMO.projectCode,
        isRejected: true,
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
    ],
  },
  {
    id: "rev-2",
    code: demoMoNumber(1),
    reflowFrom: "IQC Scan",
    reason: "Staff Return",
    submittedAt: "Sep 04, 10:49",
    returnedAt: "Sep 22, 09:12",
    materials: [],
  },
  {
    id: "rev-3",
    code: demoMoNumber(2),
    reflowFrom: "Exim",
    reason: "Staff Return",
    submittedAt: "Sep 04, 11:05",
    returnedAt: "Sep 22, 10:30",
    materials: [],
  },
];

/* =========================================================
   REVISION NOTICE
========================================================= */

export function RevisionNotice() {
  const { t } = useI18n();
  const [items, setItems] = useState<RevisionItem[]>(initialRevisionItems);
  const [showAll, setShowAll] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftMaterials, setDraftMaterials] = useState<Material[]>([]);
  const [submitStep, setSubmitStep] = useState<SubmitStep>(null);
  const [resubmitId, setResubmitId] = useState<string | null>(null);
  const detailsRef = React.useRef<HTMLDivElement>(null);
  function toggleShowAll() {
    const nextState = !showAll;
    setShowAll(nextState);

    if (nextState) {
      requestAnimationFrame(() => {
        detailsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    } else {
      setExpandedId(null);
      setEditingId(null);
      setDraftMaterials([]);
    }
  }

  function toggleRow(id: string) {
    if (editingId && editingId !== id) {
      setEditingId(null);
      setDraftMaterials([]);
    }

    setExpandedId((current) => {
      if (current === id) {
        if (editingId === id) {
          setEditingId(null);
          setDraftMaterials([]);
        }
        return null;
      }
      return id;
    });
  }

  function startEdit(item: RevisionItem) {
    setExpandedId(item.id);
    setEditingId(item.id);
    setDraftMaterials(item.materials.map((material) => ({ ...material })));
  }

  function cancelEdit() {
    setEditingId(null);
    setDraftMaterials([]);
  }

  function saveEdit() {
    if (!editingId) return;

    setItems((prev) =>
      prev.map((item) =>
        item.id === editingId
          ? {
              ...item,
              materials: draftMaterials.map((material) => ({ ...material })),
            }
          : item,
      ),
    );

    setEditingId(null);
    setDraftMaterials([]);
  }

  function updateDraftMaterial(
    materialIndex: number,
    field: EditableMaterialField,
    value: string,
  ) {
    setDraftMaterials((prev) =>
      prev.map((material, index) =>
        index === materialIndex ? { ...material, [field]: value } : material,
      ),
    );
  }

  function updateDraftMaterialCode(materialIndex: number, code: string) {
    const option = getMaterialCodeOption(code);

    setDraftMaterials((prev) =>
      prev.map((material, index) =>
        index === materialIndex
          ? {
              ...material,
              code,
              englishName: option?.englishName ?? material.englishName,
              chinaName: option?.chinaName ?? material.chinaName,
            }
          : material,
      ),
    );
  }

  function addDraftMaterial() {
    setDraftMaterials((prev) => [...prev, { ...blankMaterial }]);
  }

  function resubmit(id: string) {
    if (!items.some((entry) => entry.id === id)) return;
    setResubmitId(id);
    setSubmitStep("confirm");
  }

  function confirmResubmit() {
    const item = items.find((entry) => entry.id === resubmitId);
    if (!item) return;

    console.log("Resubmitting:", item); // TODO: send the corrected MO to your API
    setItems((prev) => prev.filter((entry) => entry.id !== item.id));
    setExpandedId(null);
    setEditingId(null);
    setDraftMaterials([]);
    setSubmitStep("success");
  }

  return (
    <Card className="overflow-hidden rounded-lg border-strokestroke-gray bg-white">
      <SubmitFlowDialog
        step={submitStep}
        confirmTitle={t("submitFlow.resubmitConfirmTitle")}
        confirmDescription={t("submitFlow.resubmitConfirmDescription")}
        successTitle={t("submitFlow.resubmitSuccessTitle")}
        successDescription={t("submitFlow.resubmitSuccessDescription")}
        onConfirm={confirmResubmit}
        onClose={() => {
          setSubmitStep(null);
          setResubmitId(null);
        }}
      />
      <CardContent className="flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Info className="h-4 w-4 shrink-0 text-red-500" />
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-red-500">
              {t("dashboard.revision.title")}
            </h2>
            <p className="text-xs text-slate-500">
              {t("dashboard.revision.description")}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-5">
          <Badge className="rounded bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-500 hover:bg-red-50">
            {t(
              items.length === 1
                ? "dashboard.revision.itemSingular"
                : "dashboard.revision.itemPlural",
              { count: items.length },
            )}
          </Badge>
          <Button
            variant="ghost"
            type="button"
            onClick={toggleShowAll}
            className="h-auto gap-1.5 p-0 text-xs font-semibold text-slate-700 hover:bg-transparent hover:text-slate-900"
          >
            {showAll ? t("common.hideAll") : t("common.viewAll")}
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform duration-200",
                showAll && "rotate-180",
              )}
            />
          </Button>
        </div>
      </CardContent>

      <div
        ref={detailsRef}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-200",
          showAll ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="border-t border-strokestroke-gray px-4 pb-4 pt-3">
            <div className="mb-3 flex items-center justify-end">
              <p className="ml-auto pb-2 text-xs text-[#8F8F8E]">
                {t("history.showingRecords", {
                  shown: items.length,
                  total: items.length,
                })}
              </p>
            </div>
            <div className="overflow-x-auto rounded-md border border-strokestroke-gray">
              <Table className="min-w-[1120px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 px-3" />
                    <TableHead className="px-3">{t("common.moCode")}</TableHead>
                    <TableHead className="px-3">{t("dashboard.revision.reflowFrom")}</TableHead>
                    <TableHead className="px-3">{t("dashboard.revision.reason")}</TableHead>
                    <TableHead className="px-3">{t("dashboard.revision.submittedAt")}</TableHead>
                    <TableHead className="px-3">{t("dashboard.revision.returnedAt")}</TableHead>
                    <TableHead className="w-24 px-3 text-right">
                      {t("common.action")}
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="px-3 py-10 text-center text-sm text-[#5F5F5E]"
                      >
                        {t("history.noMatchingRecords")}
                      </TableCell>
                    </TableRow>
                  ) : items.map((item) => {
                    const isExpanded = expandedId === item.id;
                    const isEditing = editingId === item.id;
                    const displayedMaterials = isEditing ? draftMaterials : item.materials;

                    return (
                      <React.Fragment key={item.id}>
                        <TableRow
                          className="h-12 cursor-pointer hover:bg-slate-50"
                          onClick={() => toggleRow(item.id)}
                        >
                          <TableCell className="px-3">
                            <Button
                              type="button"
                              variant="outline"
                              className="h-6 w-6 rounded-md p-0"
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleRow(item.id);
                              }}
                              aria-label={isExpanded ? t("common.collapseRow") : t("common.expandRow")}
                            >
                              {isExpanded ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                            </Button>
                          </TableCell>
                          <TableCell className="px-3 text-xs">{item.code}</TableCell>
                          <TableCell className="px-3 text-xs">{item.reflowFrom}</TableCell>
                          <TableCell className="px-3 text-xs">{item.reason}</TableCell>
                          <TableCell className="whitespace-nowrap px-3 text-xs">{item.submittedAt}</TableCell>
                          <TableCell className="whitespace-nowrap px-3 text-xs">{item.returnedAt}</TableCell>
                          <TableCell className="px-3 text-right">
                            {!isEditing && (
                              <Button
                                type="button"
                                variant="ghost"
                                className="h-7 px-2 text-xs font-medium text-[#08783F] hover:bg-[#E7F5EC] hover:text-[#066B3B]"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  startEdit(item);
                                }}
                              >
                                {t("common.edit")}
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>

                        {isExpanded && (
                          <TableRow>
                            <TableCell colSpan={7} className="bg-white p-3">
                              <div className="overflow-x-auto">
                                <Table className="min-w-[1450px]">
                                  <MaterialTableHeader />
                                  <TableBody>
                                    {displayedMaterials.map((material, index) => (
                                      <TableRow
                                        key={`${item.id}-${index}`}
                                        className={cn(
                                          material.isRejected &&
                                            "bg-red-50/50 hover:bg-red-50/70",
                                        )}
                                      >
                                        <MaterialFields
                                          material={material}
                                          isEditing={isEditing}
                                          isRejected={material.isRejected}
                                          onChange={(field, value) =>
                                            updateDraftMaterial(index, field, value)
                                          }
                                          onCodeChange={(code) =>
                                            updateDraftMaterialCode(index, code)
                                          }
                                        />
                                      </TableRow>
                                    ))}

                                    {isEditing && (
                                      <TableRow>
                                        <TableCell colSpan={8} className="py-3">
                                          <Button
                                            type="button"
                                            variant="secondary"
                                            className="h-7 rounded-md px-3 text-xs"
                                            onClick={addDraftMaterial}
                                          >
                                            <Plus className="h-3.5 w-3.5" />
                                            {t("dashboard.revision.addMaterial")}
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    )}
                                  </TableBody>
                                </Table>
                              </div>

                              <div className="mt-3 flex items-center justify-between gap-3">
                                {isEditing ? (
                                  <div className="flex items-center gap-2">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      className="h-7 rounded-md px-3 text-xs"
                                      onClick={cancelEdit}
                                    >
                                      {t("common.cancel")}
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="primary"
                                      className="h-7 rounded-md px-3 text-xs font-semibold"
                                      onClick={saveEdit}
                                    >
                                      Save Changes
                                    </Button>
                                  </div>
                                ) : (
                                  <span className="text-xs text-slate-500">
                                    Read-only view
                                  </span>
                                )}

                                <Button
                                  type="button"
                                  variant="primary"
                                  className="h-7 rounded-md px-4 text-xs font-semibold"
                                  onClick={() => resubmit(item.id)}
                                  disabled={isEditing}
                                  title={
                                    isEditing
                                      ? "Save or cancel your changes before resubmitting"
                                      : undefined
                                  }
                                >
                                  {t("dashboard.revision.resubmit")}
                                </Button>
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
    </Card>
  );
}

/* =========================================================
   ONGOING MO
========================================================= */

type MoRow = {
  id: string;
  code: string;
  model: string;
  step: string;
  updatedTime: string;
  materials: Material[];
};

const initialOngoingMoRows: MoRow[] = [
  {
    id: "mo-1",
    code: demoMoNumber(0),
    model: DEMO.model,
    step: "Staff Return",
    updatedTime: "08:15",
    materials: [
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
    ],
  },
  {
    id: "mo-2",
    code: demoMoNumber(1),
    model: DEMO.model,
    step: "Staff Return",
    updatedTime: "08:15",
    materials: [],
  },
  {
    id: "mo-3",
    code: demoMoNumber(2),
    model: DEMO.model,
    step: "Staff Return",
    updatedTime: "08:15",
    materials: [],
  },
];

function OngoingMoTable() {
  const { t, locale } = useI18n();
  const [today, setToday] = useState<Date | null>(null);
  const [rows, setRows] = useState<MoRow[]>(initialOngoingMoRows);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const updateToday = () => setToday(new Date());
    updateToday();
    const intervalId = window.setInterval(updateToday, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  const todayLabel = today
    ? new Intl.DateTimeFormat(locale === "zh-CN" ? "zh-CN" : "en-US", {
        month: "short",
        day: "2-digit",
      }).format(today)
    : null;

  function startEdit(id: string) {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id && row.materials.length === 0
          ? { ...row, materials: [blankMaterial] }
          : row,
      ),
    );

    setEditingId(id);
    setExpandedId(id);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  function submitEdit() {
    // TODO: send rows.find(r => r.id === editingId) to your API
    setEditingId(null);
  }

  function deleteRow(id: string) {
    const confirmed = window.confirm(t("dashboard.ongoingMo.deleteConfirm"));

    if (!confirmed) return;

    setRows((prev) => prev.filter((row) => row.id !== id));
  }

  function updateMaterial(
    rowId: string,
    materialIndex: number,
    field: EditableMaterialField,
    value: string,
  ) {
    setRows((prev) =>
      prev.map((row) =>
        row.id !== rowId
          ? row
          : {
              ...row,
              materials: row.materials.map((material, index) =>
                index === materialIndex
                  ? { ...material, [field]: value }
                  : material,
              ),
            },
      ),
    );
  }

  function updateMaterialCode(rowId: string, materialIndex: number, code: string) {
    const option = getMaterialCodeOption(code);

    setRows((prev) =>
      prev.map((row) =>
        row.id !== rowId
          ? row
          : {
              ...row,
              materials: row.materials.map((material, index) =>
                index === materialIndex
                  ? {
                      ...material,
                      code,
                      englishName: option?.englishName ?? material.englishName,
                      chinaName: option?.chinaName ?? material.chinaName,
                    }
                  : material,
              ),
            },
      ),
    );
  }

  function addMaterial(rowId: string) {
    setRows((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? { ...row, materials: [...row.materials, blankMaterial] }
          : row,
      ),
    );

    setExpandedId(rowId);
  }

  return (
    <Card className="overflow-hidden rounded-lg border-[var(--strokestroke-gray)]">
      <CardHeader className="px-4 py-3">
        <CardTitle className="text-sm font-semibold">{t("dashboard.ongoingMo.title")}</CardTitle>
      </CardHeader>

      <CardContent className="px-4 pb-4">
        <div className="mb-3 flex items-center justify-end">
          <p className="text-xs text-[#8F8F8E]">
            {t("history.showingRecords", {
              shown: rows.length,
              total: rows.length,
            })}
          </p>
        </div>
        <div className="overflow-x-auto rounded border border-[var(--strokestroke-gray)]">
          <Table className="min-w-[850px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 px-3" />
                <TableHead className="px-3">{t("common.moCode")}</TableHead>
                <TableHead className="px-3">{t("common.model")}</TableHead>
                <TableHead className="px-3">{t("dashboard.ongoingMo.progress")}</TableHead>
                <TableHead className="px-3">{t("dashboard.ongoingMo.currentStep")}</TableHead>
                <TableHead className="px-3">{t("dashboard.ongoingMo.lastUpdated")}</TableHead>
                <TableHead className="w-[120px] px-3 text-center">
                  {t("common.action")}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="px-3 py-10 text-center text-sm text-[#5F5F5E]"
                  >
                    {rows.length === 0
                      ? t("common.noData")
                      : t("history.noMatchingRecords")}
                  </TableCell>
                </TableRow>
              ) : rows.map((row) => {
                const isEditing = editingId === row.id;
                const isExpanded = expandedId === row.id;

                return (
                  <React.Fragment key={row.id}>
                    <TableRow
                      className="h-12 cursor-pointer hover:bg-slate-50"
                      onClick={() => setExpandedId(isExpanded ? null : row.id)}
                    >
                      <TableCell className="w-12 px-3">
                        <Button
                          type="button"
                          variant="outline"
                          className="h-7 w-7 rounded-md p-0"
                          onClick={(event) => {
                            event.stopPropagation();
                            setExpandedId(isExpanded ? null : row.id);
                          }}
                          aria-label={t("common.expandRow")}
                        >
                          {isExpanded ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        </Button>
                      </TableCell>

                      <TableCell className="max-w-[190px] truncate px-3 text-xs">
                        {row.code}
                      </TableCell>
                      <TableCell className="px-3 text-xs">
                        {row.model}
                      </TableCell>

                      <TableCell className="px-3">
                        <div className="flex min-w-[120px] items-center gap-2">
                          <ProgressBar value={46} />
                          <span className="text-xs text-muted-foreground">
                            3/7
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="px-3 text-xs">{row.step}</TableCell>
                      <TableCell className="px-3 text-xs">
                        {todayLabel
                          ? `${todayLabel}, ${row.updatedTime}`
                          : row.updatedTime}
                      </TableCell>

                      <TableCell className="px-3 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <Button
                              type="button"
                              variant="ghost"
                              className="h-7 rounded-md px-2.5 text-xs"
                              onClick={(event) => {
                                event.stopPropagation();
                                cancelEdit();
                              }}
                            >
                              {t("common.cancel")}
                            </Button>

                            <Button
                              type="button"
                              variant="primary"
                              className="h-7 rounded-md px-2.5 text-xs"
                              onClick={(event) => {
                                event.stopPropagation();
                                submitEdit();
                              }}
                            >
                              {t("common.submit")}
                            </Button>
                          </div>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                className="h-7 w-8 rounded-md p-0"
                                aria-label={t("common.moreActions")}
                                onClick={(event) => event.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => startEdit(row.id)}
                              >
                                {t("dashboard.ongoingMo.editData")}
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                destructive
                                onClick={() => deleteRow(row.id)}
                              >
                                {t("dashboard.ongoingMo.deleteData")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>

                    {isExpanded && (
                        <TableRow>
                          <TableCell colSpan={7} className="bg-white p-3">
                            <div className="overflow-x-auto">
                              <Table className="min-w-[1450px]">
                                <MaterialTableHeader />
                                <TableBody>
                                  {row.materials.map((material, index) => (
                                    <TableRow key={index}>
                                      <TableCell className="px-3 py-2">
                                        {isEditing ? (
                                          <Select
                                            value={material.code || undefined}
                                            onValueChange={(value) =>
                                              updateMaterialCode(row.id, index, value)
                                            }
                                          >
                                            <SelectTrigger className="h-8 w-full rounded-md border-strokestroke-gray text-xs">
                                              <SelectValue placeholder={t("moEntry.chooseMaterialCode")} />
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
                                        ) : (
                                          material.code || "—"
                                        )}
                                      </TableCell>

                                      <TableCell className="px-3 py-2">
                                        {isEditing ? (
                                          <Input
                                            placeholder={t("moEntry.inputEnglishName")}
                                            value={material.englishName}
                                            onChange={(e) => updateMaterial(row.id, index, "englishName", e.target.value)}
                                            className={materialInputClass}
                                          />
                                        ) : (
                                          <span className="text-xs">{material.englishName || "—"}</span>
                                        )}
                                      </TableCell>

                                      <TableCell className="px-3 py-2">
                                        {isEditing ? (
                                          <Input
                                            placeholder={t("moEntry.inputChinaName")}
                                            value={material.chinaName}
                                            onChange={(e) => updateMaterial(row.id, index, "chinaName", e.target.value)}
                                            className={materialInputClass}
                                          />
                                        ) : (
                                          <span className="text-xs">{material.chinaName || "—"}</span>
                                        )}
                                      </TableCell>

                                      <TableCell className="px-3 py-2">
                                        {isEditing ? (
                                          <Input
                                            placeholder={t("moEntry.inputQuantity")}
                                            type="number"
                                            value={material.qty ?? ""}
                                            onChange={(e) => updateMaterial(row.id, index, "qty", e.target.value)}
                                            className={materialInputClass}
                                          />
                                        ) : (
                                          <span className="text-xs">{material.qty || "—"}</span>
                                        )}
                                      </TableCell>

                                      <TableCell className="px-3 py-2">
                                        {isEditing ? (
                                          <Select
                                            value={material.category || undefined}
                                            onValueChange={(value) =>
                                              updateMaterial(
                                                row.id,
                                                index,
                                                "category",
                                                value,
                                              )
                                            }
                                          >
                                            <SelectTrigger
                                              className="h-8 w-full rounded-md border-strokestroke-gray bg-backgroundbg-white text-xs"
                                            >
                                              <CategorySelectValue
                                                value={material.category ?? ""}
                                                placeholder={t("common.category")}
                                              />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="Wait repair">
                                                {t("common.waitRepair")}
                                              </SelectItem>
                                              <SelectItem value="Idle OK">
                                                {t("common.idleOk")}
                                              </SelectItem>
                                            </SelectContent>
                                          </Select>
                                        ) : material.category ? (
                                          <span
                                            className={cn(
                                              "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                                              material.category === "Wait repair" &&
                                                "bg-yellow-100 text-yellow-800",
                                              material.category === "Idle OK" &&
                                                "bg-green-100 text-green-800",
                                            )}
                                          >
                                            {material.category === "Wait repair"
                                              ? t("common.waitRepair")
                                              : t("common.idleOk")}
                                          </span>
                                        ) : (
                                          "—"
                                        )}
                                      </TableCell>

                                      <TableCell className="px-3 py-2">
                                        {isEditing ? (
                                          <Select
                                            value={material.transportation || undefined}
                                            onValueChange={(value) =>
                                              updateMaterial(
                                                row.id,
                                                index,
                                                "transportation",
                                                value,
                                              )
                                            }
                                          >
                                            <SelectTrigger className="h-8 w-full rounded-md border-strokestroke-gray text-xs">
                                              <SelectValue placeholder={t("common.transportation")} />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="Air">
                                                {t("common.air")}
                                              </SelectItem>
                                              <SelectItem value="Sea">
                                                {t("common.sea")}
                                              </SelectItem>
                                            </SelectContent>
                                          </Select>
                                        ) : material.transportation === "Air" ? (
                                          t("common.air")
                                        ) : material.transportation === "Sea" ? (
                                          t("common.sea")
                                        ) : (
                                          "—"
                                        )}
                                      </TableCell>

                                      <TableCell className="px-3 py-2">
                                        {isEditing ? (
                                          <Input
                                            placeholder="e.g. 110100"
                                            value={material.locator ?? ""}
                                            onChange={(e) => updateMaterial(row.id, index, "locator", e.target.value)}
                                            className={materialInputClass}
                                          />
                                        ) : (
                                          <span className="text-xs">{material.locator || "—"}</span>
                                        )}
                                      </TableCell>

                                      <TableCell className="px-3 py-2">
                                        {isEditing ? (
                                          <Input
                                            placeholder={DEMO.projectCode}
                                            value={material.projectCode ?? ""}
                                            onChange={(e) => updateMaterial(row.id, index, "projectCode", e.target.value)}
                                            className={materialInputClass}
                                          />
                                        ) : (
                                          <span className="text-xs">{material.projectCode || "—"}</span>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))}

                                  {isEditing && (
                                    <TableRow>
                                      <TableCell colSpan={8} className="py-3">
                                        <Button
                                          type="button"
                                          variant="secondary"
                                          className="h-7 rounded-md px-3 text-xs"
                                          onClick={() => addMaterial(row.id)}
                                        >
                                          <Plus className="h-3.5 w-3.5" />
                                          {t("dashboard.ongoingMo.addMaterial")}
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  )}
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
      </CardContent>
    </Card>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

export default function DashboardContent(): JSX.Element {
  const { t } = useI18n();

  return (
    <main>
      <div className="mx-auto flex w-full max-w-[1625px] flex-col gap-5">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500">
          {t("dashboard.breadcrumb")}
        </nav>

        <h1 className="text-lg font-semibold text-slate-950">{t("dashboard.title")}</h1>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <TaskProgressCard />
          <KpiCard />
        </section>

        <RevisionNotice />

        <OngoingMoTable />
      </div>
    </main>
  );
}
