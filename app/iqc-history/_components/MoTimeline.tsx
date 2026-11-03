"use client";

import {
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  XCircle,
} from "lucide-react";

import BackTitle from "@/components/layout/BackTitle";
import MoCompactCard from "@/components/iqc/MoCompactCard";
import { useI18n, type TranslationKey } from "@/i18n";
import { canViewStageDetail } from "@/lib/mo-detail/access";
import {
  STAGE_KEYS,
  type MoDetail,
  type StageDetail,
  type StageKey,
  type StageStatus,
} from "@/lib/mo-detail/types";

import HistoryStatus from "./HistoryStatus";

const STAGE_LABELS: Record<StageKey, TranslationKey> = {
  pmcEntry: "history.detail.stages.pmcEntry",
  iqcScan: "history.detail.stages.iqcScan",
  pmcOpenWo: "history.detail.stages.pmcOpenWo",
  staffReturn: "history.detail.stages.staffReturn",
  exim: "history.detail.stages.exim",
  staffReturnSticker: "history.detail.stages.staffReturnSticker",
  iqcQaPass: "history.detail.stages.iqcQaPass",
};

function statusLabel(status: StageStatus, t: (key: TranslationKey) => string) {
  if (status === "completed") return t("status.completed");
  if (status === "rejected") return t("status.rejected");
  if (status === "in-progress") return t("status.inProgress");
  return t("status.notStarted");
}

function StatusIcon({ status }: { status: StageStatus }) {
  const Icon =
    status === "completed"
      ? CheckCircle2
      : status === "rejected"
        ? XCircle
        : status === "in-progress"
          ? Clock3
          : Circle;
  const color =
    status === "completed"
      ? "text-[#006B3C]"
      : status === "rejected"
        ? "text-red-600"
        : status === "in-progress"
          ? "text-amber-600"
          : "text-text-colortext-gray";

  return <Icon aria-hidden="true" className={`h-5 w-5 ${color}`} />;
}

export default function MoTimeline({
  mo,
  onSelectStage,
  onBack,
}: {
  mo: MoDetail;
  onSelectStage: (stage: StageDetail) => void;
  onBack: () => void;
}) {
  const { t } = useI18n();
  const completed = mo.stages.filter((stage) => stage.status === "completed").length;
  const overallStatusLabel =
    mo.overallStatus === "Completed"
      ? t("iqcHistory.completed")
      : mo.overallStatus === "Rejected"
        ? t("iqcHistory.rejected")
        : mo.overallStatus === "In Progress"
          ? t("iqcHistory.inProgress")
          : t("status.notStarted");

  return (
    <>
      <div className="mb-2">
        <BackTitle
          title={t("iqcHistory.backToHistory")}
          onBack={onBack}
          backLabel={t("common.back")}
        />
      </div>

      <MoCompactCard
        moNumber={mo.moCode}
        model={mo.model}
        returnId={mo.returnId}
        status={
          <HistoryStatus status={mo.overallStatus} label={overallStatusLabel} />
        }
        progress={{
          label: t("iqcHistory.stagesCompleted", {
            completed,
            total: mo.stages.length,
          }),
          percent:
            mo.stages.length > 0
              ? Math.round((completed / mo.stages.length) * 100)
              : 0,
        }}
      />

      <section aria-labelledby="iqc-history-timeline" className="mt-3">
        <div className="mb-2">
          <h2
            id="iqc-history-timeline"
            className="text-[16px] font-semibold leading-[22px] text-text-colortext-black"
          >
            {t("iqcHistory.processTimeline")}
          </h2>
          <p className="mt-0.5 text-[13px] leading-[18px] text-text-colortext-gray">
            {t("iqcHistory.timelineDescription")}
          </p>
        </div>

        <ul className="space-y-0">
          {STAGE_KEYS.map((stageKey, index) => {
            const stage = mo.stages.find((item) => item.stageKey === stageKey);
            if (!stage) return null;
            const available =
              canViewStageDetail("iqc", stage.stageKey) &&
              stage.status !== "pending" &&
              stage.data !== null;
            const meta =
              stage.status === "pending"
                ? t("iqcHistory.notStartedYet")
                : [stage.timestamp, stage.employeeName].filter(Boolean).join(" · ");

            return (
              <li key={stage.stageKey} className="flex gap-2.5">
                <span className="flex w-6 shrink-0 flex-col items-center">
                  <span className="flex h-6 w-6 items-center justify-center">
                    <StatusIcon status={stage.status} />
                  </span>
                  {index < STAGE_KEYS.length - 1 && (
                    <span className="my-0.5 min-h-4 w-px flex-1 bg-strokestroke-gray" />
                  )}
                </span>
                <StageRow
                  stage={stage}
                  available={available}
                  meta={meta}
                  onSelect={() => onSelectStage(stage)}
                  label={t(STAGE_LABELS[stage.stageKey])}
                  statusText={statusLabel(stage.status, t)}
                />
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}

function StageRow({
  stage,
  available,
  meta,
  onSelect,
  label,
  statusText,
}: {
  stage: StageDetail;
  available: boolean;
  meta: string;
  onSelect: () => void;
  label: string;
  statusText: string;
}) {
  const { t } = useI18n();
  const content = (
    <>
      <span className="flex min-w-0 items-center justify-between gap-2">
        <span className="truncate text-[14px] font-semibold leading-5 text-text-colortext-black">
          {label}
        </span>
        <HistoryStatus status={stage.status} label={statusText} />
      </span>
      <span className="mt-0.5 block truncate text-[12px] leading-4 text-text-colortext-gray">
        {meta}
      </span>
      {!available && stage.status !== "pending" && (
        <span className="sr-only">{t("iqcHistory.detailsNotAvailable")}</span>
      )}
    </>
  );

  return (
    <div className="min-w-0 flex-1 rounded-xl border border-strokestroke-gray bg-backgroundbg-white">
      {available ? (
        <button
          type="button"
          onClick={onSelect}
          className="flex min-h-[56px] w-full items-center gap-2 px-3 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryprimary-green"
        >
          <span className="min-w-0 flex-1">{content}</span>
          <ChevronRight
            aria-hidden="true"
            className="h-5 w-5 shrink-0 text-text-colortext-gray"
          />
        </button>
      ) : (
        <div className="min-h-[56px] px-3 py-2">{content}</div>
      )}
    </div>
  );
}
