"use client";

import { useEffect, useState } from "react";

import BackTitle from "@/components/layout/BackTitle";
import { useI18n } from "@/i18n";

import MoCompactCard from "@/components/iqc/MoCompactCard";
import CartonVerificationDetail from "./CartonVerificationDetail";
import CartonVerificationList from "./CartonVerificationList";
import MoVerificationCard from "./MoVerificationCard";
import ScanSheet from "./ScanSheet";
import type { UseIqcVerificationReturn } from "../_hooks/useIqcVerification";
import {
  type DetailStep,
  type ScanTarget,
  type VerificationCarton,
  type VerificationStep,
  isMaterialScanned,
} from "./verification-types";
import VerificationSubmitDialogs from "./mobile/VerificationSubmitDialogs";

type Props = {
  moNumber: string;
  submittedAt: string;
  returnId: string;
  model: string;
  verification: UseIqcVerificationReturn;
  /** Lets the page pick the right bottom padding / hide the nav. */
  onStepChange: (step: VerificationStep) => void;
};

export default function VerificationFlow({
  moNumber,
  submittedAt,
  returnId,
  model,
  verification,
  onStepChange,
}: Props) {
  const { t } = useI18n();

  const [step, setStep] = useState<VerificationStep>("landing");
  const [detailStep, setDetailStep] = useState<DetailStep>("materials");
  const [selectedCartonId, setSelectedCartonId] = useState<string | null>(null);
  const [scanTarget, setScanTarget] = useState<ScanTarget | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    onStepChange(step);
  }, [step, onStepChange]);

  const { cartons, verifiedCount, progressPercent, submitted } = verification;
  const selectedCarton =
    cartons.find((carton) => carton.id === selectedCartonId) ?? null;

  const scanMaterial =
    scanTarget?.kind === "material" && selectedCarton
      ? (selectedCarton.materials.find((x) => x.id === scanTarget.materialId) ??
        null)
      : null;

  /* ---------- navigation ---------- */

  function handleOpenCarton(carton: VerificationCarton) {
    setSelectedCartonId(carton.id);
    setDetailStep("materials");
    setStep("carton-detail");
  }

  function handleBackFromDetail() {
    if (detailStep === "carton-sticker") {
      setDetailStep("materials");
      return;
    }

    setSelectedCartonId(null);
    setStep("carton-list");
  }

  /* ---------- scanning ---------- */

  function handleConfirmMaterialScan() {
    if (!selectedCarton || !scanMaterial) return;

    verification.scanMaterial(selectedCarton.id, scanMaterial.id);

    // Keep scanning: jump to the next material that is not scanned yet.
    const next = selectedCarton.materials.find(
      (item) => item.id !== scanMaterial.id && !isMaterialScanned(item),
    );

    setScanTarget(next ? { kind: "material", materialId: next.id } : null);
  }

  function handleConfirmStickerScan() {
    if (!selectedCarton) return;

    verification.scanSticker(selectedCarton.id);
    setScanTarget(null);
  }

  function handleCompleteCarton() {
    if (!selectedCarton) return;

    verification.completeCarton(selectedCarton.id);
    setSelectedCartonId(null);
    setDetailStep("materials");
    setStep("carton-list");
  }

  /* ---------- submit ---------- */

  function handleConfirmSubmit() {
    verification.submit();
    setShowSubmitModal(false);
    setShowSuccessModal(true);
  }

  return (
    <>
      {/* Landing: MO summary */}
      {step === "landing" && (
        <>
          <div className="mb-3 max-md:mb-3">
            <BackTitle title={t("iqc.verify.title")} />
          </div>

          <MoVerificationCard
            moNumber={moNumber}
            submittedAt={submittedAt}
            returnId={returnId}
            model={model}
            verifiedCount={verifiedCount}
            totalCartons={cartons.length}
            progressPercent={progressPercent}
            onClick={() => setStep("carton-list")}
          />
        </>
      )}

      {/* Carton list */}
      {step === "carton-list" && (
        <>
          <BackTitle
            title={t("iqc.verify.title")}
            onBack={() => setStep("landing")}
            backLabel={t("common.back")}
          />

          <div className="mt-3">
            <MoCompactCard
              moNumber={moNumber}
              model={model}
              returnId={returnId}
              progress={{
                label: t("iqc.verify.cartonsVerified", {
                  verified: verifiedCount,
                  total: cartons.length,
                }),
                percent: progressPercent,
              }}
            />
          </div>

          <div className="mt-4 max-md:mt-3">
            <CartonVerificationList
              cartons={cartons}
              allVerified={verification.allVerified}
              onOpenCarton={handleOpenCarton}
              onSubmit={() => setShowSubmitModal(true)}
              submitted={submitted}
            />
          </div>
        </>
      )}

      {/* Carton detail: step 1 materials, step 2 carton sticker */}
      {step === "carton-detail" && selectedCarton && (
        <CartonVerificationDetail
          key={selectedCarton.id}
          carton={selectedCarton}
          detailStep={detailStep}
          moNumber={moNumber}
          model={model}
          returnId={returnId}
          onBack={handleBackFromDetail}
          onScanMaterial={(material) =>
            setScanTarget({ kind: "material", materialId: material.id })
          }
          onScanSticker={() => setScanTarget({ kind: "carton-sticker" })}
          onContinue={() => setDetailStep("carton-sticker")}
          onComplete={handleCompleteCarton}
        />
      )}

      {/* Scan sheets */}
      {scanMaterial && (
        <ScanSheet
          key={scanMaterial.id}
          title={t("iqc.verify.scanUpnTitle")}
          targetTitle={scanMaterial.code}
          targetSubtitle={`${scanMaterial.englishName} ${scanMaterial.chinaName}`}
          label={t("common.scanUpnBarcode")}
          expected={scanMaterial.code}
          requiredError={t("iqc.form.errorUpnRequired")}
          mismatchError={t("iqc.form.errorUpnMismatch")}
          onConfirm={handleConfirmMaterialScan}
          onClose={() => setScanTarget(null)}
        />
      )}

      {scanTarget?.kind === "carton-sticker" && selectedCarton && (
        <ScanSheet
          key="carton-sticker"
          title={t("iqc.verify.scanStickerTitle")}
          targetTitle={selectedCarton.code}
          label={t("iqc.verify.cartonStickerLabel")}
          expected={selectedCarton.code}
          requiredError={t("iqc.verify.errorStickerRequired")}
          mismatchError={t("iqc.verify.errorStickerMismatch")}
          onConfirm={handleConfirmStickerScan}
          onClose={() => setScanTarget(null)}
        />
      )}

      <VerificationSubmitDialogs
        open={showSubmitModal}
        successOpen={showSuccessModal}
        cartonCount={cartons.length}
        moNumber={moNumber}
        onCancelSubmit={() => setShowSubmitModal(false)}
        onConfirmSubmit={handleConfirmSubmit}
        onDismissSuccess={() => setShowSuccessModal(false)}
      />
    </>
  );
}
