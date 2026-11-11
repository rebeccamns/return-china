export type DateRange = {
  from: Date | null;
  to: Date | null;
};

export type DateRangePreset =
  | "today"
  | "yesterday"
  | "thisWeek"
  | "lastWeek"
  | "thisMonth"
  | "lastMonth"
  | "thisYear"
  | "lastYear"
  | "allTime";

export type DateRangePickerProps = {
  value: DateRange;
  onApply: (range: DateRange, preset: DateRangePreset | null) => void;
  presets?: DateRangePreset[];
  markedDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  weekStartsOn?: 0 | 1;
  placeholder?: string;
  className?: string;
};
