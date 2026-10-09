"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import MobileHeader from "@/components/layout/mobile-header";

import InspectionModal from "./_components/InspectionModal";
import MaterialInspectionForm from "./_components/MaterialInspectionForm";
import MaterialInspectionList from "./_components/MaterialInspectionList";
import type { IQCMaterial } from "./_components/iqc-types";
import MoInspectionCard from "./_components/MoInspectionCard";

type Step = "overview" | "material-list" | "material-detail";

const INITIAL_MATERIALS: IQCMaterial[] = [
  {
    id: "1",
    code: "721032000320",
    englishName: "Camera Module",
    chinaName: "相机模组",
    qty: 10,
    upnBarcode: "",
    status: null,
    notes: "",
    photoName: "",
  },
  {
    id: "2",
    code: "621032000320",
    englishName: "Battery cover AC175",
    chinaName: "电池盖组件 AC175 绿",
    qty: 10,
    upnBarcode: "",
    status: null,
    notes: "",
    photoName: "",
  },
  {
    id: "3",
    code: "621032003165",
    englishName: "Battery cover AC175",
    chinaName: "电池盖组件 AC175 绿",
    qty: 10,
    upnBarcode: "",
    status: null,
    notes: "",
    photoName: "",
  },
  {
    id: "4",
    code: "621032003165",
    englishName: "Battery cover AC175",
    chinaName: "电池盖组件 AC175 绿",
    qty: 10,
    upnBarcode: "",
    status: null,
    notes: "",
    photoName: "",
  },
  {
    id: "5",
    code: "621032003165",
    englishName: "Battery cover AC175",
    chinaName: "电池盖组件 AC175 绿",
    qty: 10,
    upnBarcode: "",
    status: null,
    notes: "",
    photoName: "",
  },
  {
    id: "6",
    code: "621032003165",
    englishName: "Battery cover AC175",
    chinaName: "电池盖组件 AC175 绿",
    qty: 10,
    upnBarcode: "",
    status: null,
    notes: "",
    photoName: "",
  },
];

