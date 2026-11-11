"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";

import { CalendarPickerModal } from "@/components/history/CalendarPickerModal";
import {
  ALL_CALENDAR_RANGE,
  isWithinHistoryDateRange,
  type CalendarRange,
} from "@/components/history/date-range";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import { DEMO, demoMoNumber } from "@/lib/demo-data";

/* =========================================================
   TYPES + DATA
========================================================= */

export type Task = {
  id: string;
  batch: string; // e.g. BATCH202609
  type: string; // Return Idle / Receive Material / Verify Material
  model: string;
  done: number; // MOs that finished the whole flow
  total: number; // MOs planned for this task
  createdFromMo: string; // the MO whose entry auto-created this task
  createdAt: string;
  createdDate: string; // ISO date used by the dashboard date filter
  updatedAt: string;
};

// TODO: replace with your API. A task is created automatically the first time
// PMC enters an MO for a batch + model (MO Entry > Create Task). Later MOs for
// the same batch + model attach to that existing task.
const sampleTasks: Task[] = [
  {
    id: "t-1",
    batch: "BATCH202609",
    type: "Return Idle",
    model: DEMO.model,
    done: 12,
    total: 12,
    createdFromMo: demoMoNumber(0),
    createdAt: "Sep 02, 09:05",
    createdDate: "2026-09-02",
    updatedAt: "Sep 20, 14:32",
  },
  {
    id: "t-2",
    batch: "BATCH202609",
    type: "Receive Material",
    model: DEMO.model,
    done: 7,
    total: 12,
    createdFromMo: demoMoNumber(1),
    createdAt: "Sep 04, 10:26",
    createdDate: "2026-09-04",
    updatedAt: "Sep 22, 08:15",
  },
  {
    id: "t-3",
    batch: "BATCH202609",
    type: "Verify Material",
    model: DEMO.model,
    done: 2,
    total: 12,
    createdFromMo: demoMoNumber(2),
    createdAt: "Sep 10, 13:40",
    createdDate: "2026-09-10",
    updatedAt: "Sep 21, 16:48",
  },
  {
    id: "t-4",
    batch: "BATCH202610",
    type: "Return Idle",
    model: DEMO.model,
    done: 5,
    total: 14,
    createdFromMo: demoMoNumber(3),
    createdAt: "Sep 12, 09:20",
    createdDate: "2026-09-12",
    updatedAt: "Sep 22, 09:10",
  },
  {
    id: "t-5",
    batch: "BATCH202610",
    type: "Receive Material",
    model: DEMO.model,
    done: 8,
    total: 14,
    createdFromMo: demoMoNumber(4),
    createdAt: "Sep 13, 11:15",
    createdDate: "2026-09-13",
    updatedAt: "Sep 22, 09:30",
  },
  {
    id: "t-6",
    batch: "BATCH202610",
    type: "Verify Material",
    model: DEMO.model,
    done: 0,
    total: 14,
    createdFromMo: demoMoNumber(5),
    createdAt: "Sep 14, 14:05",
    createdDate: "2026-09-14",
    updatedAt: "Sep 21, 15:10",
  },
  {
    id: "t-7",
    batch: "BATCH202611",
    type: "Return Idle",
    model: DEMO.model,
    done: 4,
    total: 10,
    createdFromMo: demoMoNumber(6),
    createdAt: "Sep 15, 08:40",
    createdDate: "2026-09-15",
    updatedAt: "Sep 22, 10:05",
  },
  {
    id: "t-8",
    batch: "BATCH202611",
    type: "Receive Material",
    model: DEMO.model,
    done: 3,
    total: 10,
    createdFromMo: demoMoNumber(7),
    createdAt: "Sep 16, 10:25",
    createdDate: "2026-09-16",
    updatedAt: "Sep 22, 10:25",
  },
  {
    id: "t-9",
    batch: "BATCH202611",
    type: "Verify Material",
    model: DEMO.model,
    done: 0,
    total: 10,
    createdFromMo: demoMoNumber(8),
    createdAt: "Sep 17, 13:50",
    createdDate: "2026-09-17",
    updatedAt: "Sep 21, 16:00",
  },
  {
    id: "t-10",
    batch: "BATCH202612",
    type: "Return Idle",
    model: DEMO.model,
    done: 1,
    total: 8,
    createdFromMo: demoMoNumber(9),
    createdAt: "Sep 18, 09:35",
    createdDate: "2026-09-18",
    updatedAt: "Sep 22, 11:00",
  },
  {
    id: "t-11",
    batch: "BATCH202612",
    type: "Receive Material",
    model: DEMO.model,
    done: 0,
    total: 8,
    createdFromMo: demoMoNumber(10),
    createdAt: "Sep 19, 12:10",
    createdDate: "2026-09-19",
    updatedAt: "Sep 22, 11:20",
  },
  {
    id: "t-12",
    batch: "BATCH202612",
    type: "Verify Material",
    model: DEMO.model,
    done: 0,
    total: 8,
    createdFromMo: demoMoNumber(11),
    createdAt: "Sep 20, 15:45",
    createdDate: "2026-09-20",
    updatedAt: "Sep 22, 11:45",
  },
];

