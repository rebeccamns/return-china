import type { DateRange, DateRangePreset } from "./types";

const DEFAULT_WEEK_STARTS_ON = 0;
const DEFAULT_PRESETS: DateRangePreset[] = [
  "today",
  "yesterday",
  "thisWeek",
  "lastWeek",
  "thisMonth",
  "lastMonth",
  "thisYear",
  "lastYear",
  "allTime",
];

export function getDefaultDateRangePresets(): DateRangePreset[] {
  return [...DEFAULT_PRESETS];
}

export function normalizeDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function normalizeDateRange(range: DateRange): DateRange {
  return {
    from: range.from ? normalizeDate(range.from) : null,
    to: range.to ? normalizeDate(range.to) : null,
  };
}

export function serializeDate(date: Date): string {
  const normalized = normalizeDate(date);
  const year = String(normalized.getFullYear()).padStart(4, "0");
  const month = String(normalized.getMonth() + 1).padStart(2, "0");
  const day = String(normalized.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function isSameDate(first: Date, second: Date): boolean {
  return serializeDate(first) === serializeDate(second);
}

export function compareDates(first: Date, second: Date): number {
  const firstValue = serializeDate(first);
  const secondValue = serializeDate(second);
  return firstValue < secondValue ? -1 : firstValue > secondValue ? 1 : 0;
}

export function addDays(date: Date, amount: number): Date {
  const result = normalizeDate(date);
  result.setDate(result.getDate() + amount);
  return result;
}

export function getStartOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function addMonthsClamped(date: Date, amount: number): Date {
  const targetMonth = addMonths(date, amount);
  const lastDay = new Date(
    targetMonth.getFullYear(),
    targetMonth.getMonth() + 1,
    0,
  ).getDate();
  return new Date(
    targetMonth.getFullYear(),
    targetMonth.getMonth(),
    Math.min(date.getDate(), lastDay),
  );
}

export function getCalendarWeeks(
  month: Date,
  weekStartsOn: 0 | 1 = DEFAULT_WEEK_STARTS_ON,
): Date[][] {
  const firstOfMonth = getStartOfMonth(month);
  const offset = (firstOfMonth.getDay() - weekStartsOn + 7) % 7;
  const firstVisibleDate = addDays(firstOfMonth, -offset);

  return Array.from({ length: 6 }, (_, weekIndex) =>
    Array.from({ length: 7 }, (_, dayIndex) =>
      addDays(firstVisibleDate, weekIndex * 7 + dayIndex),
    ),
  );
}

export function formatDate(
  date: Date,
  locale: string,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  },
): string {
  return new Intl.DateTimeFormat(locale, options).format(normalizeDate(date));
}

export function formatMonth(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(getStartOfMonth(date));
}

export function getWeekdayLabels(
  locale: string,
  weekStartsOn: 0 | 1 = DEFAULT_WEEK_STARTS_ON,
): string[] {
  const firstSunday = new Date(2026, 0, 4);
  const firstDay = addDays(firstSunday, weekStartsOn);
  const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });

  return Array.from({ length: 7 }, (_, index) => {
    const label = formatter.format(addDays(firstDay, index));
    return locale.toLowerCase().startsWith("en") ? label.slice(0, 2) : label;
  });
}

export function getPresetRange(
  preset: DateRangePreset,
  referenceDate = new Date(),
  weekStartsOn: 0 | 1 = DEFAULT_WEEK_STARTS_ON,
): DateRange {
  const today = normalizeDate(referenceDate);

  switch (preset) {
    case "allTime":
      return { from: null, to: null };
    case "today":
      return { from: today, to: today };
    case "yesterday": {
      const yesterday = addDays(today, -1);
      return { from: yesterday, to: yesterday };
    }
    case "thisWeek": {
      const offset = (today.getDay() - weekStartsOn + 7) % 7;
      const from = addDays(today, -offset);
      return { from, to: addDays(from, 6) };
    }
    case "lastWeek": {
      const offset = (today.getDay() - weekStartsOn + 7) % 7;
      const thisWeekStart = addDays(today, -offset);
      const from = addDays(thisWeekStart, -7);
      return { from, to: addDays(from, 6) };
    }
    case "thisMonth": {
      const from = getStartOfMonth(today);
      return {
        from,
        to: new Date(today.getFullYear(), today.getMonth() + 1, 0),
      };
    }
    case "lastMonth": {
      const from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      return {
        from,
        to: new Date(today.getFullYear(), today.getMonth(), 0),
      };
    }
    case "thisYear":
      return {
        from: new Date(today.getFullYear(), 0, 1),
        to: new Date(today.getFullYear(), 11, 31),
      };
    case "lastYear":
      return {
        from: new Date(today.getFullYear() - 1, 0, 1),
        to: new Date(today.getFullYear() - 1, 11, 31),
      };
  }
}

