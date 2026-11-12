"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";

import { cn } from "@/lib/utils";

import {
  formatDayLabel,
  formatMonthTitle,
  getMonthCells,
  getWeekdayLabels,
  isSelectable,
  type DateKey,
  type MonthView,
  type PaintedRange,
} from "./range-calendar-utils";

type NavButton = {
  label: string;
  onClick: () => void;
  /** Shown on mobile only (the left month carries "next" when the right month is hidden). */
  mobileOnly?: boolean;
};

type MonthGridProps = {
  view: MonthView;
  locale: string;
  painted: PaintedRange | null;
  /** Last selectable day (today). */
  maxKey: DateKey;
  allowFutureDates?: boolean;
  /** The one day that is reachable with Tab (roving tabindex). */
  tabKey: DateKey | null;
  prev?: NavButton;
  next?: NavButton;
  onSelect: (key: DateKey) => void;
  onHover?: (key: DateKey | null) => void;
  /** Return true when the key press was handled. */
  onKeyNavigate: (key: DateKey, eventKey: string) => boolean;
};

export default function MonthGrid({
  view,
  locale,
  painted,
  maxKey,
  allowFutureDates = false,
  tabKey,
  prev,
  next,
  onSelect,
  onHover,
  onKeyNavigate,
}: MonthGridProps) {
  const cells = useMemo(() => getMonthCells(view), [view]);
  const weekdays = useMemo(() => getWeekdayLabels(locale), [locale]);
  const title = formatMonthTitle(view, locale);

  const inRange = (index: number) => {
    const cell = cells[index];
    return (
      painted !== null &&
      cell !== undefined &&
      cell.inMonth &&
      cell.key >= painted.lo &&
      cell.key <= painted.hi
    );
  };

  const rows = Array.from({ length: cells.length / 7 }, (_, row) =>
    cells.slice(row * 7, row * 7 + 7),
  );

  return (
    <div className="w-[260px] max-w-full">
      <div className="mb-1 flex h-8 items-center justify-between">
        <div className="h-8 w-8">
          {prev && (
            <button
              type="button"
              onClick={prev.onClick}
              aria-label={prev.label}
              className="flex h-8 w-8 items-center justify-center rounded-md text-[#555554] hover:bg-[#F0F0EE]"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            </button>
          )}
        </div>

        <h3 className="text-sm font-semibold text-[#222222]">{title}</h3>

        <div className="h-8 w-8">
          {next && (
            <button
              type="button"
              onClick={next.onClick}
              aria-label={next.label}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md text-[#555554] hover:bg-[#F0F0EE]",
                next.mobileOnly && "md:hidden",
              )}
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      <div
        role="grid"
        aria-label={title}
        onMouseLeave={() => onHover?.(null)}
      >
        <div role="row" className="grid grid-cols-7">
          {weekdays.map((weekday, index) => (
            <div
              key={index}
              role="columnheader"
              aria-label={weekday.long}
              className="flex h-7 items-center justify-center text-[11px] font-medium text-[#777777]"
            >
              {weekday.narrow}
            </div>
          ))}
        </div>

        {rows.map((row, rowIndex) => (
          <div key={rowIndex} role="row" className="grid grid-cols-7">
            {row.map((cell, colIndex) => {
              const index = rowIndex * 7 + colIndex;
              const selected = inRange(index);
              const isEdge =
                selected &&
                painted !== null &&
                (cell.key === painted.lo || cell.key === painted.hi);
              const prevSelected = colIndex > 0 && inRange(index - 1);
              const nextSelected = colIndex < 6 && inRange(index + 1);
              const interactive =
                cell.inMonth &&
                (allowFutureDates || isSelectable(cell.key, maxKey));

              return (
                <div
                  key={cell.key}
                  role="gridcell"
                  aria-selected={selected || undefined}
                  className={cn(
                    "flex h-9 items-center justify-center",
                    selected && "bg-[#E7F5EC]",
                    selected && !prevSelected && "rounded-l-md",
                    selected && !nextSelected && "rounded-r-md",
                  )}
                >
                  {interactive ? (
                    <button
                      type="button"
                      data-day={cell.key}
                      tabIndex={cell.key === tabKey ? 0 : -1}
                      aria-label={formatDayLabel(cell.key, locale)}
                      onClick={() => onSelect(cell.key)}
                      onMouseEnter={() => onHover?.(cell.key)}
                      onKeyDown={(event) => {
                        if (onKeyNavigate(cell.key, event.key)) {
                          event.preventDefault();
                        }
                      }}
                      className={cn(
                        "h-9 w-9 rounded-md text-xs transition-colors",
                        isEdge
                          ? "bg-[#08783F] font-medium text-white"
                          : selected
                            ? "text-[#08783F]"
                            : "text-[#222222] hover:bg-[#F0F0EE]",
                      )}
                    >
                      {cell.day}
                    </button>
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 items-center justify-center text-xs text-[#C8C8C6]"
                    >
                      {cell.day}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
