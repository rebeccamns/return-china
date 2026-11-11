
"use client";

import { Download } from "lucide-react";

import { CalendarPickerModal } from "@/components/history/CalendarPickerModal";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import type { TranslationKey } from "@/i18n";

import { MODES, getPeriodOptions, type PeriodOptionTexts } from "../_lib/data";
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
  onModeChange: (mode: Mode) => void;
  onPeriodChange: (period: string) => void;
  onExport: () => void;
};

export default function DashboardHeader({
  mode,
  period,
  onModeChange,
  onPeriodChange,
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
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Page title */}
        <h1 className="shrink-0 text-lg font-semibold text-[#111111]">
          {t("superadmin.dashboard")}
        </h1>

        {/* Controls aligned to the right */}
        <div className="flex flex-wrap items-center justify-end gap-2">
          {/* Time granularity */}
          <div
            role="tablist"
            aria-label={t("superadmin.timeGranularity")}
            className="flex h-[38px] items-center rounded-md border border-strokestroke-gray bg-white p-1"
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
                    "h-[30px] flex-1 rounded px-4 text-[13px] transition-colors sm:px-5",
                    active
                      ? "bg-[#08783F] font-semibold text-white"
                      : "font-medium text-[#444444] hover:bg-slate-50",
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
            buttonClassName="h-[40px] min-w-[134px] text-sm font-medium"
          />

          {/* Export button */}
          <Button
            type="button"
            variant="secondary"
            onClick={onExport}
            className="h-[38px] w-full gap-2 rounded-md px-3 text-[13px] font-semibold sm:w-auto"
          >
            <Download className="h-4 w-4" strokeWidth={1.75} />
            {t("superadmin.export")}
          </Button>
        </div>
      </div>
    </div>
  );
}
