"use client";

import { useI18n } from "@/i18n";

export default function HistoryLoading() {
  const { t } = useI18n();

  return (
    <div aria-busy="true" aria-label={t("common.loading")} className="space-y-3">
      <div className="h-11 w-36 animate-pulse rounded-lg bg-backgroundbg-white" />
      <div className="h-24 animate-pulse rounded-2xl bg-backgroundbg-white" />
      <div className="h-56 animate-pulse rounded-2xl bg-backgroundbg-white" />
    </div>
  );
}
