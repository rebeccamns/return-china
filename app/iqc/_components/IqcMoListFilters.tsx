"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useI18n, type TranslationKey } from "@/i18n";
import type { IqcMoStatusFilter } from "../_lib/mo-list-filters";

const STATUS_OPTIONS: {
  value: IqcMoStatusFilter;
  labelKey: TranslationKey;
}[] = [
  { value: "All", labelKey: "history.allStatuses" },
  { value: "Completed", labelKey: "iqcHistory.completed" },
  { value: "In Progress", labelKey: "iqcHistory.inProgress" },
  { value: "Rejected", labelKey: "iqcHistory.rejected" },
  { value: "Pending", labelKey: "status.notStarted" },
];

export default function IqcMoListFilters({
  search,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
}: {
  search: string;
  statusFilter: IqcMoStatusFilter;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: IqcMoStatusFilter) => void;
}) {
  const { t } = useI18n();

  return (
    <div className="mb-4 flex flex-wrap items-end gap-3">
      <div className="w-full sm:w-[280px]">
        <label
          htmlFor="iqc-mo-search"
          className="mb-1.5 block text-xs font-medium text-[#5F5F5E]"
        >
          {t("history.searchLabel")}
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A3A3A1]" />
          <Input
            id="iqc-mo-search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={t("iqcHistory.searchPlaceholder")}
            className="h-9 rounded-md border-strokestroke-gray pl-9 text-xs placeholder:text-[#A3A3A1]"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="iqc-mo-status"
          className="mb-1.5 block text-xs font-medium text-[#5F5F5E]"
        >
          {t("history.statusLabel")}
        </label>
        <select
          id="iqc-mo-status"
          value={statusFilter}
          onChange={(event) =>
            onStatusFilterChange(event.target.value as IqcMoStatusFilter)
          }
          className="h-9 w-[170px] rounded-md border border-strokestroke-gray bg-white px-3 text-xs text-[#333333]"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.labelKey)}
            </option>
          ))}
        </select>
      </div>
      {(search || statusFilter !== "All") && (
        <button
          type="button"
          onClick={() => {
            onSearchChange("");
            onStatusFilterChange("All");
          }}
          className="h-9 text-xs font-medium text-[#046A39] hover:underline"
        >
          {t("history.clearFilters")}
        </button>
      )}
    </div>
  );
}
