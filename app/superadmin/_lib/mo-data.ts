/**
 * MO Monitoring dummy data and helper functions.
 * All data lives here so components never import raw arrays directly.
 *
 * TODO(backend): replace every exported function with a real API call.
 */

import type {
  ActivityLogEntry,
  ActivityStatus,
  MoRecord,
  MoStatus,
  StepName,
  TimelineStep,
} from "./types";
import { DEMO, demoMoNumber } from "@/lib/demo-data";

// TODO(backend): replace with real auth/role check
export const currentRole = "superadmin";

/** The 7 steps in order */
export const MO_STEPS: StepName[] = [
  "PMC Entry",
  "IQC",
  "PMC Open WO",
  "Staff Return",
  "Exim",
  "Staff Return 2",
  "IQC QA Pass",
];

/** Human-readable label for each StepName in the MO monitoring context */
export const STEP_DISPLAY: Record<StepName, string> = {
  "PMC Entry": "PMC Entry",
  IQC: "IQC",
  "PMC Open WO": "PMC Open WO",
  "Staff Return": "Staff Return",
  Exim: "Exim",
  "Staff Return 2": "Staff Return 2",
  "IQC QA Pass": "IQC QA Pass",
};

// ---------------------------------------------------------------------------
// Helper to build a display timestamp
// ---------------------------------------------------------------------------

const SEP = new Date(2026, 8, 22); // Sep 22 2026 (month is 0-indexed)
const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

