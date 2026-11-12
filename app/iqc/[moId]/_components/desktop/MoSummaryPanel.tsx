"use client";

import { useI18n } from "@/i18n";

import type { UseIqcIdentityReturn } from "../../_hooks/useIqcIdentity";

type Props = {
  identity: UseIqcIdentityReturn;
};

export default function MoSummaryPanel({ identity }: Props) {
  const { t } = useI18n();
  const { moData, progressPercent } = identity;

  return (
    <section className="mb-5 rounded-lg border border-strokestroke-gray bg-backgroundbg-white px-[18px] py-4">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-text-colortext-black">
          {moData.moNumber}
        </h2>
        <p className="mt-1 text-xs text-text-colortext-gray">
          {t("common.submittedAt", { date: moData.submittedAt })}
        </p>
      </div>

      <dl className="grid grid-cols-4 gap-5">
        <div>
          <dt className="text-xs text-text-colortext-gray">{t("common.returnId")}</dt>
          <dd className="mt-1 text-sm font-medium text-text-colortext-black">
            {moData.returnId}
          </dd>
        </div>

        <div>
          <dt className="text-xs text-text-colortext-gray">{t("common.model")}</dt>
          <dd className="mt-1 text-sm font-medium text-text-colortext-black">
            {moData.model}
          </dd>
        </div>

        <div>
          <dt className="text-xs text-text-colortext-gray">{t("iqc.materialsLabel")}</dt>
          <dd className="mt-1 text-sm font-medium text-text-colortext-black">
            {t(
              moData.totalMaterials === 1
                ? "common.materialSingular"
                : "common.materialPlural",
              { count: moData.totalMaterials },
            )}
          </dd>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-xs text-text-colortext-gray">
              {t("iqc.progressLabel")}
            </dt>
            <dd className="text-sm font-semibold text-text-colortext-black">
              {progressPercent}%
            </dd>
          </div>
          <div className="mt-2 h-[6px] overflow-hidden rounded-full bg-[#E6E6E6] dark:bg-backgroundbg-black">
            <div
              className="h-full rounded-full bg-[#008348] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </dl>
    </section>
  );
}
