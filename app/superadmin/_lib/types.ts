export type Mode = "year" | "month" | "date" | "day";

export type PeriodOption = { value: string; label: string };

export type Kpis = {
  total: number;
  totalDelta: number; // % change vs the previous period (signed)
  completed: number;
  completedDelta: number;
  rejected: number;
  rejectedDelta: number;
  leadTimeDays: number;
  leadTimeDelta: number;
};

export type TrendPoint = {
  label: string; // x-axis label
  tooltipLabel: string; // title shown in the hover tooltip
  rate: number; // rejection rate, %
  rejected: number;
  shipments: number;
  topStage: string; // stage with the most rejections ("" when none)
  topStageCount: number;
};

export type FlowRow = {
  stage: string;
  mos: number; // MOs counted in this stage for the period
  overPct: number; // % of those MOs that exceeded the SLT
  sltHours: number; // average time spent within the SLT (green part of the bar)
  overHours: number; // average time beyond the SLT (red part, 0 = none)
};

export type DashboardData = {
  kpis: Kpis;
  trend: TrendPoint[];
  flows: FlowRow[];
};