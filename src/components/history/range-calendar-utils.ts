import {
  getCalendarRangeBounds,
  type CalendarRange,
} from "@/components/history/date-range";
import type { TranslationKey } from "@/i18n";

/** 0 = Sunday (as in the design), 1 = Monday. */
export const WEEK_STARTS_ON: 0 | 1 = 0;

/** When true, days after the reference date (today) cannot be selected. */
export const DISABLE_FUTURE_DAYS = true;

/** Local calendar date as "YYYY-MM-DD". Never built with toISOString (no UTC shift). */
export type DateKey = string;

export type RangeBounds = { start: DateKey; end: DateKey };
export type PaintedRange = { lo: DateKey; hi: DateKey };
export type MonthView = { year: number; month: number }; // month: 0-11
export type DayCell = { key: DateKey; day: number; inMonth: boolean };

export type PresetId =
  | "today"
  | "last7"
  | "last14"
  | "last30"
  | "last3Months"
  | "last12Months"
  | "monthToDate"
  | "quarterToDate"
  | "yearToDate"
  | "all";

export type RangePreset = {
  id: PresetId;
  labelKey: TranslationKey;
  toRange: (today: Date) => CalendarRange;
};

/* ---------- date helpers (local time) ---------- */

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function toKey(date: Date): DateKey {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function fromKey(key: DateKey): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** Adds months and clamps the day (May 31 + (-3) = Feb 28/29, never Mar 3). */
export function addMonthsClamped(date: Date, months: number): Date {
  const lastDay = new Date(date.getFullYear(), date.getMonth() + months + 1, 0).getDate();
  return new Date(
    date.getFullYear(),
    date.getMonth() + months,
    Math.min(date.getDate(), lastDay),
  );
}

export function viewFromKey(key: DateKey): MonthView {
  const date = fromKey(key);
  return { year: date.getFullYear(), month: date.getMonth() };
}

export function shiftView(view: MonthView, delta: number): MonthView {
  const date = new Date(view.year, view.month + delta, 1);
  return { year: date.getFullYear(), month: date.getMonth() };
}

function compareViews(a: MonthView, b: MonthView): number {
  return a.year * 12 + a.month - (b.year * 12 + b.month);
}

/** True when `target` is the left month or the right month of `left`. */
export function isMonthVisible(target: MonthView, left: MonthView): boolean {
  const diff = compareViews(target, left);
  return diff === 0 || diff === 1;
}

/* ---------- presets ---------- */

function customRange(start: Date, end: Date): CalendarRange {
  return { type: "custom", start: toKey(start), end: toKey(end) };
}

/** "Last N days" counts today as day 1, so it starts N - 1 days back. */
function lastDaysRange(today: Date, days: number): CalendarRange {
  return customRange(addDays(today, -(days - 1)), today);
}

export const RANGE_PRESETS: RangePreset[] = [
  {
    id: "today",
    labelKey: "history.calendarPicker.today",
    toRange: () => ({ type: "today" }),
  },
  {
    id: "last7",
    labelKey: "history.last7Days",
    toRange: () => ({ type: "lastDays", days: 7 }),
  },
  {
    id: "last14",
    labelKey: "history.last14Days",
    toRange: (today) => lastDaysRange(today, 14),
  },
  {
    id: "last30",
    labelKey: "history.last30Days",
    toRange: () => ({ type: "lastDays", days: 30 }),
  },
  {
    id: "last3Months",
    labelKey: "history.last3Months",
    toRange: (today) =>
      customRange(addDays(addMonthsClamped(today, -3), 1), today),
  },
  {
    id: "last12Months",
    labelKey: "history.last12Months",
    toRange: (today) =>
      customRange(addDays(addMonthsClamped(today, -12), 1), today),
  },
  {
    id: "monthToDate",
    labelKey: "history.monthToDate",
    toRange: (today) =>
      customRange(new Date(today.getFullYear(), today.getMonth(), 1), today),
  },
  {
    id: "quarterToDate",
    labelKey: "history.quarterToDate",
    toRange: (today) =>
      customRange(
        new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1),
        today,
      ),
  },
  {
    id: "yearToDate",
    labelKey: "history.yearToDate",
    toRange: (today) => customRange(new Date(today.getFullYear(), 0, 1), today),
  },
  {
    id: "all",
    labelKey: "history.allTime",
    toRange: () => ({ type: "all" }),
  },
];

