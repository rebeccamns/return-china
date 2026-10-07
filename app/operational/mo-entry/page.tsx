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

type MaterialRow = {
  code: string;
  englishName: string;
  chinaName: string;
  qty: string;
};

// TODO: replace with real material master data from your backend once it exists
const MATERIAL_CODE_OPTIONS = [
  { code: "621032000320", englishName: "Battery cover AC175", chinaName: "电池盖组件 AC175 绿" },
  { code: "621032000321", englishName: "Display Panel", chinaName: "显示屏面板" },
  { code: "621032000322", englishName: "Camera Module", chinaName: "相机模组" },
];

const initialRows: MaterialRow[] = [
  { code: "621032000320", englishName: "Battery cover AC175", chinaName: "电池盖组件 AC175 绿", qty: "5" },
  { code: "621032000320", englishName: "Display Panel", chinaName: "显示屏面板", qty: "10" },
  { code: "621032000320", englishName: "Camera Module", chinaName: "相机模组", qty: "7" },
  { code: "621032000320", englishName: "Camera Module", chinaName: "相机模组", qty: "7" },
  { code: "621032000320", englishName: "Display Panel", chinaName: "显示屏面板", qty: "10" },
];

export default function MoEntryPage() {
  const [moNumber, setMoNumber] = useState("");
  const [model, setModel] = useState("");
  const [rows, setRows] = useState<MaterialRow[]>(initialRows);
  const [checkedRows, setCheckedRows] = useState<Set<number>>(new Set());
  const [statusMessage, setStatusMessage] = useState("");

  function updateRow(index: number, field: keyof MaterialRow, value: string) {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  }

  // Selecting a material code auto-fills its English/China name from the master list,
  // same way a real material lookup would behave.
  function handleCodeChange(index: number, code: string) {
    const match = MATERIAL_CODE_OPTIONS.find((m) => m.code === code);
    setRows((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              code,
              englishName: match?.englishName ?? row.englishName,
              chinaName: match?.chinaName ?? row.chinaName,
            }
          : row
      )
    );
  }

  function toggleCheck(index: number) {
    setCheckedRows((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  }

  function deleteRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
    setCheckedRows((prev) => {
      const next = new Set<number>();
      prev.forEach((i) => {
        if (i < index) next.add(i);
        if (i > index) next.add(i - 1); // shift indices down after removal
      });
      return next;
    });
  }

  function addRow() {
    setRows((prev) => [...prev, { code: "", englishName: "", chinaName: "", qty: "" }]);
    setStatusMessage("New material row added.");
  }

  function createTask() {
    if (!moNumber.trim() || !model.trim()) {
      setStatusMessage("Fill MO Number and Model before creating a task.");
      return;
    }

    setStatusMessage(`Task created for ${moNumber.trim()} (${model.trim()}).`);
  }

  function submitMo() {
    const hasIncompleteRow = rows.some(
      (row) =>
        !row.code.trim() ||
        !row.englishName.trim() ||
        !row.chinaName.trim() ||
        !row.qty.trim()
    );

    if (rows.length === 0 || hasIncompleteRow) {
      setStatusMessage("Complete all material rows before submitting MO.");
      return;
    }

    setStatusMessage(`MO submitted with ${rows.length} material${rows.length === 1 ? "" : "s"}.`);
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
            <span className="font-medium text-text-colortext-dark">MO Entry</span>
          </nav>

          <h1 className="mb-4 text-lg font-semibold text-[#111111]">MO Entry</h1>

          <div className="overflow-hidden rounded-lg border border-strokestroke-gray bg-white">
            <div className="px-[18px] py-[18px]">
              <div className="flex items-end gap-3">
                <div className="min-w-0 flex-1">
                  <label className="mb-1.5 block text-xs font-medium text-[#111111]">
                    MO Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Input MO Number"
                    value={moNumber}
                    onChange={(e) => setMoNumber(e.target.value)}
                    className="h-9 rounded-md border-strokestroke-gray px-3 text-xs placeholder:text-[#A3A3A1]"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <label className="mb-1.5 block text-xs font-medium text-[#111111]">
                    Input Model <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Input model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="h-9 rounded-md border-strokestroke-gray px-3 text-xs placeholder:text-[#A3A3A1]"
                  />
                </div>

                <Button
                  type="button"
                  onClick={createTask}
                  className="h-9 shrink-0 gap-2 rounded-md bg-gradient-to-b from-[#058346] to-[#0B5934] px-4 text-xs font-semibold text-white hover:opacity-90"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create Task
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
                <h2 className="text-sm font-semibold text-[#111111]">Material List</h2>
              </div>

              <div className="mb-3 flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex h-8 items-center rounded-full bg-[#F8F8F8] px-3 text-xs">
                    <span className="text-[#8F8F8E]">MO</span>
                    <span className="ml-3 font-medium text-[#111111]">T2026090410261301048</span>
                  </div>
                  <div className="flex h-8 min-w-0 max-w-[360px] items-center rounded-full bg-[#F8F8F8] px-3 text-xs">
                    <span className="shrink-0 text-[#8F8F8E]">Task</span>
                    <span className="ml-3 truncate font-medium text-[#111111]">
                      BATCH202609 - Return Idle Latte M
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-xs text-[#5F5F5E]">{rows.length} item</span>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addRow}
                    className="h-8 gap-1.5 rounded-md border-strokestroke-gray px-3 text-xs font-medium text-[#555554] hover:bg-[#F8F8F8]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add New Material
                  </Button>
                  <Button
                    type="button"
                    onClick={submitMo}
                    className="h-8 gap-2 rounded-md bg-gradient-to-b from-[#058346] to-[#0B5934] px-3.5 text-xs font-semibold text-white hover:opacity-90"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Submit MO
                  </Button>
                </div>
              </div>

              <div className="overflow-hidden rounded-md border border-strokestroke-gray">
                <Table>
                  <TableHeader className="bg-[#F8F8F8]">
                    <TableRow className="hover:bg-[#F8F8F8]">
                      <TableHead className="w-12 px-3 text-xs" />
                      <TableHead className="px-3 text-xs">Material Code</TableHead>
                      <TableHead className="px-3 text-xs">English Name</TableHead>
                      <TableHead className="px-3 text-xs">China Name</TableHead>
                      <TableHead className="px-3 text-xs">Qty (pcs)</TableHead>
                      <TableHead className="w-20 px-3 text-xs" />
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {rows.map((row, index) => {
                      const isChecked = checkedRows.has(index);
                      return (
                        <TableRow
                          key={index}
                          className={`h-12 ${isChecked ? "bg-[#EAF6EE] hover:bg-[#EAF6EE]" : "hover:bg-[#FAFAFA]"}`}
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
                              onValueChange={(value) => handleCodeChange(index, value)}
                            >
                              <SelectTrigger className="h-8 w-full rounded-md border-strokestroke-gray text-xs">
                                <SelectValue placeholder="Choose material code..." />
                              </SelectTrigger>
                              <SelectContent>
                                {MATERIAL_CODE_OPTIONS.map((opt) => (
                                  <SelectItem key={opt.code} value={opt.code} className="text-xs">
                                    {opt.code}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>

                          <TableCell className="px-3 py-2">
                            <Input
                              placeholder="Input English name"
                              value={row.englishName}
                              onChange={(e) => updateRow(index, "englishName", e.target.value)}
                              className="h-8 rounded-md border-strokestroke-gray px-2 text-xs placeholder:text-[#A3A3A1]"
                            />
                          </TableCell>

                          <TableCell className="px-3 py-2">
                            <Input
                              placeholder="Input China name"
                              value={row.chinaName}
                              onChange={(e) => updateRow(index, "chinaName", e.target.value)}
                              className="h-8 rounded-md border-strokestroke-gray px-2 text-xs placeholder:text-[#A3A3A1]"
                            />
                          </TableCell>

                          <TableCell className="px-3 py-2">
                            <Input
                              placeholder="Input quantity"
                              type="number"
                              value={row.qty}
                              onChange={(e) => updateRow(index, "qty", e.target.value)}
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
                                Delete
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
