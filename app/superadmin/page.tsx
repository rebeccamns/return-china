"use client";

import { useMemo, useState } from "react";

import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";

import DashboardHeader from "./_components/DashboardHeader";
import KpiCards from "./_components/KpiCards";
import RejectionRateChart from "./_components/RejectionRateChart";
import SltPerformanceCard from "./_components/SltPerformanceCard";
import {
  COMPARE_LABEL,
  DEFAULT_PERIOD,
  PERIOD_OPTIONS,
  getDashboardData,
} from "./_lib/data";
import { exportDashboardCsv } from "./_lib/export";
import type { Mode } from "./_lib/types";

export default function SuperadminDashboardPage() {
  const [mode, setMode] = useState<Mode>("year");
  const [period, setPeriod] = useState(DEFAULT_PERIOD.year);

  // TODO: replace with a fetch keyed on [mode, period]
  const data = useMemo(() => getDashboardData(mode, period), [mode, period]);

  const periodLabel =
    PERIOD_OPTIONS[mode].find((option) => option.value === period)?.label ?? period;

  function handleModeChange(next: Mode) {
    setMode(next);
    setPeriod(DEFAULT_PERIOD[next]); // each toggle resets the select to its default
  }

  function handleExport() {
    exportDashboardCsv(data, { mode, periodLabel, compareLabel: COMPARE_LABEL[mode] });
  }

  return (
    <main className="min-h-screen w-full bg-backgroundbg-gray">
      <Sidebar variant="superadmin" />

      <div className="flex min-h-screen flex-col pl-[255px]">
        <TopBar />

        <div className="mt-[52px] w-full px-[18px] py-5">
          <nav className="mb-5 flex items-center gap-2 text-xs">
            <span className="text-text-colortext-gray">Dashboard</span>
            <span className="text-[#B5B5B3]">›</span>
            <span className="font-medium text-text-colortext-dark">Dashboard</span>
          </nav>

          <DashboardHeader
            mode={mode}
            period={period}
            onModeChange={handleModeChange}
            onPeriodChange={setPeriod}
            onExport={handleExport}
          />

          <div className="mt-5 flex flex-col gap-5">
            <KpiCards kpis={data.kpis} compareLabel={COMPARE_LABEL[mode]} />
            <RejectionRateChart points={data.trend} />
            <SltPerformanceCard rows={data.flows} />
          </div>
        </div>
      </div>
    </main>
  );
}