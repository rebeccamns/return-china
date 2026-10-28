"use client";

import * as React from "react";
import { useState } from "react";
import { AlertCircle, ChevronDown, Info, MoreHorizontal, Plus } from "lucide-react";

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

import KpiCard from "@/components/ui/kpichart";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import TaskProgressCard from "./TaskProgressCard";

const inputClass =
  "h-7 w-full rounded-md border border-strokestroke-gray bg-white px-2 text-xs outline-none transition-colors focus:border-primaryprimary-green";

const nestedHeadClass =
  "bg-slate-100 px-3 text-xs font-semibold text-slate-700";
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
  isRejected?: boolean;
};

type RevisionItem = {
  id: string;
  code: string;
  reflowFrom: string;
  reason: string;
  materials: Material[];
};

const blankMaterial: Material = {
  code: "",
  englishName: "",
  chinaName: "",
};

/* =========================================================
   REVISION DATA
========================================================= */

const initialRevisionItems: RevisionItem[] = [
  {
    id: "rev-1",
    code: "T2026090410261301048",
    reflowFrom: "PMC Entry",
    reason: "Staff Return",
    materials: [
      {
        code: "621032000320",
        englishName: "Battery cover AC175",
        chinaName: "电池盖组件 AC175 绿",
        isRejected: true,
      },
      {
        code: "621032000320",
        englishName: "Display Panel",
        chinaName: "显示屏面板",
      },
      {
        code: "621032000320",
        englishName: "Camera Module",
        chinaName: "相机模组",
      },
      {
        code: "621032000320",
        englishName: "Camera Module",
        chinaName: "相机模组",
      },
      {
        code: "621032000320",
        englishName: "Display Panel",
        chinaName: "显示屏面板",
      },
    ],
  },
  {
    id: "rev-2",
    code: "T2026090410261301049",
    reflowFrom: "IQC Scan",
    reason: "Staff Return",
    materials: [],
  },
  {
    id: "rev-3",
    code: "T2026090410261301050",
    reflowFrom: "Exim",
    reason: "Staff Return",
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
    field: keyof Material,
    value: string,
  ) {
    setDraftMaterials((prev) =>
      prev.map((material, index) =>
        index === materialIndex ? { ...material, [field]: value } : material,
      ),
    );
  }

  function addDraftMaterial() {
    setDraftMaterials((prev) => [...prev, { ...blankMaterial }]);
  }

  function resubmit(id: string) {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;

    console.log("Resubmitting:", item); // TODO: send the corrected MO to your API
    setItems((prev) => prev.filter((entry) => entry.id !== id));
    setExpandedId(null);
    setEditingId(null);
    setDraftMaterials([]);
  }

  return (
    <Card className="overflow-hidden rounded-lg border-strokestroke-gray bg-white">
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
            <div className="overflow-x-auto rounded-md border border-strokestroke-gray">
              <Table className="min-w-[850px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 px-3" />
                    <TableHead className="px-3">{t("common.moCode")}</TableHead>
                    <TableHead className="px-3">{t("dashboard.revision.reflowFrom")}</TableHead>
                    <TableHead className="px-3">{t("dashboard.revision.reason")}</TableHead>
                    <TableHead className="w-24 px-3 text-right">
                      {t("common.action")}
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {items.map((item) => {
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
                              <Plus
                                className={cn(
                                  "h-3.5 w-3.5 transition-transform duration-200",
                                  isExpanded && "rotate-45",
                                )}
                              />
                            </Button>
                          </TableCell>
                          <TableCell className="px-3 text-xs">{item.code}</TableCell>
                          <TableCell className="px-3 text-xs">{item.reflowFrom}</TableCell>
                          <TableCell className="px-3 text-xs">{item.reason}</TableCell>
                          <TableCell className="px-3 text-right">
                            {!isEditing && (
                              <Button
                                type="button"
                                variant="ghost"
                                className="h-7 px-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
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
                          <>
                            <TableRow className="hover:bg-slate-100">
                              <TableHead className={cn(nestedHeadClass, "w-12")} />
                              <TableHead className={nestedHeadClass}>{t("common.materialCode")}</TableHead>
                              <TableHead className={nestedHeadClass}>{t("common.englishName")}</TableHead>
                              <TableHead className={nestedHeadClass}>{t("common.chinaName")}</TableHead>
                              <TableHead className={nestedHeadClass}>{isEditing ? "Status" : ""}</TableHead>
                            </TableRow>

                            {displayedMaterials.map((material, index) => (
                              <TableRow
                                key={`${item.id}-${index}`}
                                className={cn(
                                  material.isRejected && "bg-red-50/50 hover:bg-red-50/70",
                                )}
                              >
                                <TableCell />
                                <TableCell className="px-3 py-2">
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      className={cn(
                                        inputClass,
                                        material.isRejected && "border-red-400 focus:border-red-500",
                                      )}
                                      value={material.code}
                                      onChange={(event) => updateDraftMaterial(index, "code", event.target.value)}
                                    />
                                  ) : (
                                    <span className="inline-flex items-center gap-2 text-xs">
                                      {material.code}
                                      {material.isRejected && (
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
                                    <input
                                      type="text"
                                      className={cn(
                                        inputClass,
                                        material.isRejected && "border-red-400 focus:border-red-500",
                                      )}
                                      value={material.englishName}
                                      onChange={(event) => updateDraftMaterial(index, "englishName", event.target.value)}
                                    />
                                  ) : (
                                    <span className="text-xs">{material.englishName}</span>
                                  )}
                                </TableCell>
                                <TableCell className="px-3 py-2">
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      className={cn(
                                        inputClass,
                                        material.isRejected && "border-red-400 focus:border-red-500",
                                      )}
                                      value={material.chinaName}
                                      onChange={(event) => updateDraftMaterial(index, "chinaName", event.target.value)}
                                    />
                                  ) : (
                                    <span className="text-xs">{material.chinaName}</span>
                                  )}
                                </TableCell>
                                <TableCell className="px-3 py-2 text-right">
                                  {isEditing && material.isRejected && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-red-600">
                                      <AlertCircle className="h-3.5 w-3.5" />
                                      Rejected
                                    </span>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}

                            <TableRow className="hover:bg-transparent">
                              <TableCell />
                              <TableCell colSpan={4} className="px-3 py-3">
                                <div className="flex items-center justify-between gap-3">
                                  {isEditing ? (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      className="h-7 rounded-md px-3 text-xs"
                                      onClick={addDraftMaterial}
                                    >
                                      <Plus className="h-3.5 w-3.5" />
                                      {t("dashboard.revision.addMaterial")}
                                    </Button>
                                  ) : (
                                    <span className="text-xs text-slate-500">Read-only view</span>
                                  )}

                                  <div className="flex items-center gap-2">
                                    {isEditing && (
                                      <>
                                        <Button
                                          type="button"
                                          variant="outline"
                                          className="h-7 rounded-md px-3 text-xs"
                                          onClick={cancelEdit}
                                        >
                                          {t("common.cancel")}
                                        </Button>
                                        <Button
                                          type="button"
                                          className="h-7 rounded-md bg-[#058346] px-3 text-xs font-semibold text-white hover:bg-[#0b5934]"
                                          onClick={saveEdit}
                                        >
                                          Save Changes
                                        </Button>
                                      </>
                                    )}
                                    <Button
                                      type="button"
                                      className="h-7 rounded-md bg-gradient-to-b from-[#058346] to-[#0b5934] px-4 text-xs font-semibold text-white hover:opacity-90"
                                      onClick={() => resubmit(item.id)}
                                      disabled={isEditing}
                                      title={isEditing ? "Save or cancel your changes before resubmitting" : undefined}
                                    >
                                      {t("dashboard.revision.resubmit")}
                                    </Button>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          </>
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
  updated: string;
  materials: Material[];
};

const initialOngoingMoRows: MoRow[] = [
  {
    id: "mo-1",
    code: "T2026090410261301048",
    model: "Latte-M",
    step: "Staff Return",
    updated: "Sep 22, 08:15",
    materials: [
      {
        code: "621032000320",
        englishName: "Battery cover AC175",
        chinaName: "电池盖组件 AC175 绿",
      },
      {
        code: "621032000320",
        englishName: "Display Panel",
        chinaName: "显示屏面板",
      },
      {
        code: "621032000320",
        englishName: "Camera Module",
        chinaName: "相机模组",
      },
      {
        code: "621032000320",
        englishName: "Camera Module",
        chinaName: "相机模组",
      },
      {
        code: "621032000320",
        englishName: "Display Panel",
        chinaName: "显示屏面板",
      },
    ],
  },
  {
    id: "mo-2",
    code: "T2026090410261301049",
    model: "Latte-M",
    step: "Staff Return",
    updated: "Sep 22, 08:15",
    materials: [],
  },
  {
    id: "mo-3",
    code: "T2026090410261301050",
    model: "Latte-M",
    step: "Staff Return",
    updated: "Sep 22, 08:15",
    materials: [],
  },
];

function OngoingMoTable() {
  const { t } = useI18n();
  const [rows, setRows] = useState<MoRow[]>(initialOngoingMoRows);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

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
    field: keyof Material,
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

  const cellInputClass =
    "w-full rounded-md border border-strokestroke-gray px-2 py-1.5 text-xs focus:border-primaryprimary-green focus:outline-none";

  return (
    <Card className="overflow-hidden rounded-lg border-[var(--strokestroke-gray)]">
      <CardHeader className="px-4 py-3">
        <CardTitle className="text-sm font-semibold">{t("dashboard.ongoingMo.title")}</CardTitle>
      </CardHeader>

      <CardContent className="px-4 pb-4">
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
              {rows.map((row) => {
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
                          <Plus
                            className={cn(
                              "h-4 w-4 transition-transform",
                              isExpanded && "rotate-45",
                            )}
                          />
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
                        {row.updated}
                      </TableCell>

                      <TableCell className="px-3 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <Button
                              type="button"
                              variant="outline"
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
                              className="h-7 rounded-md bg-[#058346] px-2.5 text-xs text-white hover:bg-[#0b5934]"
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
                      <>
                        <TableRow className="backgroundbg-gray-50 hover:bg-gray-50">
                          <TableHead className={cn(nestedHeadClass, "w-12")} />
                          <TableHead className={nestedHeadClass}>
                            {t("common.materialCode")}
                          </TableHead>
                          <TableHead colSpan={2} className={nestedHeadClass}>
                            {t("common.englishName")}
                          </TableHead>
                          <TableHead colSpan={3} className={nestedHeadClass}>
                            {t("common.chinaName")}
                          </TableHead>
                        </TableRow>

                        {row.materials.map((material, index) => (
                          <TableRow key={index}>
                            <TableCell />

                            <TableCell className="text-xs">
                              {isEditing ? (
                                <input
                                  className={cellInputClass}
                                  value={material.code}
                                  onChange={(e) =>
                                    updateMaterial(
                                      row.id,
                                      index,
                                      "code",
                                      e.target.value,
                                    )
                                  }
                                />
                              ) : (
                                material.code
                              )}
                            </TableCell>

                            <TableCell colSpan={2} className="text-xs">
                              {isEditing ? (
                                <input
                                  className={cellInputClass}
                                  value={material.englishName}
                                  onChange={(e) =>
                                    updateMaterial(
                                      row.id,
                                      index,
                                      "englishName",
                                      e.target.value,
                                    )
                                  }
                                />
                              ) : (
                                material.englishName
                              )}
                            </TableCell>

                            <TableCell colSpan={3} className="text-xs">
                              {isEditing ? (
                                <input
                                  className={cellInputClass}
                                  value={material.chinaName}
                                  onChange={(e) =>
                                    updateMaterial(
                                      row.id,
                                      index,
                                      "chinaName",
                                      e.target.value,
                                    )
                                  }
                                />
                              ) : (
                                material.chinaName
                              )}
                            </TableCell>
                          </TableRow>
                        ))}

                        {isEditing && (
                          <TableRow>
                            <TableCell />
                            <TableCell colSpan={6} className="py-3">
                              <Button
                                type="button"
                                variant="outline"
                                className="h-7 rounded-md px-3 text-xs"
                                onClick={() => addMaterial(row.id)}
                              >
                                <Plus className="h-3.5 w-3.5" />
                                {t("dashboard.ongoingMo.addMaterial")}
                              </Button>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
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
