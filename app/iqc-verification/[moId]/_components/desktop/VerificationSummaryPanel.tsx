"use client";

import { useI18n } from "@/i18n";

import type { UseIqcVerificationReturn } from "../../_hooks/useIqcVerification";

type Props = {
  moNumber: string;
  submittedAt: string;
  returnId: string;
  model: string;
  verification: UseIqcVerificationReturn;
};

export default function VerificationSummaryPanel({
  moNumber,
  submittedAt,
  returnId,
  model,
  verification,
}: Props) {
  const { t } = useI18n();

  return (
    <section className="mb-5 rounded-lg border border-strokestroke-gray bg-backgroundbg-white px-[18px] py-4">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-text-colortext-black">{moNumber}</h2>
        <p className="mt-1 text-xs text-text-colortext-gray">
          {t("common.submittedAt", { date: submittedAt })}
        </p>
      </div>

      <dl className="grid grid-cols-3 gap-5">
        <div>
          <dt className="text-xs text-text-colortext-gray">{t("common.returnId")}</dt>
          <dd className="mt-1 text-sm font-medium text-text-colortext-black">
            {returnId}
          </dd>
        </div>

        <div>
          <dt className="text-xs text-text-colortext-gray">{t("common.model")}</dt>
          <dd className="mt-1 text-sm font-medium text-text-colortext-black">{model}</dd>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-xs text-text-colortext-gray">
              {t("iqc.verify.cartonsVerified", {
                verified: verification.verifiedCount,
                total: verification.cartons.length,
              })}
            </dt>
            <dd className="text-sm font-semibold text-text-colortext-black">
              {verification.progressPercent}%
            </dd>
          </div>
          <div className="mt-2 h-[6px] overflow-hidden rounded-full bg-[#E6E6E6] dark:bg-backgroundbg-black">
            <div
              className="h-full rounded-full bg-[#008348] transition-all duration-300"
              style={{ width: `${verification.progressPercent}%` }}
            />
          </div>
        </div>
      </dl>
    </section>
  );
}