export function areDateRangesEqual(first: DateRange, second: DateRange): boolean {
  if (!first.from || !first.to || !second.from || !second.to) {
    return first.from === null &&
      first.to === null &&
      second.from === null &&
      second.to === null;
  }

  return (
    isSameDate(first.from, second.from) && isSameDate(first.to, second.to)
  );
}

export function findMatchingPreset(
  range: DateRange,
  presets: DateRangePreset[],
  referenceDate = new Date(),
  weekStartsOn: 0 | 1 = DEFAULT_WEEK_STARTS_ON,
): DateRangePreset | null {
  return (
    presets.find((preset) =>
      areDateRangesEqual(
        range,
        getPresetRange(preset, referenceDate, weekStartsOn),
      ),
    ) ?? null
  );
}

export function isDateInRange(date: Date, range: DateRange): boolean {
  if (!range.from || !range.to) return false;
  const normalized = normalizeDate(date);
  return (
    compareDates(normalized, range.from) >= 0 &&
    compareDates(normalized, range.to) <= 0
  );
}

export function isDateSelectable(
  date: Date,
  constraints: {
    minDate?: Date;
    maxDate?: Date;
    disabledDates?: Date[];
  },
): boolean {
  const normalized = normalizeDate(date);

  if (
    constraints.minDate &&
    compareDates(normalized, constraints.minDate) < 0
  ) {
    return false;
  }
  if (
    constraints.maxDate &&
    compareDates(normalized, constraints.maxDate) > 0
  ) {
    return false;
  }
  return !constraints.disabledDates?.some((disabledDate) =>
    isSameDate(normalized, disabledDate),
  );
}

function normalizeText(value: string, locale: string): string {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase(locale)
    .replace(/[\s,./-]/g, "");
}

function getDateFieldOrder(locale: string): ("year" | "month" | "day")[] {
  const parts = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
    .formatToParts(new Date(2006, 10, 23));
  const order: ("year" | "month" | "day")[] = [];

  for (const part of parts) {
    if (
      part.type === "year" ||
      part.type === "month" ||
      part.type === "day"
    ) {
      order.push(part.type);
    }
  }

  return order;
}

export function parseLocalizedDate(value: string, locale: string): Date | null {
  const input = value.trim();
  const isoDate = parseDate(input);
  if (isoDate) return isoDate;

  const normalizedInput = normalizeText(input, locale);
  let localizedMonth: { value: number; hasNumericLabel: boolean } | null = null;

  for (let month = 0; month < 12 && !localizedMonth; month += 1) {
    for (const monthStyle of ["short", "long"] as const) {
      const monthLabel = new Intl.DateTimeFormat(locale, {
        month: monthStyle,
      }).format(new Date(2026, month, 1));
      const normalizedMonth = normalizeText(monthLabel, locale);
      if (normalizedMonth && normalizedInput.includes(normalizedMonth)) {
        localizedMonth = {
          value: month + 1,
          hasNumericLabel: /\d/.test(monthLabel),
        };
        break;
      }
    }
  }

  const numbers = input.match(/\d+/g)?.map(Number) ?? [];
  const fieldOrder = getDateFieldOrder(locale);
  const fields = localizedMonth?.hasNumericLabel
    ? fieldOrder
    : fieldOrder.filter((field) => !(field === "month" && localizedMonth));

  if (numbers.length !== fields.length) return null;

  const dateFields: Partial<Record<"year" | "month" | "day", number>> = {};
  fields.forEach((field, index) => {
    dateFields[field] = numbers[index];
  });

  const year = dateFields.year;
  const month = localizedMonth?.value ?? dateFields.month;
  const day = dateFields.day;
  if (!year || !month || !day) return null;

  const parsedDate = new Date(year, month - 1, day);
  if (
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day
  ) {
    return null;
  }

  return parsedDate;
}

export function formatLocalizedDate(date: Date, locale: string): string {
  return formatDate(date, locale);
}
