"use client";

import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import { useI18n } from "@/i18n";
import type { TranslationKey } from "@/i18n";

export default function ComingSoon({ titleKey }: { titleKey: TranslationKey }) {
  const { t } = useI18n();

  return (
    <main className="min-h-screen w-full bg-backgroundbg-gray">
      <Sidebar variant="superadmin" />

      <div className="flex min-h-screen flex-col pl-[255px]">
        <TopBar />

        <div className="mt-[52px] w-full px-[18px] py-5">
          <nav className="mb-4 flex items-center gap-2 text-xs">
            <span className="text-text-colortext-gray">{t("superadmin.dashboard")}</span>
            <span className="text-[#B5B5B3]">›</span>
            <span className="font-medium text-text-colortext-dark">{t(titleKey)}</span>
          </nav>
          <h1 className="text-lg font-semibold text-[#111111]">{t(titleKey)}</h1>
          <p className="mt-2 text-xs text-slate-500">{t("superadmin.comingSoon")}</p>
        </div>
      </div>
    </main>
  );
}
