"use client";

import type { TranslationKey } from "@/i18n";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

import type { DateRangePreset } from "./types";

const PRESET_LABELS: Record<DateRangePreset, TranslationKey> = {
  today: "dateRangePicker.today",
  yesterday: "dateRangePicker.yesterday",
  thisWeek: "dateRangePicker.thisWeek",
  lastWeek: "dateRangePicker.lastWeek",
  thisMonth: "dateRangePicker.thisMonth",
  lastMonth: "dateRangePicker.lastMonth",
  thisYear: "dateRangePicker.thisYear",
  lastYear: "dateRangePicker.lastYear",
  allTime: "dateRangePicker.allTime",
};

type PresetListProps = {
  presets: DateRangePreset[];
  selectedPreset: DateRangePreset | null;
  isPresetDisabled: (preset: DateRangePreset) => boolean;
  onSelect: (preset: DateRangePreset) => void;
};

export function PresetList({
  presets,
  selectedPreset,
  isPresetDisabled,
  onSelect,
}: PresetListProps) {
  const { t } = useI18n();

  const renderButtons = (className: string) =>
    presets.map((preset) => {
      const selected = preset === selectedPreset;
      const disabled = isPresetDisabled(preset);

      return (
        <button
          key={preset}
          type="button"
          aria-pressed={selected}
          disabled={disabled}
          onClick={() => onSelect(preset)}
          className={cn(
            "h-9 shrink-0 rounded-md px-2.5 text-left text-xs text-text-colortext-dark transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryprimary-green disabled:cursor-not-allowed disabled:opacity-40",
            selected && "bg-slate-50 font-medium",
            className,
          )}
        >
          {t(PRESET_LABELS[preset])}
        </button>
      );
    });

  return (
    <>
      <div className="flex gap-1 overflow-x-auto border-b border-strokestroke-gray px-3 py-2 md:hidden">
        {renderButtons("whitespace-nowrap")}
      </div>
      <nav
        aria-label={t("dateRangePicker.presetsLabel")}
        className="hidden w-[140px] shrink-0 flex-col gap-0.5 border-r border-strokestroke-gray p-2 md:flex"
      >
        {renderButtons("w-full")}
      </nav>
    </>
  );
}