/* =========================================================
   HELPERS
========================================================= */

type Status = "Completed" | "In progress" | "Not started";

const taskName = (t: Task) => `${t.batch} - ${t.type} ${t.model}`;

const percent = (t: Task) =>
  t.total > 0 ? Math.min(100, Math.round((t.done / t.total) * 100)) : 0;

const statusOf = (t: Task): Status =>
  t.total > 0 && t.done >= t.total
    ? "Completed"
    : t.done === 0
      ? "Not started"
      : "In progress";

const isComplete = (t: Task) => statusOf(t) === "Completed";

function Bar({ value, className }: { value: number; className?: string }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-slate-200",
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#0b5934] to-[#15a760] transition-[width] duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

/* =========================================================
   TASK PROGRESS CARD
========================================================= */

export default function TaskProgressCard({
  tasks = sampleTasks,
}: {
  tasks?: Task[];
}) {
  const { t } = useI18n();
  const [dateRange, setDateRange] = useState<CalendarRange>(ALL_CALENDAR_RANGE);

  const dateFilteredTasks = useMemo(
    () => tasks.filter((task) => isWithinHistoryDateRange(task.createdDate, dateRange)),
    [tasks, dateRange],
  );

  // Ongoing tasks first, completed ones last
  const sorted = useMemo(
    () =>
      [...dateFilteredTasks].sort(
        (a, b) => Number(isComplete(a)) - Number(isComplete(b)),
      ),
    [dateFilteredTasks],
  );

  const completed = dateFilteredTasks.filter(isComplete).length;
  const ongoing = dateFilteredTasks.length - completed;
  const taskPercent = dateFilteredTasks.length
    ? Math.round((completed / dateFilteredTasks.length) * 100)
    : 0;
  const moDone = dateFilteredTasks.reduce((sum, t) => sum + t.done, 0);
  const moTotal = dateFilteredTasks.reduce((sum, t) => sum + t.total, 0);

  return (
    <Card className="min-w-0 flex-1 overflow-hidden rounded-lg border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between gap-4 border-b px-4 py-3">
        <CardTitle className="text-sm font-semibold">{t("dashboard.taskProgress.title")}</CardTitle>
        <div className="flex items-center gap-1">
          <CalendarPickerModal
            value={dateRange}
            onChange={setDateRange}
            ariaLabel={t("iqcHistory.dateFilterLabel")}
            buttonClassName="h-8 text-xs"
          />
          {dateRange.type !== "all" && (
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 text-slate-500"
              type="button"
              onClick={() => setDateRange(ALL_CALENDAR_RANGE)}
              aria-label={t("dashboard.taskProgress.clearDateFilter")}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-4 py-3">
        {dateFilteredTasks.length === 0 ? (
          <div className="rounded-md border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500">
            {dateRange.type !== "all"
              ? t("dashboard.taskProgress.noTasksOnDate")
              : t("dashboard.taskProgress.noTasks")}
          </div>
        ) : (
          <>
            <section className="space-y-2">
              <div className="flex items-end gap-1">
                <strong className="text-2xl leading-6">
                  {completed}/{dateFilteredTasks.length}
                </strong>
                <span className="text-xs text-slate-500">{t("dashboard.taskProgress.taskComplete")}</span>
              </div>

              <div className="flex items-center gap-2">
                <Bar value={taskPercent} />
                <span className="w-8 shrink-0 text-right text-[10px] text-slate-600">
                  {taskPercent}%
                </span>
              </div>

              <p className="text-[11px] text-slate-500">
                {t("dashboard.taskProgress.moDoneSummary", { done: moDone, total: moTotal })}
              </p>
            </section>

            <div className="border-t border-slate-200" />

            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">{t("dashboard.taskProgress.taskList")}</h3>
                <span className="text-[10px] text-slate-500">
                  {t("dashboard.taskProgress.tasksOngoing", { count: ongoing })}
                </span>
              </div>

              <ul className="max-h-[6.25rem] divide-y divide-slate-200 overflow-y-auto overscroll-contain">
                  {sorted.map((task) => {
                    const complete = isComplete(task);
                    return (
                      <li
                        key={task.id}
                        className="flex items-center gap-3 py-2 text-xs"
                      >
                        <span
                          className={cn(
                            "min-w-0 flex-1 truncate",
                            complete && "text-slate-500",
                          )}
                        >
                          {taskName(task)}
                        </span>

                        <span className="flex shrink-0 items-center gap-2">
                          <Bar value={percent(task)} className="w-16" />
                          <span
                            className={cn(
                              "w-9 text-right",
                              complete
                                ? "font-medium text-[#0b5934]"
                                : "text-slate-600",
                            )}
                          >
                            {task.done}/{task.total}
                          </span>
                        </span>
                      </li>
                    );
                  })}
              </ul>
            </section>
          </>
        )}
      </CardContent>
    </Card>
  );
}