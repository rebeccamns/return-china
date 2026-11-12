"use client";

import { use, useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";

import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import MobileCircleBackground from "@/components/layout/mobile-circle-background";
import MobileHeader from "@/components/layout/mobile-header";
import MobileBottomNav, {
  STAFF_RETURN_ITEMS,
} from "@/components/layout/mobile-bottom-nav";
import { useI18n } from "@/i18n";
import { DEMO } from "@/lib/demo-data";
import { useIsDesktop } from "@/hooks/use-is-desktop";

import CartonList from "./_components/CartonList";
import MaterialDetailForm from "./_components/MaterialDetailForm";
import MaterialList from "./_components/MaterialList";
import StickyActionBar, {
  primaryButton,
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

type Step = "carton-list" | "material-list" | "material-detail";

const MATERIAL_OPTIONS: Material[] = [
  {
    id: "1",
    code: DEMO.materialCodes.cameraModule,
    englishName: "Camera Module Lychee F4",
    chinaName: "相机模组",
  },
  {
    id: "2",
    code: DEMO.materialCodes.batteryCover,
    englishName: "Battery cover Lychee F4",
    chinaName: "电池盖组件 AC175 绿",
  },
  {
    id: "3",
    code: DEMO.materialCodes.displayPanel,
    englishName: "Display Panel Lychee F4",
    chinaName: "显示屏面板",
  },
];

export default function StaffReturnPage({
  params,
}: {
  params: Promise<{ moId: string }>;
}) {
  const { moId } = use(params);
  const isDesktop = useIsDesktop();
  const { t } = useI18n();

  const [step, setStep] = useState<Step>("carton-list");

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

  const showBottomNav = step === "carton-list";

  if (isDesktop === undefined) {
    return <div className="min-h-screen bg-backgroundbg-gray" />;
  }

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

  function handleBackToSelection() {
    clearSelection();
    window.location.href = "/staff-return";
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
    <main
      aria-label={`${t("staffReturn.title")} ${moId}`}
      className="mobile-body-copy relative min-h-screen w-full overflow-hidden bg-backgroundbg-gray antialiased max-md:bg-white dark:bg-backgroundbg-gray"
    >
      {isDesktop && <Sidebar variant="staffReturn" />}
      {/* Desktop decorative background */}
      <section
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[255px] overflow-hidden md:hidden"
      >
        <div className="absolute -left-[90px] -top-[80px] h-[270px] w-[620px] rounded-[50%] bg-[var(--decor-circle-1)]" />
        <div className="absolute -left-[100px] top-[80px] h-[190px] w-[620px] rounded-[50%] bg-[var(--decor-circle-2)]" />
      </section>
      {!isDesktop && <MobileCircleBackground />}
      {isDesktop ? (
        <TopBar />
      ) : (
        <MobileHeader />
      )}

      <section
        className={`relative z-10 ${
          isDesktop
            ? "ml-[255px] mt-[52px] w-auto px-6 py-5 pb-32"
            : `mx-auto w-full max-w-[412px] px-5 max-md:px-4 pt-[calc(var(--mobile-header-h)+1.25rem)] max-md:pt-[calc(var(--mobile-header-h)+0.5rem)] ${
                showBottomNav
                  ? "pb-[calc(var(--bottom-nav-h)+88px)] max-md:pb-[calc(var(--bottom-nav-h)+var(--action-bar-h)+12px)]"
                  : "pb-[calc(env(safe-area-inset-bottom,0px)+88px)] max-md:pb-[calc(env(safe-area-inset-bottom,0px)+var(--action-bar-h)+12px)]"
              }`
        }`}
      >
        {isDesktop && (
          <nav className="mb-4 text-xs text-text-colortext-gray">
            {t("staffReturn.title")}
          </nav>
        )}
        {/* Carton list */}
        {step === "carton-list" && (
          <>
            <h1 className="m-0">
              <button
                type="button"
                onClick={handleBackToSelection}
                aria-label={`${t("common.back")} ${t("staffReturn.title")}`}
                className="-ml-1 flex min-h-11 items-center gap-1 text-left"
              >
                <ChevronLeft
                  className="h-6 w-6 shrink-0 text-primaryprimary-green"
                  strokeWidth={2}
                />
                <span className="text-[22px] max-md:text-title font-semibold leading-7 tracking-[-0.01em] text-text-colortext-black">
                  {t("staffReturn.title")}
                </span>
              </button>
            </h1>

            <CartonList
              cartons={cartons}
              onAddCartons={handleAddCartons}
              onOpenCarton={handleOpenCarton}
            />

            <StickyActionBar aboveNav>
              <button
                type="button"
                onClick={handleRejectWO}
                className="h-12 max-md:h-11 flex-1 rounded-[14px] border border-red-200 bg-red-50 px-4 text-[15px] max-md:text-button font-semibold text-red-600 transition active:scale-[0.98] hover:bg-red-100 dark:border-strokestroke-red dark:bg-backgroundbg-red dark:text-text-colortext-red dark:hover:bg-[#6B1F25]"
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
      {showBottomNav && !isDesktop && (
        <MobileBottomNav
          items={STAFF_RETURN_ITEMS}
          activeItem="packing-list"
          onNavigate={(item) => {
            switch (item) {
              case "packing-list":
                window.location.href = "/staff-return";
                break;

              case "carton-sticker":
                window.location.href = "/staff-return-sticker";
                break;

              case "history":
                window.location.href = "/staff-return-history";
                break;
              case "identity":
              case "verification":
                break;
            }
          }}
        />
      )}
    </main>
  );
}