"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, type KeyboardEvent } from "react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import {
  addDays,
  addMonths,
  addMonthsClamped,
  compareDates,
  formatDate,
  formatMonth,
  getCalendarWeeks,
  getStartOfMonth,
  getWeekdayLabels,
  isDateInRange,
  isDateSelectable,
  isSameDate,
  normalizeDate,
  serializeDate,
} from "./date-range-utils";
import { DayCell } from "./DayCell";
import type { DateRange } from "./types";

type RangeCalendarProps = {
  viewMonth: Date;
  range: DateRange;
  previewRange: DateRange | null;
  hoveredDate: Date | null;
  activeDate: Date | null;
  focusRequest: string | null;
  markedDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  weekStartsOn: 0 | 1;
  onNavigate: (amount: number) => void;
  onSelectDate: (date: Date) => void;
  onHoverDate: (date: Date | null) => void;
  onFocusDate: (date: Date, monthShift?: number) => void;
  onFocusRequestHandled: () => void;
};

function CalendarMonth({
  month,
  isFirstMonth,
  isSecondMonth,
  range,
  visualRange,
  isPreview,
  hoveredDate,
  activeDate,
  markedDateKeys,
  minDate,
  maxDate,
  disabledDates,
  weekStartsOn,
  locale,
  t,
  onNavigate,
  onSelectDate,
  onHoverDate,
  onFocusDate,
}: {
  month: Date;
  isFirstMonth: boolean;
  isSecondMonth: boolean;
  range: DateRange;
  visualRange: DateRange;
  isPreview: boolean;
  hoveredDate: Date | null;
  activeDate: Date | null;
  markedDateKeys: Set<string>;
  minDate?: Date;
  maxDate?: Date;
  disabledDates: Date[];
  weekStartsOn: 0 | 1;
  locale: string;
  t: ReturnType<typeof useI18n>["t"];
  onNavigate: (amount: number) => void;
  onSelectDate: (date: Date) => void;
  onHoverDate: (date: Date | null) => void;
  onFocusDate: (date: Date, monthShift?: number) => void;
}) {
  const monthStart = getStartOfMonth(month);
  const weeks = getCalendarWeeks(monthStart, weekStartsOn);
  const weekdayLabels = getWeekdayLabels(locale, weekStartsOn);
  const monthLabel = formatMonth(monthStart, locale);
  const constraints = { minDate, maxDate, disabledDates };

  function getKeyboardTarget(
    date: Date,
    direction: number,
    amount: number,
    includeStart = false,
  ): Date | null {
    let target = normalizeDate(date);
    if (!includeStart) target = addDays(target, direction);

    for (let index = 0; index < amount; index += 1) {
      if (isDateSelectable(target, constraints)) return target;
      target = addDays(target, direction);
    }
    return null;
  }

  function handleDayKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    date: Date,
  ) {
    let target: Date | null = null;
    let monthShift: number | undefined;

    switch (event.key) {
      case "ArrowLeft":
        target = getKeyboardTarget(date, -1, 366);
        break;
      case "ArrowRight":
        target = getKeyboardTarget(date, 1, 366);
        break;
      case "ArrowUp":
        target = getKeyboardTarget(addDays(date, -7), -1, 366, true);
        break;
      case "ArrowDown":
        target = getKeyboardTarget(addDays(date, 7), 1, 366, true);
        break;
      case "Home": {
        const offset = (date.getDay() - weekStartsOn + 7) % 7;
        const weekStart = addDays(date, -offset);
        target = getKeyboardTarget(weekStart, 1, 7, true);
        break;
      }
      case "End": {
        const offset = (date.getDay() - weekStartsOn + 7) % 7;
        const weekEnd = addDays(date, 6 - offset);
        target = getKeyboardTarget(weekEnd, -1, 7, true);
        break;
      }
      case "PageUp":
      case "PageDown":
        monthShift = event.key === "PageUp" ? -1 : 1;
        target = addMonthsClamped(date, monthShift);
        if (!isDateSelectable(target, constraints)) {
          target = getKeyboardTarget(target, monthShift, 31, true);
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (isDateSelectable(date, constraints)) onSelectDate(date);
        return;
      default:
        return;
    }

    event.preventDefault();
    if (target) onFocusDate(target, monthShift);
  }

  return (
    <section
      className={`min-w-0 flex-1 px-2 py-3 md:px-3 ${
        isSecondMonth ? "hidden md:block md:border-l md:border-strokestroke-gray" : ""
      }`}
      aria-label={monthLabel}
    >
      <header className="mb-2 flex h-9 items-center justify-between">
        {isFirstMonth ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t("dateRangePicker.previousMonth")}
            onClick={() => onNavigate(-1)}
            className="h-8 w-8 rounded-full text-text-colortext-gray"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
        ) : (
          <span aria-hidden="true" className="h-8 w-8" />
        )}

        <h3 className="text-sm font-semibold text-text-colortext-dark">
          {monthLabel}
        </h3>

        {isSecondMonth ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t("dateRangePicker.nextMonth")}
            onClick={() => onNavigate(1)}
            className="h-8 w-8 rounded-full text-text-colortext-gray"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        ) : isFirstMonth ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t("dateRangePicker.nextMonth")}
            onClick={() => onNavigate(1)}
            className="h-8 w-8 rounded-full text-text-colortext-gray md:hidden"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        ) : (
          <span aria-hidden="true" className="h-8 w-8" />
        )}
      </header>

      <div role="grid" aria-label={monthLabel}>
        <div role="row" className="mb-1 grid grid-cols-7">
          {weekdayLabels.map((weekday, index) => {
            const weekdayDate = addDays(
              new Date(2026, 0, 4),
              (weekStartsOn + index) % 7,
            );
            return (
              <div
                key={`${weekday}-${index}`}
                role="columnheader"
                aria-label={new Intl.DateTimeFormat(locale, {
                  weekday: "long",
                }).format(weekdayDate)}
                className="flex h-8 w-9 items-center justify-center text-[11px] font-medium text-text-colortext-gray"
              >
                {weekday}
              </div>
            );
          })}
        </div>

        {weeks.map((week, weekIndex) => (
          <div
            key={`${serializeDate(monthStart)}-week-${weekIndex}`}
            role="row"
            className="grid grid-cols-7"
          >
            {week.map((date) => {
              const dateKey = serializeDate(date);
              const isCurrentMonth =
                date.getMonth() === monthStart.getMonth() &&
                date.getFullYear() === monthStart.getFullYear();
              const isDisabled =
                !isCurrentMonth || !isDateSelectable(date, constraints);
              const isActualStart =
                range.from !== null && isSameDate(date, range.from);
              const isActualEnd =
                range.to !== null && isSameDate(date, range.to);
              const isPreviewEndpoint =
                isPreview &&
                hoveredDate !== null &&
                isSameDate(date, hoveredDate);
              const hasRangeBand =
                visualRange.from !== null &&
                visualRange.to !== null &&
                !isSameDate(visualRange.from, visualRange.to);
              const isInRange =
                isCurrentMonth &&
                hasRangeBand &&
                isDateInRange(date, visualRange) &&
                (!isPreview || !isDisabled);
              const isBandStart =
                isInRange &&
                visualRange.from !== null &&
                isSameDate(date, visualRange.from);
              const isBandEnd =
                isInRange &&
                visualRange.to !== null &&
                isSameDate(date, visualRange.to);
              const isSelected =
                isCurrentMonth &&
                (isActualStart ||
                  isActualEnd ||
                  isDateInRange(date, range));

              return (
                <DayCell
                  key={dateKey}
                  date={normalizeDate(date)}
                  dateKey={dateKey}
                  dateLabel={formatDate(date, locale, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                  isCurrentMonth={isCurrentMonth}
                  isDisabled={isDisabled}
                  isMarked={isCurrentMonth && markedDateKeys.has(dateKey)}
                  isSelected={isSelected}
                  isRangeStart={isActualStart}
                  isRangeEnd={isActualEnd}
                  isBandStart={isBandStart}
                  isBandEnd={isBandEnd || isPreviewEndpoint}
                  isInRange={isInRange}
                  isPreviewEnd={
                    isPreviewEndpoint && !isActualStart && !isActualEnd
                  }
                  isFocused={
                    activeDate !== null && isSameDate(date, activeDate)
                  }
                  onSelect={onSelectDate}
                  onHover={onHoverDate}
                  onKeyDown={handleDayKeyDown}
                />
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

export function RangeCalendar({
  viewMonth,
  range,
  previewRange,
  hoveredDate,
  activeDate,
  focusRequest,
  markedDates = [],
  minDate,
  maxDate,
  disabledDates = [],
  weekStartsOn,
  onNavigate,
  onSelectDate,
  onHoverDate,
  onFocusDate,
  onFocusRequestHandled,
}: RangeCalendarProps) {
  const { locale, t } = useI18n();
  const gridRef = useRef<HTMLDivElement>(null);
  const firstMonth = getStartOfMonth(viewMonth);
  const secondMonth = addMonths(firstMonth, 1);
  const markedDateKeys = new Set(markedDates.map(serializeDate));
  const isPreview = Boolean(previewRange && hoveredDate);
  const visualRange = previewRange ?? range;

  useEffect(() => {
    if (!focusRequest) return;

    requestAnimationFrame(() => {
      const target = gridRef.current?.querySelector(
        `[data-date="${focusRequest}"]`,
      );
      if (target instanceof HTMLButtonElement && !target.disabled) {
        target.focus();
      }
      onFocusRequestHandled();
    });
  }, [focusRequest, onFocusRequestHandled, viewMonth]);

  const sharedProps = {
    range,
    visualRange,
    isPreview,
    hoveredDate,
    activeDate,
    markedDateKeys,
    minDate,
    maxDate,
    disabledDates,
    weekStartsOn,
    locale,
    t,
    onNavigate,
    onSelectDate,
    onHoverDate,
    onFocusDate,
  };

  return (
    <div
      ref={gridRef}
      className="grid min-w-0 grid-cols-1 md:grid-cols-2"
      onMouseLeave={() => onHoverDate(null)}
    >
      <CalendarMonth
        {...sharedProps}
        month={firstMonth}
        isFirstMonth
        isSecondMonth={false}
      />
      <CalendarMonth
        {...sharedProps}
        month={secondMonth}
        isFirstMonth={false}
        isSecondMonth
      />
    </div>
  );
}
