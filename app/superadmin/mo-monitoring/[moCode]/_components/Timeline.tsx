"use client";

import { CheckCircle, Circle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import type { MoRecord, StepName, TimelineStep } from "../../../_lib/types";
import { STEP_DISPLAY } from "../../../_lib/mo-data";

function StepIcon({ status }: { status: TimelineStep["status"] }) {
  if (status === "completed") {
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E3F1E9] dark:bg-backgroundbg-green">
        <CheckCircle className="h-5 w-5 text-[#08783F] dark:text-text-colortext-green" strokeWidth={2} />
      </span>
    );
  }
  if (status === "reopened") {
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E3F1E9] dark:bg-backgroundbg-green">
        <RefreshCw className="h-5 w-5 text-[#08783F] dark:text-text-colortext-green" strokeWidth={2} />
      </span>
    );
  }
  if (status === "in_progress") {
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-100 dark:bg-backgroundbg-yellow">
        <RefreshCw className="h-5 w-5 text-yellow-500 dark:text-text-colortext-yellow" strokeWidth={2} />
      </span>
    );
  }
  // not_started
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-gray-200 bg-white dark:border-strokestroke-gray dark:bg-backgroundbg-white">
      <Circle className="h-4 w-4 text-gray-300 dark:text-icon-muted" strokeWidth={1.5} />
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

type Props = {
  mo: MoRecord;
  selectedStep: StepName | null;
  onSelect: (step: StepName) => void;
};

export default function Timeline({ mo, selectedStep, onSelect }: Props) {
  const { t } = useI18n();

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-strokestroke-gray dark:bg-backgroundbg-white">
      <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-text-colortext-black">
        {t("moMonitoring.detail.returnProcessTimeline")}
      </h3>

      <ol className="relative flex flex-col gap-0">
        {mo.timeline.map((step, i) => {
          const isLast = i === mo.timeline.length - 1;
          const isDim = step.status === "not_started";
          const isSelected = selectedStep === step.step;

          return (
            <li key={i} className="flex gap-3">
              {/* connector */}
              <div className="flex flex-col items-center">
                <StepIcon status={step.status} />
                {!isLast && (
                  <div className={cn("w-0.5 flex-1 my-1", isDim ? "bg-gray-200 dark:bg-backgroundbg-black" : "bg-green-200 dark:bg-strokestroke-green")} style={{ minHeight: 24 }} />
                )}
              </div>

              {/* card */}
              <button
                type="button"
                disabled={isDim}
                aria-pressed={isSelected}
                onClick={() => onSelect(step.step)}
                className={cn(
                  "mb-2 flex flex-1 items-center justify-between rounded-lg px-3 py-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#08783F]",
                  !isDim && "cursor-pointer hover:border-[#08783F]/40 dark:hover:border-strokestroke-green",
                  isSelected && "ring-2 ring-[#08783F]",
                  step.status === "in_progress"
                    ? "bg-yellow-50 border border-yellow-200 dark:bg-backgroundbg-yellow dark:border-strokestroke-yellow"
                    : isDim
                      ? "bg-gray-50 border border-gray-100 dark:bg-backgroundbg-bluish-gray dark:border-strokestroke-gray"
                      : "bg-white border border-gray-100 dark:bg-backgroundbg-white dark:border-strokestroke-gray",
                )}
              >
                <div>
                  <p className={cn("text-sm font-medium", isDim ? "text-gray-400 dark:text-text-colortext-gray" : "text-gray-800 dark:text-text-colortext-dark")}>
                    {STEP_DISPLAY[step.step]}
                  </p>
                  <p
                    className={cn(
                      "text-xs",
                      step.status === "completed" || step.status === "reopened"
                        ? "text-[#08783F] dark:text-text-colortext-green"
                        : step.status === "in_progress"
                          ? "text-yellow-600 dark:text-text-colortext-yellow"
                          : "text-gray-400 dark:text-text-colortext-gray",
                    )}
                  >
                    {stepStatusLabel(step.status, t)}
                  </p>
                </div>
                {step.time && (
                  <span className="ml-3 shrink-0 text-xs text-gray-400 dark:text-text-colortext-gray">{step.time}</span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
