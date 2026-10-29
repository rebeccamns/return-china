
export type Mode = "year" | "month" | "date" | "day";

/* ============================================================
   MO Monitoring types
============================================================ */

export type MoStatus = "In Progress" | "Pending" | "Completed" | "Blocked";

export type StepStatus = "completed" | "in_progress" | "not_started" | "reopened";

export type StepName =
  | "PMC Entry"
  | "IQC"
  | "PMC Open WO"
  | "Staff Return"
  | "Exim"
  | "Staff Return 2"
  | "IQC QA Pass";

export type ActivityStatus = "Started" | "Completed" | "Rejected";

export type TimelineStep = {
  step: StepName;
  status: StepStatus;
  /** Display time string, e.g. "09:02". Null when not started. */
  time: string | null;
};

export type ActivityLogEntry = {
  /** Full display timestamp, e.g. "Sep 22, 12:16" */
  time: string;
  processStep: StepName;
  activityStatus: ActivityStatus;
  remarks: string;
};

export type MoRecord = {
  moCode: string;
  model: "Latte-M" | "Latte-S" | "Mocha-X";
  currentStep: StepName;
  /** Number of steps completed out of 7 */
  completedSteps: number;
  status: MoStatus;
  /** Display string, e.g. "Sep 22, 08:15" */
  lastUpdated: string;
  /** Real Date object used for date-range filtering */
  lastUpdatedDate: Date;
  timeline: TimelineStep[];
  activityLog: ActivityLogEntry[];
  rejectionCount: number;
};

export type PeriodOption = {
  value: string;
  label: string;
};

export type Kpis = {
  total: number;
  totalDelta: number;
  completed: number;
  completedDelta: number;
  rejected: number;
  rejectedDelta: number;
  leadTimeDays: number;
  leadTimeDelta: number;
};

export type TrendPoint = {
  label: string;
  tooltipLabel: string;
  rate: number;
  rejected: number;
  shipments: number;
  topStage: string;
  topStageCount: number;
};

export type FlowRow = {
  stage: string;
  mos: number;
  overPct: number;
  sltHours: number;
  overHours: number;
};

export type AbnormalRateRow = {
  stage: string;
  shipments: number;
  feedback: number;
};

export type DashboardData = {
  kpis: Kpis;
  trend: TrendPoint[];
  flows: FlowRow[];
};
