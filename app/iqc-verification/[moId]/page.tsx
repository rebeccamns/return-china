"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";

import MobileBottomNav, {
  type MobileNavItem,
} from "@/components/layout/mobile-bottom-nav";
import MobileHeader from "@/components/layout/mobile-header";

import VerificationFlow from "./_components/VerificationFlow";
import type { VerificationStep } from "./_components/verification-types";

export default function IQCVerificationPage({
  params,
}: {
  params: Promise<{ moId: string }>;
}) {
  const { moId } = use(params);
  const router = useRouter();

  const [step, setStep] = useState<VerificationStep>("landing");
  const activeNav: MobileNavItem = "verification";

  const moData = {
    moNumber: moId || "MO-321654987",
    submittedAt: "2026-09-02 09:05",
    returnId: "RC-20260831-002",
    model: "Latte-M",
  };

  /** Carton detail is a full-screen flow, so the nav is hidden there. */
  const showBottomNav = step !== "carton-detail";

  const bottomPadding = !showBottomNav
    ? "pb-[calc(env(safe-area-inset-bottom,0px)+88px)] max-md:pb-[calc(env(safe-area-inset-bottom,0px)+var(--action-bar-h)+12px)]" // sticky bar, no nav
    : step === "carton-list"
      ? "pb-[calc(var(--bottom-nav-h)+88px)] max-md:pb-[calc(var(--bottom-nav-h)+var(--action-bar-h)+12px)]" // sticky submit + nav
      : "pb-[calc(var(--bottom-nav-h)+24px)] max-md:pb-[calc(var(--bottom-nav-h)+12px)]"; // nav only

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-backgroundbg-gray antialiased">
      {/* Decorative background */}
      <section
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[255px] overflow-hidden"
      >
        <div className="absolute -left-[90px] -top-[80px] h-[270px] w-[620px] rounded-[50%] bg-[#d8f4e2]" />
        <div className="absolute -left-[100px] top-[80px] h-[190px] w-[620px] rounded-[50%] bg-[#effbf3]" />
      </section>

      <MobileHeader />

      <section
        className={`relative z-10 mx-auto w-full max-w-[412px] px-4 pt-[calc(var(--mobile-header-h)+0.75rem)] max-md:pt-[calc(var(--mobile-header-h)+0.5rem)] ${bottomPadding}`}
      >
        <VerificationFlow
          moNumber={moData.moNumber}
          submittedAt={moData.submittedAt}
          returnId={moData.returnId}
          model={moData.model}
          onStepChange={setStep}
        />
      </section>

      {showBottomNav && (
        <MobileBottomNav
          activeItem={activeNav}
          onNavigate={(item) => {
            switch (item) {
              case "identity":
                router.push(`/iqc/${moId}`);
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
