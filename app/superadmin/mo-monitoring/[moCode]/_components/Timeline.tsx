"use client";

import { CheckCircle, Circle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import type { MoRecord, TimelineStep } from "../../../_lib/types";
import { STEP_DISPLAY } from "../../../_lib/mo-data";

function StepIcon({ status }: { status: TimelineStep["status"] }) {
  if (status === "completed") {
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
        <CheckCircle className="h-5 w-5 text-green-600" strokeWidth={2} />
      </span>
    );
  }
  if (status === "reopened") {
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
        <RefreshCw className="h-5 w-5 text-green-500" strokeWidth={2} />
      </span>
    );
  }
  if (status === "in_progress") {
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-100">
        <RefreshCw className="h-5 w-5 text-yellow-500" strokeWidth={2} />
      </span>
    );
  }
  // not_started
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-gray-200 bg-white">
      <Circle className="h-4 w-4 text-gray-300" strokeWidth={1.5} />
    </span>
  );
}

function stepStatusLabel(status: TimelineStep["status"], t: (key: Parameters<ReturnType<typeof useI18n>["t"]>[0]) => string): string {
  switch (status) {
    case "completed":   return t("moMonitoring.detail.stepCompleted");
    case "reopened":    return t("moMonitoring.detail.stepReopened");
    case "in_progress": return t("moMonitoring.detail.stepInProgress");
    default:            return t("moMonitoring.detail.stepNotStarted");
  }
}

type Props = { mo: MoRecord };

export default function Timeline({ mo }: Props) {
  const { t } = useI18n();

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">
        {t("moMonitoring.detail.returnProcessTimeline")}
      </h3>

      <ol className="relative flex flex-col gap-0">
        {mo.timeline.map((step, i) => {
          const isLast = i === mo.timeline.length - 1;
          const isDim = step.status === "not_started";

          return (
            <li key={i} className="flex gap-3">
              {/* connector */}
              <div className="flex flex-col items-center">
                <StepIcon status={step.status} />
                {!isLast && (
                  <div className={cn("w-0.5 flex-1 my-1", isDim ? "bg-gray-200" : "bg-green-200")} style={{ minHeight: 24 }} />
                )}
              </div>

              {/* card */}
              <div
                className={cn(
                  "mb-2 flex flex-1 items-center justify-between rounded-lg px-3 py-2",
                  step.status === "in_progress"
                    ? "bg-yellow-50 border border-yellow-200"
                    : isDim
                      ? "bg-gray-50 border border-gray-100"
                      : "bg-white border border-gray-100",
                )}
              >
                <div>
                  <p className={cn("text-sm font-medium", isDim ? "text-gray-400" : "text-gray-800")}>
                    {STEP_DISPLAY[step.step]}
                  </p>
                  <p
                    className={cn(
                      "text-xs",
                      step.status === "completed" || step.status === "reopened"
                        ? "text-green-600"
                        : step.status === "in_progress"
                          ? "text-yellow-600"
                          : "text-gray-400",
                    )}
                  >
                    {stepStatusLabel(step.status, t)}
                  </p>
                </div>
                {step.time && (
                  <span className="ml-3 shrink-0 text-xs text-gray-400">{step.time}</span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

