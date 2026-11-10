"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Download, RotateCcw } from "lucide-react";
import Link from "next/link";

import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import { useI18n } from "@/i18n";
import { DEMO } from "@/lib/demo-data";

import StatusBadge from "../_components/StatusBadge";
import Timeline from "./_components/Timeline";
import CurrentStageCard from "./_components/CurrentStageCard";
import ActivityLog from "./_components/ActivityLog";
import InterveneModal, { type IntervenePayload } from "./_components/InterveneModal";

import { getMoDetail, intervene, currentRole } from "../../_lib/mo-data";
import { getMoDetail as getStageData } from "@/lib/mo-detail/data";
import type { StageKey } from "@/lib/mo-detail/types";
import StageDetailPanel from "./_components/StageDetailPanel";
import { exportMoCsv } from "../../_lib/export";
import type { MoRecord, StepName } from "../../_lib/types";
import { MO_STEPS } from "../../_lib/mo-data";

export default function MoDetailPage() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams();
  const moCode = typeof params.moCode === "string" ? params.moCode : "";
  const flowParam = useSearchParams().get("flow");
  const initialFlow = MO_STEPS.find((step) => step === flowParam) ?? null;
  const [selectedStep, setSelectedStep] = useState<StepName | null>(initialFlow);

  const [mo, setMo] = useState<MoRecord | null | undefined>(undefined); // undefined = loading
  const [interveneOpen, setInterveneOpen] = useState(false);

  // TODO(backend): replace with real API call
  useEffect(() => {
    getMoDetail(moCode).then(setMo);
  }, [moCode]);

  const STAGE_KEY_BY_STEP: Record<StepName, StageKey> = {
    "PMC Entry": "pmcEntry",
    IQC: "iqcScan",
    "PMC Open WO": "pmcOpenWo",
    "Staff Return": "staffReturn",
    Exim: "exim",
    "Staff Return 2": "staffReturnSticker",
    "IQC QA Pass": "iqcQaPass",
  };

  // Only flows that are finished (completed/reopened) show their submitted data.
  const selectedEntry = mo?.timeline.find((entry) => entry.step === selectedStep);
  const showStageDetail =
    !!selectedStep &&
    (selectedEntry?.status === "completed" || selectedEntry?.status === "reopened");

  // TODO(backend): load the real stage data for this MO; falls back to the demo MO data
  const stageData =
    getStageData(moCode) ?? getStageData(DEMO.moNumber);
  const selectedStage =
    showStageDetail && selectedStep
      ? (stageData?.stages.find((s) => s.stageKey === STAGE_KEY_BY_STEP[selectedStep]) ?? null)
      : null;

  function handleSelectStep(step: StepName) {
    const entry = mo?.timeline.find((e) => e.step === step);
    // The ongoing flow has no data yet, so it returns to the default overview
    setSelectedStep(entry?.status === "in_progress" ? null : step);
  }

  // Items come from the PMC Entry material list
  const interveneItems = (
    stageData?.stages.find((s) => s.stageKey === "pmcEntry")?.data as
      | { materials?: { code: string; englishName: string }[] }
      | undefined
  )?.materials?.map((m) => ({ code: m.code, name: m.englishName })) ?? [];

  // Reflow targets: every flow up to and including the current one
  const stageOptions = mo
    ? MO_STEPS.slice(0, MO_STEPS.indexOf(mo.currentStep) + 1)
    : [];

  async function handleIntervene({ stage, items, reason }: IntervenePayload) {
    // TODO(backend): persist the reflow target and revision items; only a log note is stored for now
    const itemNote = items.length ? ` | Items: ${items.join(", ")}` : "";
    await intervene(moCode, `Reflow to ${stage} - ${reason}${itemNote}`);
    // Refresh local state to reflect the blocked status + new log entry
    const updated = await getMoDetail(moCode);
    setMo(updated);
    setInterveneOpen(false);
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (mo === undefined) {
    return (
      <main className="min-h-screen w-full bg-backgroundbg-gray">
        <Sidebar variant="superadmin" />
        <div className="flex min-h-screen flex-col pl-[255px]">
          <TopBar />
          <div className="mt-[52px] flex items-center justify-center px-[18px] py-20">
            <p className="text-sm text-gray-400">{t("common.loading")}</p>
          </div>
        </div>
      </main>
    );
  }

  // ── Not found ─────────────────────────────────────────────────────────────
  if (mo === null) {
    return (
      <main className="min-h-screen w-full bg-backgroundbg-gray">
        <Sidebar variant="superadmin" />
        <div className="flex min-h-screen flex-col pl-[255px]">
          <TopBar />
          <div className="mt-[52px] flex flex-col items-center justify-center px-[18px] py-24 text-center">
            <p className="text-lg font-semibold text-gray-700">
              {t("moMonitoring.detail.notFound")}
            </p>
            <p className="mt-2 text-sm text-gray-400">
              {t("moMonitoring.detail.notFoundHint", { code: moCode })}
            </p>
            <button
              type="button"
              onClick={() => router.push("/superadmin/mo-monitoring")}
              className="mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-black/5"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("moMonitoring.backBtn")}
            </button>
          </div>
        </div>
      </main>
    );
  }

  const rejectionLabel =
    mo.rejectionCount === 1
      ? t("moMonitoring.detail.rejectionSingular", { count: String(mo.rejectionCount) })
      : t("moMonitoring.detail.rejectionPlural", { count: String(mo.rejectionCount) });

  return (
    <main className="min-h-screen w-full bg-backgroundbg-gray">
      <Sidebar variant="superadmin" />

      <div className="flex min-h-screen flex-col pl-[255px]">
        <TopBar />

        <div className="mt-[52px] w-full px-[18px] py-5">
          {/* Breadcrumb */}
          <nav className="mb-5 flex items-center gap-2 text-xs" aria-label="Breadcrumb">
            <Link
              href="/superadmin/mo-monitoring"
              className="text-text-colortext-gray hover:underline"
            >
              {t("moMonitoring.breadcrumb")}
            </Link>
            <span className="text-[#B5B5B3]">›</span>
            <span className="font-medium text-text-colortext-dark">
              {t("moMonitoring.detailBreadcrumb")}
            </span>
          </nav>

          {/* Page title */}
          <h1 className="text-lg font-semibold text-[#111111]">
            {t("moMonitoring.title")}
          </h1>

          {/* Back / Export row */}
          <div className="mt-4 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#08783F]"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
              {t("moMonitoring.backBtn")}
            </button>

            <button
              type="button"
              onClick={() => exportMoCsv([mo], `mo-${mo.moCode}.csv`)}
              className="inline-flex items-center gap-2 rounded-lg border border-[#08783F] bg-[#08783F] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:border-[#066B3B] hover:bg-[#066B3B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#08783F]"
            >
              <Download className="h-4 w-4" strokeWidth={1.75} />
              {t("moMonitoring.exportMoData")}
            </button>
          </div>

          {/* Main card */}
          <div className="mt-4 rounded-xl border border-gray-200 bg-white">
            {/* Card header */}
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 px-6 py-5">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-bold text-gray-900">
                    MO - {mo.moCode}
                  </h2>
                  <StatusBadge status={mo.status} />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  <span className="mr-4">
                    Model{" "}
                    <span className="font-medium text-gray-700">{mo.model}</span>
                  </span>
                  <span>
                    {t("moMonitoring.detail.lastUpdated")}{" "}
                    <span className="font-medium text-gray-700">{mo.lastUpdated}</span>
                  </span>
                </p>
              </div>

              {mo.rejectionCount > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <RotateCcw className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                  <span>{rejectionLabel}</span>
                </div>
              )}
            </div>

            {/* Two-column body */}
            <div className="flex flex-col gap-5 p-6 lg:flex-row">
              {/* LEFT: Timeline (~35%) */}
              <div className="w-full lg:w-[340px] lg:shrink-0">
                <Timeline mo={mo} selectedStep={selectedStep} onSelect={handleSelectStep} />
              </div>

              {/* RIGHT: Current Stage + Activity Log */}
              <div className="flex flex-1 flex-col gap-5 min-w-0">
                {showStageDetail && selectedStep ? (
                  <StageDetailPanel
                    mo={mo}
                    step={selectedStep}
                    stage={selectedStage}
                    canIntervene={currentRole === "superadmin"}
                    onIntervene={() => setInterveneOpen(true)}
                  />
                ) : (
                  <CurrentStageCard
                    mo={mo}
                    flow={selectedStep ?? undefined}
                    onIntervene={() => setInterveneOpen(true)}
                  />
                )}
                <ActivityLog log={mo.activityLog} flow={selectedStep ?? undefined} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Intervene Modal */}
      <InterveneModal
        open={interveneOpen}
        moCode={mo.moCode}
        currentStep={mo.currentStep}
        stageOptions={stageOptions}
        items={interveneItems}
        onClose={() => setInterveneOpen(false)}
        onConfirm={handleIntervene}
      />
    </main>
  );
}
