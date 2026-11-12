"use client";

import { useMemo, useState } from "react";

import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import { useI18n } from "@/i18n";
import type { TranslationKey } from "@/i18n";

import DashboardHeader from "./_components/DashboardHeader";
import KpiCards from "./_components/KpiCards";
import RejectionRateChart from "./_components/RejectionRateChart";
import ShipmentFeedbackComboChart from "./_components/ShipmentFeedbackComboChart";
import SltPerformanceCard from "./_components/SltPerformanceCard";

import {
  DEFAULT_PERIOD,
  getDashboardData,
  getPeriodOptions,
  type PeriodOptionTexts,
} from "./_lib/data";

import { exportDashboardCsv } from "./_lib/export";
import type { Mode } from "./_lib/types";

const COMPARE_LABEL_KEYS: Record<Mode, TranslationKey> = {
  year: "superadmin.compare.year",
  month: "superadmin.compare.month",
  date: "superadmin.compare.date",
  day: "superadmin.compare.day",
};

export default function SuperadminDashboardPage() {
  const { t, dictionary } = useI18n();

  const [mode, setMode] = useState<Mode>("year");
  const [period, setPeriod] = useState(DEFAULT_PERIOD.year);
  const [model, setModel] = useState("all");

  const data = useMemo(
    () => getDashboardData(mode, period, model),
    [mode, period, model],
  );

  const periodTexts = useMemo<PeriodOptionTexts>(
    () => ({
      monthsShort: dictionary.dates.monthsShort,
      weekdaysShort: dictionary.dates.weekdaysShort,
      today: t("dates.today"),
      yesterday: t("dates.yesterday"),
      lastNDays: (days) => t("dates.lastNDays", { days }),
      formatShortDate: (day, monthIndex) =>
        `${day} ${dictionary.dates.monthsShort[monthIndex]}`,
    }),
    [dictionary, t],
  );

  const periodLabel =
    getPeriodOptions(mode, periodTexts).find(
      (option) => option.value === period,
    )?.label ?? period;

  const compareLabel = t(COMPARE_LABEL_KEYS[mode]);

  function handleModeChange(next: Mode) {
    setMode(next);
    setPeriod(DEFAULT_PERIOD[next]);
  }

  function handleExport() {
    exportDashboardCsv(data, {
      mode,
      periodLabel,
      compareLabel,
    });
  }

  // Preserve the chart logic / data mapping as requested
  const passRatePoints = useMemo(
    () =>
      data.trend.map((point) => ({
        ...point,
        rate: 100,
      })),
    [data.trend],
  );

  return (
    <main className="min-h-screen w-full bg-backgroundbg-gray">
      <Sidebar variant="superadmin" />

      <div className="flex min-h-screen flex-col pl-[255px]">
        <TopBar />

        {/* Proportional padding to fill screen gracefully without scrolling */}
        <div className="mt-[52px] w-full px-5 py-3.5 lg:px-6">
          {/* Breadcrumb */}
          <nav className="mb-2 flex items-center gap-1.5 text-xs leading-none">
            <span className="text-text-colortext-gray">
              {t("superadmin.dashboard")}
            </span>
            <span className="text-text-colortext-gray">›</span>
            <span className="font-medium text-text-colortext-dark">
              {t("superadmin.dashboard")}
            </span>
          </nav>

          {/* Unified Filter Header */}
          <DashboardHeader
            mode={mode}
            period={period}
            model={model}
            onModeChange={handleModeChange}
            onPeriodChange={setPeriod}
            onModelChange={setModel}
            onExport={handleExport}
          />

          {/* Main Visual Hierarchy: Proportional comfortable gaps */}
          <div className="mt-3.5 flex flex-col gap-3.5">
            {/* 1. Executive Summary KPIs */}
            <KpiCards
              kpis={data.kpis}
              compareLabel={compareLabel}
            />

            {/* 2. Analytical Trends (Side by side) */}
            <div className="grid grid-cols-1 items-stretch gap-3.5 xl:grid-cols-2">
              <RejectionRateChart
                points={passRatePoints}
                title="Pass Rate (%)"
                metric="pass"
              />

              <ShipmentFeedbackComboChart points={data.trend} />
            </div>

            {/* 3. Operational SLT Bottleneck Breakdown */}
            <SltPerformanceCard rows={data.flows} />
          </div>
        </div>
      </div>
    </main>
  );
}
