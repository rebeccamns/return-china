"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";

import MonthGrid from "./MonthGrid";
import {
  addDays,
  addMonthsClamped,
  fromKey,
  shiftView,
  toKey,
  viewFromKey,
  type DateKey,
  type MonthView,
} from "./range-calendar-utils";

type CalendarSelectionPanelProps = {
  mode: "single" | "month";
  value: string;
  onChange: (value: string) => void;
  onApply: () => void;
  onCancel: () => void;
  referenceDate: Date;
};

function padMonth(month: number): string {
  return String(month + 1).padStart(2, "0");
}

function getValueYear(value: string, fallback: number): number {
  const year = Number(value.slice(0, 4));
  return Number.isInteger(year) && year > 0 ? year : fallback;
}

export default function CalendarSelectionPanel({
  mode,
  value,
  onChange,
  onApply,
  onCancel,
  referenceDate,
}: CalendarSelectionPanelProps) {
  const { t, locale } = useI18n();
  const todayKey = useMemo(() => toKey(referenceDate), [referenceDate]);
  const initialDateKey =
    mode === "single" && /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? value
      : todayKey;
  const [view, setView] = useState<MonthView>(() =>
    viewFromKey(initialDateKey),
  );
  const [focusKey, setFocusKey] = useState<DateKey>(initialDateKey);
  const [viewYear, setViewYear] = useState(() =>
    getValueYear(value, referenceDate.getFullYear()),
  );
  const panelRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef(false);

  useEffect(() => {
    if (!pendingFocus.current) return;
    pendingFocus.current = false;
    panelRef.current
      ?.querySelector<HTMLButtonElement>(`[data-day="${focusKey}"]`)
      ?.focus();
  }, [focusKey, view]);

  function moveFocusTo(target: DateKey) {
    const targetView = viewFromKey(target);
    if (targetView.year !== view.year || targetView.month !== view.month) {
      setView(targetView);
    }

    pendingFocus.current = true;
    setFocusKey(target);
  }

  function navigateMonth(amount: number) {
    const nextView = shiftView(view, amount);
    const nextFocus = toKey(addMonthsClamped(fromKey(focusKey), amount));
    setView(nextView);
    pendingFocus.current = true;
    setFocusKey(nextFocus);
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
        target = addDays(date, -date.getDay());
        break;
      case "End":
        target = addDays(date, 6 - date.getDay());
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

    moveFocusTo(toKey(target));
    return true;
  }

  const title =
    mode === "single"
      ? t("history.calendarPicker.selectDate")
      : t("history.calendarPicker.selectMonth");

  return (
    <div ref={panelRef} className="flex flex-col">
      <header className="flex min-h-10 items-center border-b border-[#E4E4E2] px-4 py-2.5 pr-12">
        <h2 className="text-sm font-semibold text-[#222222]">{title}</h2>
      </header>

      {mode === "single" ? (
        <div className="flex justify-center p-3">
          <MonthGrid
            view={view}
            locale={locale}
            painted={value ? { lo: value, hi: value } : null}
            maxKey={todayKey}
            allowFutureDates
            tabKey={focusKey}
            prev={{
              label: t("history.calendarPicker.previousMonth"),
              onClick: () => navigateMonth(-1),
            }}
            next={{
              label: t("history.calendarPicker.nextMonth"),
              onClick: () => navigateMonth(1),
            }}
            onSelect={(key) => {
              onChange(key);
              setFocusKey(key);
            }}
            onKeyNavigate={handleKeyNavigate}
          />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between border-b border-[#E4E4E2] px-3 py-2">
            <button
              type="button"
              aria-label={t("history.calendarPicker.previousYear")}
              onClick={() => setViewYear((year) => year - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-[#555554] hover:bg-[#F0F0EE]"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <h3 className="text-sm font-semibold text-[#222222]">
              {viewYear}
            </h3>
            <button
              type="button"
              aria-label={t("history.calendarPicker.nextYear")}
              onClick={() => setViewYear((year) => year + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-[#555554] hover:bg-[#F0F0EE]"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1 p-3">
            {Array.from({ length: 12 }, (_, monthIndex) => {
              const monthValue = `${viewYear}-${padMonth(monthIndex)}`;
              const selected = value === monthValue;
              const monthLabel = new Intl.DateTimeFormat(locale, {
                month: "long",
              }).format(new Date(viewYear, monthIndex, 1));

              return (
                <button
                  key={monthValue}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onChange(monthValue)}
                  className={`h-9 rounded-md px-2 text-xs transition-colors ${
                    selected
                      ? "bg-[#08783F] font-medium text-white"
                      : "text-[#222222] hover:bg-[#F0F0EE]"
                  }`}
                >
                  {monthLabel}
                </button>
              );
            })}
          </div>
        </>
      )}

      <footer className="flex justify-end gap-2 border-t border-[#E4E4E2] px-3 py-2.5">
        <Button
          type="button"
          variant="outline"
          className="h-9 border-[#D5D5D3] bg-white px-3 text-xs"
          onClick={onCancel}
        >
          {t("common.cancel")}
        </Button>
        <Button
          type="button"
          variant="primary"
          className="h-9 px-3 text-xs"
          onClick={onApply}
          disabled={!value}
        >
          {t("history.calendarPicker.apply")}
        </Button>
      </footer>
    </div>
  );
}
