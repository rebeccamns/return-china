"use client";

import { useState } from "react";

import MobileHeader from "@/components/layout/mobile-header";

import CartonList, {
  type Carton,
} from "./_components/CartonList";

import MaterialDetailForm from "./_components/MaterialDetailForm";

import MaterialList, {
  type Material,
} from "./_components/MaterialList";

import MoSummaryCard from "./_components/MoSummaryCard";

type Step =
  | "landing"
  | "carton-list"
  | "material-list"
  | "material-detail";

const MATERIAL_OPTIONS: Material[] = [
  {
    id: "1",
    code: "721032000320",
    englishName: "Camera Module",
    chinaName: "相机模组",
  },
  {
    id: "2",
    code: "621032000320",
    englishName: "battery cover AC175",
    chinaName: "电池盖组件 AC175 绿",
  },
  {
    id: "3",
    code: "621032000321",
    englishName: "Display Panel",
    chinaName: "显示屏面板",
  },
];

export default function StaffReturnPage({
  params,
}: {
  params: { moId: string };
}) {
  const [step, setStep] = useState<Step>("landing");

  const [cartons, setCartons] = useState<Carton[]>([
    {
      id: "carton-1",
      code: "CT0001",
      materialCount: 0,
      totalMaterials: 3,
    },
  ]);

  const [selectedCarton, setSelectedCarton] =
    useState<Carton | null>(null);

  const [completedMaterials, setCompletedMaterials] =
    useState<Material[]>([]);

  const [selectedMaterialCode, setSelectedMaterialCode] =
    useState("");

  const selectedMaterial =
    MATERIAL_OPTIONS.find(
      (material) =>
        material.code === selectedMaterialCode
    ) ?? null;

  function handleCreatePackingList() {
    setStep("carton-list");
  }

  function handleAddCarton() {
    const nextNumber = cartons.length + 1;

    const newCarton: Carton = {
      id: `carton-${nextNumber}`,
      code: `CT${String(nextNumber).padStart(4, "0")}`,
      materialCount: 0,
      totalMaterials: 3,
    };

    setCartons((prev) => [...prev, newCarton]);
  }

  function handleOpenCarton(carton: Carton) {
    setSelectedCarton(carton);

    setCompletedMaterials([]);
    setSelectedMaterialCode("");

    setStep("material-list");
  }

  function handleSelectMaterial(code: string) {
    setSelectedMaterialCode(code);

    if (code) {
      setStep("material-detail");
    }
  }

  function handleMaterialComplete(material: Material) {
    setCompletedMaterials((prev) => {
      const exists = prev.some(
        (item) => item.code === material.code
      );

      if (exists) {
        return prev;
      }

      return [...prev, material];
    });

    setCartons((prev) =>
      prev.map((carton) =>
        carton.id === selectedCarton?.id
          ? {
              ...carton,
              materialCount:
                carton.materialCount + 1,
            }
          : carton
      )
    );

    setSelectedMaterialCode("");
    setStep("material-list");
  }

  function handleBackToCartons() {
    setSelectedCarton(null);
    setCompletedMaterials([]);
    setSelectedMaterialCode("");
    setStep("carton-list");
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
        <h1 className="mb-4 text-[20px] font-semibold leading-[150%] text-text-colortext-black">
          Staff Return
        </h1>

        {/* Landing */}
        {step === "landing" && (
          <MoSummaryCard
            showCreateButton
            onCreatePackingList={
              handleCreatePackingList
            }
          />
        )}

        {/* Carton List */}
        {step === "carton-list" && (
          <>
            <MoSummaryCard />

            <CartonList
              cartons={cartons}
              onOpenCarton={handleOpenCarton}
              onAddCarton={handleAddCarton}
            />
          </>
        )}

        {/* Material List */}
        {step === "material-list" &&
          selectedCarton && (
            <>
              <MoSummaryCard />

              <div className="mt-5">
                <MaterialList
                  cartonCode={selectedCarton.code}
                  completedMaterials={
                    completedMaterials
                  }
                  totalMaterials={
                    selectedCarton.totalMaterials
                  }
                  selectedMaterialCode={
                    selectedMaterialCode
                  }
                  materialOptions={
                    MATERIAL_OPTIONS
                  }
                  onBack={handleBackToCartons}
                  onSelectMaterial={
                    handleSelectMaterial
                  }
                />
              </div>
            </>
          )}

        {/* Material Detail */}
        {step === "material-detail" &&
          selectedCarton &&
          selectedMaterial && (
            <>
              <MoSummaryCard />

              <div className="mt-5">
                <MaterialDetailForm
                  cartonCode={selectedCarton.code}
                  material={selectedMaterial}
                  completedCount={
                    completedMaterials.length
                  }
                  totalMaterials={
                    selectedCarton.totalMaterials
                  }
                  onBack={() =>
                    setStep("material-list")
                  }
                  onComplete={
                    handleMaterialComplete
                  }
                />
              </div>
            </>
          )}
      </section>
    </main>
  );
}