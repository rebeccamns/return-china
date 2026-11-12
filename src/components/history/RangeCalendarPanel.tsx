"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CalendarRange } from "@/components/history/date-range";
import { useI18n } from "@/i18n";

import MonthGrid from "./MonthGrid";
import RangePresetList from "./RangePresetList";
import {
  DISABLE_FUTURE_DAYS,
  RANGE_PRESETS,
  WEEK_STARTS_ON,
  addDays,
  addMonthsClamped,
  fromKey,
  getPaintedRange,
  getRangeBounds,
  isMonthVisible,
  isSelectable,
  pickDay,
  presetMatches,
  shiftView,
  toKey,
  viewFromKey,
  type DateKey,
  type MonthView,
  type RangePreset,
} from "./range-calendar-utils";

type RangeCalendarPanelProps = {
  /** The draft range owned by the modal. */
  value: CalendarRange;
  onChange: (range: CalendarRange) => void;
  onApply: () => void;
  onCancel: () => void;
  applyDisabled: boolean;
  referenceDate: Date;
};

export default function RangeCalendarPanel({
  value,
  onChange,
  onApply,
  onCancel,
  applyDisabled,
  referenceDate,
}: RangeCalendarPanelProps) {
  const { t, locale } = useI18n();

  const today = useMemo(() => fromKey(toKey(referenceDate)), [referenceDate]);
  const maxKey = toKey(today);

  const [view, setView] = useState<MonthView>(() => {
    const bounds = getRangeBounds(value, today);
    return viewFromKey(bounds?.start ?? maxKey);
  });
  const [hoverKey, setHoverKey] = useState<DateKey | null>(null);
  const [focusKey, setFocusKey] = useState<DateKey | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef(false);

  const rightView = shiftView(view, 1);
  const painted = getPaintedRange(value, hoverKey, today);
  const activePreset = RANGE_PRESETS.find((preset) =>
    presetMatches(preset, value, today),
  );
  const rangeBounds = getRangeBounds(value, today);
  const dateInputRange =
    value.type === "custom"
      ? value
      : rangeBounds ?? { start: "", end: "" };

  // Roving tabindex: one reachable day, preferably the focused, start or today.
  const tabKey = useMemo<DateKey>(() => {
    const bounds = getRangeBounds(value, today);
    const candidates = [focusKey, bounds?.start ?? null, maxKey];
    const found = candidates.find(
      (key): key is DateKey =>
        key !== null &&
        isMonthVisible(viewFromKey(key), view) &&
        isSelectable(key, maxKey),
    );
    return found ?? toKey(new Date(view.year, view.month, 1));
  }, [focusKey, value, today, maxKey, view]);

  useEffect(() => {
    if (!pendingFocus.current || !focusKey) return;
    pendingFocus.current = false;
    panelRef.current
      ?.querySelector<HTMLButtonElement>(`[data-day="${focusKey}"]`)
      ?.focus();
  }, [focusKey, view]);

  function handleSelect(key: DateKey) {
    onChange(pickDay(value, key));
    setFocusKey(key);
  }

  function handleDateInputChange(endpoint: "start" | "end", date: string) {
    onChange({
      type: "custom",
      start: endpoint === "start" ? date : dateInputRange.start,
      end: endpoint === "end" ? date : dateInputRange.end,
    });
    setHoverKey(null);
  }

  function handlePreset(preset: RangePreset) {
    const next = preset.toRange(today);
    onChange(next);
    setView(viewFromKey(getRangeBounds(next, today)?.start ?? maxKey));
    setHoverKey(null);
    setFocusKey(null);
  }

  function moveFocusTo(target: DateKey) {
    const targetView = viewFromKey(target);

    if (!isMonthVisible(targetView, view)) {
      const before =
        targetView.year * 12 + targetView.month < view.year * 12 + view.month;
      setView(before ? targetView : shiftView(targetView, -1));
    }

    pendingFocus.current = true;
    setFocusKey(target);
  }

  function handleKeyNavigate(key: DateKey, eventKey: string): boolean {
    const date = fromKey(key);
    let target: Date;

    switch (eventKey) {
      case "ArrowLeft":
        target = addDays(date, -1);
        break;
      case "ArrowRight":
        target = addDays(date, 1);
        break;
      case "ArrowUp":
        target = addDays(date, -7);
        break;
      case "ArrowDown":
        target = addDays(date, 7);
        break;
      case "Home":
        target = addDays(date, -((date.getDay() - WEEK_STARTS_ON + 7) % 7));
        break;
      case "End":
        target = addDays(date, 6 - ((date.getDay() - WEEK_STARTS_ON + 7) % 7));
        break;
      case "PageUp":
        target = addMonthsClamped(date, -1);
        break;
      case "PageDown":
        target = addMonthsClamped(date, 1);
        break;
      default:
        return false;
    }

    const targetKey = toKey(target);
    if (DISABLE_FUTURE_DAYS && targetKey > maxKey) return true;

    moveFocusTo(targetKey);
    return true;
  }

  return (
    <div ref={panelRef} className="flex flex-col">
      <header className="flex min-h-10 items-center border-b border-[#E4E4E2] px-4 py-2.5 pr-12 dark:border-strokestroke-gray">
        <h2 className="text-sm font-semibold text-text-colortext-black">
          {t("history.calendarPicker.title")}
        </h2>
      </header>

      <div className="flex flex-col md:flex-row">
        <RangePresetList
          presets={RANGE_PRESETS}
          activeId={activePreset?.id ?? null}
          onSelect={handlePreset}
        />

        <section className="min-w-0 flex-1">
          <div className="flex justify-center md:grid md:grid-cols-2 md:justify-items-center">
            <div className="p-3">
              <MonthGrid
                view={view}
                locale={locale}
                painted={painted}
                maxKey={maxKey}
                tabKey={tabKey}
                prev={{
                  label: t("history.calendarPicker.previousMonth"),
                  onClick: () => setView((current) => shiftView(current, -1)),
                }}
                next={{
                  label: t("history.calendarPicker.nextMonth"),
                  onClick: () => setView((current) => shiftView(current, 1)),
                  mobileOnly: true,
                }}
                onSelect={handleSelect}
                onHover={setHoverKey}
                onKeyNavigate={handleKeyNavigate}
              />
            </div>

            <div className="hidden border-l border-[#E4E4E2] p-3 md:block dark:border-strokestroke-gray">
              <MonthGrid
                view={rightView}
                locale={locale}
                painted={painted}
                maxKey={maxKey}
                tabKey={tabKey}
                next={{
                  label: t("history.calendarPicker.nextMonth"),
                  onClick: () => setView((current) => shiftView(current, 1)),
                }}
                onSelect={handleSelect}
                onHover={setHoverKey}
                onKeyNavigate={handleKeyNavigate}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#E4E4E2] px-3 py-2.5 md:flex-row md:items-end md:justify-between dark:border-strokestroke-gray">
            <div className="grid min-w-0 flex-1 grid-cols-2 gap-2.5">
              <label className="min-w-0 space-y-1 text-xs font-medium text-text-colortext-gray">
                {t("history.calendarPicker.startDate")}
                <Input
                  type="date"
                  value={dateInputRange.start}
                  onChange={(event) =>
                    handleDateInputChange("start", event.target.value)
                  }
                  className="h-8 border-strokestroke-gray bg-backgroundbg-white text-sm text-text-colortext-black"
                />
              </label>
              <label className="min-w-0 space-y-1 text-xs font-medium text-text-colortext-gray">
                {t("history.calendarPicker.endDate")}
                <Input
                  type="date"
                  value={dateInputRange.end}
                  onChange={(event) =>
                    handleDateInputChange("end", event.target.value)
                  }
                  className="h-8 border-strokestroke-gray bg-backgroundbg-white text-sm text-text-colortext-black"
                />
              </label>
            </div>

            <div className="flex shrink-0 justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-9 border-strokestroke-gray bg-backgroundbg-white px-3 text-xs"
                onClick={onCancel}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={onApply}
                disabled={applyDisabled}
                className="h-9 px-3 text-xs"
              >
                {t("history.calendarPicker.apply")}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
