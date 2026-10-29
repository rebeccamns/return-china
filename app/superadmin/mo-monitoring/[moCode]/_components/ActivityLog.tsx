"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ActivityLogEntry, ActivityStatus } from "../../../_lib/types";

type Filter = "all" | ActivityStatus;

const STATUS_COLOR: Record<ActivityStatus, string> = {
  Started: "text-blue-600",
  Completed: "text-green-600",
  Rejected: "text-red-600",
};

type Props = {
  log: ActivityLogEntry[];
};

export default function ActivityLog({ log }: Props) {
  const { t } = useI18n();
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return log;
    return log.filter((e) => e.activityStatus === filter);
  }, [log, filter]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      {/* Header row */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-gray-900">
          {t("moMonitoring.detail.activityLog")}
        </h3>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="h-8 w-auto min-w-[140px] text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("moMonitoring.detail.activityFilterAll")}</SelectItem>
            <SelectItem value="Completed">{t("moMonitoring.detail.activityFilterCompleted")}</SelectItem>
            <SelectItem value="Rejected">{t("moMonitoring.detail.activityFilterRejected")}</SelectItem>
            <SelectItem value="Started">{t("moMonitoring.detail.activityFilterStarted")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {(
                [
                  ["moMonitoring.detail.tableTime", "w-36"],
                  ["moMonitoring.detail.tableProcessStep", ""],
                  ["moMonitoring.detail.tableStatus", "w-28"],
                  ["moMonitoring.detail.tableRemarks", ""],
                ] as const
              ).map(([key, cls]) => (
                <th
                  key={key}
                  className={cn(
                    "py-2 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500",
                    cls,
                  )}
                >
                  {t(key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-sm text-gray-400">
                  {t("common.noData")}
                </td>
              </tr>
            ) : (
              filtered.map((entry, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="whitespace-nowrap py-3 pr-4 text-xs text-gray-500">
                    {entry.time}
                  </td>
                  <td className="py-3 pr-4 text-sm text-gray-700">
                    {entry.processStep}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        STATUS_COLOR[entry.activityStatus],
                      )}
                    >
                      {entry.activityStatus}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-600">
                    {entry.remarks}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

