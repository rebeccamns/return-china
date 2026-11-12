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
    <div className="mb-4 grid grid-cols-2 items-end gap-3 sm:flex sm:flex-wrap">
      <div className="w-full min-w-0 sm:w-[280px]">
        <label
          htmlFor="iqc-mo-search"
          className="mb-1.5 block text-xs font-medium text-text-colortext-gray"
        >
          {t("history.searchLabel")}
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-colortext-gray" />
          <Input
            id="iqc-mo-search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={t("iqcHistory.searchPlaceholder")}
            className="h-9 rounded-md border-strokestroke-gray bg-backgroundbg-white pl-9 text-xs text-text-colortext-black placeholder:text-text-colortext-gray"
          />
        </div>
      </div>
      <div className="min-w-0">
        <label
          htmlFor="iqc-mo-status"
          className="mb-1.5 block text-xs font-medium text-text-colortext-gray"
        >
          {t("history.statusLabel")}
        </label>
        <select
          id="iqc-mo-status"
          value={statusFilter}
          onChange={(event) =>
            onStatusFilterChange(event.target.value as IqcMoStatusFilter)
          }
          className="h-9 w-full rounded-md border border-strokestroke-gray bg-backgroundbg-white px-3 text-xs text-text-colortext-black sm:w-[170px]"
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
          className="col-span-2 h-9 text-xs font-medium text-primaryprimary-green hover:underline sm:col-span-1"
        >
          {t("history.clearFilters")}
        </button>
      )}
    </div>
  );
}
