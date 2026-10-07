"use client";
import * as React from "react";
import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Filter,
  Info,
  MoreHorizontal,
    ChevronDown,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const taskItems = [
  {
    name: "BATCH202609 - Return Idle Latte M",
    progress: "2/12",
  },
  {
    name: "BATCH202609 - Receive Material Latte M",
    progress: "2/12",
  },
  {
    name: "BATCH202609 - Verify Material Latte M",
    progress: "2/12",
  },
];

const chartItems = [
  { label: "BATCH202609", normal: 74, abnormal: 26 },
  { label: "BATCH202610", normal: 137, abnormal: 72 },
  { label: "BATCH202611", normal: 107, abnormal: 90 },
  { label: "BATCH202611", normal: 54, abnormal: 107 },
  { label: "BATCH202611", normal: 117, abnormal: 74 },
  { label: "BATCH202611", normal: 107, abnormal: 90 },
];

const ongoingMoRows = [
  {
    code: "T2026090410261301048",
    model: "Latte-M",
    step: "Staff Return",
    updated: "Sep 22, 08:15",
  },
  {
    code: "T2026090410261301048",
    model: "Latte-M",
    step: "Staff Return",
    updated: "Sep 22, 08:15",
  },
  {
    code: "T2026090410261301048",
    model: "Latte-M",
    step: "Staff Return",
    updated: "Sep 22, 08:15",
  },
];

const axisValues = ["8", "6", "4", "2", "0"];

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

