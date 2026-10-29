"use client";

import { Info, PauseCircle } from "lucide-react";
import { useI18n } from "@/i18n";
import StatusBadge from "../../_components/StatusBadge";
import type { MoRecord } from "../../../_lib/types";
import { STEP_DISPLAY, currentRole } from "../../../_lib/mo-data";

// TODO(backend): replace with real auth/role check
const FLOW_INDEX: Record<string, number> = {
  "PMC Entry": 1,
  IQC: 2,
  "PMC Open WO": 3,
  "Staff Return": 4,
  Exim: 5,
  "Staff Return 2": 6,
  "IQC QA Pass": 7,
};

type Props = {
  mo: MoRecord;
  onIntervene: () => void;
};

export default function CurrentStageCard({ mo, onIntervene }: Props) {
  const { t } = useI18n();
  const flowN = FLOW_INDEX[mo.currentStep] ?? 1;
  const stepName = STEP_DISPLAY[mo.currentStep];

  const canIntervene = currentRole === "superadmin";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      {/* Header */}
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
        {t("moMonitoring.detail.currentStageLabel")}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-base font-semibold text-gray-900">
          {t("moMonitoring.detail.flowLabel", { n: String(flowN), name: stepName })}
        </h3>
        <StatusBadge status={mo.status === "Completed" ? "Completed" : "In Progress"} />
      </div>

      <p className="mt-1 text-xs text-gray-400">
        {t("moMonitoring.detail.lastUpdated")} {mo.lastUpdated}
      </p>

      {/* Info banner */}
      <div className="mt-4 flex items-start gap-2 rounded-lg bg-gray-50 px-3 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" strokeWidth={1.75} />
        <p className="text-sm text-gray-600">
          {t("moMonitoring.detail.infoMessage", { step: stepName })}
        </p>
      </div>

      {/* Intervene button — guarded by role */}
      {canIntervene && mo.status !== "Blocked" && mo.status !== "Completed" && (
        <button
          type="button"
          onClick={onIntervene}
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <PauseCircle className="h-4 w-4" strokeWidth={2} />
          {t("moMonitoring.interveneMo")}
        </button>
      )}
    </div>
  );
}

