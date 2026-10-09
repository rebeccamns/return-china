"use client";

import { useState } from "react";

import MobileHeader from "@/components/layout/mobile-header";

import MoInspectionCard from "./_components/MoInspectionCard";

type Step = "overview" | "material-list";

export default function IQCPage({
  params,
}: {
  params: { moId: string };
}) {
  const [step, setStep] = useState<Step>("overview");

  /*
   * Temporary mock data.
   * Later this will come from your backend/API.
   */
  const moData = {
    moNumber: "MO-321654987",
    submittedAt: "2026-09-02 09:05",
    returnId: "RC-20260831-002",
    model: "Latte-M",
    inspectedCount: 0,
    totalMaterials: 6,
  };

  function handleOpenInspection() {
    setStep("material-list");
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-backgroundbg-gray">
      {/* Green decorative background */}
      <section
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[149px] h-[255px] overflow-hidden"
      >
        <div className="absolute -left-[90px] -top-[80px] h-[270px] w-[620px] rounded-[50%] bg-[#d8f4e2]" />

        <div className="absolute -left-[100px] top-[80px] h-[190px] w-[620px] rounded-[50%] bg-[#effbf3]" />
      </section>

      <MobileHeader />

      <section className="relative z-10 mx-auto w-full max-w-[412px] px-4 pb-8 pt-[170px]">
        {/* Page title */}
        <h1 className="mb-5 text-[20px] font-semibold leading-[150%] text-text-colortext-black">
          IQC Inspect
        </h1>

        {/* Overview */}
        {step === "overview" && (
          <MoInspectionCard
            moNumber={moData.moNumber}
            submittedAt={moData.submittedAt}
            returnId={moData.returnId}
            model={moData.model}
            inspectedCount={moData.inspectedCount}
            totalMaterials={moData.totalMaterials}
            onClick={handleOpenInspection}
          />
        )}

        {/* Material list will be added next */}
        {step === "material-list" && (
          <div className="rounded-xl border border-strokestroke-gray bg-backgroundbg-white p-5">
            <p className="text-center text-sm text-text-colortext-gray">
              Material inspection list will be added next.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}