"use client";

import { CalendarDays, ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

import {
  addMonths,
  compareDates,
  findMatchingPreset,
  formatDate,
  formatLocalizedDate,
  getCalendarWeeks,
  getDefaultDateRangePresets,
  getPresetRange,
  getStartOfMonth,
  isDateSelectable,
  normalizeDate,
  normalizeDateRange,
  parseLocalizedDate,
  serializeDate,
} from "./date-range-utils";
import { PresetList } from "./PresetList";
import { RangeCalendar } from "./RangeCalendar";
import type {
  DateRange,
  DateRangePickerProps,
  DateRangePreset,
} from "./types";

type PopoverPosition = {
  top: number;
  left: number;
};

function getInitialFocusableDate(
  month: Date,
  weekStartsOn: 0 | 1,
  constraints: {
    minDate?: Date;
    maxDate?: Date;
    disabledDates?: Date[];
  },
): Date | null {
  let visibleMonth = getStartOfMonth(month);

  for (let monthOffset = 0; monthOffset < 24; monthOffset += 1) {
    const date = getCalendarWeeks(visibleMonth, weekStartsOn)
      .flat()
      .find(
        (candidate) =>
          candidate.getMonth() === visibleMonth.getMonth() &&
          candidate.getFullYear() === visibleMonth.getFullYear() &&
          isDateSelectable(candidate, constraints),
      );
    if (date) return date;
    visibleMonth = addMonths(visibleMonth, 1);
  }

  return null;
}

function getPreviewRange(
  range: DateRange,
  hoveredDate: Date | null,
  constraints: {
    minDate?: Date;
    maxDate?: Date;
    disabledDates?: Date[];
  },
): DateRange | null {
  if (
    !range.from ||
    range.to ||
    !hoveredDate ||
    !isDateSelectable(hoveredDate, constraints)
  ) {
    return null;
  }

  return compareDates(hoveredDate, range.from) < 0
    ? { from: hoveredDate, to: range.from }
    : { from: range.from, to: hoveredDate };
}

function getRangeText(
  range: DateRange,
  locale: string,
  allTimeLabel: string,
): string {
  if (!range.from && !range.to) return allTimeLabel;
  if (range.from && range.to) {
    return `${formatDate(range.from, locale)} – ${formatDate(range.to, locale)}`;
  }
  if (range.from) return `${formatDate(range.from, locale)} –`;
  if (range.to) return `– ${formatDate(range.to, locale)}`;
  return allTimeLabel;
}

function isRangeValid(
  range: DateRange,
  invalidFrom: boolean,
  invalidTo: boolean,
  constraints: {
    minDate?: Date;
    maxDate?: Date;
    disabledDates?: Date[];
  },
): boolean {
  if (invalidFrom || invalidTo) return false;
  if (Boolean(range.from) !== Boolean(range.to)) return false;
  if (
    range.from &&
    range.to &&
    compareDates(range.from, range.to) > 0
  ) {
    return false;
  }
  return (
    (!range.from || isDateSelectable(range.from, constraints)) &&
    (!range.to || isDateSelectable(range.to, constraints))
  );
}

export function DateRangePicker({
  value,
  onApply,
  presets: requestedPresets,
  markedDates,
  minDate,
  maxDate,
  disabledDates,
  weekStartsOn: requestedWeekStartsOn,
  placeholder,
  className,
}: DateRangePickerProps) {
  const { t, locale } = useI18n();
  const presets = requestedPresets ?? getDefaultDateRangePresets();
  const weekStartsOn = requestedWeekStartsOn ?? 0;
  const constraints = { minDate, maxDate, disabledDates };
  const initialRange = normalizeDateRange(value);
  const [open, setOpen] = useState(false);
  const [draftRange, setDraftRange] = useState<DateRange>(initialRange);
  const [viewMonth, setViewMonth] = useState(() =>
    getStartOfMonth(initialRange.from ?? new Date()),
  );
  const [activeDate, setActiveDate] = useState<Date | null>(
    initialRange.from ?? normalizeDate(new Date()),
  );
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [focusRequest, setFocusRequest] = useState<string | null>(null);
  const [fromText, setFromText] = useState(
    initialRange.from ? formatLocalizedDate(initialRange.from, locale) : "",
  );
  const [toText, setToText] = useState(
    initialRange.to ? formatLocalizedDate(initialRange.to, locale) : "",
  );
  const [invalidFrom, setInvalidFrom] = useState(false);
  const [invalidTo, setInvalidTo] = useState(false);
  const [referenceDate, setReferenceDate] = useState(() =>
    normalizeDate(new Date()),
  );
  const [position, setPosition] = useState<PopoverPosition | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const hasFocusedPanel = useRef(false);
  const panelId = useId();
  const dialogLabelId = `${panelId}-label`;
  const rangeErrorId = `${panelId}-range-error`;

  const selectedPreset = findMatchingPreset(
    draftRange,
    presets,
    referenceDate,
    weekStartsOn,
  );
  const previewRange = getPreviewRange(
    draftRange,
    hoveredDate,
    constraints,
  );
  const rangeOrderInvalid =
    draftRange.from !== null &&
    draftRange.to !== null &&
    compareDates(draftRange.from, draftRange.to) > 0;
  const canApply = isRangeValid(
    draftRange,
    invalidFrom || rangeOrderInvalid,
    invalidTo || rangeOrderInvalid,
    constraints,
  );
  const triggerLabel =
    value.from || value.to
      ? getRangeText(value, locale, t("dateRangePicker.allTime"))
      : placeholder ?? t("dateRangePicker.allTime");

  const closePanel = useCallback(() => {
    setOpen(false);
    setPosition(null);
    setHoveredDate(null);
    setFocusRequest(null);
    requestAnimationFrame(() =>
      triggerRef.current?.querySelector<HTMLButtonElement>("button")?.focus(),
    );
  }, []);

  function updateDraftText(range: DateRange) {
    setFromText(
      range.from ? formatLocalizedDate(range.from, locale) : "",
    );
    setToText(range.to ? formatLocalizedDate(range.to, locale) : "");
    setInvalidFrom(false);
    setInvalidTo(false);
  }

  function openPanel() {
    const normalizedValue = normalizeDateRange(value);
    const nextReferenceDate = normalizeDate(new Date());
    const nextMonth = getStartOfMonth(
      normalizedValue.from ?? nextReferenceDate,
    );
    const nextActiveDate =
      (normalizedValue.from &&
      isDateSelectable(normalizedValue.from, constraints)
        ? normalizedValue.from
        : getInitialFocusableDate(nextMonth, weekStartsOn, constraints));

    setReferenceDate(nextReferenceDate);
    setDraftRange(normalizedValue);
    updateDraftText(normalizedValue);
    setViewMonth(nextMonth);
    setActiveDate(nextActiveDate);
    setHoveredDate(null);
    setFocusRequest(null);
    setPosition(null);
    hasFocusedPanel.current = false;
    setOpen(true);
  }

  function handleSelectDate(date: Date) {
    if (!isDateSelectable(date, constraints)) return;

    const selectedDate = normalizeDate(date);
    let nextRange: DateRange;

    if (!draftRange.from || draftRange.to) {
      nextRange = { from: selectedDate, to: null };
    } else if (compareDates(selectedDate, draftRange.from) < 0) {
      nextRange = { from: selectedDate, to: draftRange.from };
    } else {
      nextRange = { from: draftRange.from, to: selectedDate };
    }

    setDraftRange(nextRange);
    updateDraftText(nextRange);
    setActiveDate(selectedDate);
    setHoveredDate(null);
    setFocusRequest(null);
  }

  function handlePresetSelect(preset: DateRangePreset) {
    const nextRange = getPresetRange(preset, referenceDate, weekStartsOn);
    const nextMonth = getStartOfMonth(nextRange.from ?? referenceDate);
    const nextActiveDate =
      nextRange.from ??
      getInitialFocusableDate(nextMonth, weekStartsOn, constraints);

    setDraftRange(nextRange);
    updateDraftText(nextRange);
    setViewMonth(nextMonth);
    setActiveDate(nextActiveDate);
    setHoveredDate(null);
    setFocusRequest(null);
  }

  function isPresetDisabled(preset: DateRangePreset): boolean {
    const range = getPresetRange(preset, referenceDate, weekStartsOn);
    return (
      Boolean(range.from && !isDateSelectable(range.from, constraints)) ||
      Boolean(range.to && !isDateSelectable(range.to, constraints))
    );
  }

  function handleNavigate(amount: number) {
    const nextMonth = addMonths(viewMonth, amount);
    setViewMonth(nextMonth);

    if (activeDate) {
      const monthAfterRight = addMonths(nextMonth, 2);
      if (
        compareDates(activeDate, nextMonth) < 0 ||
        compareDates(activeDate, monthAfterRight) >= 0
      ) {
        setActiveDate(
          getInitialFocusableDate(nextMonth, weekStartsOn, constraints),
        );
      }
    }
    setFocusRequest(null);
  }

  function handleKeyboardFocus(date: Date, monthShift?: number) {
    const nextDate = normalizeDate(date);
    setActiveDate(nextDate);
    setFocusRequest(serializeDate(nextDate));

    if (monthShift !== undefined) {
      setViewMonth((current) => addMonths(current, monthShift));
      return;
    }

    const leftMonth = getStartOfMonth(viewMonth);
    const monthAfterRight = addMonths(leftMonth, 2);
    if (
      compareDates(nextDate, leftMonth) < 0 ||
      compareDates(nextDate, monthAfterRight) >= 0
    ) {
      setViewMonth(getStartOfMonth(nextDate));
    }
  }

  function updateDateInput(
    endpoint: "from" | "to",
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const text = event.target.value;
    const parsedDate = parseLocalizedDate(text, locale);
    const setText = endpoint === "from" ? setFromText : setToText;
    const setInvalid = endpoint === "from" ? setInvalidFrom : setInvalidTo;

    setText(text);
    if (text.trim() === "") {
      setInvalid(false);
      setDraftRange((current) => ({ ...current, [endpoint]: null }));
      return;
    }
    if (!parsedDate || !isDateSelectable(parsedDate, constraints)) {
      setInvalid(true);
      return;
    }

    setInvalid(false);
    setDraftRange((current) => ({ ...current, [endpoint]: parsedDate }));
    setViewMonth(getStartOfMonth(parsedDate));
    setActiveDate(parsedDate);
  }

  function formatDateInputOnBlur(endpoint: "from" | "to") {
    const date = endpoint === "from" ? draftRange.from : draftRange.to;
    const invalid = endpoint === "from" ? invalidFrom : invalidTo;
    if (!invalid && date) {
      const formatted = formatLocalizedDate(date, locale);
      if (endpoint === "from") setFromText(formatted);
      else setToText(formatted);
    }
  }

  function handleApply() {
    if (!canApply) return;

    const appliedRange = normalizeDateRange(draftRange);
    const preset = findMatchingPreset(
      appliedRange,
      presets,
      referenceDate,
      weekStartsOn,
    );
    onApply(appliedRange, preset);
    closePanel();
  }

  function handlePanelKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      closePanel();
      return;
    }

    if (event.key !== "Tab" || !panelRef.current) return;
    const focusableElements = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled])',
      ),
    ).filter(
      (element) =>
        element.tabIndex >= 0 && element.getClientRects().length > 0,
    );
    if (focusableElements.length === 0) return;

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const trigger = triggerRef.current?.querySelector("button");
      const panel = panelRef.current;
      if (!trigger || !panel) return;

      const triggerRect = trigger.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      const padding = 12;
      const gap = 8;
      const maxLeft = Math.max(
        padding,
        window.innerWidth - panelRect.width - padding,
      );
      const left = Math.min(
        Math.max(padding, triggerRect.right - panelRect.width),
        maxLeft,
      );
      let top = triggerRect.bottom + gap;

      if (
        top + panelRect.height > window.innerHeight - padding &&
        triggerRect.top - panelRect.height - gap >= padding
      ) {
        top = triggerRect.top - panelRect.height - gap;
      } else if (top + panelRect.height > window.innerHeight - padding) {
        top = Math.max(
          padding,
          window.innerHeight - panelRect.height - padding,
        );
      }

      setPosition({ top, left });
    };

    const animationFrame = requestAnimationFrame(updatePosition);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleOutsidePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (
        target instanceof Node &&
        !panelRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        closePanel();
      }
    };

    document.addEventListener("pointerdown", handleOutsidePointerDown);
    return () =>
      document.removeEventListener("pointerdown", handleOutsidePointerDown);
  }, [closePanel, open]);

  useEffect(() => {
    if (!open || !position || hasFocusedPanel.current) return;

    const animationFrame = requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const firstFocusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled])',
        ),
      ).find(
        (element) =>
          element.tabIndex >= 0 && element.getClientRects().length > 0,
      );
      (firstFocusable ?? panel).focus();
      hasFocusedPanel.current = true;
    });
    return () => cancelAnimationFrame(animationFrame);
  }, [open, position]);

  const panel =
    open && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-modal="false"
            aria-labelledby={dialogLabelId}
            tabIndex={-1}
            onKeyDown={handlePanelKeyDown}
            style={{
              top: position?.top ?? 0,
              left: position?.left ?? 0,
              visibility: position ? "visible" : "hidden",
            }}
            className="fixed z-[100] flex max-h-[calc(100vh-24px)] w-[700px] max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-xl border border-strokestroke-gray bg-white text-text-colortext-black shadow-lg"
          >
            <h2 id={dialogLabelId} className="sr-only">
              {t("dateRangePicker.dialogLabel")}
            </h2>

            <div className="flex min-h-0 flex-1 flex-col md:flex-row">
              <PresetList
                presets={presets}
                selectedPreset={selectedPreset}
                isPresetDisabled={isPresetDisabled}
                onSelect={handlePresetSelect}
              />
              <div className="min-h-0 flex-1 overflow-y-auto">
                <RangeCalendar
                  viewMonth={viewMonth}
                  range={draftRange}
                  previewRange={previewRange}
                  hoveredDate={hoveredDate}
                  activeDate={activeDate}
                  focusRequest={focusRequest}
                  markedDates={markedDates}
                  minDate={minDate}
                  maxDate={maxDate}
                  disabledDates={disabledDates}
                  weekStartsOn={weekStartsOn}
                  onNavigate={handleNavigate}
                  onSelectDate={handleSelectDate}
                  onHoverDate={setHoveredDate}
                  onFocusDate={handleKeyboardFocus}
                  onFocusRequestHandled={() => setFocusRequest(null)}
                />
              </div>
            </div>

            <footer className="flex shrink-0 flex-col gap-3 border-t border-strokestroke-gray px-3 py-3 md:flex-row md:items-center md:justify-between">
              <div className="flex min-w-0 items-center gap-2">
                <div className="min-w-0 flex-1">
                  <Input
                    type="text"
                    value={fromText}
                    onChange={(event) => updateDateInput("from", event)}
                    onBlur={() => formatDateInputOnBlur("from")}
                    placeholder={t("dateRangePicker.startDate")}
                    aria-label={t("dateRangePicker.startDate")}
                    aria-invalid={invalidFrom || rangeOrderInvalid}
                    aria-describedby={
                      invalidFrom || rangeOrderInvalid ? rangeErrorId : undefined
                    }
                    autoComplete="off"
                    inputMode="text"
                    className={cn(
                      "h-9 border-strokestroke-gray bg-white text-xs text-text-colortext-dark placeholder:text-text-colortext-gray",
                      (invalidFrom || rangeOrderInvalid) && "border-red-600",
                    )}
                  />
                </div>
                <span aria-hidden="true" className="text-sm text-text-colortext-gray">
                  –
                </span>
                <div className="min-w-0 flex-1">
                  <Input
                    type="text"
                    value={toText}
                    onChange={(event) => updateDateInput("to", event)}
                    onBlur={() => formatDateInputOnBlur("to")}
                    placeholder={t("dateRangePicker.endDate")}
                    aria-label={t("dateRangePicker.endDate")}
                    aria-invalid={invalidTo || rangeOrderInvalid}
                    aria-describedby={
                      invalidTo || rangeOrderInvalid ? rangeErrorId : undefined
                    }
                    autoComplete="off"
                    inputMode="text"
                    className={cn(
                      "h-9 border-strokestroke-gray bg-white text-xs text-text-colortext-dark placeholder:text-text-colortext-gray",
                      (invalidTo || rangeOrderInvalid) && "border-red-600",
                    )}
                  />
                </div>
                {(invalidFrom || invalidTo || rangeOrderInvalid) && (
                  <span id={rangeErrorId} className="sr-only">
                    {rangeOrderInvalid
                      ? t("dateRangePicker.invalidRange")
                      : t("dateRangePicker.invalidDate")}
                  </span>
                )}
              </div>

              <div className="flex shrink-0 justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closePanel}
                  className="h-9 border-strokestroke-gray bg-white px-3 text-xs text-text-colortext-dark"
                >
                  {t("dateRangePicker.cancel")}
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleApply}
                  disabled={!canApply}
                  className="h-9 border-primaryprimary-green bg-primaryprimary-green px-3 text-xs text-white hover:border-primaryprimary-green hover:bg-primaryprimary-green"
                >
                  {t("dateRangePicker.apply")}
                </Button>
              </div>
            </footer>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div ref={triggerRef} className="inline-flex max-w-full">
        <Button
          type="button"
          variant="outline"
          aria-haspopup="dialog"
          aria-controls={open ? panelId : undefined}
          aria-expanded={open}
          onClick={() => (open ? closePanel() : openPanel())}
          className={cn(
            "h-9 max-w-full justify-between gap-3 border-strokestroke-gray bg-white px-3 text-sm font-medium text-text-colortext-dark hover:bg-slate-50",
            className,
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            <CalendarDays
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-primaryprimary-green"
            />
            <span className="truncate">{triggerLabel}</span>
          </span>
          <ChevronDown
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-text-colortext-gray"
          />
        </Button>
      </div>
      {panel}
    </>
  );
}