export default function IQCPage({
  params,
}: {
  params: { moId: string };
}) {
  const [step, setStep] = useState<Step>("overview");
  const [materials, setMaterials] = useState<IQCMaterial[]>(INITIAL_MATERIALS);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const moData = {
    moNumber: params.moId || "MO-321654987",
    submittedAt: "2026-09-02 09:05",
    returnId: "RC-20260831-002",
    model: "Latte-M",
    totalMaterials: materials.length,
  };

  const selectedMaterial =
    materials.find((material) => material.id === selectedMaterialId) ?? null;
  const inspectedCount = materials.filter((material) => material.status !== null).length;

  function handleOpenInspection() {
    setStep("material-list");
  }

  function handleSelectMaterial(material: IQCMaterial) {
    setSelectedMaterialId(material.id);
    setStep("material-detail");
  }

  function handleSaveMaterial(updatedMaterial: IQCMaterial) {
    setMaterials((current) =>
      current.map((material) =>
        material.id === updatedMaterial.id ? updatedMaterial : material
      )
    );
    setSelectedMaterialId(null);
    setStep("material-list");
  }

  function handleBackToList() {
    setSelectedMaterialId(null);
    setStep("material-list");
  }

  function handleConfirmSubmit() {
    setSubmitted(true);
    setShowSubmitModal(false);
    setShowSuccessModal(true);
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-backgroundbg-gray">
      {/* Original IQC / Staff Return decorative background */}
      <section
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[149px] h-[255px] overflow-hidden"
      >
        <div className="absolute -left-[90px] -top-[80px] h-[270px] w-[620px] rounded-[50%] bg-[#d8f4e2]" />
        <div className="absolute -left-[100px] top-[80px] h-[190px] w-[620px] rounded-[50%] bg-[#effbf3]" />
      </section>

      <MobileHeader />

      <section className="relative z-10 mx-auto w-full max-w-[412px] px-4 pb-8 pt-[170px]">
        {step === "overview" && (
          <>
            <h1 className="mb-5 text-[20px] font-semibold leading-[150%] text-text-colortext-black">
              IQC Inspect
            </h1>
            <MoInspectionCard
              moNumber={moData.moNumber}
              submittedAt={moData.submittedAt}
              returnId={moData.returnId}
              model={moData.model}
              inspectedCount={inspectedCount}
              totalMaterials={moData.totalMaterials}
              onClick={handleOpenInspection}
            />
          </>
        )}

        {step === "material-list" && (
          <>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h1 className="text-[20px] font-semibold leading-[150%] text-text-colortext-black">
                IQC Inspect
              </h1>
              <button
                type="button"
                onClick={() => setStep("overview")}
                className="flex h-9 items-center gap-1.5 rounded-md bg-backgroundbg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-backgroundbg-gray"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            </div>

            <MoInspectionCard
              moNumber={moData.moNumber}
              submittedAt={moData.submittedAt}
              returnId={moData.returnId}
              model={moData.model}
              inspectedCount={inspectedCount}
              totalMaterials={moData.totalMaterials}
              onClick={() => undefined}
            />

            <div className="mt-5">
              <MaterialInspectionList
                materials={materials}
                onSelectMaterial={handleSelectMaterial}
                onSubmit={() => setShowSubmitModal(true)}
                submitted={submitted}
              />
            </div>
          </>
        )}

        {step === "material-detail" && selectedMaterial && (
          <>
            <MoSummaryCardFallback
              moNumber={moData.moNumber}
              submittedAt={moData.submittedAt}
              returnId={moData.returnId}
              model={moData.model}
              inspectedCount={inspectedCount}
              totalMaterials={moData.totalMaterials}
            />
            <div className="mt-5">
              <MaterialInspectionForm
                material={selectedMaterial}
                onBack={handleBackToList}
                onSave={handleSaveMaterial}
              />
            </div>
          </>
        )}
      </section>

      <InspectionModal
        open={showSubmitModal}
        title="Submit Inspection?"
        description={`All ${materials.length} materials have been inspected. Submit the inspection results for ${moData.moNumber}?`}
        confirmLabel="Submit"
        onCancel={() => setShowSubmitModal(false)}
        onConfirm={handleConfirmSubmit}
      />

      <InspectionModal
        open={showSuccessModal}
        title="Inspection Submitted Successfully"
        description="The inspection results have been submitted."
        onCancel={() => setShowSuccessModal(false)}
        onConfirm={() => setShowSuccessModal(false)}
        success
      />
    </main>
  );
}

function MoSummaryCardFallback({
  moNumber,
  submittedAt,
  returnId,
  model,
  inspectedCount,
  totalMaterials,
}: {
  moNumber: string;
  submittedAt: string;
  returnId: string;
  model: string;
  inspectedCount: number;
  totalMaterials: number;
}) {
  const progress = Math.round((inspectedCount / totalMaterials) * 100);

  return (
    <section className="w-full rounded-lg border border-strokestroke-gray bg-backgroundbg-white shadow-none">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[16px] font-semibold leading-[150%] text-text-colortext-black">
              {moNumber}
            </h2>
            <p className="mt-1 text-[14px] font-medium leading-[125%] text-text-colortext-gray">
              Submitted at {submittedAt}
            </p>
          </div>
          <span className="text-[14px] font-medium text-text-colortext-gray">
            {progress}%
          </span>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-4 border-b border-strokestroke-gray pb-4">
          <div>
            <dt className="text-[14px] text-text-colortext-dark">Return ID</dt>
            <dd className="mt-1 break-words text-[16px] font-medium text-text-colortext-black">{returnId}</dd>
          </div>
          <div>
            <dt className="text-[14px] text-text-colortext-dark">Model</dt>
            <dd className="mt-1 text-[16px] font-medium text-text-colortext-black">{model}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
