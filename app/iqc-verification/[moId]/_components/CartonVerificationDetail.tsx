"use client";

import { Check, Package, ScanLine } from "lucide-react";

import BackTitle from "@/components/layout/BackTitle";
import StickyActionBar, {
  primaryButton,
} from "@/components/layout/StickyActionBar";
import { useI18n } from "@/i18n";

import MoCompactCard from "@/components/iqc/MoCompactCard";
import {
  type DetailStep,
  type VerificationCarton,
  type VerificationMaterial,
  allMaterialsScanned,
  isMaterialScanned,
  scannedCount,
} from "./verification-types";

type Props = {
  carton: VerificationCarton;
  detailStep: DetailStep;
  moNumber: string;
  model: string;
  returnId: string;
  onBack: () => void;
  onScanMaterial: (material: VerificationMaterial) => void;
  onScanSticker: () => void;
  onContinue: () => void;
  onComplete: () => void;
};

export default function CartonVerificationDetail({
  carton,
  detailStep,
  moNumber,
  model,
  returnId,
  onBack,
  onScanMaterial,
  onScanSticker,
  onContinue,
  onComplete,
}: Props) {
  const { t } = useI18n();

  const isStep1 = detailStep === "materials";
  const scanned = scannedCount(carton);
  const total = carton.materials.length;
  const stickerScanned = carton.scannedSticker !== "";

  return (
    <div>
      <BackTitle
        title={carton.code}
        onBack={onBack}
        backLabel={t("common.back")}
      />

      <div className="mt-3">
        <MoCompactCard moNumber={moNumber} model={model} returnId={returnId} />
      </div>

      {/* 2-step progress */}
      <div className="mt-4 max-md:mt-3 flex gap-2" aria-hidden="true">
        <div className="h-1 flex-1 rounded-full bg-[#008348]" />
        <div
          className={`h-1 flex-1 rounded-full transition-colors ${
            isStep1 ? "bg-[#E6E6E6]" : "bg-[#008348]"
          }`}
        />
      </div>

      {/* Materials inside this carton */}
      <section className="mt-4 max-md:mt-3 flex items-center gap-3 rounded-2xl border border-strokestroke-gray bg-backgroundbg-white p-4 max-md:p-3.5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50">
          <Package className="h-5 w-5 text-[#929292]" strokeWidth={1.5} />
        </span>

        <p className="min-w-0 flex-1 text-[15px] max-md:text-body font-semibold leading-5 text-text-colortext-black">
          {t("iqc.verify.materialsInside", { count: total })}
        </p>

        <span className="shrink-0 text-[13px] max-md:text-secondary font-medium max-md:font-normal leading-[18px] text-text-colortext-gray">
          {scanned}/{total}
        </span>
      </section>

      {/* Step content */}
      <section className="mt-4 max-md:mt-3 rounded-2xl border border-strokestroke-gray bg-backgroundbg-white p-4 max-md:p-3.5">
        {isStep1 ? (
          <>
            <p className="text-[12px] max-md:text-caption font-medium leading-4 text-[#006B3C]">
              {t("staffReturn.step1")}
            </p>
            <h2 className="mt-1 text-[16px] max-md:text-heading font-semibold leading-6 text-text-colortext-black">
              {t("iqc.verify.step1Title")}
            </h2>
            <p className="mt-0.5 text-[13px] max-md:text-secondary leading-[18px] text-text-colortext-gray">
              {t("iqc.verify.step1Hint")}
            </p>

            <ul className="mt-4 max-md:mt-3 divide-y divide-strokestroke-gray overflow-hidden rounded-xl border border-strokestroke-gray">
              {carton.materials.map((material, index) => {
                const done = isMaterialScanned(material);

                return (
                  <li key={material.id}>
                    <button
                      type="button"
                      onClick={() => onScanMaterial(material)}
                      className="flex min-h-[60px] max-md:min-h-[52px] w-full items-center gap-3 px-3 max-md:px-3.5 py-2.5 max-md:py-2 text-left transition-colors active:bg-backgroundbg-gray"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E7F5EC] text-[13px] max-md:text-secondary font-semibold text-[#006B3C]">
                        {done ? (
                          <Check className="h-4 w-4" strokeWidth={3} />
                        ) : (
                          index + 1
                        )}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] max-md:text-body font-semibold leading-5 text-text-colortext-black">
                          {material.code}
                        </span>
                        <span className="mt-0.5 block truncate text-[13px] max-md:text-secondary leading-[18px] text-text-colortext-gray">
                          {material.englishName} {material.chinaName}
                        </span>
                      </span>

                      {done ? (
                        <span className="shrink-0 rounded-full bg-[#E7F5EC] px-2 py-0.5 text-[11px] max-md:text-pill font-semibold leading-4 text-[#006B3C]">
                          {t("iqc.verify.scanned")}
                        </span>
                      ) : (
                        <ScanLine
                          className="h-5 w-5 shrink-0 text-primaryprimary-green"
                          strokeWidth={1.8}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <>
            <p className="text-[12px] max-md:text-caption font-medium leading-4 text-[#006B3C]">
              {t("staffReturn.step2")}
            </p>
            <h2 className="mt-1 text-[16px] max-md:text-heading font-semibold leading-6 text-text-colortext-black">
              {t("iqc.verify.step2Title")}
            </h2>
            <p className="mt-0.5 text-[13px] max-md:text-secondary leading-[18px] text-text-colortext-gray">
              {t("iqc.verify.step2Hint")}
            </p>

            <button
              type="button"
              onClick={onScanSticker}
              className={`mt-4 max-md:mt-3 flex w-full items-center gap-3 rounded-2xl p-3 max-md:p-2.5 text-left transition active:scale-[0.99] ${
                stickerScanned
                  ? "border border-[#008348] bg-[#E7F5EC]"
                  : "border-2 border-dashed border-[#b8d9c5] bg-[#f5fbf7] hover:bg-[#edf8f1]"
              }`}
            >
              <span className="flex h-14 w-14 max-md:h-12 max-md:w-12 shrink-0 items-center justify-center rounded-xl bg-white text-primaryprimary-green">
                {stickerScanned ? (
                  <Check className="h-6 w-6" strokeWidth={2.5} />
                ) : (
                  <ScanLine className="h-6 w-6" strokeWidth={1.8} />
                )}
              </span>

              <span className="min-w-0">
                <span className="block truncate text-[14px] max-md:text-body font-semibold leading-5 text-text-colortext-black">
                  {stickerScanned
                    ? t("iqc.verify.stickerScanned")
                    : t("iqc.verify.tapToScanSticker")}
                </span>
                <span className="mt-0.5 block truncate text-[12px] max-md:text-caption leading-4 text-text-colortext-gray">
                  {carton.code}
                </span>
              </span>
            </button>
          </>
        )}
      </section>

      {/* Sticky action (the carton flow hides the bottom nav) */}
      <StickyActionBar>
        {isStep1 ? (
          <button
            type="button"
            onClick={onContinue}
            disabled={!allMaterialsScanned(carton)}
            className={`${primaryButton} flex-1`}
          >
            {t("common.continue")}
          </button>
        ) : (
          <button
            type="button"
            onClick={onComplete}
            disabled={!stickerScanned}
            className={`${primaryButton} flex-1`}
          >
            {t("iqc.verify.completeCarton")}
          </button>
        )}
      </StickyActionBar>
    </div>
  );
}
