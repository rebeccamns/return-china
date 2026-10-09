"use client";

import * as React from "react";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
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

type Status = "Completed" | "Rejected" | "Resubmitted";

type Material = {
  code: string;
  englishName: string;
  chinaName: string;
  qty: number;
};

type HistoryRow = {
  id: string;
  code: string;
  model: string;
  task: string;
  status: Status;
  notes: string; // "-" when there's nothing to explain
  submittedBy: string;
  dateSubmitted: string;
  materials: Material[];
};

const STATUS_STYLES: Record<Status, string> = {
  Completed: "bg-[#E6F4EA] text-[#0b5934]",
  Rejected: "bg-red-50 text-red-600",
  Resubmitted: "bg-amber-50 text-amber-700",
};

// TODO: replace with real data from your API once it exists
const sampleMaterials: Material[] = [
  { code: "621032000320", englishName: "Battery cover AC175", chinaName: "电池盖组件 AC175 绿", qty: 5 },
  { code: "621032000320", englishName: "Display Panel", chinaName: "显示屏面板", qty: 10 },
  { code: "621032000320", englishName: "Camera Module", chinaName: "相机模组", qty: 7 },
];

const historyRows: HistoryRow[] = [
  {
    id: "h-1",
    code: "T2026090410261301048",
    model: "Latte-M",
    task: "BATCH202609 - Return Idle Latte M",
    status: "Completed",
    notes: "-",
    submittedBy: "Bagus Saputra",
    dateSubmitted: "Sep 20, 2026 14:32",
    materials: sampleMaterials,
  },
  {
    id: "h-2",
    code: "T2026090410261301041",
    model: "A58",
    task: "BATCH202609 - Receive Material A58",
    status: "Rejected",
    notes: "Quantity mismatch on Camera Module (expected 7, received 5)",
    submittedBy: "Bagus Saputra",
    dateSubmitted: "Sep 19, 2026 09:15",
    materials: sampleMaterials,
  },
  {
    id: "h-3",
    code: "T2026090410261301039",
    model: "A77",
    task: "BATCH202608 - Verify Material A77",
    status: "Resubmitted",
    notes: "Previously rejected: wrong material code on Display Panel",
    submittedBy: "Bagus Saputra",
    dateSubmitted: "Sep 18, 2026 16:48",
    materials: sampleMaterials,
  },
  {
    id: "h-4",
    code: "T2026090410261301033",
    model: "Latte-M",
    task: "BATCH202608 - Return Idle Latte M",
    status: "Completed",
    notes: "-",
    submittedBy: "Bagus Saputra",
    dateSubmitted: "Sep 17, 2026 11:02",
    materials: sampleMaterials,
  },
  {
    id: "h-5",
    code: "T2026090410261301028",
    model: "A98",
    task: "BATCH202608 - Receive Material A98",
    status: "Rejected",
    notes: "China name does not match the master list",
    submittedBy: "Bagus Saputra",
    dateSubmitted: "Sep 16, 2026 08:40",
    materials: sampleMaterials,
  },
];

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredRows = historyRows.filter((row) => {
    const query = search.toLowerCase();
    return (
      row.code.toLowerCase().includes(query) ||
      row.model.toLowerCase().includes(query) ||
      row.task.toLowerCase().includes(query) ||
      row.status.toLowerCase().includes(query) ||
      row.notes.toLowerCase().includes(query)
    );
  });

  return (
    <main className="min-h-screen w-full bg-backgroundbg-gray">
      <Sidebar />
      <div className="flex min-h-screen flex-col pl-[255px]">
        <TopBar />

        <div className="mt-[52px] w-full px-[18px] py-5">
          <nav className="mb-4 flex items-center gap-2 text-xs">
            <span className="text-text-colortext-gray">Entry</span>
            <span className="text-[#B5B5B3]">›</span>
            <span className="font-medium text-text-colortext-dark">History</span>
          </nav>

          <h1 className="mb-4 text-lg font-semibold text-[#111111]">History</h1>

          <div className="overflow-hidden rounded-lg border border-strokestroke-gray bg-white">
            <div className="flex items-center justify-between gap-4 px-[18px] py-[18px]">
              <h2 className="text-sm font-semibold text-[#111111]">Submitted MO</h2>

              <div className="relative w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A3A3A1]" />
                <Input
                  placeholder="Search MO, model, status, or notes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 rounded-md border-strokestroke-gray pl-9 text-xs placeholder:text-[#A3A3A1]"
                />
              </div>
            </div>

            <div className="border-t border-strokestroke-gray" />

            <div className="px-[18px] pb-[18px] pt-4">
              <div className="overflow-x-auto rounded-md border border-strokestroke-gray">
                <Table className="min-w-[1100px]">
                  <TableHeader className="bg-[#F8F8F8]">
                    <TableRow className="hover:bg-[#F8F8F8]">
                      <TableHead className="w-12 px-3" />
                      <TableHead className="px-3 text-xs">MO Code</TableHead>
                      <TableHead className="px-3 text-xs">Model</TableHead>
                      <TableHead className="px-3 text-xs">Task</TableHead>
                      <TableHead className="px-3 text-xs">Status</TableHead>
                      <TableHead className="px-3 text-xs">Notes</TableHead>
                      <TableHead className="px-3 text-xs">Submitted By</TableHead>
                      <TableHead className="px-3 text-xs">Date Submitted</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredRows.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="px-3 py-6 text-center text-xs text-[#8F8F8E]"
                        >
                          No matching history found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRows.map((row) => {
                        const isExpanded = expandedId === row.id;

                        return (
                          <React.Fragment key={row.id}>
                            <TableRow className="h-12 hover:bg-[#FAFAFA]">
                              <TableCell className="px-3 py-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="h-7 w-7 rounded-md p-0"
                                  onClick={() =>
                                    setExpandedId(isExpanded ? null : row.id)
                                  }
                                  aria-label={isExpanded ? "Collapse row" : "Expand row"}
                                  aria-expanded={isExpanded}
                                >
                                  <Plus
                                    className={cn(
                                      "h-3.5 w-3.5 transition-transform duration-200",
                                      isExpanded && "rotate-45"
                                    )}
                                  />
                                </Button>
                              </TableCell>

                              <TableCell className="px-3 py-2 text-xs font-medium text-[#111111]">
                                {row.code}
                              </TableCell>
                              <TableCell className="px-3 py-2 text-xs text-[#111111]">
                                {row.model}
                              </TableCell>
                              <TableCell className="px-3 py-2 text-xs text-[#111111]">
                                {row.task}
                              </TableCell>

                              <TableCell className="px-3 py-2">
                                <span
                                  className={cn(
                                    "inline-flex rounded px-2 py-0.5 text-xs font-semibold",
                                    STATUS_STYLES[row.status]
                                  )}
                                >
                                  {row.status}
                                </span>
                              </TableCell>

                              <TableCell
                                className={cn(
                                  "max-w-[260px] px-3 py-2 text-xs",
                                  row.notes === "-" ? "text-[#8F8F8E]" : "text-[#111111]"
                                )}
                              >
                                {row.notes}
                              </TableCell>

                              <TableCell className="px-3 py-2 text-xs text-[#111111]">
                                {row.submittedBy}
                              </TableCell>
                              <TableCell className="px-3 py-2 text-xs text-[#5F5F5E]">
                                {row.dateSubmitted}
                              </TableCell>
                            </TableRow>

                            {isExpanded && (
                              <>
                                <TableRow className="h-12 bg-slate-50 hover:bg-slate-50">
                                  <TableHead className="w-12" />
                                  <TableHead className="px-3 text-xs">Material Code</TableHead>
                                  <TableHead colSpan={2} className="px-3 text-xs">
                                    English Name
                                  </TableHead>
                                  <TableHead colSpan={2} className="px-3 text-xs">
                                    China Name
                                  </TableHead>
                                  <TableHead colSpan={2} className="px-3 text-xs">
                                    Qty (pcs)
                                  </TableHead>
                                </TableRow>

                                {row.materials.map((material, i) => (
                                  <TableRow
                                    key={`${row.id}-material-${i}`}
                                    className="bg-slate-50/40 hover:bg-slate-50/40"
                                  >
                                    <TableCell />
                                    <TableCell className="px-3 py-2 text-xs text-[#111111]">
                                      {material.code}
                                    </TableCell>
                                    <TableCell colSpan={2} className="px-3 py-2 text-xs text-[#111111]">
                                      {material.englishName}
                                    </TableCell>
                                    <TableCell colSpan={2} className="px-3 py-2 text-xs text-[#111111]">
                                      {material.chinaName}
                                    </TableCell>
                                    <TableCell colSpan={2} className="px-3 py-2 text-xs text-[#111111]">
                                      {material.qty}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </>
                            )}
                          </React.Fragment>
                        );
                      })
                    )}
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