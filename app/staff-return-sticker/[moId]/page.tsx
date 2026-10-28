
"use client";

import { use, useMemo, useState } from "react";
import { Check } from "lucide-react";
import MobileHeader from "@/components/layout/mobile-header";
import { useI18n } from "@/i18n";
import MoSummaryCard from "./_components/MoSummaryCard";

import StickerCartonList, {
  type StickerCarton,
} from "./_components/StickerCartonList";
import StickerScanModal from "./_components/StickerScanModal";

type PageProps = {
  params: Promise<{ moId: string }>;
};

const INITIAL_CARTONS: StickerCarton[] = [
  { id: "carton-1", code: "CT0001", scanned: false },
  { id: "carton-2", code: "CT0002", scanned: false },
  { id: "carton-3", code: "CT0003", scanned: false },
  { id: "carton-4", code: "CT0004", scanned: false },
  { id: "carton-5", code: "CT0005", scanned: false },
  { id: "carton-6", code: "CT0006", scanned: false },
];

export default function StaffReturnStickerPage({ params }: PageProps) {
  const { moId } = use(params);
  const { t } = useI18n();

  const [cartons, setCartons] = useState(INITIAL_CARTONS);
  const [showCartonList, setShowCartonList] = useState(false);
  const [activeCarton, setActiveCarton] =
    useState<StickerCarton | null>(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const scannedCount = useMemo(
    () => cartons.filter((carton) => carton.scanned).length,
    [cartons],
  );

  const allScanned =
    cartons.length > 0 && scannedCount === cartons.length;

  function markStickerScanned(cartonId: string) {
    setCartons((current) =>
      current.map((carton) =>
        carton.id === cartonId
          ? { ...carton, scanned: true }
          : carton,
      ),
    );

    setActiveCarton(null);
  }

  function submitStickerScan() {
    // TODO: Submit sticker-scan results to your API.
    setSubmitted(true);
    setShowSubmitConfirm(false);
    setShowSuccess(true);
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-backgroundbg-gray">
      <MobileHeader />

      <section className="relative z-10 mx-auto min-h-[calc(100vh-90px)] w-full max-w-[412px] px-4 pb-8 pt-[170px]">
        {/* Soft green background matching the existing Staff Return flow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[390px] bg-gradient-to-br from-[#C8F1D8] via-[#E4F8EC] to-[#F8FCF9]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 top-[220px] h-[240px] w-[560px] rounded-[50%] bg-[#F7FFFA]"
        />

        <div className="relative mx-auto w-full">
          <h1 className="mb-4 text-[20px] font-semibold leading-[150%] text-text-colortext-black">
            {t("staffReturn.title")}
          </h1>

          {/* Shared MO summary with sticker-scanning progress */}
          <div className="overflow-hidden rounded-lg border border-strokestroke-gray bg-backgroundbg-white">
            <MoSummaryCard
              moNumber={moId || "MO-321654987"}
              scannedCount={scannedCount}
              totalCartons={cartons.length}
              showScanProgress
              onExpandedChange={setShowCartonList}
            />

            {/* Carton list and Submit appear only when the MO card is expanded */}
            {showCartonList && (
              <div className="px-4 pb-4">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-[16px] font-semibold text-text-colortext-black">
                    {t("staffReturn.cartonList")}
                  </h2>

                  <span className="text-xs text-text-colortext-gray">
                    {t(cartons.length === 1 ? "common.cartonSingular" : "common.cartonPlural", { count: cartons.length })}
                  </span>
                </div>

                <StickerCartonList
                  cartons={cartons}
                  onSelect={setActiveCarton}
                />

                {allScanned && !submitted && (
                  <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#CDE9D8] bg-[#F0FAF4] p-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#DCEFE4]">
                      <Check className="h-4 w-4 text-[#075D32]" />
                    </span>

                    <div>
                      <p className="text-sm font-semibold text-[#075D32]">
                        {t("staffReturnSticker.allScanned")}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[#47745A]">
                        {t("staffReturnSticker.allScannedDescription")}
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  disabled={!allScanned || submitted}
                  onClick={() => setShowSubmitConfirm(true)}
                  className="mt-5 flex h-12 w-full items-center justify-center rounded-lg bg-[linear-gradient(0deg,rgba(11,89,52,1)_0%,rgba(5,131,70,1)_100%)] px-4 text-base font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-none disabled:bg-[#B8B8B8] disabled:text-white"
                >
                  {submitted ? t("common.submitted") : t("common.submit")}
                </button>
              </div>
            )}
          </div>

          {showCartonList && (
            <p className="mt-4 px-1 text-center text-xs leading-5 text-[#8F8F8E]">
              {t("staffReturnSticker.scanInstructions")}
            </p>
          )}
        </div>
      </section>

      {/* Sticker scan modal */}
      {activeCarton && (
        <StickerScanModal
          carton={activeCarton}
          onClose={() => setActiveCarton(null)}
          onConfirm={() => markStickerScanned(activeCarton.id)}
        />
      )}

      {/* Submit confirmation */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="submit-sticker-title"
            className="w-full max-w-[360px] rounded-2xl bg-white p-5 shadow-xl"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#E6F4EA]">
              <Check className="h-5 w-5 text-[#075D32]" />
            </div>

            <h2
              id="submit-sticker-title"
              className="text-lg font-semibold"
            >
              {t("staffReturnSticker.confirm.title")}
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#666666]">
              {t("staffReturnSticker.confirm.description", { count: cartons.length })}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowSubmitConfirm(false)}
                className="h-10 rounded-lg border border-[#DDDDDD] text-sm font-medium text-[#444444] hover:bg-[#F8F8F8]"
              >
                {t("common.cancel")}
              </button>

              <button
                type="button"
                onClick={submitStickerScan}
                className="h-10 rounded-lg bg-[#007A3D] text-sm font-semibold text-white hover:bg-[#006532]"
              >
                {t("common.submit")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sticker-success-title"
            className="w-full max-w-[360px] rounded-2xl bg-white p-5 text-center shadow-xl"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E6F4EA]">
              <Check className="h-7 w-7 text-[#075D32]" />
            </div>

            <h2
              id="sticker-success-title"
              className="text-lg font-semibold"
            >
              {t("staffReturnSticker.success.title")}
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#666666]">
              {t("staffReturnSticker.success.description", { mo: moId || "MO-321654987" })}
            </p>

            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              className="mt-5 h-11 w-full rounded-lg bg-[#007A3D] text-sm font-semibold text-white hover:bg-[#006532]"
            >
              {t("common.done")}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
