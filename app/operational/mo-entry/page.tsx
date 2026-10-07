"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

type Material = {
  code: string;
  englishName: string;
  chinaName: string;
  qty: number;
};

const materials: Material[] = [
  { code: "621032000320", englishName: "Battery cover AC175", chinaName: "电池盖组件 AC175 绿", qty: 5 },
  { code: "621032000320", englishName: "Display Panel", chinaName: "显示屏面板", qty: 10 },
  { code: "621032000320", englishName: "Camera Module", chinaName: "相机模组", qty: 7 },
  { code: "621032000320", englishName: "Camera Module", chinaName: "相机模组", qty: 7 },
  { code: "621032000320", englishName: "Display Panel", chinaName: "显示屏面板", qty: 10 },
];

export default function MoEntryPage() {
  const [moNumber, setMoNumber] = useState("");
  const [model, setModel] = useState("");

  return (
    <main className="min-h-screen w-full bg-backgroundbg-gray">
      <Sidebar />
      <div className="flex min-h-screen flex-col pl-[255px]">
        <TopBar />
        <div className="mt-[52px] w-full px-8 py-6">
          <nav className="mb-2 text-xs text-slate-500">
            Entry <span className="mx-1">{">"}</span>
            <span className="font-medium text-slate-900">MO Entry</span>
          </nav>
          <h1 className="mb-5 text-lg font-semibold text-slate-950">MO Entry</h1>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex items-end gap-6">
              <div className="flex-1">
                <label className="mb-2 block text-sm font-medium">
                  MO Number <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Input MO Number"
                  value={moNumber}
                  onChange={(e) => setMoNumber(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="mb-2 block text-sm font-medium">
                  Input Model <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Input model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                />
              </div>
              <Button
                type="button"
                className="h-10 gap-2 bg-gradient-to-b from-[#058346] to-[#0b5934] px-4 text-white"
              >
                <Plus className="h-4 w-4" />
                Create Task
              </Button>
            </div>

            <div className="my-6 border-t border-slate-200" />

            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold">Material List</h2>
              <div className="flex items-center gap-3">
                <span className="rounded bg-slate-100 px-3 py-1.5 text-xs text-slate-600">
                  MO <span className="ml-1 font-medium text-slate-900">T2026090410261301048</span>
                </span>
                <span className="rounded bg-slate-100 px-3 py-1.5 text-xs text-slate-600">
                  Task <span className="ml-1 font-medium text-slate-900">BATCH202609 - Return Idle Latte M</span>
                </span>
                <span className="text-xs text-slate-500">{materials.length} item</span>
                <Button type="button" variant="outline" className="h-9 gap-2 text-xs">
                  <Plus className="h-3.5 w-3.5" />
                  Add New Material
                </Button>
                <Button
                  type="button"
                  className="h-9 gap-2 bg-gradient-to-b from-[#058346] to-[#0b5934] px-4 text-xs text-white"
                >
                  Submit MO
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto rounded border border-slate-200">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox />
                    </TableHead>
                    <TableHead>Material Code</TableHead>
                    <TableHead>English Name</TableHead>
                    <TableHead>China Name</TableHead>
                    <TableHead>Qty (pcs)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materials.map((m, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell className="text-xs">{m.code}</TableCell>
                      <TableCell className="text-xs">{m.englishName}</TableCell>
                      <TableCell className="text-xs">{m.chinaName}</TableCell>
                      <TableCell className="text-xs">{m.qty}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}