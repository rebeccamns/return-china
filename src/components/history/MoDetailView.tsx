"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock3,
  EyeOff,
  RotateCcw,
  XCircle,
} from "lucide-react";

import Sidebar, { type SidebarVariant } from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import { canViewStageDetail } from "@/lib/mo-detail/access";
import { getMoDetail } from "@/lib/mo-detail/data";
import { STAGE_KEYS, type MOStatus, type StageDetail, type StageKey } from "@/lib/mo-detail/types";
import MoExportButton from "./MoExportDialog";
import StageDataContent from "./StageDataContent";

const STAGE_LABEL_KEYS: Record<StageKey, `history.detail.stages.${StageKey}`> = {
  pmcEntry: "history.detail.stages.pmcEntry",
  iqcScan: "history.detail.stages.iqcScan",
  pmcOpenWo: "history.detail.stages.pmcOpenWo",
  staffReturn: "history.detail.stages.staffReturn",
  exim: "history.detail.stages.exim",
  staffReturnSticker: "history.detail.stages.staffReturnSticker",
  iqcQaPass: "history.detail.stages.iqcQaPass",
};

function OverallStatusBadge({ status }: { status: MOStatus }) {
  const { t } = useI18n();
  const Icon =
    status === "Completed"
      ? CheckCircle2
      : status === "Rejected"
        ? XCircle
        : status === "In Progress"
          ? RotateCcw
          : Circle;
  const label =
    status === "Completed"
      ? t("status.completed")
      : status === "Rejected"
        ? t("status.rejected")
        : status === "In Progress"
          ? t("status.inProgress")
          : t("status.notStarted");

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold",
        status === "Completed" && "bg-[#E6F4EA] text-[#0B5934]",
        status === "Rejected" && "bg-red-50 text-red-600",
        status === "In Progress" && "bg-amber-50 text-amber-700",
        status === "Pending" && "bg-slate-100 text-slate-600",
      )}
    >
      <Icon aria-hidden="true" className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

function StageStatusBadge({ status }: { status: StageDetail["status"] }) {
  const { t } = useI18n();
  const Icon =
    status === "completed"
      ? CheckCircle2
      : status === "rejected"
        ? XCircle
        : status === "in-progress"
          ? Clock3
          : Circle;
  const label =
    status === "completed"
      ? t("status.completed")
      : status === "rejected"
        ? t("status.rejected")
        : status === "in-progress"
          ? t("status.inProgress")
            : t("history.detail.pendingStatus");

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium",
        status === "completed" && "bg-[#E6F4EA] text-[#0B5934]",
        status === "rejected" && "bg-red-50 text-red-600",
        status === "in-progress" && "bg-amber-50 text-amber-700",
        status === "pending" && "bg-slate-100 text-slate-600",
      )}
    >
      <Icon aria-hidden="true" className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

function StageMeta({ stage }: { stage: StageDetail }) {
  const { t } = useI18n();

  if (stage.status === "pending") {
    return (
      <p className="mt-1 text-xs text-text-colortext-gray">
        {t("history.detail.notStartedYet")}
      </p>
    );
  }

  const employee = [stage.employeeName, stage.employeeId]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-colortext-gray">
      {stage.timestamp && (
        <span>
          <span className="font-medium">
            {t("history.detail.timestamp")}:
          </span>{" "}
          {stage.timestamp}
        </span>
      )}
      {employee && (
        <span>
          <span className="font-medium">
            {t("history.detail.employee")}:
          </span>{" "}
          {employee}
        </span>
      )}
      {stage.completionMessage && (
        <span className="text-black">
          {t(stage.completionMessage)}
        </span>
      )}
      {stage.rejectionReason && (
        <span className="w-full rounded-md border border-red-200 bg-red-50 p-2 text-red-700">
          <span className="font-semibold">
            {t("history.detail.rejectionReason")}:
          </span>{" "}
          {stage.rejectionReason}
        </span>
      )}
    </div>
  );
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-text-colortext-gray">{label}</dt>
      <dd
        title={value}
        className="truncate text-sm font-semibold text-black"
      >
        {value}
      </dd>
    </div>
  );
}