function TaskProgressCard() {
  const [view, setView] = useState<"overall" | "details">("overall");

  return (
    <Card className="min-w-0 flex-1 overflow-hidden rounded-lg border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between gap-4 border-b px-4 py-3">
        <CardTitle className="text-sm font-semibold">Task Progress</CardTitle>
        <div className="flex h-8 rounded-md bg-slate-100 p-0.5">
          {(["overall", "details"] as const).map((item) => (
            <Button
              key={item}
              type="button"
              variant="ghost"
              className={`h-7 rounded px-3 text-[10px] font-medium capitalize ${
                view === item
                  ? "bg-gradient-to-b from-[#058346] to-[#0b5934] text-white hover:text-white"
                  : "text-slate-700"
              }`}
              onClick={() => setView(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-4 py-3">
        {view === "overall" ? (
          <>
            <section className="space-y-2">
              <div className="flex items-end gap-1">
                <strong className="text-2xl leading-6">1/3</strong>
                <span className="text-xs text-slate-500">task complete</span>
              </div>
              <div className="flex items-center gap-2">
                <ProgressBar value={33} />
                <span className="text-[10px] text-slate-600">33%</span>
              </div>
            </section>
            <div className="border-t border-slate-200" />
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Task List</h3>
                <span className="text-[10px] text-slate-500">
                  3 task ongoing
                </span>
              </div>
              <div className="divide-y divide-slate-200">
                {taskItems.map((task) => (
                  <div
                    key={task.name}
                    className="flex items-center justify-between gap-3 py-2 text-xs"
                  >
                    <span className="truncate">{task.name}</span>
                    <span className="shrink-0 text-slate-600">
                      {task.progress}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
            Task details
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function KpiCard() {
  return (
    <Card className="min-w-0 flex-1 overflow-hidden rounded-lg border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between gap-3 border-b px-4 py-3">
        <CardTitle className="text-sm font-semibold">KPI</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-8 gap-2 px-3 text-[10px]"
            type="button"
          >
            <CalendarDays className="h-3.5 w-3.5" />
            Today
          </Button>
          <Select defaultValue="all">
            <SelectTrigger className="h-8 w-[104px] gap-1 px-3 text-[10px]">
              <Filter className="h-3.5 w-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-5">
        <div className="flex h-[200px] gap-4">
          <div className="flex w-8 flex-col justify-between pb-5 pt-1 text-[9px] text-slate-700">
            <span className="rotate-[-90deg] whitespace-nowrap text-slate-500">
              Lead time (days)
            </span>
            <div className="flex h-[125px] flex-col justify-between text-right">
              {axisValues.map((value) => (
                <span key={value}>{value}</span>
              ))}
            </div>
          </div>
          <div className="relative flex min-w-0 flex-1 items-end border-l border-slate-300">
            {[0, 25, 50, 75, 100].map((position) => (
              <div
                key={position}
                className="pointer-events-none absolute inset-x-0 border-t border-dashed border-slate-200"
                style={{ top: `${position}%` }}
              />
            ))}
            <div className="relative z-10 flex w-full items-end justify-around gap-2 px-2">
              {chartItems.map((item, index) => (
                <div
                  key={`${item.label}-${index}`}
                  className="flex min-w-0 flex-1 flex-col items-center gap-1"
                >
                  <div className="flex h-[137px] items-end gap-1">
                    <div
                      className="w-3 rounded-t-sm bg-gradient-to-t from-[#4ce498] to-[#128d2a]"
                      style={{ height: `${item.normal}px` }}
                    />
                    <div
                      className="w-3 rounded-t-sm bg-gradient-to-b from-[#c92230] to-[#ff8b4d]"
                      style={{ height: `${item.abnormal}px` }}
                    />
                  </div>
                  <span className="max-w-full truncate text-[10px] font-medium text-slate-500">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-center gap-5 text-[9px] text-slate-600">
          <span className="flex items-center gap-1">
            <i className="h-2 w-2 rounded-full bg-[#128d2a]" />
            Flow Normal
          </span>
          <span className="flex items-center gap-1">
            <i className="h-2 w-2 rounded-full bg-[#c92230]" />
            Flow Abnormal
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

type Material = {
  code: string;
  englishName: string;
  chinaName: string;
};

type RevisionItem = {
  id: string;
  code: string;
  reflowFrom: string;
  reason: string;
  materials: Material[];
};

/* --------------------------------
   Dummy Data
-------------------------------- */

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

/* --------------------------------
   Component
-------------------------------- */

export function RevisionNotice() {
  const [items, setItems] = useState<RevisionItem[]>(
    initialRevisionItems
  );

  // Controls the whole Revision Required section
  const [showAll, setShowAll] = useState(false);

  // Controls which individual MO is expanded
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const detailsRef = React.useRef<HTMLDivElement>(null);

  /* --------------------------------
     Expand / Collapse all
  -------------------------------- */

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
    }
  }

  /* --------------------------------
     Expand individual MO
  -------------------------------- */

  function toggleRow(id: string) {
    setExpandedId((current) =>
      current === id ? null : id
    );
  }

  /* --------------------------------
     Resubmit
  -------------------------------- */

  function resubmit(id: string) {
    const item = items.find((item) => item.id === id);

    // TODO:
    // Send `item` to your API here.
    console.log("Resubmitting:", item);

    // Remove from revision list after successful resubmission
    setItems((prev) =>
      prev.filter((item) => item.id !== id)
    );

    setExpandedId(null);
  }

  /* --------------------------------
     Update material
  -------------------------------- */

  function updateMaterial(
    itemId: string,
    materialIndex: number,
    field: keyof Material,
    value: string
  ) {
    setItems((prev) =>
      prev.map((item) =>
        item.id !== itemId
          ? item
          : {
              ...item,
              materials: item.materials.map(
                (material, index) =>
                  index === materialIndex
                    ? {
                        ...material,
                        [field]: value,
                      }
                    : material
              ),
            }
      )
    );
  }

  return (
    <Card className="overflow-hidden rounded-lg border-strokestroke-gray bg-white">
      {/* =====================================
          HEADER
      ===================================== */}

      <CardContent className="flex items-center justify-between gap-4 px-4 py-3">
        {/* Left */}
        <div className="flex min-w-0 items-center gap-3">
          <Info className="h-4 w-4 shrink-0 text-red-500" />

          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-red-500">
              Revision Required
            </h2>

            <p className="text-xs text-slate-500">
              These MOs were reflowed by Admin and require
              data correction before the process can continue.
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex shrink-0 items-center gap-5">
          <Badge
            className="
              rounded
              bg-red-50
              px-2
              py-0.5
              text-xs
              font-semibold
              text-red-500
              hover:bg-red-50
            "
          >
            {items.length} Item
            {items.length === 1 ? "" : "s"}
          </Badge>

          <Button
            variant="ghost"
            type="button"
            onClick={toggleShowAll}
            className="
              h-auto
              gap-1.5
              p-0
              text-xs
              font-semibold
              text-slate-700
              hover:bg-transparent
              hover:text-slate-900
            "
          >
            {showAll ? "Hide All" : "View All"}

            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform duration-200",
                showAll && "rotate-180"
              )}
            />
          </Button>
        </div>
      </CardContent>

      {/* =====================================
          EXPANDABLE CONTENT
      ===================================== */}

      <div
        ref={detailsRef}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-200",
          showAll
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="border-t border-strokestroke-gray px-4 pb-4 pt-3">
            <div className="overflow-x-auto rounded-md border border-strokestroke-gray">
              <Table className="min-w-[850px]">
                {/* =====================================
                    TABLE HEADER
                ===================================== */}

                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 px-3" />

                    <TableHead className="px-3">
                      MO Code
                    </TableHead>

                    <TableHead className="px-3">
                      Reflow From
                    </TableHead>

                    <TableHead className="px-3">
                      Reason
                    </TableHead>

                    <TableHead className="w-24 px-3 text-right">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                {/* =====================================
                    TABLE BODY
                ===================================== */}

                <TableBody>
                  {items.map((item) => {
                    const isExpanded =
                      expandedId === item.id;

                    return (
                      <React.Fragment key={item.id}>
                        {/* ---------------------------------
                            MO ROW
                        --------------------------------- */}

                        <TableRow className="h-12">
                          {/* Expand */}
                          <TableCell className="px-3">
                            <Button
                              type="button"
                              variant="outline"
                              className="h-6 w-6 rounded-md p-0"
                              onClick={() =>
                                toggleRow(item.id)
                              }
                              aria-label={
                                isExpanded
                                  ? "Collapse row"
                                  : "Expand row"
                              }
                            >
                              <Plus
                                className={cn(
                                  "h-3.5 w-3.5 transition-transform duration-200",
                                  isExpanded &&
                                    "rotate-45"
                                )}
                              />
                            </Button>
                          </TableCell>

                          {/* MO Code */}
                          <TableCell className="px-3 text-xs">
                            {item.code}
                          </TableCell>

                          {/* Reflow From */}
                          <TableCell className="px-3 text-xs">
                            {item.reflowFrom}
                          </TableCell>

                          {/* Reason */}
                          <TableCell className="px-3 text-xs">
                            {item.reason}
                          </TableCell>

                          {/* Action */}
                          <TableCell className="px-3 text-right">
                            {isExpanded ? (
                              <Button
                                type="button"
                                className="
                                  h-7
                                  rounded-md
                                  bg-gradient-to-b
                                  from-[#058346]
                                  to-[#0b5934]
                                  px-3
                                  text-xs
                                  text-white
                                  hover:opacity-90
                                "
                                onClick={() =>
                                  resubmit(item.id)
                                }
                              >
                                Resubmit
                              </Button>
                            ) : (
                              <button
                                type="button"
                                className="
                                  text-xs
                                  font-medium
                                  text-blue-600
                                  hover:underline
                                "
                                onClick={() =>
                                  toggleRow(item.id)
                                }
                              >
                                Edit
                              </button>
                            )}
                          </TableCell>
                        </TableRow>

                        {/* =================================
                            EXPANDED MATERIALS
                        ================================= */}

                        {isExpanded && (
                          <>
                            {/* Material Header */}

                            <TableRow>
                              <TableHead className="w-12" />

                              <TableHead className="px-3">
                                Material Code
                              </TableHead>

                              <TableHead className="px-3">
                                English Name
                              </TableHead>

                              <TableHead className="px-3">
                                China Name
                              </TableHead>

                              <TableHead />
                            </TableRow>

                            {/* Material Rows */}

                            {item.materials.map(
                              (material, index) => (
                                <TableRow key={index}>
                                  {/* Empty expand column */}
                                  <TableCell />

                                  {/* Material Code */}

                                  <TableCell className="px-3 py-2">
                                    <input
                                      type="text"
                                      className="
                                        h-7
                                        w-full
                                        rounded-md
                                        border
                                        border-strokestroke-gray
                                        bg-white
                                        px-2
                                        text-xs
                                        outline-none
                                        transition-colors
                                        focus:border-primaryprimary-green
                                      "
                                      value={material.code}
                                      onChange={(e) =>
                                        updateMaterial(
                                          item.id,
                                          index,
                                          "code",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </TableCell>

                                  {/* English Name */}

                                  <TableCell className="px-3 py-2">
                                    <input
                                      type="text"
                                      className="
                                        h-7
                                        w-full
                                        rounded-md
                                        border
                                        border-strokestroke-gray
                                        bg-white
                                        px-2
                                        text-xs
                                        outline-none
                                        transition-colors
                                        focus:border-primaryprimary-green
                                      "
                                      value={
                                        material.englishName
                                      }
                                      onChange={(e) =>
                                        updateMaterial(
                                          item.id,
                                          index,
                                          "englishName",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </TableCell>

                                  {/* China Name */}

                                  <TableCell className="px-3 py-2">
                                    <input
                                      type="text"
                                      className="
                                        h-7
                                        w-full
                                        rounded-md
                                        border
                                        border-strokestroke-gray
                                        bg-white
                                        px-2
                                        text-xs
                                        outline-none
                                        transition-colors
                                        focus:border-primaryprimary-green
                                      "
                                      value={
                                        material.chinaName
                                      }
                                      onChange={(e) =>
                                        updateMaterial(
                                          item.id,
                                          index,
                                          "chinaName",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </TableCell>

                                  {/* Empty action column */}
                                  <TableCell />
                                </TableRow>
                              )
                            )}
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

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";


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
      { code: "621032000320", englishName: "Battery cover AC175", chinaName: "电池盖组件 AC175 绿" },
      { code: "621032000320", englishName: "Display Panel", chinaName: "显示屏面板" },
      { code: "621032000320", englishName: "Camera Module", chinaName: "相机模组" },
      { code: "621032000320", englishName: "Camera Module", chinaName: "相机模组" },
      { code: "621032000320", englishName: "Display Panel", chinaName: "显示屏面板" },
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
  const [rows, setRows] = useState<MoRow[]>(initialOngoingMoRows);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  function startEdit(id: string) {
    setEditingId(id);
    setExpandedId(id); // editing implies the row is open so the fields are visible
  }

  function cancelEdit() {
    setEditingId(null);
  }

  function submitEdit() {
    // TODO: send `rows.find(r => r.id === editingId)` to your API here
    setEditingId(null);
  }

  function deleteRow(id: string) {
    const confirmed = window.confirm("Delete this MO's data? This can't be undone.");
    if (!confirmed) return;
    setRows((prev) => prev.filter((row) => row.id !== id));
  }

  function updateMaterial(
    rowId: string,
    materialIndex: number,
    field: keyof Material,
    value: string
  ) {
    setRows((prev) =>
      prev.map((row) =>
        row.id !== rowId
          ? row
          : {
              ...row,
              materials: row.materials.map((m, i) =>
                i === materialIndex ? { ...m, [field]: value } : m
              ),
            }
      )
    );
  }

  return (
  <Card className="overflow-hidden rounded-lg border-[var(--strokestroke-gray)]">
    <CardHeader className="px-4 py-3">
      <CardTitle className="text-sm font-semibold">Ongoing MO</CardTitle>
    </CardHeader>

    <CardContent className="px-4 pb-4">
      <div className="overflow-x-auto rounded border border-[var(--strokestroke-gray)]">
        <Table className="min-w-[850px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 px-3" />
              <TableHead className="px-3">MO Code</TableHead>
              <TableHead className="px-3">Model</TableHead>
              <TableHead className="px-3">Progress</TableHead>
              <TableHead className="px-3">Current Step</TableHead>
              <TableHead className="px-3">Last Updated</TableHead>
              <TableHead className="w-[120px] px-3 text-center">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((row) => {
              const isEditing = editingId === row.id;
              const isExpanded = expandedId === row.id;

              return (
                <React.Fragment key={row.id}>
                  {/* Main row */}
                  <TableRow className="h-12">
                    <TableCell className="w-12 px-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-7 w-7 rounded-md p-0"
                        onClick={() =>
                          setExpandedId(
                            isExpanded ? null : row.id
                          )
                        }
                        aria-label="Expand row"
                      >
                        <Plus
                          className={cn(
                            "h-4 w-4 transition-transform",
                            isExpanded && "rotate-45"
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

                    <TableCell className="px-3 text-xs">
                      {row.step}
                    </TableCell>

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
                            onClick={cancelEdit}
                          >
                            Cancel
                          </Button>

                          <Button
                            type="button"
                            className="h-7 rounded-md bg-[#058346] px-2.5 text-xs text-white hover:bg-[#0b5934]"
                            onClick={submitEdit}
                          >
                            Submit
                          </Button>
                        </div>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="h-7 w-8 rounded-md p-0"
                              aria-label="More actions"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => startEdit(row.id)}
                            >
                              Edit Data
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              destructive
                              onClick={() => deleteRow(row.id)}
                            >
                              Delete Data
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>

                  {/* Expanded material rows */}
                  {expandedId === row.id && (
                    <>
                      <TableRow>
                        <TableHead className="w-12" />
                        <TableHead>Material Code</TableHead>
                        <TableHead colSpan={2}>English Name</TableHead>
                        <TableHead colSpan={3}>China Name</TableHead>
                      </TableRow>
                      {row.materials.map((material, i) => (
                        <TableRow key={i}>
                          <TableCell />
                          <TableCell className="text-xs">
                            {editingId === row.id ? (
                              <input
                                className="w-full rounded-md border border-strokestroke-gray px-2 py-1.5 text-xs focus:border-primaryprimary-green focus:outline-none"
                                value={material.code}
                                onChange={(e) => updateMaterial(row.id, i, "code", e.target.value)}
                              />
                            ) : (
                              material.code
                            )}
                          </TableCell>
                          <TableCell colSpan={2} className="text-xs">
                            {editingId === row.id ? (
                              <input
                                className="w-full rounded-md border border-strokestroke-gray px-2 py-1.5 text-xs focus:border-primaryprimary-green focus:outline-none"
                                value={material.englishName}
                                onChange={(e) =>
                                  updateMaterial(row.id, i, "englishName", e.target.value)
                                }
                              />
                            ) : (
                              material.englishName
                            )}
                          </TableCell>
                          <TableCell colSpan={3} className="text-xs">
                            {editingId === row.id ? (
                              <input
                                className="w-full rounded-md border border-strokestroke-gray px-2 py-1.5 text-xs focus:border-primaryprimary-green focus:outline-none"
                                value={material.chinaName}
                                onChange={(e) =>
                                  updateMaterial(row.id, i, "chinaName", e.target.value)
                                }
                              />
                            ) : (
                              material.chinaName
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
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

export default function DashboardContent(): JSX.Element {
  return (
    <main className="z-[1] mt-[52px] w-full px-4 pb-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1625px] flex-col gap-5">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500">
          Dashboard
        </nav>
        <h1 className="text-lg font-semibold text-slate-950">Dashboard</h1>
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
