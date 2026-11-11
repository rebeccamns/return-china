export type CalendarRange =
  | { type: "all" }
  | { type: "today" }
  | { type: "lastDays"; days: 7 | 30 | 90 }
  | { type: "week"; date: string }
  | { type: "month"; month: string }
  | { type: "custom"; start: string; end: string };

export const ALL_CALENDAR_RANGE: CalendarRange = { type: "all" };

export function getLocalDateInputValue(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getLocalMonthInputValue(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function parseLocalDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return null;
  }
  return date;
}

function getWeekBounds(value: string): { start: string; end: string } | null {
  const date = parseLocalDate(value);
  if (!date) return null;

  const start = new Date(date);
  const daysSinceMonday = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - daysSinceMonday);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  return {
    start: getLocalDateInputValue(start),
    end: getLocalDateInputValue(end),
  };
}

function getMonthBounds(value: string): { start: string; end: string } | null {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) return null;

  const end = new Date(year, month, 0);
  return {
    start: `${match[1]}-${match[2]}-01`,
    end: getLocalDateInputValue(end),
  };
}

export function getCalendarRangeBounds(
  range: CalendarRange,
  now = new Date()
): { start: string; end: string } | null {
  const today = getLocalDateInputValue(now);

  switch (range.type) {
    case "all":
      return null;
    case "today":
      return { start: today, end: today };
    case "lastDays": {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      start.setDate(start.getDate() - (range.days - 1));
      return { start: getLocalDateInputValue(start), end: today };
    }
    case "week": {
      const bounds = getWeekBounds(range.date);
      return bounds;
    }
    case "month": {
      const bounds = getMonthBounds(range.month);
      return bounds;
    }
    case "custom":
      return range.start && range.end && range.start <= range.end
        ? { start: range.start, end: range.end }
        : null;
  }
}

export function isWithinHistoryDateRange(
  value: string | Date,
  range: CalendarRange,
  now = new Date()
): boolean {
  if (range.type === "all") return true;

  const bounds = getCalendarRangeBounds(range, now);
  if (!bounds) return false;

  const parsedValue =
    value instanceof Date
      ? value
      : /^\d{4}-\d{2}-\d{2}/.test(value)
        ? parseLocalDate(value.slice(0, 10))
        : new Date(value);
  if (!parsedValue || Number.isNaN(parsedValue.getTime())) return false;

  const dateValue = getLocalDateInputValue(parsedValue);
  return dateValue >= bounds.start && dateValue <= bounds.end;
}
