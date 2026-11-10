"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import BackTitle from "@/components/layout/BackTitle";
import MobileBottomNav, {
  type MobileNavItem,
} from "@/components/layout/mobile-bottom-nav";
import MobileCircleBackground from "@/components/layout/mobile-circle-background";
import MobileHeader from "@/components/layout/mobile-header";
import { useI18n } from "@/i18n";

import InspectionModal from "@/components/iqc/InspectionModal";
import MaterialInspectionForm from "../MaterialInspectionForm";
import MaterialInspectionList from "../MaterialInspectionList";
import type { IQCMaterial } from "../iqc-types";
import MoCompactCard from "@/components/iqc/MoCompactCard";
import MoInspectionCard from "../MoInspectionCard";
import type { UseIqcIdentityReturn } from "../../_hooks/useIqcIdentity";

type Step = "overview" | "material-list" | "material-detail";

type Props = {
  identity: UseIqcIdentityReturn;
};

export default function IqcIdentityMobile({ identity }: Props) {
  const router = useRouter();
  const { t } = useI18n();
  const {
    materials,
    moData,
    inspectedCount,
    progressPercent,
    allInspected,
    submitted,
  } = identity;

  const [step, setStep] = useState<Step>("overview");
  const [activeNav, setActiveNav] = useState<MobileNavItem>("identity");
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(
    null,
  );
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const selectedMaterial =
    materials.find((material) => material.id === selectedMaterialId) ?? null;

  /** The form flow gets the full screen; the nav stays on top-level screens. */
  const showBottomNav = step !== "material-detail";

  const bottomPadding =
    step === "material-list"
      ? "pb-[calc(var(--bottom-nav-h)+88px)] max-md:pb-[calc(var(--bottom-nav-h)+var(--action-bar-h)+12px)]" // sticky submit + nav
      : step === "material-detail"
        ? "pb-[calc(env(safe-area-inset-bottom,0px)+88px)] max-md:pb-[calc(env(safe-area-inset-bottom,0px)+var(--action-bar-h)+12px)]" // sticky save
        : "pb-[calc(var(--bottom-nav-h)+24px)] max-md:pb-[calc(var(--bottom-nav-h)+12px)]"; // nav only

  function handleOpenInspection() {
    setStep("material-list");
  }

  function handleSelectMaterial(material: IQCMaterial) {
    setSelectedMaterialId(material.id);
    setStep("material-detail");
  }

  function handleSaveMaterial(updatedMaterial: IQCMaterial) {
    identity.saveMaterial(updatedMaterial);
    setSelectedMaterialId(null);
    setStep("material-list");
  }

  function handleBackToList() {
    setSelectedMaterialId(null);
    setStep("material-list");
  }

  function handleConfirmSubmit() {
    identity.submit();
    setShowSubmitModal(false);
    setShowSuccessModal(true);
  }

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
        {/* Overview */}
        {step === "overview" && (
          <>
            <div className="mb-3 max-md:mb-3">
              <BackTitle title={t("iqc.title")} />
            </div>

            <MoInspectionCard
              moNumber={moData.moNumber}
              submittedAt={moData.submittedAt}
              returnId={moData.returnId}
              model={moData.model}
              inspectedCount={inspectedCount}
              totalMaterials={moData.totalMaterials}
              progressPercent={progressPercent}
              onClick={handleOpenInspection}
            />
          </>
        )}

        {/* Material list */}
        {step === "material-list" && (
          <>
            <BackTitle
              title={t("iqc.title")}
              onBack={() => setStep("overview")}
              backLabel={t("common.back")}
            />

            <div className="mt-3">
              <MoCompactCard
                moNumber={moData.moNumber}
                model={moData.model}
                returnId={moData.returnId}
                progress={{
                  label: t("iqc.materialInspected", {
                    inspected: inspectedCount,
                    total: moData.totalMaterials,
                  }),
                  percent: progressPercent,
                }}
              />
            </div>

            <div className="mt-4 max-md:mt-3">
              <MaterialInspectionList
                materials={materials}
                allInspected={allInspected}
                onSelectMaterial={handleSelectMaterial}
                onSubmit={() => setShowSubmitModal(true)}
                submitted={submitted}
              />
            </div>
          </>
        )}

        {/* Material detail */}
        {step === "material-detail" && selectedMaterial && (
          <MaterialInspectionForm
            key={selectedMaterial.id}
            material={selectedMaterial}
            moNumber={moData.moNumber}
            model={moData.model}
            returnId={moData.returnId}
            onBack={handleBackToList}
            onSave={handleSaveMaterial}
          />
        )}
      </section>

      <InspectionModal
        open={showSubmitModal}
        title={t("iqc.modal.submitTitle")}
        description={t("iqc.modal.submitDescription", {
          count: materials.length,
          mo: moData.moNumber,
        })}
        confirmLabel={t("common.submit")}
        onCancel={() => setShowSubmitModal(false)}
        onConfirm={handleConfirmSubmit}
      />

      <InspectionModal
        open={showSuccessModal}
        title={t("iqc.modal.successTitle")}
        description={t("iqc.modal.successDescription")}
        onCancel={() => setShowSuccessModal(false)}
        onConfirm={() => setShowSuccessModal(false)}
        success
      />

      {showBottomNav && (
        <MobileBottomNav
          activeItem={activeNav}
          onNavigate={(item) => {
            switch (item) {
              case "identity":
                setActiveNav(item);
                setStep("overview");
                break;

              case "verification":
                router.push(`/iqc-verification/${moData.moNumber}`);
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
