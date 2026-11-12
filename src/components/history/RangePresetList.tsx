"use client";

import { Check } from "lucide-react";

import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

import type { PresetId, RangePreset } from "./range-calendar-utils";

type RangePresetListProps = {
  presets: RangePreset[];
  activeId: PresetId | null;
  onSelect: (preset: RangePreset) => void;
};

/** Vertical list on desktop, horizontally scrollable chips on mobile. */
export default function RangePresetList({
  presets,
  activeId,
  onSelect,
}: RangePresetListProps) {
  const { t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t("history.dateRangeLabel")}
      className="flex shrink-0 gap-2 overflow-x-auto border-b border-[#E4E4E2] bg-[#F8F8F8] p-2 md:w-[160px] md:flex-col md:gap-0.5 md:overflow-visible md:border-b-0 md:border-r md:p-2.5"
    >
      {presets.map((preset) => {
        const active = preset.id === activeId;

        return (
          <button
            key={preset.id}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(preset)}
            className={cn(
              "flex h-8 shrink-0 items-center justify-between gap-2 whitespace-nowrap rounded-md px-2.5 text-xs font-medium text-[#555554] transition-colors hover:bg-white md:w-full",
              active && "bg-[#E7F5EC] text-[#08783F] hover:bg-[#E7F5EC]",
            )}
          >
            <span>{t(preset.labelKey)}</span>
            {active && <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} />}
          </button>
        );
      })}
    </div>
  );
}