/* ---------- range helpers ---------- */

/**
 * Start/end of a range as date keys. `end` is "" while a custom range is
 * still being picked. Returns null for "all" or when nothing is selected.
 */
export function getRangeBounds(
  range: CalendarRange,
  referenceDate: Date,
): RangeBounds | null {
  if (range.type === "all") return null;
  if (range.type === "custom") {
    return range.start ? { start: range.start, end: range.end } : null;
  }
  return getCalendarRangeBounds(range, referenceDate) ?? null;
}

export function presetMatches(
  preset: RangePreset,
  draft: CalendarRange,
  today: Date,
): boolean {
  if (preset.id === "all") return draft.type === "all";

  const target = getRangeBounds(preset.toRange(today), today);
  const current = getRangeBounds(draft, today);

  return (
    target !== null &&
    current !== null &&
    current.end !== "" &&
    target.start === current.start &&
    target.end === current.end
  );
}

/** The span to paint in the calendars, including the hover preview while picking the end date. */
export function getPaintedRange(
  draft: CalendarRange,
  hoverKey: DateKey | null,
  today: Date,
): PaintedRange | null {
  const bounds = getRangeBounds(draft, today);
  if (!bounds) return null;

  if (bounds.end) {
    return bounds.start <= bounds.end
      ? { lo: bounds.start, hi: bounds.end }
      : { lo: bounds.end, hi: bounds.start };
  }

  if (hoverKey) {
    return hoverKey < bounds.start
      ? { lo: hoverKey, hi: bounds.start }
      : { lo: bounds.start, hi: hoverKey };
  }

  return { lo: bounds.start, hi: bounds.start };
}

/** First click starts a range, second click ends it (swapping if needed), third click restarts. */
export function pickDay(draft: CalendarRange, key: DateKey): CalendarRange {
  if (draft.type === "custom" && draft.start && !draft.end) {
    return key < draft.start
      ? { type: "custom", start: key, end: draft.start }
      : { type: "custom", start: draft.start, end: key };
  }
  return { type: "custom", start: key, end: "" };
}

/* ---------- month grid and formatting ---------- */

export function getMonthCells(view: MonthView): DayCell[] {
  const first = new Date(view.year, view.month, 1);
  const lead = (first.getDay() - WEEK_STARTS_ON + 7) % 7;
  const start = addDays(first, -lead);
  const dayCount = new Date(view.year, view.month + 1, 0).getDate();
  const rowCount = Math.ceil((lead + dayCount) / 7);

  return Array.from({ length: rowCount * 7 }, (_, index) => {
    const date = addDays(start, index);
    return {
      key: toKey(date),
      day: date.getDate(),
      inMonth: date.getMonth() === view.month,
    };
  });
}

export function getWeekdayLabels(
  locale: string,
): { narrow: string; long: string }[] {
  const narrow = new Intl.DateTimeFormat(locale, { weekday: "narrow" });
  const long = new Intl.DateTimeFormat(locale, { weekday: "long" });

  // 1 Jan 2023 is a Sunday.
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(2023, 0, 1 + WEEK_STARTS_ON + index);
    return { narrow: narrow.format(date), long: long.format(date) };
  });
}

export function formatMonthTitle(view: MonthView, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(new Date(view.year, view.month, 1));
}

export function formatDayLabel(key: DateKey, locale: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
    fromKey(key),
  );
}

export function isSelectable(key: DateKey, maxKey: DateKey): boolean {
  return !DISABLE_FUTURE_DAYS || key <= maxKey;
}
