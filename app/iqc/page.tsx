"use client";

import { useIsDesktop } from "@/hooks/use-is-desktop";
import IqcMoListDesktop from "./_components/IqcMoListDesktop";
import IqcMoListMobile from "./_components/IqcMoListMobile";

export default function IQCPage() {
  const isDesktop = useIsDesktop();

  if (isDesktop === undefined) {
    return <div className="min-h-screen bg-backgroundbg-gray" />;
  }

  return isDesktop ? <IqcMoListDesktop /> : <IqcMoListMobile />;
}