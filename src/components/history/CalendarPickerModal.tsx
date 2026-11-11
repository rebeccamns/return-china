"use client";

import { CalendarDays } from "lucide-react";
import { useState } from "react";

import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  getCalendarRangeBounds,
  getLocalDateInputValue,
  getLocalMonthInputValue,
  type CalendarRange,
} from "@/components/history/date-range";
import { cn } from "@/lib/utils";

type SharedProps = {
  buttonClassName?: string;
  ariaLabel?: string;
  referenceDate?: Date;
};

type RangePickerProps = SharedProps & {
  mode?: "range";
  value: CalendarRange;
  onChange: (value: CalendarRange) => void;
};

type SingleDatePickerProps = SharedProps & {
  mode: "single";
  value: string;
  onChange: (value: string) => void;
};

type MonthPickerProps = SharedProps & {
  mode: "month";
  value: string;
  onChange: (value: string) => void;
};

type OptionPickerProps = SharedProps & {
  mode: "options";
  value: string;
  onChange: (value: string) => void;
  title: string;
  selectedLabel: string;
  options: { value: string; label: string }[];
};

type CalendarPickerProps =
  | RangePickerProps
  | SingleDatePickerProps
  | MonthPickerProps
  | OptionPickerProps;

const rangeOptions = [
  { type: "all", label: "history.allTime" },
  { type: "today", label: "history.calendarPicker.today" },
  { type: "last7", label: "history.last7Days" },
  { type: "last30", label: "history.last30Days" },
  { type: "last90", label: "history.last90Days" },
  { type: "week", label: "history.calendarPicker.weekly" },
  { type: "month", label: "history.calendarPicker.monthly" },
  { type: "custom", label: "history.customRange" },
] as const;

function formatDate(value: string, locale: string): string {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function formatMonth(value: string, locale: string): string {
  const [year, month] = value.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));
}

function getRangeLabel(
  range: CalendarRange,
  locale: string,
  t: ReturnType<typeof useI18n>["t"],
  referenceDate: Date,
): string {
  if (range.type === "all") return t("history.allTime");
  if (range.type === "today") return t("history.calendarPicker.today");
  if (range.type === "lastDays") {
    if (range.days === 7) return t("history.last7Days");
    if (range.days === 30) return t("history.last30Days");
    return t("history.last90Days");
  }
  if (range.type === "month") {
    return range.month ? formatMonth(range.month, locale) : t("history.calendarPicker.monthly");
  }
  if (range.type === "week") {
    const bounds = getCalendarRangeBounds(range, referenceDate);
    return bounds
      ? `${formatDate(bounds.start, locale)} – ${formatDate(bounds.end, locale)}`
      : t("history.calendarPicker.weekly");
  }
  return range.start && range.end
    ? `${formatDate(range.start, locale)} – ${formatDate(range.end, locale)}`
    : t("history.customRange");
}

