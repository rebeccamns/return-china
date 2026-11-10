"use client";

import IqcHistoryDesktop from "./_components/desktop/IqcHistoryDesktop";
import IqcHistoryMobile from "./_components/mobile/IqcHistoryMobile";
import { useIsDesktop } from "@/hooks/use-is-desktop";

export default function IQCHistoryPage() {
  const isDesktop = useIsDesktop();

  if (isDesktop === undefined) {
    return <div className="min-h-screen bg-backgroundbg-gray" />;
  }

  return isDesktop ? <IqcHistoryDesktop /> : <IqcHistoryMobile />;
}
