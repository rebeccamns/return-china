import type {
  DashboardData,
  FlowRow,
  Kpis,
  Mode,
  PeriodOption,
  TrendPoint,
} from "./types";

/* ============================================================
   Calendar helpers
============================================================ */

// Same date as the clock in the top bar. Swap for `new Date()` once real data exists.
export const TODAY = new Date(2026, 8, 22);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const pad = (n: number) => String(n).padStart(2, "0");
const round1 = (n: number) => Math.round(n * 10) / 10;
const isoDay = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const shortDate = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()]}`;
const parseIso = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

/* ============================================================
   Toggle + period select configuration
   (this is where the meaning of Date / Day lives, change it here)
============================================================ */

export const MODES: { value: Mode; label: string }[] = [
  { value: "year", label: "Year" }, //   chart = one point per month
  { value: "month", label: "Month" }, // chart = one point per week
  { value: "date", label: "Date" }, //   chart = one point per day, rolling window
  { value: "day", label: "Day" }, //     chart = one point per working hour of one day
];

// Display labels for the period selector are locale-aware; the component
// supplies the translated fragments and this builds the option list.
export type PeriodOptionTexts = {
  monthsShort: readonly string[];
  weekdaysShort: readonly string[];
  today: string;
  yesterday: string;
  lastNDays: (days: number) => string;
  formatShortDate: (day: number, monthIndex: number) => string;
};

export function getPeriodOptions(mode: Mode, texts: PeriodOptionTexts): PeriodOption[] {
  if (mode === "year") {
    return ["2026", "2025", "2024"].map((y) => ({ value: y, label: y }));
  }

  if (mode === "month") {
    return Array.from({ length: TODAY.getMonth() + 1 }, (_, i) => TODAY.getMonth() - i).map((m) => ({
      value: String(m),
      label: `${texts.monthsShort[m] ?? MONTHS[m]} 2026`,
    }));
  }

  if (mode === "date") {
    return [7, 14, 30].map((n) => ({ value: String(n), label: texts.lastNDays(n) }));
  }

  return Array.from({ length: 7 }, (_, i) => {
    const d = addDays(TODAY, -i);
    const prefix =
      i === 0
        ? texts.today
        : i === 1
          ? texts.yesterday
          : (texts.weekdaysShort[d.getDay()] ?? WEEKDAYS[d.getDay()]);
    return { value: isoDay(d), label: `${prefix}, ${texts.formatShortDate(d.getDate(), d.getMonth())}` };
  });
}

export const DEFAULT_PERIOD: Record<Mode, string> = {
  year: "2026",
  month: String(TODAY.getMonth()),
  date: "7",
  day: isoDay(TODAY),
};

export const COMPARE_LABEL: Record<Mode, string> = {
  year: "vs last year",
  month: "vs last month",
  date: "vs previous period",
  day: "vs yesterday",
};

/* ============================================================
   Seeded random (mulberry32). Pure integer math, so the server
   and the browser always produce identical numbers (no hydration mismatch).
============================================================ */

function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: string) {
  let a = hash(seed);
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(list: T[], rand: () => number): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Split an integer total into `parts` integers that add up exactly.
function split(total: number, parts: number, rand: () => number): number[] {
  const weights = Array.from({ length: parts }, () => 0.6 + rand() * 0.8);
  const sum = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map((w) => (w / sum) * total);
  const out = raw.map(Math.floor);
  let left = total - out.reduce((a, b) => a + b, 0);
  const byFraction = raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac || a.i - b.i);
  for (let k = 0; left > 0; k++, left--) out[byFraction[k % parts].i]++;
  return out;
}

// Place `count` rejections across slots without exceeding each slot's shipments.
function scatter(count: number, capacity: number[], rand: () => number): number[] {
  const out = capacity.map(() => 0);
  const order = shuffle(capacity.map((_, i) => i), rand);
  let left = Math.min(count, capacity.reduce((a, b) => a + b, 0));
  while (left > 0) {
    let placed = false;
    for (const i of order) {
      if (left === 0) break;
      if (out[i] < capacity[i]) {
        out[i]++;
        left--;
        placed = true;
      }
    }
    if (!placed) break;
  }
  return out;
}

/* ============================================================
   Buckets (one chart point each)
============================================================ */

type Bucket = {
  shipments: number;
  rejected: number;
  topStage: string;
  topStageCount: number;
};

type Label = { label: string; tooltipLabel: string };

const STAGES = [
  "PMC MO Entry",
  "IQC Scan",
  "PMC Open WO",
  "Staff Return",
  "Exim",
  "Staff Return 2",
  "IQC QA Pass",
] as const;

// Staff Return and Exim reject the most in the mock data
const STAGE_WEIGHTS = [1, 1.5, 0.5, 3, 3.5, 1.5, 1];

function pickStage(rand: () => number): string {
  const total = STAGE_WEIGHTS.reduce((a, b) => a + b, 0);
  let r = rand() * total;
  for (let i = 0; i < STAGES.length; i++) {
    r -= STAGE_WEIGHTS[i];
    if (r <= 0) return STAGES[i];
  }
  return STAGES[STAGES.length - 1];
}

function makeBucket(shipments: number, rejected: number, rand: () => number): Bucket {
  if (rejected === 0) return { shipments, rejected, topStage: "", topStageCount: 0 };
  const share = 0.45 + rand() * 0.3;
  return {
    shipments,
    rejected,
    topStage: pickStage(rand),
    topStageCount: Math.max(1, Math.min(rejected, Math.round(rejected * share))),
  };
}

function mergeBuckets(list: Bucket[]): Bucket {
  const shipments = list.reduce((s, b) => s + b.shipments, 0);
  const rejected = list.reduce((s, b) => s + b.rejected, 0);

  const tally = new Map<string, number>();
  for (const b of list) {
    if (b.topStage) tally.set(b.topStage, (tally.get(b.topStage) ?? 0) + b.topStageCount);
  }

  let topStage = "";
  let topStageCount = 0;
  tally.forEach((count, stage) => {
    if (count > topStageCount) {
      topStage = stage;
      topStageCount = count;
    }
  });

  return { shipments, rejected, topStage, topStageCount: Math.min(topStageCount, rejected) };
}

/* ============================================================
   YEAR 2026: the numbers from the design.
   [shipments, rejected, most-rejected stage, rejected in that stage]
============================================================ */

const YEAR_2026: [number, number, string, number][] = [
  [126, 10, "Staff Return", 4], // Jan 7.9%
  [118, 8, "Exim", 3], //          Feb 6.8%
  [131, 10, "Staff Return", 4], // Mar 7.6%
  [120, 8, "Exim", 3], //          Apr 6.7%
  [128, 9, "IQC Scan", 4], //      May 7.0%
  [122, 7, "Exim", 3], //          Jun 5.7%
  [123, 8, "Exim", 5], //          Jul 6.5%
  [119, 7, "Staff Return", 3], //  Aug 5.9%
  [118, 8, "Exim", 4], //          Sep 6.8%
  [125, 8, "Staff Return", 3], //  Oct 6.4%
  [123, 9, "Exim", 4], //          Nov 7.3%
  [127, 7, "IQC QA Pass", 3], //   Dec 5.5%
];

// KPI cards exactly as designed (they do not reconcile with the monthly rows,
// see the note in the reply; derive both from the same query once the API exists).
const DESIGN_KPIS: Kpis = {
  total: 1480,
  totalDelta: 8.4,
  completed: 1001,
  completedDelta: 8.1,
  rejected: 118,
  rejectedDelta: -12.6,
  leadTimeDays: 3.2,
  leadTimeDelta: -18.2,
};

// Bar = average time in the stage. Green = time within the SLT, red = average
// time beyond it. The label = MOs counted + the share of them that exceeded the SLT.
// TODO: sltHours should come from the "Standard Lead Time" sheet. IQC Scan,
// PMC Open WO and Staff Return 2 are chosen here to match the design bars.
const DESIGN_FLOWS: FlowRow[] = [
  { stage: "PMC MO Entry", mos: 12, overPct: 17, sltHours: 3.9, overHours: 0.8 },
  { stage: "IQC Scan", mos: 4, overPct: 18, sltHours: 5.6, overHours: 0.8 },
  { stage: "PMC Open WO", mos: 9, overPct: 17, sltHours: 2.3, overHours: 0 },
  { stage: "Staff Return", mos: 7, overPct: 34, sltHours: 8, overHours: 4.2 },
  { stage: "Exim", mos: 8, overPct: 17, sltHours: 4, overHours: 0.8 },
  { stage: "Staff Return 2", mos: 4, overPct: 17, sltHours: 1.5, overHours: 0.3 },
  { stage: "IQC QA Pass", mos: 2, overPct: 17, sltHours: 4, overHours: 0 },
];

/* ============================================================
   Derived views (always consistent with the 2026 monthly data)
============================================================ */

const dayCache = new Map<number, Bucket[]>();

function daysOfMonth(month: number): Bucket[] {
  const cached = dayCache.get(month);
  if (cached) return cached;

  const [shipments, rejected] = YEAR_2026[month];
  const count = new Date(2026, month + 1, 0).getDate();
  const rand = rng(`days:${month}`);
  const perDay = split(shipments, count, rand);
  const rejectedPerDay = scatter(rejected, perDay, rand);
  const result = perDay.map((s, i) => makeBucket(s, rejectedPerDay[i], rand));

  dayCache.set(month, result);
  return result;
}

const dayBucket = (d: Date) => daysOfMonth(d.getMonth())[d.getDate() - 1];

function weeksOfMonth(month: number): { buckets: Bucket[]; labels: Label[] } {
  const days = daysOfMonth(month);
  const chunks: Bucket[][] = [];
  for (let i = 0; i < days.length; i += 7) chunks.push(days.slice(i, i + 7));

  return {
    buckets: chunks.map(mergeBuckets),
    labels: chunks.map((chunk, i) => ({
      label: `Wk ${i + 1}`,
      tooltipLabel: `${MONTHS[month]} ${i * 7 + 1}–${i * 7 + chunk.length}`,
    })),
  };
}

const HOURS = Array.from({ length: 10 }, (_, i) => 8 + i); // 08:00 – 17:00

function hoursOfDay(date: Date): Bucket[] {
  const day = dayBucket(date);
  const rand = rng(`hours:${isoDay(date)}`);
  const perHour = split(day.shipments, HOURS.length, rand);
  const rejectedPerHour = scatter(day.rejected, perHour, rand);
  return perHour.map((s, i) => makeBucket(s, rejectedPerHour[i], rand));
}

function generatedYear(year: string): Bucket[] {
  const rand = rng(`year:${year}`);
  return MONTHS.map(() => {
    const shipments = 100 + Math.round(rand() * 35);
    const rejected = Math.round(shipments * (0.05 + rand() * 0.04));
    return makeBucket(shipments, rejected, rand);
  });
}

function kpisFrom(buckets: Bucket[], rand: () => number): Kpis {
  const total = buckets.reduce((s, b) => s + b.shipments, 0);
  const rejected = buckets.reduce((s, b) => s + b.rejected, 0);
  return {
    total,
    completed: Math.min(total - rejected, Math.round(total * 0.676)),
    rejected,
    leadTimeDays: round1(2.7 + rand() * 1.1),
    totalDelta: round1(-3 + rand() * 15),
    completedDelta: round1(-3 + rand() * 14),
    rejectedDelta: round1(-(2 + rand() * 14)),
    leadTimeDelta: round1(-(2 + rand() * 18)),
  };
}

function flowsFor(mode: Mode, period: string): FlowRow[] {
  const rand = rng(`flows:${mode}:${period}`);
  const volume = { year: 1, month: 0.6, date: 0.45, day: 0.2 }[mode];

  return DESIGN_FLOWS.map((row) => ({
    ...row,
    mos: Math.max(1, Math.round(row.mos * volume * (0.7 + rand() * 0.6))),
    overPct: Math.min(45, Math.max(5, Math.round(row.overPct + (rand() - 0.5) * 10))),
    overHours:
      row.overHours === 0 && rand() < 0.6 ? 0 : round1((row.overHours || 0.3) * (0.6 + rand() * 0.8)),
  }));
}

/* ============================================================
   Public API
============================================================ */

export function getDashboardData(mode: Mode, period: string): DashboardData {
  const isDesign = mode === "year" && period === "2026";

  let buckets: Bucket[];
  let labels: Label[];

  if (mode === "year") {
    buckets = isDesign
      ? YEAR_2026.map(([shipments, rejected, topStage, topStageCount]) => ({
          shipments,
          rejected,
          topStage,
          topStageCount,
        }))
      : generatedYear(period);
    labels = MONTHS.map((m) => ({ label: m, tooltipLabel: m }));
  } else if (mode === "month") {
    const weeks = weeksOfMonth(Number(period));
    buckets = weeks.buckets;
    labels = weeks.labels;
  } else if (mode === "date") {
    const count = Number(period);
    const dates = Array.from({ length: count }, (_, i) => addDays(TODAY, i - (count - 1)));
    buckets = dates.map(dayBucket);
    labels = dates.map((d) => ({
      label: shortDate(d),
      tooltipLabel: `${WEEKDAYS[d.getDay()]}, ${shortDate(d)}`,
    }));
  } else {
    buckets = hoursOfDay(parseIso(period));
    labels = HOURS.map((h) => ({
      label: `${pad(h)}:00`,
      tooltipLabel: `${pad(h)}:00 – ${pad(h + 1)}:00`,
    }));
  }

  const trend: TrendPoint[] = buckets.map((b, i) => ({
    ...labels[i],
    ...b,
    rate: b.shipments > 0 ? round1((b.rejected / b.shipments) * 100) : 0,
  }));

  return {
    kpis: isDesign ? DESIGN_KPIS : kpisFrom(buckets, rng(`kpi:${mode}:${period}`)),
    trend,
    flows: isDesign ? DESIGN_FLOWS : flowsFor(mode, period),
  };
  
}


/**
 * Demo monthly SLT data.
 * Uses the existing seeded flow generator so the result is deterministic.
 * Replace this with real monthly data when the API is available.
 */
export function getFlowsForMonth(month: number): FlowRow[] {
  const safeMonth = Math.min(11, Math.max(0, month));
  return flowsFor("month", String(safeMonth));
}
