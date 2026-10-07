"use client";

import { useState } from "react";
import { Search } from "lucide-react";
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

type HistoryRow = {
  code: string;
  model: string;
  task: string;
  submittedBy: string;
  dateSubmitted: string;
};

// TODO: replace with real data from your API once it exists
const historyRows: HistoryRow[] = [
  {
    code: "T2026090410261301048",
    model: "Latte-M",
    task: "BATCH202609 - Return Idle Latte M",
    submittedBy: "Bagus Saputra",
    dateSubmitted: "Sep 20, 2026 14:32",
  },
  {
    code: "T2026090410261301041",
    model: "A58",
    task: "BATCH202609 - Receive Material A58",
    submittedBy: "Bagus Saputra",
    dateSubmitted: "Sep 19, 2026 09:15",
  },
  {
    code: "T2026090410261301039",
    model: "A77",
    task: "BATCH202608 - Verify Material A77",
    submittedBy: "Bagus Saputra",
    dateSubmitted: "Sep 18, 2026 16:48",
  },
  {
    code: "T2026090410261301033",
    model: "Latte-M",
    task: "BATCH202608 - Return Idle Latte M",
    submittedBy: "Bagus Saputra",
    dateSubmitted: "Sep 17, 2026 11:02",
  },
  {
    code: "T2026090410261301028",
    model: "A98",
    task: "BATCH202608 - Receive Material A98",
    submittedBy: "Bagus Saputra",
    dateSubmitted: "Sep 16, 2026 08:40",
  },
];

export default function HistoryPage() {
  const [search, setSearch] = useState("");

  const filteredRows = historyRows.filter((row) => {
    const query = search.toLowerCase();
    return (
      row.code.toLowerCase().includes(query) ||
      row.model.toLowerCase().includes(query) ||
      row.task.toLowerCase().includes(query)
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
              <h2 className="text-sm font-semibold text-[#111111]">
                Submitted MO
              </h2>

              <div className="relative w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A3A3A1]" />
                <Input
                  placeholder="Search MO, model, or task..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 rounded-md border-strokestroke-gray pl-9 text-xs placeholder:text-[#A3A3A1]"
                />
              </div>
            </div>

            <div className="border-t border-strokestroke-gray" />

            <div className="px-[18px] pb-[18px] pt-4">
              <div className="overflow-hidden rounded-md border border-strokestroke-gray">
                <Table>
                  <TableHeader className="bg-[#F8F8F8]">
                    <TableRow className="hover:bg-[#F8F8F8]">
                      <TableHead className="px-3 text-xs">MO Code</TableHead>
                      <TableHead className="px-3 text-xs">Model</TableHead>
                      <TableHead className="px-3 text-xs">Task</TableHead>
                      <TableHead className="px-3 text-xs">Submitted By</TableHead>
                      <TableHead className="px-3 text-xs">Date Submitted</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredRows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="px-3 py-6 text-center text-xs text-[#8F8F8E]">
                          No matching history found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRows.map((row, i) => (
                        <TableRow key={i} className="h-10 hover:bg-[#FAFAFA]">
                          <TableCell className="px-3 py-2 text-xs font-medium text-[#111111]">
                            {row.code}
                          </TableCell>
                          <TableCell className="px-3 py-2 text-xs text-[#111111]">
                            {row.model}
                          </TableCell>
                          <TableCell className="px-3 py-2 text-xs text-[#111111]">
                            {row.task}
                          </TableCell>
                          <TableCell className="px-3 py-2 text-xs text-[#111111]">
                            {row.submittedBy}
                          </TableCell>
                          <TableCell className="px-3 py-2 text-xs text-[#5F5F5E]">
                            {row.dateSubmitted}
                          </TableCell>
                        </TableRow>
                      ))
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