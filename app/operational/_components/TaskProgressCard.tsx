"use client";

import { useMemo } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";

/* =========================================================
   TYPES + DATA
========================================================= */

export type Task = {
  id: string;
  batch: string; // e.g. BATCH202609
  type: string; // Return Idle / Receive Material / Verify Material
  model: string; // e.g. Latte M
  done: number; // MOs that finished the whole flow
  total: number; // MOs planned for this task
  createdFromMo: string; // the MO whose entry auto-created this task
  createdAt: string;
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
    model: "Latte M",
    done: 12,
    total: 12,
    createdFromMo: "T2026090410261301041",
    createdAt: "Sep 02, 09:05",
    updatedAt: "Sep 20, 14:32",
  },
  {
    id: "t-2",
    batch: "BATCH202609",
    type: "Receive Material",
    model: "Latte M",
    done: 7,
    total: 12,
    createdFromMo: "T2026090410261301048",
    createdAt: "Sep 04, 10:26",
    updatedAt: "Sep 22, 08:15",
  },
  {
    id: "t-3",
    batch: "BATCH202609",
    type: "Verify Material",
    model: "Latte M",
    done: 2,
    total: 12,
    createdFromMo: "T2026090410261301049",
    createdAt: "Sep 10, 13:40",
    updatedAt: "Sep 21, 16:48",
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

  // Ongoing tasks first, completed ones last
  const sorted = useMemo(
    () => [...tasks].sort((a, b) => Number(isComplete(a)) - Number(isComplete(b))),
    [tasks],
  );

  const completed = tasks.filter(isComplete).length;
  const ongoing = tasks.length - completed;
  const taskPercent = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;
  const moDone = tasks.reduce((sum, t) => sum + t.done, 0);
  const moTotal = tasks.reduce((sum, t) => sum + t.total, 0);

  return (
    <Card className="min-w-0 flex-1 overflow-hidden rounded-lg border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between gap-4 border-b px-4 py-3">
        <CardTitle className="text-sm font-semibold">{t("dashboard.taskProgress.title")}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 px-4 py-3">
        {tasks.length === 0 ? (
          <div className="rounded-md border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500">
            {t("dashboard.taskProgress.noTasks")}
          </div>
        ) : (
          <>
            <section className="space-y-2">
              <div className="flex items-end gap-1">
                <strong className="text-2xl leading-6">
                  {completed}/{tasks.length}
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

              <ul className="max-h-44 divide-y divide-slate-200 overflow-y-auto">
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