function fmtDate(d: Date): string {
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

function fmtDateTime(d: Date, hour: number, min: number): string {
  const hh = String(hour).padStart(2, "0");
  const mm = String(min).padStart(2, "0");
  return `${fmtDate(d)}, ${hh}:${mm}`;
}

function daysBefore(n: number): Date {
  return new Date(SEP.getFullYear(), SEP.getMonth(), SEP.getDate() - n);
}

// ---------------------------------------------------------------------------
// Individual MO builders
// ---------------------------------------------------------------------------

function buildStep(step: StepName, status: TimelineStep["status"], time: string | null): TimelineStep {
  return { step, status, time };
}

function buildLog(time: string, processStep: StepName, activityStatus: ActivityStatus, remarks: string): ActivityLogEntry {
  return { time, processStep, activityStatus, remarks };
}

// ---------------------------------------------------------------------------
// The 25 MO records
// ---------------------------------------------------------------------------

const RAW_MOS: MoRecord[] = [

  // ── MO 01 ── Reference MO from the spec ──────────────────────────────────
  {
    moCode: demoMoNumber(0),
    model: DEMO.model,
    currentStep: "Exim",
    completedSteps: 4,
    status: "In Progress",
    lastUpdated: "Sep 22, 08:15",
    lastUpdatedDate: daysBefore(0),
    rejectionCount: 1,
    timeline: [
      buildStep("PMC Entry",   "completed",   "09:02"),
      buildStep("IQC",         "completed",   "09:24"),
      buildStep("PMC Open WO", "reopened",    "09:43"),
      buildStep("Staff Return","completed",   "11:58"),
      buildStep("Exim",        "in_progress", null),
      buildStep("Staff Return 2","not_started",null),
      buildStep("IQC QA Pass", "not_started", null),
    ],
    activityLog: [
      buildLog("Sep 22, 12:16", "Exim",        "Started",   "MO entered Exim process"),
      buildLog("Sep 22, 12:02", "Staff Return", "Completed", "Carton submission completed"),
      buildLog("Sep 22, 11:40", "PMC Open WO", "Completed", "WO Number re-submitted"),
      buildLog("Sep 22, 12:02", "Staff Return", "Rejected",  "WO rejected"),
      buildLog("Sep 22, 11:40", "PMC Open WO", "Completed", "WO Number submitted"),
      buildLog("Sep 22, 11:20", "IQC",         "Completed", "10/10 units scanned"),
      buildLog("Sep 22, 10:10", "PMC Entry",   "Completed", "MO entry"),
    ],
  },

  // ── MO 02 ──────────────────────────────────────────────────────────────
  {
    moCode: demoMoNumber(1),
    model: DEMO.model,
    currentStep: "IQC",
    completedSteps: 1,
    status: "Pending",
    lastUpdated: "Sep 22, 08:15",
    lastUpdatedDate: daysBefore(0),
    rejectionCount: 0,
    timeline: [
      buildStep("PMC Entry",   "completed",   "08:05"),
      buildStep("IQC",         "not_started", null),
      buildStep("PMC Open WO", "not_started", null),
      buildStep("Staff Return","not_started", null),
      buildStep("Exim",        "not_started", null),
      buildStep("Staff Return 2","not_started",null),
      buildStep("IQC QA Pass", "not_started", null),
    ],
    activityLog: [
      buildLog("Sep 22, 08:05", "PMC Entry", "Completed", "MO entry"),
    ],
  },

  // ── MO 03 ──────────────────────────────────────────────────────────────
  {
    moCode: demoMoNumber(2),
    model: DEMO.model,
    currentStep: "Staff Return",
    completedSteps: 2,
    status: "In Progress",
    lastUpdated: "Sep 22, 08:15",
    lastUpdatedDate: daysBefore(0),
    rejectionCount: 0,
    timeline: [
      buildStep("PMC Entry",   "completed",   "07:50"),
      buildStep("IQC",         "completed",   "08:10"),
      buildStep("PMC Open WO", "not_started", null),
      buildStep("Staff Return","in_progress", null),
      buildStep("Exim",        "not_started", null),
      buildStep("Staff Return 2","not_started",null),
      buildStep("IQC QA Pass", "not_started", null),
    ],
    activityLog: [
      buildLog("Sep 22, 08:30", "Staff Return","Started",   "Staff return started"),
      buildLog("Sep 22, 08:10", "IQC",         "Completed", "8/8 units scanned"),
      buildLog("Sep 22, 07:50", "PMC Entry",   "Completed", "MO entry"),
    ],
  },

  // ── MO 04 ──────────────────────────────────────────────────────────────
  {
    moCode: demoMoNumber(3),
    model: DEMO.model,
    currentStep: "Staff Return",
    completedSteps: 2,
    status: "In Progress",
    lastUpdated: "Sep 22, 08:15",
    lastUpdatedDate: daysBefore(0),
    rejectionCount: 0,
    timeline: [
      buildStep("PMC Entry",   "completed",   "07:30"),
      buildStep("IQC",         "completed",   "07:55"),
      buildStep("PMC Open WO", "not_started", null),
      buildStep("Staff Return","in_progress", null),
      buildStep("Exim",        "not_started", null),
      buildStep("Staff Return 2","not_started",null),
      buildStep("IQC QA Pass", "not_started", null),
    ],
    activityLog: [
      buildLog("Sep 22, 08:20", "Staff Return","Started",   "Staff return initiated"),
      buildLog("Sep 22, 07:55", "IQC",         "Completed", "12/12 units scanned"),
      buildLog("Sep 22, 07:30", "PMC Entry",   "Completed", "MO entry"),
    ],
  },

  // ── MO 05 ──────────────────────────────────────────────────────────────
  {
    moCode: demoMoNumber(4),
    model: DEMO.model,
    currentStep: "Exim",
    completedSteps: 4,
    status: "In Progress",
    lastUpdated: "Sep 22, 08:15",
    lastUpdatedDate: daysBefore(0),
    rejectionCount: 0,
    timeline: [
      buildStep("PMC Entry",   "completed",   "06:00"),
      buildStep("IQC",         "completed",   "06:30"),
      buildStep("PMC Open WO", "completed",   "07:00"),
      buildStep("Staff Return","completed",   "07:40"),
      buildStep("Exim",        "in_progress", null),
      buildStep("Staff Return 2","not_started",null),
      buildStep("IQC QA Pass", "not_started", null),
    ],
    activityLog: [
      buildLog("Sep 22, 08:00", "Exim",        "Started",   "MO entered Exim process"),
      buildLog("Sep 22, 07:40", "Staff Return","Completed", "All cartons verified"),
      buildLog("Sep 22, 07:00", "PMC Open WO","Completed", "WO submitted"),
      buildLog("Sep 22, 06:30", "IQC",         "Completed", "6/6 units scanned"),
      buildLog("Sep 22, 06:00", "PMC Entry",   "Completed", "MO entry"),
    ],
  },

  // ── MO 06 ──────────────────────────────────────────────────────────────
  {
    moCode: demoMoNumber(5),
    model: DEMO.model,
    currentStep: "Staff Return",
    completedSteps: 2,
    status: "Pending",
    lastUpdated: "Sep 22, 08:15",
    lastUpdatedDate: daysBefore(0),
    rejectionCount: 0,
    timeline: [
      buildStep("PMC Entry",   "completed",   "08:00"),
      buildStep("IQC",         "completed",   "08:25"),
      buildStep("PMC Open WO", "not_started", null),
      buildStep("Staff Return","not_started", null),
      buildStep("Exim",        "not_started", null),
      buildStep("Staff Return 2","not_started",null),
      buildStep("IQC QA Pass", "not_started", null),
    ],
    activityLog: [
      buildLog("Sep 22, 08:25", "IQC",       "Completed", "5/5 units scanned"),
      buildLog("Sep 22, 08:00", "PMC Entry", "Completed", "MO entry"),
    ],
  },

  // ── MO 07 ──────────────────────────────────────────────────────────────
  {
    moCode: demoMoNumber(6),
    model: DEMO.model,
    currentStep: "Staff Return 2",
    completedSteps: 5,
    status: "In Progress",
    lastUpdated: "Sep 22, 08:15",
    lastUpdatedDate: daysBefore(0),
    rejectionCount: 0,
    timeline: [
      buildStep("PMC Entry",   "completed",   "05:00"),
      buildStep("IQC",         "completed",   "05:30"),
      buildStep("PMC Open WO", "completed",   "06:00"),
      buildStep("Staff Return","completed",   "06:45"),
      buildStep("Exim",        "completed",   "07:30"),
      buildStep("Staff Return 2","in_progress",null),
      buildStep("IQC QA Pass", "not_started", null),
    ],
    activityLog: [
      buildLog("Sep 22, 08:10", "Staff Return 2","Started",   "Sticker scan started"),
      buildLog("Sep 22, 07:30", "Exim",          "Completed", "Exim verification done"),
      buildLog("Sep 22, 06:45", "Staff Return",  "Completed", "Cartons submitted"),
      buildLog("Sep 22, 06:00", "PMC Open WO",   "Completed", "WO submitted"),
      buildLog("Sep 22, 05:30", "IQC",           "Completed", "9/9 units scanned"),
      buildLog("Sep 22, 05:00", "PMC Entry",     "Completed", "MO entry"),
    ],
  },

  // ── MO 08 ─ Blocked ───────────────────────────────────────────────────
  {
    moCode: demoMoNumber(7),
    model: DEMO.model,
    currentStep: "Staff Return",
    completedSteps: 2,
    status: "Blocked",
    lastUpdated: "Sep 22, 08:15",
    lastUpdatedDate: daysBefore(0),
    rejectionCount: 1,
    timeline: [
      buildStep("PMC Entry",   "completed",   "07:10"),
      buildStep("IQC",         "completed",   "07:35"),
      buildStep("PMC Open WO", "not_started", null),
      buildStep("Staff Return","in_progress", null),
      buildStep("Exim",        "not_started", null),
      buildStep("Staff Return 2","not_started",null),
      buildStep("IQC QA Pass", "not_started", null),
    ],
    activityLog: [
      buildLog("Sep 22, 08:00", "Staff Return","Rejected",  "Carton data mismatch"),
      buildLog("Sep 22, 07:35", "IQC",         "Completed", "7/7 units scanned"),
      buildLog("Sep 22, 07:10", "PMC Entry",   "Completed", "MO entry"),
    ],
  },

  // ── MO 09 ──────────────────────────────────────────────────────────────
  {
    moCode: demoMoNumber(8),
    model: DEMO.model,
    currentStep: "Staff Return",
    completedSteps: 2,
    status: "In Progress",
    lastUpdated: "Sep 22, 08:15",
    lastUpdatedDate: daysBefore(0),
    rejectionCount: 0,
    timeline: [
      buildStep("PMC Entry",   "completed",   "08:40"),
      buildStep("IQC",         "completed",   "09:00"),
      buildStep("PMC Open WO", "not_started", null),
      buildStep("Staff Return","in_progress", null),
      buildStep("Exim",        "not_started", null),
      buildStep("Staff Return 2","not_started",null),
      buildStep("IQC QA Pass", "not_started", null),
    ],
    activityLog: [
      buildLog("Sep 22, 09:15", "Staff Return","Started",   "Staff return initiated"),
      buildLog("Sep 22, 09:00", "IQC",         "Completed", "10/10 units scanned"),
      buildLog("Sep 22, 08:40", "PMC Entry",   "Completed", "MO entry"),
    ],
  },

  // ── MO 10 ──────────────────────────────────────────────────────────────
  {
    moCode: demoMoNumber(9),
    model: DEMO.model,
    currentStep: "Staff Return",
    completedSteps: 2,
    status: "Pending",
    lastUpdated: "Sep 22, 08:15",
    lastUpdatedDate: daysBefore(0),
    rejectionCount: 0,
    timeline: [
      buildStep("PMC Entry",   "completed",   "09:10"),
      buildStep("IQC",         "completed",   "09:35"),
      buildStep("PMC Open WO", "not_started", null),
      buildStep("Staff Return","not_started", null),
      buildStep("Exim",        "not_started", null),
      buildStep("Staff Return 2","not_started",null),
      buildStep("IQC QA Pass", "not_started", null),
    ],
    activityLog: [
      buildLog("Sep 22, 09:35", "IQC",       "Completed", "11/11 units scanned"),
      buildLog("Sep 22, 09:10", "PMC Entry", "Completed", "MO entry"),
    ],
  },

  // ── MO 11 ─ Completed ─────────────────────────────────────────────────
  {
    moCode: demoMoNumber(10),
    model: DEMO.model,
    currentStep: "IQC QA Pass",
    completedSteps: 7,
    status: "Completed",
    lastUpdated: "Sep 21, 16:45",
    lastUpdatedDate: daysBefore(1),
    rejectionCount: 0,
    timeline: [
      buildStep("PMC Entry",   "completed", "08:00"),
      buildStep("IQC",         "completed", "09:00"),
      buildStep("PMC Open WO", "completed", "10:00"),
      buildStep("Staff Return","completed", "11:30"),
      buildStep("Exim",        "completed", "13:00"),
      buildStep("Staff Return 2","completed","14:30"),
      buildStep("IQC QA Pass", "completed", "16:45"),
    ],
    activityLog: [
      buildLog("Sep 21, 16:45", "IQC QA Pass",   "Completed", "All checks passed"),
      buildLog("Sep 21, 14:30", "Staff Return 2","Completed", "All stickers scanned"),
      buildLog("Sep 21, 13:00", "Exim",           "Completed", "Exim approved"),
      buildLog("Sep 21, 11:30", "Staff Return",   "Completed", "All cartons submitted"),
      buildLog("Sep 21, 10:00", "PMC Open WO",    "Completed", "WO submitted"),
      buildLog("Sep 21, 09:00", "IQC",            "Completed", "8/8 units scanned"),
      buildLog("Sep 21, 08:00", "PMC Entry",      "Completed", "MO entry"),
    ],
  },

  // ── MO 12 ─ Completed ─────────────────────────────────────────────────
  {
    moCode: demoMoNumber(11),
    model: DEMO.model,
    currentStep: "IQC QA Pass",
    completedSteps: 7,
    status: "Completed",
    lastUpdated: "Sep 21, 15:30",
    lastUpdatedDate: daysBefore(1),
    rejectionCount: 2,
    timeline: [
      buildStep("PMC Entry",   "completed", "07:00"),
      buildStep("IQC",         "completed", "07:45"),
      buildStep("PMC Open WO", "reopened",  "09:00"),
      buildStep("Staff Return","reopened",  "12:00"),
      buildStep("Exim",        "completed", "13:30"),
      buildStep("Staff Return 2","completed","14:30"),
      buildStep("IQC QA Pass", "completed", "15:30"),
    ],
    activityLog: [
      buildLog("Sep 21, 15:30", "IQC QA Pass",   "Completed", "QA check passed"),
      buildLog("Sep 21, 14:30", "Staff Return 2","Completed", "Sticker scan done"),
      buildLog("Sep 21, 13:30", "Exim",           "Completed", "Exim verification done"),
      buildLog("Sep 21, 12:00", "Staff Return",   "Completed", "Resubmitted carton data"),
      buildLog("Sep 21, 11:00", "Staff Return",   "Rejected",  "Wrong carton weight"),
      buildLog("Sep 21, 09:00", "PMC Open WO",    "Completed", "WO re-submitted"),
      buildLog("Sep 21, 08:30", "PMC Open WO",    "Rejected",  "WO data mismatch"),
      buildLog("Sep 21, 07:45", "IQC",            "Completed", "15/15 units scanned"),
      buildLog("Sep 21, 07:00", "PMC Entry",      "Completed", "MO entry"),
    ],
  },

  // ── MO 13 ─ Completed ─────────────────────────────────────────────────
  {
    moCode: demoMoNumber(12),
    model: DEMO.model,
    currentStep: "IQC QA Pass",
    completedSteps: 7,
    status: "Completed",
    lastUpdated: "Sep 21, 14:00",
    lastUpdatedDate: daysBefore(1),
    rejectionCount: 0,
    timeline: [
      buildStep("PMC Entry",   "completed", "07:30"),
      buildStep("IQC",         "completed", "08:15"),
      buildStep("PMC Open WO", "completed", "09:00"),
      buildStep("Staff Return","completed", "10:30"),
      buildStep("Exim",        "completed", "11:45"),
      buildStep("Staff Return 2","completed","12:45"),
      buildStep("IQC QA Pass", "completed", "14:00"),
    ],
    activityLog: [
      buildLog("Sep 21, 14:00", "IQC QA Pass",   "Completed", "QA passed"),
      buildLog("Sep 21, 12:45", "Staff Return 2","Completed", "Stickers all scanned"),
      buildLog("Sep 21, 11:45", "Exim",           "Completed", "Approved"),
      buildLog("Sep 21, 10:30", "Staff Return",   "Completed", "Cartons submitted"),
      buildLog("Sep 21, 09:00", "PMC Open WO",    "Completed", "WO submitted"),
      buildLog("Sep 21, 08:15", "IQC",            "Completed", "12/12 units"),
      buildLog("Sep 21, 07:30", "PMC Entry",      "Completed", "MO entry"),
    ],
  },

  // ── MO 14 ─ Completed ─────────────────────────────────────────────────
  {
    moCode: demoMoNumber(13),
    model: DEMO.model,
    currentStep: "IQC QA Pass",
    completedSteps: 7,
    status: "Completed",
    lastUpdated: "Sep 20, 17:00",
    lastUpdatedDate: daysBefore(2),
    rejectionCount: 0,
    timeline: [
      buildStep("PMC Entry",   "completed", "08:00"),
      buildStep("IQC",         "completed", "09:00"),
      buildStep("PMC Open WO", "completed", "10:00"),
      buildStep("Staff Return","completed", "11:30"),
      buildStep("Exim",        "completed", "13:00"),
      buildStep("Staff Return 2","completed","15:00"),
      buildStep("IQC QA Pass", "completed", "17:00"),
    ],
    activityLog: [
      buildLog("Sep 20, 17:00", "IQC QA Pass",   "Completed", "Passed"),
      buildLog("Sep 20, 15:00", "Staff Return 2","Completed", "Done"),
      buildLog("Sep 20, 13:00", "Exim",           "Completed", "Done"),
      buildLog("Sep 20, 11:30", "Staff Return",   "Completed", "Done"),
      buildLog("Sep 20, 10:00", "PMC Open WO",    "Completed", "WO submitted"),
      buildLog("Sep 20, 09:00", "IQC",            "Completed", "10/10 units"),
      buildLog("Sep 20, 08:00", "PMC Entry",      "Completed", "MO entry"),
    ],
  },

  // ── MO 15 ─ Completed ─────────────────────────────────────────────────
  {
    moCode: demoMoNumber(14),
    model: DEMO.model,
    currentStep: "IQC QA Pass",
    completedSteps: 7,
    status: "Completed",
    lastUpdated: "Sep 20, 16:00",
    lastUpdatedDate: daysBefore(2),
    rejectionCount: 1,
    timeline: [
      buildStep("PMC Entry",   "completed", "07:00"),
      buildStep("IQC",         "completed", "07:45"),
      buildStep("PMC Open WO", "completed", "08:30"),
      buildStep("Staff Return","reopened",  "11:00"),
      buildStep("Exim",        "completed", "12:30"),
      buildStep("Staff Return 2","completed","13:30"),
      buildStep("IQC QA Pass", "completed", "16:00"),
    ],
    activityLog: [
      buildLog("Sep 20, 16:00", "IQC QA Pass",   "Completed", "QA passed"),
      buildLog("Sep 20, 13:30", "Staff Return 2","Completed", "Stickers scanned"),
      buildLog("Sep 20, 12:30", "Exim",           "Completed", "Approved"),
      buildLog("Sep 20, 11:00", "Staff Return",   "Completed", "Data corrected and resubmitted"),
      buildLog("Sep 20, 10:00", "Staff Return",   "Rejected",  "Net weight mismatch"),
      buildLog("Sep 20, 08:30", "PMC Open WO",    "Completed", "WO submitted"),
      buildLog("Sep 20, 07:45", "IQC",            "Completed", "9/9 units"),
      buildLog("Sep 20, 07:00", "PMC Entry",      "Completed", "MO entry"),
    ],
  },

  // ── MO 16 ─ Completed ─────────────────────────────────────────────────
  {
    moCode: demoMoNumber(15),
    model: DEMO.model,
    currentStep: "IQC QA Pass",
    completedSteps: 7,
    status: "Completed",
    lastUpdated: "Sep 19, 15:30",
    lastUpdatedDate: daysBefore(3),
    rejectionCount: 0,
    timeline: [
      buildStep("PMC Entry",   "completed", "08:10"),
      buildStep("IQC",         "completed", "09:00"),
      buildStep("PMC Open WO", "completed", "09:45"),
      buildStep("Staff Return","completed", "11:00"),
      buildStep("Exim",        "completed", "12:30"),
      buildStep("Staff Return 2","completed","13:30"),
      buildStep("IQC QA Pass", "completed", "15:30"),
    ],
    activityLog: [
      buildLog("Sep 19, 15:30", "IQC QA Pass",   "Completed", "Passed"),
      buildLog("Sep 19, 13:30", "Staff Return 2","Completed", "Done"),
      buildLog("Sep 19, 12:30", "Exim",           "Completed", "Done"),
      buildLog("Sep 19, 11:00", "Staff Return",   "Completed", "Done"),
      buildLog("Sep 19, 09:45", "PMC Open WO",    "Completed", "WO submitted"),
      buildLog("Sep 19, 09:00", "IQC",            "Completed", "8/8 units"),
      buildLog("Sep 19, 08:10", "PMC Entry",      "Completed", "MO entry"),
    ],
  },

  // ── MO 17 ─ Completed ─────────────────────────────────────────────────
  {
    moCode: demoMoNumber(16),
    model: DEMO.model,
    currentStep: "IQC QA Pass",
    completedSteps: 7,
    status: "Completed",
    lastUpdated: "Sep 19, 14:00",
    lastUpdatedDate: daysBefore(3),
    rejectionCount: 0,
    timeline: [
      buildStep("PMC Entry",   "completed", "07:45"),
      buildStep("IQC",         "completed", "08:30"),
      buildStep("PMC Open WO", "completed", "09:15"),
      buildStep("Staff Return","completed", "10:45"),
      buildStep("Exim",        "completed", "12:00"),
      buildStep("Staff Return 2","completed","13:00"),
      buildStep("IQC QA Pass", "completed", "14:00"),
    ],
    activityLog: [
      buildLog("Sep 19, 14:00", "IQC QA Pass",   "Completed", "Passed"),
      buildLog("Sep 19, 13:00", "Staff Return 2","Completed", "Done"),
      buildLog("Sep 19, 12:00", "Exim",           "Completed", "Done"),
      buildLog("Sep 19, 10:45", "Staff Return",   "Completed", "Done"),
      buildLog("Sep 19, 09:15", "PMC Open WO",    "Completed", "WO submitted"),
      buildLog("Sep 19, 08:30", "IQC",            "Completed", "7/7 units"),
      buildLog("Sep 19, 07:45", "PMC Entry",      "Completed", "MO entry"),
    ],
  },

  // ── MO 18 ─ Completed ─────────────────────────────────────────────────
  {
    moCode: demoMoNumber(17),
    model: DEMO.model,
    currentStep: "IQC QA Pass",
    completedSteps: 7,
    status: "Completed",
    lastUpdated: "Sep 18, 16:00",
    lastUpdatedDate: daysBefore(4),
    rejectionCount: 0,
    timeline: [
      buildStep("PMC Entry",   "completed", "08:00"),
      buildStep("IQC",         "completed", "08:45"),
      buildStep("PMC Open WO", "completed", "09:30"),
      buildStep("Staff Return","completed", "11:00"),
      buildStep("Exim",        "completed", "12:30"),
      buildStep("Staff Return 2","completed","14:00"),
      buildStep("IQC QA Pass", "completed", "16:00"),
    ],
    activityLog: [
      buildLog("Sep 18, 16:00", "IQC QA Pass",   "Completed", "Passed"),
      buildLog("Sep 18, 14:00", "Staff Return 2","Completed", "Done"),
      buildLog("Sep 18, 12:30", "Exim",           "Completed", "Done"),
      buildLog("Sep 18, 11:00", "Staff Return",   "Completed", "Done"),
      buildLog("Sep 18, 09:30", "PMC Open WO",    "Completed", "WO submitted"),
      buildLog("Sep 18, 08:45", "IQC",            "Completed", "11/11 units"),
      buildLog("Sep 18, 08:00", "PMC Entry",      "Completed", "MO entry"),
    ],
  },

  // ── MO 19 ─ Completed ─────────────────────────────────────────────────
  {
    moCode: demoMoNumber(18),
    model: DEMO.model,
    currentStep: "IQC QA Pass",
    completedSteps: 7,
    status: "Completed",
    lastUpdated: "Sep 18, 15:00",
    lastUpdatedDate: daysBefore(4),
    rejectionCount: 0,
    timeline: [
      buildStep("PMC Entry",   "completed", "07:30"),
      buildStep("IQC",         "completed", "08:15"),
      buildStep("PMC Open WO", "completed", "09:00"),
      buildStep("Staff Return","completed", "10:30"),
      buildStep("Exim",        "completed", "12:00"),
      buildStep("Staff Return 2","completed","13:30"),
      buildStep("IQC QA Pass", "completed", "15:00"),
    ],
    activityLog: [
      buildLog("Sep 18, 15:00", "IQC QA Pass",   "Completed", "Passed"),
      buildLog("Sep 18, 13:30", "Staff Return 2","Completed", "Done"),
      buildLog("Sep 18, 12:00", "Exim",           "Completed", "Done"),
      buildLog("Sep 18, 10:30", "Staff Return",   "Completed", "Done"),
      buildLog("Sep 18, 09:00", "PMC Open WO",    "Completed", "WO submitted"),
      buildLog("Sep 18, 08:15", "IQC",            "Completed", "6/6 units"),
      buildLog("Sep 18, 07:30", "PMC Entry",      "Completed", "MO entry"),
    ],
  },

  // ── MO 20 ─ Completed ─────────────────────────────────────────────────
  {
    moCode: demoMoNumber(19),
    model: DEMO.model,
    currentStep: "IQC QA Pass",
    completedSteps: 7,
    status: "Completed",
    lastUpdated: "Sep 17, 16:30",
    lastUpdatedDate: daysBefore(5),
    rejectionCount: 0,
    timeline: [
      buildStep("PMC Entry",   "completed", "08:00"),
      buildStep("IQC",         "completed", "09:00"),
      buildStep("PMC Open WO", "completed", "10:00"),
      buildStep("Staff Return","completed", "11:30"),
      buildStep("Exim",        "completed", "13:00"),
      buildStep("Staff Return 2","completed","14:30"),
      buildStep("IQC QA Pass", "completed", "16:30"),
    ],
    activityLog: [
      buildLog("Sep 17, 16:30", "IQC QA Pass",   "Completed", "Passed"),
      buildLog("Sep 17, 14:30", "Staff Return 2","Completed", "Done"),
      buildLog("Sep 17, 13:00", "Exim",           "Completed", "Done"),
      buildLog("Sep 17, 11:30", "Staff Return",   "Completed", "Done"),
      buildLog("Sep 17, 10:00", "PMC Open WO",    "Completed", "WO submitted"),
      buildLog("Sep 17, 09:00", "IQC",            "Completed", "13/13 units"),
      buildLog("Sep 17, 08:00", "PMC Entry",      "Completed", "MO entry"),
    ],
  },

  // ── MO 21 ─ Completed ─────────────────────────────────────────────────
  {
    moCode: demoMoNumber(20),
    model: DEMO.model,
    currentStep: "IQC QA Pass",
    completedSteps: 7,
    status: "Completed",
    lastUpdated: "Sep 17, 14:00",
    lastUpdatedDate: daysBefore(5),
    rejectionCount: 0,
    timeline: [
      buildStep("PMC Entry",   "completed", "07:00"),
      buildStep("IQC",         "completed", "08:00"),
      buildStep("PMC Open WO", "completed", "09:00"),
      buildStep("Staff Return","completed", "10:30"),
      buildStep("Exim",        "completed", "12:00"),
      buildStep("Staff Return 2","completed","13:00"),
      buildStep("IQC QA Pass", "completed", "14:00"),
    ],
    activityLog: [
      buildLog("Sep 17, 14:00", "IQC QA Pass",   "Completed", "Passed"),
      buildLog("Sep 17, 13:00", "Staff Return 2","Completed", "Done"),
      buildLog("Sep 17, 12:00", "Exim",           "Completed", "Done"),
      buildLog("Sep 17, 10:30", "Staff Return",   "Completed", "Done"),
      buildLog("Sep 17, 09:00", "PMC Open WO",    "Completed", "WO submitted"),
      buildLog("Sep 17, 08:00", "IQC",            "Completed", "10/10 units"),
      buildLog("Sep 17, 07:00", "PMC Entry",      "Completed", "MO entry"),
    ],
  },

  // ── MO 22 ─ Completed ─────────────────────────────────────────────────
  {
    moCode: demoMoNumber(21),
    model: DEMO.model,
    currentStep: "IQC QA Pass",
    completedSteps: 7,
    status: "Completed",
    lastUpdated: "Sep 16, 15:45",
    lastUpdatedDate: daysBefore(6),
    rejectionCount: 1,
    timeline: [
      buildStep("PMC Entry",   "completed", "07:00"),
      buildStep("IQC",         "completed", "08:00"),
      buildStep("PMC Open WO", "completed", "09:00"),
      buildStep("Staff Return","reopened",  "12:00"),
      buildStep("Exim",        "completed", "13:00"),
      buildStep("Staff Return 2","completed","14:30"),
      buildStep("IQC QA Pass", "completed", "15:45"),
    ],
    activityLog: [
      buildLog("Sep 16, 15:45", "IQC QA Pass",   "Completed", "Passed"),
      buildLog("Sep 16, 14:30", "Staff Return 2","Completed", "Done"),
      buildLog("Sep 16, 13:00", "Exim",           "Completed", "Approved"),
      buildLog("Sep 16, 12:00", "Staff Return",   "Completed", "Corrected and resubmitted"),
      buildLog("Sep 16, 11:00", "Staff Return",   "Rejected",  "Quantity mismatch"),
      buildLog("Sep 16, 09:00", "PMC Open WO",    "Completed", "WO submitted"),
      buildLog("Sep 16, 08:00", "IQC",            "Completed", "8/8 units"),
      buildLog("Sep 16, 07:00", "PMC Entry",      "Completed", "MO entry"),
    ],
  },

  // ── MO 23 ─ Completed ─────────────────────────────────────────────────
  {
    moCode: demoMoNumber(22),
    model: DEMO.model,
    currentStep: "IQC QA Pass",
    completedSteps: 7,
    status: "Completed",
    lastUpdated: "Sep 16, 14:30",
    lastUpdatedDate: daysBefore(6),
    rejectionCount: 0,
    timeline: [
      buildStep("PMC Entry",   "completed", "07:30"),
      buildStep("IQC",         "completed", "08:30"),
      buildStep("PMC Open WO", "completed", "09:30"),
      buildStep("Staff Return","completed", "11:00"),
      buildStep("Exim",        "completed", "12:00"),
      buildStep("Staff Return 2","completed","13:30"),
      buildStep("IQC QA Pass", "completed", "14:30"),
    ],
    activityLog: [
      buildLog("Sep 16, 14:30", "IQC QA Pass",   "Completed", "Passed"),
      buildLog("Sep 16, 13:30", "Staff Return 2","Completed", "Done"),
      buildLog("Sep 16, 12:00", "Exim",           "Completed", "Done"),
      buildLog("Sep 16, 11:00", "Staff Return",   "Completed", "Done"),
      buildLog("Sep 16, 09:30", "PMC Open WO",    "Completed", "WO submitted"),
      buildLog("Sep 16, 08:30", "IQC",            "Completed", "9/9 units"),
      buildLog("Sep 16, 07:30", "PMC Entry",      "Completed", "MO entry"),
    ],
  },

  // ── MO 24 ─ In Progress, deep ──────────────────────────────────────────
  {
    moCode: demoMoNumber(23),
    model: DEMO.model,
    currentStep: "Staff Return 2",
    completedSteps: 5,
    status: "In Progress",
    lastUpdated: "Sep 15, 14:00",
    lastUpdatedDate: daysBefore(7),
    rejectionCount: 0,
    timeline: [
      buildStep("PMC Entry",   "completed",   "08:00"),
      buildStep("IQC",         "completed",   "09:00"),
      buildStep("PMC Open WO", "completed",   "10:00"),
      buildStep("Staff Return","completed",   "11:30"),
      buildStep("Exim",        "completed",   "12:30"),
      buildStep("Staff Return 2","in_progress",null),
      buildStep("IQC QA Pass", "not_started", null),
    ],
    activityLog: [
      buildLog("Sep 15, 13:00", "Staff Return 2","Started",   "Sticker scan started"),
      buildLog("Sep 15, 12:30", "Exim",           "Completed", "Approved"),
      buildLog("Sep 15, 11:30", "Staff Return",   "Completed", "Done"),
      buildLog("Sep 15, 10:00", "PMC Open WO",    "Completed", "WO submitted"),
      buildLog("Sep 15, 09:00", "IQC",            "Completed", "14/14 units"),
      buildLog("Sep 15, 08:00", "PMC Entry",      "Completed", "MO entry"),
    ],
  },

  // ── MO 25 ─ Pending, early stage ──────────────────────────────────────
  {
    moCode: demoMoNumber(24),
    model: DEMO.model,
    currentStep: "PMC Entry",
    completedSteps: 0,
    status: "Pending",
    lastUpdated: "Sep 15, 09:00",
    lastUpdatedDate: daysBefore(7),
    rejectionCount: 0,
    timeline: [
      buildStep("PMC Entry",   "in_progress", null),
      buildStep("IQC",         "not_started", null),
      buildStep("PMC Open WO", "not_started", null),
      buildStep("Staff Return","not_started", null),
      buildStep("Exim",        "not_started", null),
      buildStep("Staff Return 2","not_started",null),
      buildStep("IQC QA Pass", "not_started", null),
    ],
    activityLog: [
      buildLog("Sep 15, 09:00", "PMC Entry", "Started", "MO created"),
    ],
  },
];

// ---------------------------------------------------------------------------
// Public helper API (all async-shaped so a backend can replace them)
// ---------------------------------------------------------------------------

/** All MO records sorted by lastUpdated descending (newest first). */
let _mos: MoRecord[] = [...RAW_MOS];

/**
 * TODO(backend): replace with real API call
 * Returns all MO records, newest first.
 */
export async function getMoList(): Promise<MoRecord[]> {
  return [..._mos].sort(
    (a, b) => b.lastUpdatedDate.getTime() - a.lastUpdatedDate.getTime(),
  );
}

/**
 * TODO(backend): replace with real API call
 * Returns a single MO by code, or null if not found.
 */
export async function getMoDetail(moCode: string): Promise<MoRecord | null> {
  return _mos.find((m) => m.moCode === moCode) ?? null;
}

/**
 * TODO(backend): replace with real API call
 * Sets the MO status to Blocked and appends an Intervention log entry.
 * Mutates the local array (survives re-renders, resets on page refresh).
 */
export async function intervene(moCode: string, reason: string): Promise<void> {
  _mos = _mos.map((m) => {
    if (m.moCode !== moCode) return m;
    const now = "Sep 22, 09:11"; // frozen demo time; TODO(backend): use new Date()
    const entry: ActivityLogEntry = {
      time: now,
      processStep: m.currentStep,
      activityStatus: "Rejected",
      remarks: `Superadmin intervention: ${reason}`,
    };
    return {
      ...m,
      status: "Blocked" as MoStatus,
      activityLog: [entry, ...m.activityLog],
    };
  });
}

/** Unique model values for filter dropdown */
export function getModelOptions(): string[] {
  const set = new Set(RAW_MOS.map((m) => m.model));
  return Array.from(set).sort();
}

/** Unique status values for filter dropdown */
export function getStatusOptions(): MoStatus[] {
  return ["In Progress", "Pending", "Completed", "Blocked"];
}

/** Unique step values for filter dropdown */
export function getStepOptions(): StepName[] {
  return [...MO_STEPS];
}
