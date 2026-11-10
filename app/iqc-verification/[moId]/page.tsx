"use client";

import { use } from "react";

import IqcVerificationDesktop from "./_components/desktop/IqcVerificationDesktop";
import IqcVerificationMobile from "./_components/mobile/IqcVerificationMobile";
import { useIqcVerification } from "./_hooks/useIqcVerification";
import { useIsDesktop } from "@/hooks/use-is-desktop";

export default function IQCVerificationPage({
  params,
}: {
  params: Promise<{ moId: string }>;
}) {
  const { moId } = use(params);
  const verification = useIqcVerification();
  const isDesktop = useIsDesktop();

  if (isDesktop === undefined) {
    return <div className="min-h-screen bg-backgroundbg-gray" />;
  }

  if (isDesktop) {
    return (
      <IqcVerificationDesktop moId={moId} verification={verification} />
    );
  }

  return <IqcVerificationMobile moId={moId} verification={verification} />;
}
