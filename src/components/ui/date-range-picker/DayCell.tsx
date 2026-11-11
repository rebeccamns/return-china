"use client";

import type { KeyboardEvent } from "react";

import { cn } from "@/lib/utils";

export type DayCellProps = {
  date: Date;
  dateKey: string;
  dateLabel: string;
  isCurrentMonth: boolean;
  isDisabled: boolean;
  isMarked: boolean;
  isSelected: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isBandStart: boolean;
  isBandEnd: boolean;
  isInRange: boolean;
  isPreviewEnd: boolean;
  isFocused: boolean;
  onSelect: (date: Date) => void;
  onHover: (date: Date | null) => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>, date: Date) => void;
};

export function DayCell({
  date,
  dateKey,
  dateLabel,
  isCurrentMonth,
  isDisabled,
  isMarked,
  isSelected,
  isRangeStart,
  isRangeEnd,
  isBandStart,
  isBandEnd,
  isInRange,
  isPreviewEnd,
  isFocused,
  onSelect,
  onHover,
  onKeyDown,
}: DayCellProps) {
  const isEndpoint = isRangeStart || isRangeEnd;
  const showBand = isInRange && !(isRangeStart && isRangeEnd);

  return (
    <div
      role="gridcell"
      aria-selected={isSelected}
      aria-disabled={isDisabled}
      className="relative flex h-9 w-9 items-center justify-center"
    >
      {showBand && (
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-y-[5px] bg-[#E7F5EC]",
            isBandStart && "left-1/2 right-0",
            isBandEnd && "left-0 right-1/2",
            !isBandStart && !isBandEnd && "inset-x-0",
          )}
        />
      )}

      <button
        type="button"
        data-date={dateKey}
        tabIndex={isFocused && !isDisabled ? 0 : -1}
        aria-label={dateLabel}
        aria-selected={isSelected}
        aria-disabled={isDisabled}
        disabled={isDisabled}
        onClick={() => onSelect(date)}
        onMouseEnter={() => onHover(isDisabled ? null : date)}
        onMouseLeave={() => onHover(null)}
        onKeyDown={(event) => onKeyDown(event, date)}
        className={cn(
          "relative z-10 flex h-9 w-9 flex-col items-center justify-center rounded-full text-xs leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryprimary-green focus-visible:ring-offset-1",
          isCurrentMonth && !isDisabled
            ? "text-text-colortext-dark"
            : "text-text-colortext-gray opacity-40",
          isMarked &&
            !isEndpoint &&
            !isDisabled &&
            "bg-[#E7F5EC]/70 text-[#006B3C]",
          !isEndpoint &&
            !isDisabled &&
            "hover:bg-slate-50",
          isEndpoint &&
            "bg-primaryprimary-green font-semibold text-white hover:bg-primaryprimary-green",
          isInRange &&
            !isEndpoint &&
            !isDisabled &&
            "text-[#006B3C]",
          isPreviewEnd &&
            !isEndpoint &&
            "ring-1 ring-primaryprimary-green",
          isDisabled && "cursor-not-allowed",
        )}
      >
        <span>{date.getDate()}</span>
        {isMarked && (
          <span
            aria-hidden="true"
            className={cn(
              "mt-0.5 h-1 w-1 rounded-full",
              isEndpoint ? "bg-white" : "bg-primaryprimary-green",
            )}
          />
        )}
      </button>
    </div>
  );
}