function StageDetails({
  stage,
  role,
}: {
  stage: StageDetail;
  role: string;
}) {
  const { t } = useI18n();
  const canView = canViewStageDetail(role, stage.stageKey);

  if (!canView) {
    return (
      <div className="mt-3 flex items-center gap-2 rounded-md bg-slate-50 p-3 text-xs text-text-colortext-gray">
        <EyeOff aria-hidden="true" className="h-4 w-4 shrink-0" />
        {t("history.detail.noAccess")}
      </div>
    );
  }

  if (stage.status === "pending" || stage.data === null) {
    return (
      <div
        aria-disabled="true"
        className="mt-3 rounded-md border border-dashed border-strokestroke-gray bg-slate-50 p-3"
      >
        <p className="text-xs font-medium text-text-colortext-gray">
          {t("history.detail.details")}
        </p>
        <p className="mt-1 text-xs text-text-colortext-gray">
          {stage.status === "pending"
            ? t("history.detail.notStartedYet")
            : t("history.detail.noData")}
        </p>
      </div>
    );
  }

  return (
    <AccordionItem
      value={stage.stageKey}
      className="mt-3 border-0"
    >
      <AccordionTrigger className="rounded-md border border-strokestroke-gray px-3 py-2 text-xs font-medium text-black hover:no-underline">
        {t("history.detail.details")}
      </AccordionTrigger>
      <AccordionContent className="pt-3">
        <StageDataContent stage={stage} />
      </AccordionContent>
    </AccordionItem>
  );
}

