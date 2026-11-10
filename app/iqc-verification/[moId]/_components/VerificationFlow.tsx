"use client";

import { useEffect, useState } from "react";

import BackTitle from "@/components/layout/BackTitle";
import { useI18n } from "@/i18n";
import { DEMO } from "@/lib/demo-data";

import InspectionModal from "@/components/iqc/InspectionModal";
import MoCompactCard from "@/components/iqc/MoCompactCard";
import CartonVerificationDetail from "./CartonVerificationDetail";
import CartonVerificationList from "./CartonVerificationList";
import MoVerificationCard from "./MoVerificationCard";
import ScanSheet from "./ScanSheet";
import {
  type DetailStep,
  type ScanTarget,
  type VerificationCarton,
  type VerificationMaterial,
  type VerificationStep,
  isMaterialScanned,
} from "./verification-types";

type Props = {
  moNumber: string;
  submittedAt: string;
  returnId: string;
  model: string;
  /** Lets the page pick the right bottom padding / hide the nav. */
  onStepChange: (step: VerificationStep) => void;
};

const m = (
  id: string,
  code: string,
  englishName: string,
  chinaName: string,
): VerificationMaterial => ({ id, code, englishName, chinaName, scannedUpn: "" });

// TODO: replace with the cartons from the packing list (API).
const INITIAL_CARTONS: VerificationCarton[] = [
  {
    id: "carton-1",
    code: "CT0001",
    scannedSticker: "",
    verified: false,
    materials: [
      m("1-1", DEMO.materialCodes.cameraModule, "Camera Module Lychee F4", "相机模组"),
      m("1-2", DEMO.materialCodes.batteryCover, "Battery cover Lychee F4", "电池盖组件 AC175 绿"),
      m("1-3", DEMO.materialCodes.batteryCover, "Battery cover Lychee F4", "电池盖组件 AC175 绿"),
    ],
  },
  {
    id: "carton-2",
    code: "CT0002",
    scannedSticker: "",
    verified: false,
    materials: [
      m("2-1", DEMO.materialCodes.cameraModule, "Camera Module Lychee F4", "相机模组"),
      m("2-2", DEMO.materialCodes.displayPanel, "Display Panel Lychee F4", "显示屏面板"),
    ],
  },
  {
    id: "carton-3",
    code: "CT0003",
    scannedSticker: "",
    verified: false,
    materials: [
      m("3-1", DEMO.materialCodes.batteryCover, "Battery cover Lychee F4", "电池盖组件 AC175 绿"),
      m("3-2", DEMO.materialCodes.displayPanel, "Display Panel Lychee F4", "显示屏面板"),
      m("3-3", DEMO.materialCodes.batteryCover, "Battery cover Lychee F4", "电池盖组件 AC175 绿"),
    ],
  },
];

export default function VerificationFlow({
  moNumber,
  submittedAt,
  returnId,
  model,
  onStepChange,
}: Props) {
  const { t } = useI18n();

  const [step, setStep] = useState<VerificationStep>("landing");
  const [detailStep, setDetailStep] = useState<DetailStep>("materials");
  const [cartons, setCartons] = useState<VerificationCarton[]>(INITIAL_CARTONS);
  const [selectedCartonId, setSelectedCartonId] = useState<string | null>(null);
  const [scanTarget, setScanTarget] = useState<ScanTarget | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    onStepChange(step);
  }, [step, onStepChange]);

  const selectedCarton =
    cartons.find((carton) => carton.id === selectedCartonId) ?? null;

  const verifiedCount = cartons.filter((carton) => carton.verified).length;

  const scanMaterial =
    scanTarget?.kind === "material" && selectedCarton
      ? (selectedCarton.materials.find((x) => x.id === scanTarget.materialId) ??
        null)
      : null;

  /* ---------- helpers ---------- */

  function updateSelectedCarton(
    updater: (carton: VerificationCarton) => VerificationCarton,
  ) {
    setCartons((prev) =>
      prev.map((carton) =>
        carton.id === selectedCartonId ? updater(carton) : carton,
      ),
    );
  }

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

    updateSelectedCarton((carton) => ({
      ...carton,
      verified: false, // changed → must be completed again
      materials: carton.materials.map((item) =>
        item.id === scanMaterial.id
          ? { ...item, scannedUpn: DEMO.upnCode }
          : item,
      ),
    }));

    // Keep scanning: jump to the next material that is not scanned yet.
    const next = selectedCarton.materials.find(
      (item) => item.id !== scanMaterial.id && !isMaterialScanned(item),
    );

    setScanTarget(next ? { kind: "material", materialId: next.id } : null);
  }

  function handleConfirmStickerScan() {
    if (!selectedCarton) return;

    updateSelectedCarton((carton) => ({
      ...carton,
      scannedSticker: carton.code,
    }));
    setScanTarget(null);
  }

  function handleCompleteCarton() {
    updateSelectedCarton((carton) => ({ ...carton, verified: true }));
    setSelectedCartonId(null);
    setDetailStep("materials");
    setStep("carton-list");
  }

  /* ---------- submit ---------- */

  function handleConfirmSubmit() {
    setSubmitted(true);
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
                percent:
                  cartons.length > 0
                    ? Math.round((verifiedCount / cartons.length) * 100)
                    : 0,
              }}
            />
          </div>

          <div className="mt-4 max-md:mt-3">
            <CartonVerificationList
              cartons={cartons}
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

      {/* Submit modals */}
      <InspectionModal
        open={showSubmitModal}
        title={t("iqc.verify.submitTitle")}
        description={t("iqc.verify.submitDescription", {
          count: cartons.length,
          mo: moNumber,
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
    </>
  );
}
