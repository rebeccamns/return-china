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
import { cn } from "@/lib/utils";

type Status = "Submitted" | "Rejected" | "Resubmitted";

type HistoryRow = {
  code: string;
  materials: number;
  status: Status;
  notes: string; // "-" when nothing to explain
  date: string;
};

const STATUS_STYLES: Record<Status, string> = {
  Submitted: "bg-[#E6F4EA] text-[#0b5934]",
  Rejected: "bg-red-50 text-red-600",
  Resubmitted: "bg-amber-50 text-amber-700",
};

const headClass =
  "h-10 whitespace-nowrap bg-[#F8F8F8] px-3 text-xs font-medium text-slate-700";

// TODO: replace with real data from your API
const rows: HistoryRow[] = [
  { code: "T2026090410261301041", materials: 11, status: "Submitted", notes: "-", date: "Sep 20, 2026 14:32" },
  { code: "T2026090410261301039", materials: 5, status: "Rejected", notes: "Photo of UPN label is unreadable", date: "Sep 19, 2026 09:15" },
  { code: "T2026090410261301033", materials: 8, status: "Resubmitted", notes: "Previously rejected: wrong net weight", date: "Sep 18, 2026 16:48" },
  { code: "T2026090410261301028", materials: 3, status: "Submitted", notes: "-", date: "Sep 16, 2026 08:40" },
];

export default function EximHistoryPage() {
  const [search, setSearch] = useState("");

  const query = search.toLowerCase();
  const filtered = rows.filter(
    (r) =>
      r.code.toLowerCase().includes(query) ||
      r.status.toLowerCase().includes(query) ||
      r.notes.toLowerCase().includes(query),
  );

  return (
    <main className="min-h-screen w-full bg-backgroundbg-gray">
      <Sidebar variant="exim" />

      <div className="flex min-h-screen flex-col pl-[255px]">
        <TopBar />

        <div className="mt-[52px] w-full px-[18px] py-5">
          <nav className="mb-4 flex items-center gap-2 text-xs">
            <span className="text-text-colortext-gray">Exim</span>
            <span className="text-[#B5B5B3]">›</span>
            <span className="font-medium text-text-colortext-dark">History</span>
          </nav>

          <h1 className="mb-4 text-lg font-semibold text-[#111111]">History</h1>

          <div className="overflow-hidden rounded-lg border border-strokestroke-gray bg-white">
            <div className="flex items-center justify-between gap-4 px-[18px] py-[18px]">
              <h2 className="text-sm font-semibold text-[#111111]">Processed MO</h2>

              <div className="relative w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A3A3A1]" />
                <Input
                  placeholder="Search MO, status, or notes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 rounded-md border-strokestroke-gray pl-9 text-xs placeholder:text-[#A3A3A1]"
                />
              </div>
            </div>

            <div className="border-t border-strokestroke-gray" />

            <div className="px-[18px] pb-[18px] pt-4">
              <div className="overflow-x-auto rounded-md border border-strokestroke-gray">
                <Table className="min-w-[900px]">
                  <TableHeader className="bg-[#F8F8F8]">
                    <TableRow className="hover:bg-[#F8F8F8]">
                      <TableHead className={headClass}>MO Code</TableHead>
                      <TableHead className={headClass}>Materials</TableHead>
                      <TableHead className={headClass}>Status</TableHead>
                      <TableHead className={headClass}>Notes</TableHead>
                      <TableHead className={headClass}>Date</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="px-3 py-6 text-center text-xs text-[#8F8F8E]"
                        >
                          No matching history found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filtered.map((row) => (
                        <TableRow key={row.code} className="h-12 hover:bg-[#FAFAFA]">
                          <TableCell className="px-3 py-2 text-xs font-medium text-[#111111]">
                            {row.code}
                          </TableCell>
                          <TableCell className="px-3 py-2 text-xs text-[#111111]">
                            {row.materials} items
                          </TableCell>
                          <TableCell className="px-3 py-2">
                            <span
                              className={cn(
                                "inline-flex rounded px-2 py-0.5 text-xs font-semibold",
                                STATUS_STYLES[row.status],
                              )}
                            >
                              {row.status}
                            </span>
                          </TableCell>
                          <TableCell
                            className={cn(
                              "max-w-[320px] px-3 py-2 text-xs",
                              row.notes === "-" ? "text-[#8F8F8E]" : "text-[#111111]",
                            )}
                          >
                            {row.notes}
                          </TableCell>
                          <TableCell className="px-3 py-2 text-xs text-[#5F5F5E]">
                            {row.date}
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