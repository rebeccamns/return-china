"use client";

import { Download, SlidersHorizontal } from "lucide-react";

import { CalendarPickerModal } from "@/components/history/CalendarPickerModal";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import type { TranslationKey } from "@/i18n";

import {
  MODES,
  MODEL_OPTIONS,
  getPeriodOptions,
  type PeriodOptionTexts,
} from "../_lib/data";
import type { Mode } from "../_lib/types";

const MODE_LABEL_KEYS: Record<Mode, TranslationKey> = {
  year: "superadmin.modes.year",
  month: "superadmin.modes.month",
  date: "superadmin.modes.date",
  day: "superadmin.modes.day",
};

type Props = {
  mode: Mode;
  period: string;
  model: string;
  onModeChange: (mode: Mode) => void;
  onPeriodChange: (period: string) => void;
  onModelChange: (model: string) => void;
  onExport: () => void;
};

export default function DashboardHeader({
  mode,
  period,
  model,
  onModeChange,
  onPeriodChange,
  onModelChange,
  onExport,
}: Props) {
  const { t, dictionary } = useI18n();

  const periodTexts = useMemo<PeriodOptionTexts>(
    () => ({
      monthsShort: dictionary.dates.monthsShort,
      weekdaysShort: dictionary.dates.weekdaysShort,
      today: t("dates.today"),
      yesterday: t("dates.yesterday"),
      lastNDays: (days) => t("dates.lastNDays", { days }),
      formatShortDate: (day, monthIndex) =>
        `${day} ${dictionary.dates.monthsShort[monthIndex]}`,
    }),
    [dictionary, t],
  );

  const periodOptions = getPeriodOptions(mode, periodTexts);
  const selectedPeriodLabel =
    periodOptions.find((option) => option.value === period)?.label ?? period;

  return (
    <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      {/* Page Title & Scope summary */}
      <div className="flex items-center gap-3">
        <h1 className="text-base font-semibold leading-tight text-text-colortext-black">
          {t("superadmin.dashboard")}
        </h1>
        <span className="hidden items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-800 dark:border-strokestroke-green/50 dark:bg-backgroundbg-green dark:text-text-colortext-green md:inline-flex">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-600 dark:bg-brand-green-fg" />
          {selectedPeriodLabel} · {model === "all" ? "All Models" : model}
        </span>
      </div>

      {/* Controls aligned to the right (compact 32px height) */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {/* Time granularity tabs */}
        <div
          role="tablist"
          aria-label={t("superadmin.timeGranularity")}
          className="flex h-8 items-center rounded-md border border-strokestroke-gray bg-backgroundbg-white p-0.5"
        >
          {MODES.map((item) => {
            const active = item.value === mode;

            return (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onModeChange(item.value)}
                className={cn(
                  "h-7 rounded px-2.5 text-xs transition-colors sm:px-3",
                  active
                    ? "bg-[#08783F] font-semibold text-white shadow-xs"
                    : "font-medium text-text-colortext-dark hover:bg-backgroundbg-bluish-gray",
                )}
              >
                {t(MODE_LABEL_KEYS[item.value])}
              </button>
            );
          })}
        </div>

        {/* Period selector */}
        <CalendarPickerModal
          mode="options"
          value={period}
          onChange={onPeriodChange}
          options={periodOptions}
          title={t("superadmin.period")}
          selectedLabel={selectedPeriodLabel}
          ariaLabel={t("superadmin.period")}
          buttonClassName="h-8 min-w-[110px] border-strokestroke-gray bg-backgroundbg-white px-2.5 text-xs font-medium text-text-colortext-black hover:bg-backgroundbg-bluish-gray"
        />

        {/* Model filter */}
        <Select value={model} onValueChange={onModelChange}>
          <SelectTrigger className="h-8 w-[116px] rounded-md border-strokestroke-gray bg-backgroundbg-white px-2.5 text-xs font-medium text-text-colortext-black">
            <SelectValue placeholder="Model" />
          </SelectTrigger>
          <SelectContent align="end">
            {MODEL_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Export button */}
        <Button
          type="button"
          variant="secondary"
          onClick={onExport}
          className="h-8 gap-1.5 rounded-md px-2.5 text-xs font-semibold"
        >
          <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
          <span>{t("superadmin.export")}</span>
        </Button>
      </div>
    </div>
  );
}
