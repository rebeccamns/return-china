"use client";

import * as React from "react";
import { useState } from "react";
import { Plus, Send } from "lucide-react";
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

type Material = {
  code: string;
  englishName: string;
  chinaName: string;
};

type WoRow = {
  id: string;
  code: string;
  model: string;
  iqcStatus: "Passed" | "Failed";
  materials: Material[];
};

// TODO: replace with real data from your API once it exists
const initialRows: WoRow[] = [
  {
    id: "wo-1",
    code: "T2026090410261301048",
    model: "Latte-M",
    iqcStatus: "Passed",
    materials: [
      { code: "621032000320", englishName: "Battery cover AC175", chinaName: "电池盖组件 AC175 绿" },
      { code: "621032000320", englishName: "Display Panel", chinaName: "显示屏面板" },
      { code: "621032000320", englishName: "Camera Module", chinaName: "相机模组" },
      { code: "621032000320", englishName: "Camera Module", chinaName: "相机模组" },
      { code: "621032000320", englishName: "Display Panel", chinaName: "显示屏面板" },
    ],
  },
  {
    id: "wo-2",
    code: "T2026090410261301049",
    model: "Latte-M",
    iqcStatus: "Passed",
    materials: [
      { code: "621032000320", englishName: "Battery cover AC175", chinaName: "电池盖组件 AC175 绿" },
      { code: "621032000320", englishName: "Display Panel", chinaName: "显示屏面板" },
      { code: "621032000320", englishName: "Camera Module", chinaName: "相机模组" },
      { code: "621032000320", englishName: "Camera Module", chinaName: "相机模组" },
      { code: "621032000320", englishName: "Display Panel", chinaName: "显示屏面板" },
    ],
  },
  {
    id: "wo-3",
    code: "T2026090410261301050",
    model: "Latte-M",
    iqcStatus: "Passed",
    materials: [
      { code: "621032000320", englishName: "Battery cover AC175", chinaName: "电池盖组件 AC175 绿" },
      { code: "621032000320", englishName: "Display Panel", chinaName: "显示屏面板" },
      { code: "621032000320", englishName: "Camera Module", chinaName: "相机模组" },
      { code: "621032000320", englishName: "Camera Module", chinaName: "相机模组" },
      { code: "621032000320", englishName: "Display Panel", chinaName: "显示屏面板" },
    ],
  },
];

export default function WoEntryPage() {
  const [rows] = useState<WoRow[]>(initialRows);
  const [woValues, setWoValues] = useState<Record<string, string>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function updateWo(id: string, value: string) {
    setWoValues((prev) => ({ ...prev, [id]: value }));
  }

  function submitWo(id: string) {
    const wo = woValues[id];
    if (!wo?.trim()) return;
    // TODO: send { moId: id, wo } to your API here
    alert(`WO "${wo}" submitted for ${id} (not yet connected to a backend).`);
  }

  return (
    <main className="min-h-screen w-full bg-backgroundbg-gray">
      <Sidebar />
      <div className="flex min-h-screen flex-col pl-[255px]">
        <TopBar />

        <div className="mt-[52px] w-full px-[18px] py-5">
          <nav className="mb-4 flex items-center gap-2 text-xs">
            <span className="text-text-colortext-gray">Entry</span>
            <span className="text-[#B5B5B3]">›</span>
            <span className="font-medium text-text-colortext-dark">WO Entry</span>
          </nav>

          <h1 className="mb-4 text-lg font-semibold text-[#111111]">WO Entry</h1>

          <div className="overflow-hidden rounded-lg border border-strokestroke-gray bg-white">
            <div className="px-[18px] py-[18px]">
              <h2 className="text-sm font-semibold text-[#111111]">MO List</h2>
            </div>

            <div className="border-t border-strokestroke-gray" />

            <div className="px-[18px] pb-[18px] pt-4">
              <div className="overflow-hidden rounded-md border border-strokestroke-gray">
                <Table>
                  <TableHeader className="bg-[#F8F8F8]">
                    <TableRow className="hover:bg-[#F8F8F8]">
                      <TableHead className="w-12 px-3 text-xs" />
                      <TableHead className="px-3 text-xs">MO Code</TableHead>
                      <TableHead className="px-3 text-xs">Model</TableHead>
                      <TableHead className="px-3 text-xs">IQC Status</TableHead>
                      <TableHead className="px-3 text-xs">Material</TableHead>
                      <TableHead className="px-3 text-xs">WO</TableHead>
                      <TableHead className="w-32 px-3 text-xs" />
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {rows.map((row) => {
                      const woValue = woValues[row.id] ?? "";
                      const canSubmit = woValue.trim().length > 0;
                      const isExpanded = expandedId === row.id;

                      return (
                        <React.Fragment key={row.id}>
                          <TableRow key={row.id} className="h-14 hover:bg-[#FAFAFA]">
                            <TableCell className="px-3 py-2">
                              <Button
                                type="button"
                                variant="outline"
                                className="h-7 w-7 p-0"
                                onClick={() =>
                                  setExpandedId(isExpanded ? null : row.id)
                                }
                                aria-label="Expand row"
                              >
                                <Plus
                                  className={`h-3.5 w-3.5 transition-transform ${
                                    isExpanded ? "rotate-45" : ""
                                  }`}
                                />
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
                                {row.iqcStatus}
                              </span>
                            </TableCell>

                            <TableCell className="px-3 py-2 text-xs text-[#111111]">
                              {row.materials.length} items
                            </TableCell>

                            <TableCell className="px-3 py-2">
                              <Input
                                placeholder="Input WO"
                                value={woValue}
                                onChange={(e) => updateWo(row.id, e.target.value)}
                                className="h-9 rounded-md border-strokestroke-gray px-3 text-xs placeholder:text-[#A3A3A1]"
                              />
                            </TableCell>

                            <TableCell className="px-3 py-2">
                              <Button
                                type="button"
                                disabled={!canSubmit}
                                onClick={() => submitWo(row.id)}
                                className={`h-9 w-full gap-2 rounded-md px-3 text-xs font-semibold text-white ${
                                  canSubmit
                                    ? "bg-gradient-to-b from-[#058346] to-[#0b5934] hover:opacity-90"
                                    : "cursor-not-allowed bg-slate-300 hover:bg-slate-300"
                                }`}
                              >
                                <Send className="h-3.5 w-3.5" />
                                Submit WO
                              </Button>
                            </TableCell>
                          </TableRow>

                          {isExpanded && (
                            <>
                              <TableRow key={`${row.id}-header`} className="bg-slate-50 hover:bg-slate-50">
                                <TableHead className="w-12" />
                                <TableHead className="text-xs">Material Code</TableHead>
                                <TableHead colSpan={2} className="text-xs">English Name</TableHead>
                                <TableHead colSpan={3} className="text-xs">China Name</TableHead>
                              </TableRow>
                              {row.materials.map((material, i) => (
                                <TableRow
                                  key={`${row.id}-material-${i}`}
                                  className="bg-slate-50/40 hover:bg-slate-50/40"
                                >
                                  <TableCell />
                                  <TableCell className="text-xs">{material.code}</TableCell>
                                  <TableCell colSpan={2} className="text-xs">
                                    {material.englishName}
                                  </TableCell>
                                  <TableCell colSpan={3} className="text-xs">
                                    {material.chinaName}
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
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}