export default function MoDetailView({
  moId,
  role,
  historyHref,
}: {
  moId: string;
  role: string;
  historyHref: string;
}) {
  const { t } = useI18n();
  const mo = getMoDetail(moId);
  const [openStages, setOpenStages] = useState<string[]>(() => {
    const firstCompleted = mo?.stages.find(
      (stage) => stage.status === "completed" && stage.data !== null,
    );
    return firstCompleted ? [firstCompleted.stageKey] : [];
  });
  const stageMap = new Map(mo?.stages.map((stage) => [stage.stageKey, stage]));
  const stagesWithDetails =
    mo?.stages
      .filter(
        (stage) =>
          canViewStageDetail(role, stage.stageKey) &&
          stage.status !== "pending" &&
          stage.data !== null,
      )
      .map((stage) => stage.stageKey) ?? [];
  const entryHref = historyHref.replace(/\/history\/?$/, "");
  const sidebarVariant: SidebarVariant =
    role === "exim" || role === "superadmin" || role === "warehouse"
      ? role
      : "pmc";

  return (
    <main className="min-h-screen w-full bg-backgroundbg-gray">
      <Sidebar variant={sidebarVariant} />
      <div className="flex min-h-screen flex-col pl-[255px]">
        <TopBar />
        <div className="mt-[52px] w-full px-[18px] py-5">
          <nav
            aria-label={t("history.detail.breadcrumbLabel")}
            className="mb-4 flex items-center gap-2 text-xs"
          >
            <Link
              href={entryHref}
              className="text-text-colortext-gray hover:text-black"
            >
              {historyHref === "/exim/history"
                ? t("exim.title")
                : role === "superadmin"
                  ? t("superadmin.dashboard")
                  : role === "warehouse"
                    ? t("navigation.moList")
                    : t("navigation.entry")}
            </Link>
            <span aria-hidden="true" className="text-[#B5B5B3]">
              ›
            </span>
            <Link
              href={historyHref}
              className="text-text-colortext-gray hover:text-black"
            >
              {t("navigation.history")}
            </Link>
            <span aria-hidden="true" className="text-[#B5B5B3]">
              ›
            </span>
            <span aria-current="page" className="font-medium text-black">
              {t("history.detail.title")}
            </span>
          </nav>

          <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold text-black">
                {t("history.detail.title")}
              </h1>
              <p className="mt-1 text-xs text-text-colortext-gray">
                {t("history.detail.subtitle")}
              </p>
            </div>
            <div className="flex gap-2">
              {mo?.overallStatus === "Completed" && <MoExportButton mo={mo} />}
              <Button asChild variant="outline" className="gap-2">
                <Link href={historyHref}>
                  <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                  {t("history.detail.backToHistory")}
                </Link>
              </Button>
            </div>
          </header>

          {!mo ? (
            <section
              aria-labelledby="mo-detail-not-found"
              className="rounded-lg border border-strokestroke-gray bg-white p-5"
            >
              <h2
                id="mo-detail-not-found"
                className="text-sm font-semibold text-black"
              >
                {t("history.detail.notFound")}
              </h2>
              <p className="mt-1 text-xs text-text-colortext-gray">
                {t("history.detail.notFoundHint", { code: moId })}
              </p>
              <Button asChild variant="outline" className="mt-4">
                <Link href={historyHref}>
                  {t("history.detail.backToHistory")}
                </Link>
              </Button>
            </section>
          ) : (
            <div className="space-y-5">
              <section
                aria-labelledby="mo-summary-heading"
                className="rounded-lg border border-strokestroke-gray bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2
                      id="mo-summary-heading"
                      className="break-all text-xl font-semibold text-black"
                    >
                      {mo.moCode}
                    </h2>
                    <p className="mt-1 text-sm text-text-colortext-gray">
                      {mo.batchNumber} · {mo.productDescription}
                    </p>
                  </div>
                  <OverallStatusBadge status={mo.overallStatus} />
                </div>
                <dl className="mt-4 grid grid-cols-1 gap-4 border-t border-strokestroke-gray pt-4 sm:grid-cols-2 lg:grid-cols-4">
                  <SummaryField
                    label={t("common.model")}
                    value={mo.model}
                  />
                  <SummaryField
                    label={t("history.detail.projectNumber")}
                    value={mo.projectNumber}
                  />
                  <SummaryField
                    label={t("history.submittedBy")}
                    value={mo.submittedBy}
                  />
                  <SummaryField
                    label={t("history.dateSubmitted")}
                    value={mo.submittedAt}
                  />
                </dl>
              </section>

              <section aria-labelledby="process-timeline-heading">
                <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2
                      id="process-timeline-heading"
                      className="text-base font-semibold text-black"
                    >
                      {t("history.detail.processTimeline")}
                    </h2>
                    <p className="mt-1 text-xs text-text-colortext-gray">
                      {t("history.detail.timelineDescription")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpenStages(stagesWithDetails)}
                      disabled={stagesWithDetails.length === 0}
                    >
                      {t("history.detail.expandAll")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpenStages([])}
                      disabled={openStages.length === 0}
                    >
                      {t("history.detail.collapseAll")}
                    </Button>
                  </div>
                </div>
                <Accordion
                  type="multiple"
                  value={openStages}
                  onValueChange={setOpenStages}
                  className="space-y-0"
                >
                  {STAGE_KEYS.map((stageKey, index) => {
                    const stage = stageMap.get(stageKey);
                    if (!stage) return null;

                    return (
                      <article
                        key={stageKey}
                        className="flex gap-3"
                        aria-labelledby={`stage-${stageKey}-heading`}
                      >
                        <div
                          aria-hidden="true"
                          className="flex w-7 shrink-0 flex-col items-center"
                        >
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-backgroundbg-green text-xs font-semibold text-primaryprimary-green">
                            {index + 1}
                          </span>
                          {index < STAGE_KEYS.length - 1 && (
                            <span className="my-1 min-h-8 w-px flex-1 bg-strokestroke-gray" />
                          )}
                        </div>
                        <div className="mb-3 min-w-0 flex-1 rounded-md border border-strokestroke-gray bg-white p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3
                              id={`stage-${stageKey}-heading`}
                              className="text-sm font-semibold text-black"
                            >
                              {t(STAGE_LABEL_KEYS[stageKey])}
                            </h3>
                            <StageStatusBadge status={stage.status} />
                          </div>
                          <StageMeta stage={stage} />
                          <StageDetails stage={stage} role={role} />
                        </div>
                      </article>
                    );
                  })}
                </Accordion>
              </section>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
