"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import MobileBottomNav, {
  type MobileNavItem,
} from "@/components/layout/mobile-bottom-nav";
import MobileCircleBackground from "@/components/layout/mobile-circle-background";
import MobileHeader from "@/components/layout/mobile-header";
import { DEMO, resolveDemoMoNumber } from "@/lib/demo-data";

import type { UseIqcVerificationReturn } from "../../_hooks/useIqcVerification";
import VerificationFlow from "../VerificationFlow";
import type { VerificationStep } from "../verification-types";

type Props = {
  moId: string;
  verification: UseIqcVerificationReturn;
};

export default function IqcVerificationMobile({
  moId,
  verification,
}: Props) {
  const router = useRouter();

  const [step, setStep] = useState<VerificationStep>("landing");
  const activeNav: MobileNavItem = "verification";

  const moData = {
    moNumber: resolveDemoMoNumber(moId),
    submittedAt: "2026-09-02 09:05",
    returnId: "RC-20260831-002",
    model: DEMO.model,
  };

  /** Carton detail is a full-screen flow, so the nav is hidden there. */
  const showBottomNav = step !== "carton-detail";

  const bottomPadding = !showBottomNav
    ? "pb-[calc(env(safe-area-inset-bottom,0px)+88px)] max-md:pb-[calc(env(safe-area-inset-bottom,0px)+var(--action-bar-h)+12px)]" // sticky bar, no nav
    : step === "carton-list"
      ? "pb-[calc(var(--bottom-nav-h)+88px)] max-md:pb-[calc(var(--bottom-nav-h)+var(--action-bar-h)+12px)]" // sticky submit + nav
      : "pb-[calc(var(--bottom-nav-h)+24px)] max-md:pb-[calc(var(--bottom-nav-h)+12px)]"; // nav only

  return (
    <main className="mobile-body-copy relative min-h-screen w-full overflow-hidden bg-backgroundbg-gray antialiased max-md:bg-white">
      {/* Desktop decorative background */}
      <section
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[255px] overflow-hidden max-md:hidden"
      >
        <div className="absolute -left-[90px] -top-[80px] h-[270px] w-[620px] rounded-[50%] bg-[#d8f4e2]" />
        <div className="absolute -left-[100px] top-[80px] h-[190px] w-[620px] rounded-[50%] bg-[#effbf3]" />
      </section>
      <MobileCircleBackground />

      <MobileHeader />

      <section
        className={`relative z-10 mx-auto w-full max-w-[412px] px-4 pt-[calc(var(--mobile-header-h)+0.75rem)] max-md:pt-[calc(var(--mobile-header-h)+0.5rem)] ${bottomPadding}`}
      >
        <VerificationFlow
          moNumber={moData.moNumber}
          submittedAt={moData.submittedAt}
          returnId={moData.returnId}
          model={moData.model}
          verification={verification}
          onStepChange={setStep}
        />
      </section>

      {showBottomNav && (
        <MobileBottomNav
          activeItem={activeNav}
          onNavigate={(item) => {
            switch (item) {
              case "identity":
                router.push(`/iqc/${moData.moNumber}`);
                break;

              case "verification":
                // Already here.
                break;

              case "history":
                router.push("/iqc-history");
                break;
            }
          }}
        />
      )}
    </main>
  );
}
