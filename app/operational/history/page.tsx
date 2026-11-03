"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Search } from "lucide-react";

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
import { useI18n } from "@/i18n";

type MOStatus = "Completed" | "Rejected" | "Resubmitted";

type HistoryRow = {
  id: string;
  code: string;
  model: string;
  projectNumber: string;
  task: string;
  status: MOStatus;
  notes: string;
  submittedBy: string;
  dateSubmitted: string;
};

const STATUS_STYLES: Record<MOStatus, string> = {
  Completed: "bg-[#E6F4EA] text-[#0B5934]",
  Rejected: "bg-red-50 text-red-600",
  Resubmitted: "bg-amber-50 text-amber-700",
};

// Mock data for frontend demonstration.
// Replace with API data when the backend is available.
const historyRows: HistoryRow[] = [
  {
    id: "h-1",
    code: "T2026090410261301048",
    model: "Latte-M",
    projectNumber: "9991028",
    task: "BATCH202609 - Return Idle Latte M",
    status: "Completed",
    notes: "-",
    submittedBy: "Bagus Saputra",
    dateSubmitted: "Sep 20, 2026 14:32",
  },
  {
    id: "h-2",
    code: "T2026090410261301041",
    model: "A58",
    projectNumber: "9991027",
    task: "BATCH202609 - Receive Material A58",
    status: "Rejected",
    notes: "Quantity mismatch on Camera Module (expected 7, received 5)",
    submittedBy: "Bagus Saputra",
    dateSubmitted: "Sep 19, 2026 09:15",
  },
  {
    id: "h-3",
    code: "T2026090410261301039",
    model: "A77",
    projectNumber: "9991026",
    task: "BATCH202608 - Verify Material A77",
    status: "Resubmitted",
    notes: "Previously rejected: wrong material code on Display Panel",
    submittedBy: "Bagus Saputra",
    dateSubmitted: "Sep 18, 2026 16:48",
  },
  {
    id: "h-4",
    code: "T2026090410261301033",
    model: "Latte-M",
    projectNumber: "9991025",
    task: "BATCH202608 - Return Idle Latte M",
    status: "Completed",
    notes: "-",
    submittedBy: "Bagus Saputra",
    dateSubmitted: "Sep 17, 2026 11:02",
  },
  {
    id: "h-5",
    code: "T2026090410261301028",
    model: "A98",
    projectNumber: "9991024",
    task: "BATCH202608 - Receive Material A98",
    status: "Rejected",
    notes: "China name does not match the master list",
    submittedBy: "Bagus Saputra",
    dateSubmitted: "Sep 16, 2026 08:40",
  },
];

function StatusBadge({ status }: { status: MOStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold",
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

export default function HistoryPage() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return historyRows;

    return historyRows.filter((row) =>
      [
        row.code,
        row.model,
        row.projectNumber,
        row.task,
        row.status,
        row.notes,
        row.submittedBy,
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [search]);

  return (
    <main className="min-h-screen w-full bg-backgroundbg-gray">
      <Sidebar />

      <div className="flex min-h-screen flex-col pl-[255px]">
        <TopBar />

        <div className="mt-[52px] w-full px-[18px] py-5">
          <nav className="mb-4 flex items-center gap-2 text-xs">
            <span className="text-text-colortext-gray">
              {t("history.breadcrumbSection")}
            </span>
            <span className="text-[#B5B5B3]">›</span>
            <span className="font-medium text-text-colortext-dark">
              {t("history.title")}
            </span>
          </nav>

          <h1 className="mb-4 text-lg font-semibold text-[#111111]">
            {t("history.title")}
          </h1>

          <section className="overflow-hidden rounded-lg border border-strokestroke-gray bg-white">
            <div className="flex flex-wrap items-center justify-between gap-4 px-[18px] py-[18px]">
              <h2 className="text-sm font-semibold text-[#111111]">
                {t("history.submittedMo")}
              </h2>

              <div className="relative w-full sm:w-80">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A3A3A1]" />
                <Input
                  placeholder={t("history.searchPlaceholder")}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="h-9 rounded-md border-strokestroke-gray pl-9 text-xs placeholder:text-[#A3A3A1]"
                />
              </div>
            </div>

            <div className="border-t border-strokestroke-gray" />

            <div className="px-[18px] pb-[18px] pt-4">
              <div className="overflow-x-auto rounded-md border border-strokestroke-gray">
                <Table className="min-w-[1100px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("common.moCode")}</TableHead>
                      <TableHead>{t("common.model")}</TableHead>
                      <TableHead>Project No.</TableHead>
                      <TableHead>{t("common.task")}</TableHead>
                      <TableHead>{t("common.status")}</TableHead>
                      <TableHead>{t("common.notes")}</TableHead>
                      <TableHead>{t("history.submittedBy")}</TableHead>
                      <TableHead>{t("history.dateSubmitted")}</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredRows.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={9}
                          className="px-3 py-8 text-center text-xs text-[#8F8F8E]"
                        >
                          {t("history.noMatching")}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRows.map((row) => {
                        const detailHref = `/operational/history/${encodeURIComponent(row.code)}`;

                        return (
                          <TableRow
                            key={row.id}
                            className="h-12 hover:bg-[#FAFAFA]"
                          >
                            <TableCell className="whitespace-nowrap text-xs font-medium text-[#111111]">
                              <Link
                                href={detailHref}
                                className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryprimary-green"
                              >
                                {row.code}
                              </Link>
                            </TableCell>
                            <TableCell className="text-xs">
                              {row.model}
                            </TableCell>
                            <TableCell className="text-xs">
                              {row.projectNumber}
                            </TableCell>
                            <TableCell className="max-w-[240px] text-xs">
                              {row.task}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={row.status} />
                            </TableCell>
                            <TableCell className="max-w-[260px] text-xs text-[#5F5F5E]">
                              {row.notes}
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-xs">
                              {row.submittedBy}
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-xs text-[#5F5F5E]">
                              {row.dateSubmitted}
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="h-8 gap-1.5 text-xs"
                              >
                                <Link
                                  href={detailHref}
                                  aria-label={`${t("history.viewDetail")}: ${row.code}`}
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  {t("history.viewDetail")}
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
