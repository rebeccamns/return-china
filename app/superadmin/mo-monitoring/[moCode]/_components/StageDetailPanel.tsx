"use client";

import { PauseCircle } from "lucide-react";

import StageDataContent from "@/components/history/StageDataContent";
import { useI18n } from "@/i18n";
import type { StageDetail } from "@/lib/mo-detail/types";
import StatusBadge from "../../_components/StatusBadge";
import type { MoRecord, StepName } from "../../../_lib/types";
import { STEP_DISPLAY } from "../../../_lib/mo-data";

type Props = {
  mo: MoRecord;
  step: StepName;
  stage: StageDetail | null;
  canIntervene: boolean;
  onIntervene: () => void;
};

export default function StageDetailPanel({
  mo,
  step,
  stage,
  canIntervene,
  onIntervene,
}: Props) {
  const { t } = useI18n();
  const timelineEntry = mo.timeline.find((entry) => entry.step === step);
  const employee = [stage?.employeeName, stage?.employeeId]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-strokestroke-gray dark:bg-backgroundbg-white">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-text-colortext-gray">
        {t("history.detail.details")}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-base font-semibold text-gray-900 dark:text-text-colortext-black">
            {STEP_DISPLAY[step]}
          </h3>
          <StatusBadge status="Completed" />
        </div>

        {canIntervene && mo.status !== "Blocked" && (
          <button
            type="button"
            onClick={onIntervene}
            className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <PauseCircle className="h-4 w-4" strokeWidth={2} />
            {t("moMonitoring.interveneMo")}
          </button>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-text-colortext-gray">
        {(stage?.timestamp ?? timelineEntry?.time) && (
          <span>
            <span className="font-medium">{t("history.detail.timestamp")}:</span>{" "}
            {stage?.timestamp ?? timelineEntry?.time}
          </span>
        )}
        {employee && (
          <span>
            <span className="font-medium">{t("history.detail.employee")}:</span>{" "}
            {employee}
          </span>
        )}
      </div>

      <div className="mt-4">
        {stage ? (
          <StageDataContent stage={stage} />
        ) : (
          <p className="rounded-md bg-slate-50 p-3 text-xs text-gray-500 dark:bg-backgroundbg-bluish-gray dark:text-text-colortext-gray">
            {t("history.detail.noData")}
          </p>
        )}
      </div>
    </div>
  );
}
