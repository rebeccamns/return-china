"use client";

import { CalendarDays } from "lucide-react";
import { useState } from "react";

import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  getCalendarRangeBounds,
  type CalendarRange,
} from "@/components/history/date-range";
import { cn } from "@/lib/utils";

import CalendarSelectionPanel from "./CalendarSelectionPanel";
import RangeCalendarPanel from "./RangeCalendarPanel";

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
  // Changes on every open so the range panel starts from the applied value.
  const [openCount, setOpenCount] = useState(0);
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

  // A custom range needs both dates, in order, before it can be applied.
  const customRangeValid =
    draftRange.type !== "custom" ||
    (Boolean(draftRange.start) &&
      Boolean(draftRange.end) &&
      draftRange.start <= draftRange.end);

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
    setOpenCount((count) => count + 1);
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
        className={cn(
          "rounded-lg border border-[#D9D9D7]",
          mode === "range"
            ? "max-w-[760px] overflow-hidden p-0"
            : mode === "single" || mode === "month"
              ? "max-w-[360px] overflow-hidden p-0"
              : "max-w-[440px] px-5 pb-5 pt-7"
        )}
      >
        {mode === "range" ? (
          <RangeCalendarPanel
            key={openCount}
            value={draftRange}
            onChange={setDraftRange}
            onApply={applySelection}
            onCancel={() => setOpen(false)}
            applyDisabled={!customRangeValid}
            referenceDate={referenceDate}
          />
        ) : props.mode === "single" || props.mode === "month" ? (
          <CalendarSelectionPanel
            key={openCount}
            mode={props.mode}
            value={draftValue}
            onChange={setDraftValue}
            onApply={applySelection}
            onCancel={() => setOpen(false)}
            referenceDate={referenceDate}
          />
        ) : props.mode === "options" ? (
          <>
            <div className="mb-5">
              <h2 className="text-base font-semibold text-[#222222]">{props.title}</h2>
            </div>
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
                disabled={!draftValue}
              >
                {t("history.calendarPicker.apply")}
              </Button>
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
}