export function CalendarPickerModal(props: CalendarPickerProps) {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const [draftRange, setDraftRange] = useState<CalendarRange>(
    props.mode === "range" || props.mode === undefined ? props.value : { type: "all" }
  );
  const [draftValue, setDraftValue] = useState(
    props.mode === "single" ||
      props.mode === "month" ||
      props.mode === "options"
      ? props.value
      : ""
  );
  const referenceDate = props.referenceDate ?? new Date();
  const today = getLocalDateInputValue(referenceDate);
  const mode = props.mode ?? "range";

  const triggerLabel =
    props.mode === "options"
      ? props.selectedLabel
      : props.mode === "month"
      ? props.value
        ? formatMonth(props.value, locale)
        : t("history.calendarPicker.selectMonth")
      : props.mode === "single"
        ? props.value
          ? formatDate(props.value, locale)
          : t("history.calendarPicker.selectDate")
        : getRangeLabel(props.value, locale, t, referenceDate);

  const customRangeValid =
    draftRange.type !== "custom" ||
    (Boolean(draftRange.start) &&
      Boolean(draftRange.end) &&
      draftRange.start <= draftRange.end);
  const customRangeInvalidOrder =
    draftRange.type === "custom" &&
    Boolean(draftRange.start) &&
    Boolean(draftRange.end) &&
    draftRange.start > draftRange.end;

  function openPicker() {
    if (
      props.mode === "single" ||
      props.mode === "month" ||
      props.mode === "options"
    ) {
      setDraftValue(props.value);
    } else {
      setDraftRange(props.value);
    }
    setOpen(true);
  }

  function applySelection() {
    if (
      props.mode === "single" ||
      props.mode === "month" ||
      props.mode === "options"
    ) {
      props.onChange(draftValue);
    } else {
      props.onChange(draftRange);
    }
    setOpen(false);
  }

  function selectRangeOption(option: (typeof rangeOptions)[number]["type"]) {
    setDraftRange((current) => {
      switch (option) {
        case "all":
          return { type: "all" };
        case "today":
          return { type: "today" };
        case "last7":
          return { type: "lastDays", days: 7 };
        case "last30":
          return { type: "lastDays", days: 30 };
        case "last90":
          return { type: "lastDays", days: 90 };
        case "week":
          return {
            type: "week",
            date: current.type === "week" ? current.date : today,
          };
        case "month":
          return {
            type: "month",
            month:
              current.type === "month"
                ? current.month
                : getLocalMonthInputValue(referenceDate),
          };
        case "custom":
          return current.type === "custom"
            ? current
            : { type: "custom", start: "", end: "" };
      }
    });
  }

  function isOptionSelected(option: (typeof rangeOptions)[number]["type"]): boolean {
    switch (option) {
      case "all":
        return draftRange.type === "all";
      case "today":
        return draftRange.type === "today";
      case "last7":
        return draftRange.type === "lastDays" && draftRange.days === 7;
      case "last30":
        return draftRange.type === "lastDays" && draftRange.days === 30;
      case "last90":
        return draftRange.type === "lastDays" && draftRange.days === 90;
      case "week":
        return draftRange.type === "week";
      case "month":
        return draftRange.type === "month";
      case "custom":
        return draftRange.type === "custom";
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className={cn(
          "h-9 min-w-0 justify-start gap-2 border-[#D5D5D3] bg-white px-3 text-left font-normal text-[#333333] hover:bg-[#F8F8F8]",
          props.buttonClassName
        )}
        onClick={openPicker}
        aria-label={props.ariaLabel ?? t("history.dateRangeLabel")}
      >
        <CalendarDays className="h-4 w-4 shrink-0 text-[#777777]" />
        <span className="truncate">{triggerLabel}</span>
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        className="max-w-[440px] rounded-lg border border-[#D9D9D7] px-5 pb-5 pt-7"
      >
        <div className="mb-5">
          <h2 className="text-base font-semibold text-[#222222]">
            {mode === "range"
              ? t("history.calendarPicker.title")
              : props.mode === "options"
                ? props.title
                : mode === "month"
                  ? t("history.calendarPicker.selectMonth")
                  : t("history.calendarPicker.selectDate")}
          </h2>
          {mode === "range" && (
            <p className="mt-1 text-sm text-[#777777]">
              {t("history.calendarPicker.description")}
            </p>
          )}
        </div>

        {mode === "range" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {rangeOptions.map((option) => (
                <Button
                  key={option.type}
                  type="button"
                  variant="outline"
                  className={cn(
                    "h-9 border-[#D9D9D7] px-2 text-xs font-medium text-[#555554]",
                    isOptionSelected(option.type) &&
                      "border-[#08783F] bg-[#E7F5EC] text-[#08783F] hover:bg-[#E7F5EC]"
                  )}
                  onClick={() => selectRangeOption(option.type)}
                  aria-pressed={isOptionSelected(option.type)}
                >
                  {t(option.label)}
                </Button>
              ))}
            </div>

            {draftRange.type === "week" && (
              <label className="block space-y-1.5 text-sm font-medium text-[#444444]">
                {t("history.calendarPicker.weekDate")}
                <Input
                  type="date"
                  value={draftRange.date}
                  max={today}
                  onChange={(event) =>
                    setDraftRange({ type: "week", date: event.target.value })
                  }
                />
              </label>
            )}

            {draftRange.type === "month" && (
              <label className="block space-y-1.5 text-sm font-medium text-[#444444]">
                {t("history.calendarPicker.month")}
                <Input
                  type="month"
                  value={draftRange.month}
                  onChange={(event) =>
                    setDraftRange({ type: "month", month: event.target.value })
                  }
                />
              </label>
            )}

            {draftRange.type === "custom" && (
              <div className="grid grid-cols-2 gap-3">
                <label className="space-y-1.5 text-sm font-medium text-[#444444]">
                  {t("history.from")}
                  <Input
                    type="date"
                    value={draftRange.start}
                    max={draftRange.end || today}
                    onChange={(event) =>
                      setDraftRange({ ...draftRange, start: event.target.value })
                    }
                  />
                </label>
                <label className="space-y-1.5 text-sm font-medium text-[#444444]">
                  {t("history.to")}
                  <Input
                    type="date"
                    value={draftRange.end}
                    min={draftRange.start || undefined}
                    max={today}
                    onChange={(event) =>
                      setDraftRange({ ...draftRange, end: event.target.value })
                    }
                  />
                </label>
                {customRangeInvalidOrder && (
                  <p className="col-span-2 text-xs text-red-600">
                    {t("history.dateError")}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : mode === "month" ? (
          <label className="block space-y-1.5 text-sm font-medium text-[#444444]">
            {t("history.calendarPicker.month")}
            <Input
              type="month"
              value={draftValue}
              onChange={(event) => setDraftValue(event.target.value)}
            />
          </label>
        ) : props.mode === "options" ? (
          <div className="max-h-[45vh] overflow-y-auto rounded-md border border-[#E4E4E2]">
            {props.options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={cn(
                  "flex w-full items-center justify-between border-b border-[#E4E4E2] px-3 py-2.5 text-left text-sm last:border-b-0 hover:bg-[#F8F8F8]",
                  draftValue === option.value &&
                    "bg-[#E7F5EC] font-medium text-[#08783F]"
                )}
                onClick={() => setDraftValue(option.value)}
                aria-pressed={draftValue === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : (
          <label className="block space-y-1.5 text-sm font-medium text-[#444444]">
            {t("history.calendarPicker.date")}
            <Input
              type="date"
              value={draftValue}
              onChange={(event) => setDraftValue(event.target.value)}
            />
          </label>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            className="border-[#D5D5D3] bg-white"
            onClick={() => setOpen(false)}
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={applySelection}
            disabled={
              (mode === "range" && !customRangeValid) ||
              (mode !== "range" && !draftValue)
            }
          >
            {t("history.calendarPicker.apply")}
          </Button>
        </div>
      </Modal>
    </>
  );
}
