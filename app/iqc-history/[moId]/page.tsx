"use client";

import { use } from "react";

import MoDetailView from "@/components/history/MoDetailView";
import { useIsDesktop } from "@/hooks/use-is-desktop";

import IqcHistoryDetailMobile from "./_components/mobile/IqcHistoryDetailMobile";

export default function IQCHistoryDetailPage({
  params,
}: {
  params: Promise<{ moId: string }>;
}) {
  const { moId } = use(params);
  const isDesktop = useIsDesktop();

  if (isDesktop === undefined) {
    return <div className="min-h-screen bg-backgroundbg-gray" />;
  }

  if (isDesktop) {
    return (
      <MoDetailView
        moId={moId}
        role="iqc"
        historyHref="/iqc-history"
        sidebarVariant="iqc"
      />
    );
  }

  return <IqcHistoryDetailMobile moId={moId} />;
}
