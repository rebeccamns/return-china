
"use client";

import { use, useMemo, useState } from "react";
import { Check } from "lucide-react";
import MobileHeader from "@/components/layout/mobile-header";
import MobileBottomNav, {
  STAFF_RETURN_ITEMS,
} from "@/components/layout/mobile-bottom-nav";
import BackTitle from "@/components/layout/BackTitle";
import StickyActionBar, {
  primaryButton,
  secondaryButton,
} from "@/components/layout/StickyActionBar";
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
  const bottomPadding = showCartonList
    ? "pb-[calc(var(--bottom-nav-h)+88px)]"
    : "pb-[calc(var(--bottom-nav-h)+24px)]";

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
    <main className="relative min-h-screen w-full overflow-hidden bg-backgroundbg-gray ">
      <section
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[255px] overflow-hidden"
      >
        <div className="absolute -left-[90px] -top-[80px] h-[270px] w-[620px] rounded-[50%] bg-[#d8f4e2]" />
        <div className="absolute -left-[100px] top-[80px] h-[190px] w-[620px] rounded-[50%] bg-[#effbf3]" />
      </section>

      <MobileHeader />

      <section
        className={`relative z-10 mx-auto w-full max-w-[412px] px-5 pt-[calc(var(--mobile-header-h)+1.25rem)] ${bottomPadding}`}
      >
        <div className="mb-3">
          <BackTitle title={t("staffReturn.title")} />
        </div>

        <MoSummaryCard
          moNumber={moId || "MO-321654987"}
          scannedCount={scannedCount}
          totalCartons={cartons.length}
          showScanProgress
          onExpandedChange={setShowCartonList}
        />

        {showCartonList && (
          <div className="mt-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-[16px] font-semibold leading-6 text-text-colortext-black">
                {t("staffReturn.cartonList")}
              </h2>

              <span className="text-[12px] font-medium leading-4 text-text-colortext-gray">
                {t(cartons.length === 1 ? "common.cartonSingular" : "common.cartonPlural", { count: cartons.length })}
              </span>
            </div>

            <StickerCartonList
              cartons={cartons}
              onSelect={setActiveCarton}
            />

            {allScanned && !submitted && (
              <div className="mt-4 flex items-start gap-3 rounded-2xl bg-[#E7F5EC] p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-backgroundbg-white">
                  <Check className="h-4 w-4 text-[#006B3C]" />
                </span>

                <div>
                  <p className="text-[13px] font-semibold leading-[18px] text-[#006B3C]">
                    {t("staffReturnSticker.allScanned")}
                  </p>
                  <p className="mt-1 text-[13px] leading-[18px] text-text-colortext-dark">
                    {t("staffReturnSticker.allScannedDescription")}
                  </p>
                </div>
              </div>
            )}

            <p className="mt-4 text-center text-[13px] leading-[18px] text-text-colortext-gray">
              {t("staffReturnSticker.scanInstructions")}
            </p>
          </div>
        )}

        {showCartonList && (
          <StickyActionBar aboveNav>
            <button
              type="button"
              disabled={!allScanned || submitted}
              onClick={() => setShowSubmitConfirm(true)}
              className={`${primaryButton} flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryprimary-green`}
            >
              {submitted ? t("common.submitted") : t("common.submit")}
            </button>
          </StickyActionBar>
        )}
      </section>

      <MobileBottomNav
        items={STAFF_RETURN_ITEMS}
        activeItem="carton-sticker"
        onNavigate={(item) => {
          switch (item) {
            case "packing-list":
              window.location.href = `/staff-return/${moId}`;
              break;
            case "carton-sticker":
            case "history":
              break;
          }
        }}
      />

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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-[2px]"
          onClick={() => setShowSubmitConfirm(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="submit-sticker-title"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-[360px] rounded-3xl border border-strokestroke-gray bg-backgroundbg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
          >
            <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#E7F5EC]">
              <Check className="h-4 w-4 text-[#006B3C]" />
            </div>

            <h2
              id="submit-sticker-title"
              className="text-[16px] font-semibold leading-6 text-text-colortext-black"
            >
              {t("staffReturnSticker.confirm.title")}
            </h2>

            <p className="mt-2 text-[13px] leading-[18px] text-text-colortext-dark">
              {t("staffReturnSticker.confirm.description", { count: cartons.length })}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowSubmitConfirm(false)}
                className={`${secondaryButton} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryprimary-green`}
              >
                {t("common.cancel")}
              </button>

              <button
                type="button"
                onClick={submitStickerScan}
                className={`${primaryButton} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryprimary-green`}
              >
                {t("common.submit")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success modal */}
      {showSuccess && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-[2px]"
          onClick={() => setShowSuccess(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sticker-success-title"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-[360px] rounded-3xl border border-strokestroke-gray bg-backgroundbg-white p-4 text-center shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
          >
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#E7F5EC]">
              <Check className="h-5 w-5 text-[#006B3C]" />
            </div>

            <h2
              id="sticker-success-title"
              className="text-[16px] font-semibold leading-6 text-text-colortext-black"
            >
              {t("staffReturnSticker.success.title")}
            </h2>

            <p className="mt-2 text-[13px] leading-[18px] text-text-colortext-dark">
              {t("staffReturnSticker.success.description", { mo: moId || "MO-321654987" })}
            </p>

            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              className={`${primaryButton} mt-4 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryprimary-green`}
            >
              {t("common.done")}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
