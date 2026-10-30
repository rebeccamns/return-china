"use client";

import { useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";

import MobileHeader from "@/components/layout/mobile-header";
import MobileBottomNav, {
  STAFF_RETURN_ITEMS,
  type MobileNavItem,
} from "@/components/layout/mobile-bottom-nav";
import { useI18n } from "@/i18n";

import CartonList from "./_components/CartonList";
import MaterialDetailForm from "./_components/MaterialDetailForm";
import MaterialList from "./_components/MaterialList";
import MoSummaryCard from "./_components/MoSummaryCard";
import StickyActionBar, {
  primaryButton,
  secondaryButton,
} from "./_components/StickyActionBar";
import {
  type Carton,
  type Material,
  type MaterialEntry,
  cartonPrefix,
  cartonNumber,
  computePacked,
  formatCartonCode,
} from "./_components/types";

type Step = "landing" | "carton-list" | "material-list" | "material-detail";

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
  const { t } = useI18n();

  const [step, setStep] = useState<Step>("landing");
  const [activeNav, setActiveNav] = useState<MobileNavItem>("packing-list");

  const [cartons, setCartons] = useState<Carton[]>([
    { id: "carton-CT1", codes: ["CT0001"], materials: [], saved: false },
  ]);

  const [selectedCartonId, setSelectedCartonId] = useState<string | null>(null);
  const [selectedMaterialCode, setSelectedMaterialCode] = useState("");
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  const selectedCarton =
    cartons.find((carton) => carton.id === selectedCartonId) ?? null;

  const editingEntry =
    selectedCarton?.materials.find((entry) => entry.id === editingEntryId) ??
    null;

  const selectedMaterial =
    editingEntry?.material ??
    MATERIAL_OPTIONS.find((m) => m.code === selectedMaterialCode) ??
    null;

  /** Current packed quantity per material, excluding the carton being edited. */
  const packedElsewhere = useMemo(
    () => computePacked(cartons, selectedCartonId),
    [cartons, selectedCartonId],
  );

  const allCartonsCompleted =
    cartons.length > 0 &&
    cartons.every((carton) => carton.saved && carton.materials.length > 0);

  const showBottomNav = step === "landing" || step === "carton-list";

  /* ---------- helpers ---------- */

  function clearSelection() {
    setSelectedCartonId(null);
    setSelectedMaterialCode("");
    setEditingEntryId(null);
  }

  function updateSelectedCarton(updater: (carton: Carton) => Carton) {
    setCartons((prev) =>
      prev.map((carton) =>
        carton.id === selectedCartonId ? updater(carton) : carton,
      ),
    );
  }

  /* ---------- WO ---------- */

  function handleSubmitWO() {
    if (!allCartonsCompleted) return;

    // TODO: connect to submit API / confirmation modal
    console.log("Submit WO");
  }

  function handleRejectWO() {
    // TODO: open reject confirmation modal
    console.log("Reject WO");
  }

  /* ---------- cartons ---------- */

  function handleCreatePackingList() {
    setStep("carton-list");
  }

  function handleBackToLanding() {
    clearSelection();
    setStep("landing");
  }

  /** Create `count` identical cartons, starting at the selected carton number. */
  function handleAddCartons(count: number, prefix: string, startNumber: number) {
    const codes = Array.from({ length: count }, (_, i) =>
      formatCartonCode(startNumber + i, prefix),
    );

    setCartons((prev) =>
      [
        ...prev,
        {
          id: `carton-${prefix}${startNumber}`,
          codes,
          materials: [],
          saved: false,
        },
      ].sort(
        (a, b) =>
          cartonPrefix(a.codes[0]).localeCompare(cartonPrefix(b.codes[0])) ||
          cartonNumber(a.codes[0]) - cartonNumber(b.codes[0]),
      ),
    );
  }

  function handleOpenCarton(carton: Carton) {
    setSelectedCartonId(carton.id);
    setSelectedMaterialCode("");
    setEditingEntryId(null);
    setStep("material-list");
  }

  function handleBackToCartons() {
    clearSelection();
    setStep("carton-list");
  }

  function handleSaveCarton() {
    if (!selectedCarton || selectedCarton.materials.length === 0) return;

    updateSelectedCarton((carton) => ({ ...carton, saved: true }));
    clearSelection();
    setStep("carton-list");
  }

  /* ---------- materials ---------- */

  function handleSelectMaterial(code: string) {
    setEditingEntryId(null);
    setSelectedMaterialCode(code);

    if (code) setStep("material-detail");
  }

  function handleEditMaterial(entry: MaterialEntry) {
    setEditingEntryId(entry.id);
    setSelectedMaterialCode(entry.material.code);
    setStep("material-detail");
  }

  function handleBackToMaterialList() {
    setSelectedMaterialCode("");
    setEditingEntryId(null);
    setStep("material-list");
  }

  function handleSaveMaterial(entry: MaterialEntry) {
    updateSelectedCarton((carton) => {
      const exists = carton.materials.some((m) => m.id === entry.id);

      return {
        ...carton,
        saved: false, // changed → needs to be saved again
        materials: exists
          ? carton.materials.map((m) => (m.id === entry.id ? entry : m))
          : [...carton.materials, entry],
      };
    });

    handleBackToMaterialList();
  }

  function handleRemoveMaterial() {
    if (!editingEntryId) return;

    updateSelectedCarton((carton) => ({
      ...carton,
      saved: false,
      materials: carton.materials.filter((m) => m.id !== editingEntryId),
    }));

    handleBackToMaterialList();
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-backgroundbg-gray font-[family-name:-apple-system,BlinkMacSystemFont,system-ui,Inter,sans-serif] antialiased">
      {/* Green decorative background */}
      <section
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[var(--mobile-header-h)] h-[255px] overflow-hidden"
      >
        <div className="absolute -left-[90px] -top-[80px] h-[270px] w-[620px] rounded-[50%] bg-[#d8f4e2]" />
        <div className="absolute -left-[100px] top-[80px] h-[190px] w-[620px] rounded-[50%] bg-[#effbf3]" />
      </section>

      <MobileHeader />

      <section
        className={`relative z-10 mx-auto w-full max-w-[412px] px-5 pt-[calc(var(--mobile-header-h)+1.25rem)] ${
          showBottomNav
            ? "pb-[calc(var(--bottom-nav-h)+88px)]"
            : "pb-[calc(env(safe-area-inset-bottom,0px)+88px)]"
        }`}
      >
        {/* Landing */}
        {step === "landing" && (
          <>
            <h1 className="mb-5 text-[22px] font-semibold leading-7 tracking-[-0.01em] text-text-colortext-black">
              {t("staffReturn.title")}
            </h1>

            <MoSummaryCard
              showCreateButton
              onCreatePackingList={handleCreatePackingList}
            />
          </>
        )}

        {/* Carton list */}
        {step === "carton-list" && (
          <>
            <h1 className="m-0">
              <button
                type="button"
                onClick={handleBackToLanding}
                aria-label={`${t("common.back")} ${t("staffReturn.title")}`}
                className="-ml-1 flex min-h-11 items-center gap-1 text-left"
              >
                <ChevronLeft
                  className="h-6 w-6 shrink-0 text-primaryprimary-green"
                  strokeWidth={2}
                />
                <span className="text-[22px] font-semibold leading-7 tracking-[-0.01em] text-text-colortext-black">
                  {t("staffReturn.title")}
                </span>
              </button>
            </h1>

            <div className="mb-5 mt-1">
              <MoSummaryCard />
            </div>

            <CartonList
              cartons={cartons}
              onAddCartons={handleAddCartons}
              onOpenCarton={handleOpenCarton}
            />

            <StickyActionBar aboveNav>
              <button
                type="button"
                onClick={handleRejectWO}
                className={`${secondaryButton} flex-1 text-text-colortext-red`}
              >
                {t("staffReturn.rejectWo")}
              </button>

              <button
                type="button"
                onClick={handleSubmitWO}
                disabled={!allCartonsCompleted}
                className={`${primaryButton} flex-1`}
              >
                {t("common.submit")}
              </button>
            </StickyActionBar>
          </>
        )}

        {/* Material list */}
        {step === "material-list" && selectedCarton && (
          <>
            <MaterialList
              carton={selectedCarton}
              materialOptions={MATERIAL_OPTIONS}
              selectedMaterialCode={selectedMaterialCode}
              packedElsewhere={packedElsewhere}
              onBack={handleBackToCartons}
              onSelectMaterial={handleSelectMaterial}
              onEditMaterial={handleEditMaterial}
              onSaveCarton={handleSaveCarton}
            />
          </>
        )}

        {/* Material detail */}
        {step === "material-detail" && selectedCarton && selectedMaterial && (
          <>
            <MaterialDetailForm
              key={editingEntry?.id ?? selectedMaterial.code}
              carton={selectedCarton}
              material={selectedMaterial}
              initial={editingEntry ?? undefined}
              packedElsewhere={packedElsewhere[selectedMaterial.code]}
              onBack={handleBackToMaterialList}
              onSave={handleSaveMaterial}
              onRemove={editingEntry ? handleRemoveMaterial : undefined}
            />
          </>
        )}
      </section>

      {/* Bottom nav only on the top-level screens; form flows get the full screen */}
      {showBottomNav && (
        <MobileBottomNav
          items={STAFF_RETURN_ITEMS}
          activeItem={activeNav}
          onNavigate={(item) => {
            switch (item) {
              case "packing-list":
                setActiveNav(item);
                clearSelection();
                setStep("landing");
                break;

              case "carton-sticker":
                window.location.href = "/staff-return-sticker/M01234";
                break;

              case "history":
                // Connect this to the History screen when available.
                break;
            }
          }}
        />
      )}
    </main>
  );
}