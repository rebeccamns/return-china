"use client";

import { use } from "react";

import IqcIdentityDesktop from "./_components/desktop/IqcIdentityDesktop";
import IqcIdentityMobile from "./_components/mobile/IqcIdentityMobile";
import { useIqcIdentity } from "./_hooks/useIqcIdentity";
import { useIsDesktop } from "@/hooks/use-is-desktop";

function IQCDetailPage({ moId }: { moId: string }) {
  const identity = useIqcIdentity(moId);
  const isDesktop = useIsDesktop();

  if (isDesktop === undefined) {
    return <div className="min-h-screen bg-backgroundbg-gray" />;
  }

  if (isDesktop) {
    return <IqcIdentityDesktop identity={identity} />;
  }

  return <IqcIdentityMobile identity={identity} />;
}

export default function IQCPage({
  params,
}: {
  params: Promise<{ moId: string }>;
}) {
  const { moId } = use(params);
  return <IQCDetailPage key={moId} moId={moId} />;
}