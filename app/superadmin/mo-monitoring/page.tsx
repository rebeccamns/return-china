"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import { useI18n } from "@/i18n";

import MoKpiCards from "./_components/MoKpiCards";
import MoTable from "./_components/MoTable";
import InterveneModal from "./[moCode]/_components/InterveneModal";

import { getMoList, intervene } from "../_lib/mo-data";
import type { MoRecord } from "../_lib/types";

export default function MoMonitoringPage() {
  const { t } = useI18n();

  const [mos, setMos] = useState<MoRecord[]>([]);
  const [interveneTarget, setInterveneTarget] = useState<MoRecord | null>(null);

  // TODO(backend): replace with real API call
  useEffect(() => {
    getMoList().then(setMos);
  }, []);

  async function handleIntervene(reason: string) {
    if (!interveneTarget) return;
    await intervene(interveneTarget.moCode, reason);
    // Refresh the list to reflect changes
    const updated = await getMoList();
    setMos(updated);
    setInterveneTarget(null);
  }

  return (
    <main className="min-h-screen w-full bg-backgroundbg-gray">
      <Sidebar variant="superadmin" />

      <div className="flex min-h-screen flex-col pl-[255px]">
        <TopBar />

        <div className="mt-[52px] w-full px-[18px] py-5">
          {/* Breadcrumb */}
          <nav className="mb-5 flex items-center gap-2 text-xs" aria-label="Breadcrumb">
            <span className="font-medium text-text-colortext-dark">
              {t("moMonitoring.breadcrumb")}
            </span>
          </nav>

          {/* Page title */}
          <h1 className="mb-5 text-lg font-semibold text-[#111111]">
            {t("moMonitoring.title")}
          </h1>

          <div className="flex flex-col gap-5">
            {/* KPI cards — derived from full list */}
            <MoKpiCards mos={mos} />

            {/* MO Table */}
            <MoTable
              mos={mos}
              onIntervene={(mo) => setInterveneTarget(mo)}
            />
          </div>
        </div>
      </div>

      {/* Intervene Modal */}
      <InterveneModal
        open={!!interveneTarget}
        onClose={() => setInterveneTarget(null)}
        onConfirm={handleIntervene}
      />
    </main>
  );
}
