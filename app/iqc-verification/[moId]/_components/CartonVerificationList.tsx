"use client";

import { Check, ChevronRight, Package } from "lucide-react";

import StickyActionBar, {
  primaryButton,
} from "@/components/layout/StickyActionBar";
import { useI18n } from "@/i18n";

import { type VerificationCarton, scannedCount } from "./verification-types";

type Props = {
  cartons: VerificationCarton[];
  allVerified: boolean;
  onOpenCarton: (carton: VerificationCarton) => void;
  onSubmit: () => void;
  submitted: boolean;
};

export default function CartonVerificationList({
  cartons,
  allVerified,
  onOpenCarton,
  onSubmit,
  submitted,
}: Props) {
  const { t } = useI18n();

  return (
    <div>
      {/* Carton list */}
      <h2 className="mb-3 max-md:mb-2 text-[16px] max-md:text-heading font-semibold leading-6 text-text-colortext-black">
        {t("staffReturn.cartonList")}
      </h2>

      <div className="overflow-hidden rounded-2xl border border-strokestroke-gray bg-backgroundbg-white">
        <ul className="divide-y divide-strokestroke-gray">
          {cartons.map((carton) => {
            const scanned = scannedCount(carton);

            return (
              <li key={carton.id}>
                <button
                  type="button"
                  onClick={() => onOpenCarton(carton)}
                  className="flex min-h-[60px] max-md:min-h-[52px] w-full items-center gap-3 px-4 py-2.5 max-md:px-3.5 max-md:py-2 text-left transition-colors active:bg-backgroundbg-gray"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50">
                    <Package
                      className="h-5 w-5 text-[#929292]"
                      strokeWidth={1.5}
                    />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] max-md:text-body font-semibold leading-5 text-text-colortext-black">
                      {carton.code}
                    </span>
                    <span className="mt-0.5 block truncate text-[13px] max-md:text-secondary leading-[18px] text-text-colortext-gray">
                      {t("iqc.verify.materialsCount", {
                        count: carton.materials.length,
                      })}
                    </span>
                  </span>

                  {carton.verified ? (
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E7F5EC]">
                      <Check
                        className="h-4 w-4 text-primaryprimary-green"
                        strokeWidth={3}
                      />
                    </span>
                  ) : scanned > 0 ? (
                    <span className="shrink-0 text-[12px] max-md:text-caption font-medium leading-4 text-text-colortext-gray">
                      {scanned}/{carton.materials.length}
                    </span>
                  ) : null}

                  <ChevronRight
                    className="h-5 w-5 shrink-0 text-[#C4C4C4]"
                    strokeWidth={2}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {allVerified && !submitted && (
        <p className="mt-4 max-md:mt-3 rounded-xl bg-[#E7F5EC] px-4 py-3 max-md:px-3.5 max-md:py-3.5 text-[13px] max-md:text-secondary leading-[18px] text-[#006B3C]">
          {t("iqc.verify.allVerified")}
        </p>
      )}

      {/* Sticky submit (sits above the bottom nav) */}
      <StickyActionBar aboveNav>
        <button
          type="button"
          disabled={!allVerified || submitted}
          onClick={onSubmit}
          className={`${primaryButton} flex-1`}
        >
          {submitted ? t("iqc.inspectionSubmitted") : t("common.submit")}
        </button>
      </StickyActionBar>
    </div>
  );
}
