
"use client";

import { CalendarDays, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { MODES, PERIOD_OPTIONS } from "../_lib/data";
import type { Mode } from "../_lib/types";

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
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Page title */}
        <h1 className="shrink-0 text-lg font-semibold text-[#111111]">
          Dashboard
        </h1>

        {/* Controls aligned to the right */}
        <div className="flex flex-wrap items-center justify-end gap-2">
          {/* Time granularity */}
          <div
            role="tablist"
            aria-label="Time granularity"
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
                      ? "bg-gradient-to-b from-[#058346] to-[#0b5934] font-semibold text-white"
                      : "font-medium text-[#444444] hover:bg-slate-50",
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Period selector */}
          <Select value={period} onValueChange={onPeriodChange}>
  <SelectTrigger
    aria-label="Period"
    className="h-[40px] w-auto min-w-[134px] gap-2 rounded-md border-strokestroke-gray bg-white px-3 text-sm font-medium text-[#111111]"
  >
    <div className="flex items-center gap-2">
      <CalendarDays
        className="h-[18px] w-[18px] shrink-0 text-[#555555]"
        strokeWidth={1.5}
      />
      <SelectValue />
    </div>
  </SelectTrigger>

  <SelectContent className="w-auto min-w-[var(--radix-select-trigger-width)]">
    {PERIOD_OPTIONS[mode].map((option) => (
      <SelectItem
        key={option.value}
        value={option.value}
        className="whitespace-nowrap text-sm"
      >
        {option.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

          {/* Export button */}
          <Button
            type="button"
            variant="outline"
            onClick={onExport}
            className="h-[38px] w-full gap-2 rounded-md border-[#058346] bg-white px-3 text-[13px] font-semibold text-[#0b5934] hover:bg-[#EAF6EE] hover:text-[#0b5934] sm:w-auto"
          >
            <Download className="h-4 w-4" strokeWidth={1.75} />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}
