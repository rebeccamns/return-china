"use client";

import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import { useI18n } from "@/i18n";

export default function MoDetailLoading() {
  const { t } = useI18n();

  return (
    <main className="min-h-screen w-full bg-backgroundbg-gray">
      <Sidebar />
      <div className="flex min-h-screen flex-col pl-[255px]">
        <TopBar />
        <div
          aria-busy="true"
          aria-label={t("common.loading")}
          className="mt-[52px] w-full space-y-5 px-[18px] py-5"
        >
          <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
          <div className="h-16 animate-pulse rounded-lg bg-white" />
          <div className="h-32 animate-pulse rounded-lg bg-white" />
          <div className="h-64 animate-pulse rounded-lg bg-white" />
        </div>
      </div>
    </main>
  );
}
