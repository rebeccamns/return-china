"use client";

import { useIsDesktop } from "@/hooks/use-is-desktop";

import IqcMoListDesktop from "../iqc/_components/IqcMoListDesktop";
import IqcMoListMobile from "../iqc/_components/IqcMoListMobile";

export default function IQCVerificationSelectionPage() {
  const isDesktop = useIsDesktop();

  if (isDesktop === undefined) {
    return <div className="min-h-screen bg-backgroundbg-gray" />;
  }

  return isDesktop ? (
    <IqcMoListDesktop workflow="verification" />
  ) : (
    <IqcMoListMobile workflow="verification" />
  );
}
