import { useI18n } from "@/i18n";
import { DEMO } from "@/lib/demo-data";
import MoDeadline from "@/components/history/MoDeadline";

import { primaryButton } from "./StickyActionBar";

type MoSummaryCardProps = {
  onCreatePackingList?: () => void;
  showCreateButton?: boolean;
  /** One-line version for inner steps, so forms get the screen space. */
  compact?: boolean;
};

const mo = {
  code: DEMO.moNumber,
  submittedAt: "2026-09-02 09:05",
  returnId: "RC-20260831-002",
  model: DEMO.model,
  wo: DEMO.workOrder,
};

export default function MoSummaryCard({
  onCreatePackingList,
  showCreateButton = false,
  compact = false,
}: MoSummaryCardProps) {
  const { t } = useI18n();

  if (compact) {
    return (
      <section className="flex w-full items-center justify-between gap-3 rounded-2xl border border-strokestroke-gray bg-backgroundbg-white px-4 py-3 max-md:px-3.5 max-md:py-3.5">
        <div className="min-w-0">
          <p className="truncate text-[15px] max-md:text-body font-semibold leading-5 text-text-colortext-black">
            {mo.code}
          </p>
          <p className="mt-0.5 truncate text-[13px] max-md:text-secondary leading-[18px] text-text-colortext-gray">
            {mo.model} · {mo.wo}
          </p>
          <MoDeadline moCode={mo.code} />
        </div>

        <span className="shrink-0 text-[13px] max-md:text-secondary leading-[18px] text-text-colortext-gray">
          {mo.returnId}
        </span>
      </section>
    );
  }

  return (
    <section className="w-full rounded-2xl border border-strokestroke-gray bg-backgroundbg-white p-4 max-md:p-3.5">
      <h2 className="text-[16px] max-md:text-heading font-semibold leading-6 text-text-colortext-black">
        {mo.code}
      </h2>

      <p className="mt-0.5 text-[12px] max-md:text-caption font-medium leading-4 text-text-colortext-gray">
        {t("common.submittedAt", { date: mo.submittedAt })}
      </p>
      <MoDeadline moCode={mo.code} />

      <dl className="mt-4 max-md:mt-3 grid grid-cols-2 gap-4 max-md:gap-3">
        <div>
          <dt className="text-[12px] max-md:text-caption font-medium leading-4 text-text-colortext-gray">
            {t("common.returnId")}
          </dt>
          <dd className="mt-1 text-[15px] max-md:text-body font-medium max-md:font-normal leading-5 text-text-colortext-black">
            {mo.returnId}
          </dd>
        </div>

        <div>
          <dt className="text-[12px] max-md:text-caption font-medium leading-4 text-text-colortext-gray">
            {t("common.model")}
          </dt>
          <dd className="mt-1 text-[15px] max-md:text-body font-medium max-md:font-normal leading-5 text-text-colortext-black">
            {mo.model}
          </dd>
        </div>
      </dl>

      <div className="mt-4 max-md:mt-3 flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3 max-md:px-3.5 max-md:py-3.5">
        <span className="text-[12px] max-md:text-caption font-medium leading-4 text-text-colortext-gray">
          {t("common.wo")}
        </span>
        <span className="text-[15px] max-md:text-body font-semibold leading-5 text-text-colortext-black">
          {mo.wo}
        </span>
      </div>

      {showCreateButton && (
        <button
          type="button"
          onClick={onCreatePackingList}
          className={`${primaryButton} mt-5 max-md:mt-3 w-full`}
        >
          {t("staffReturn.createPackingList")}
        </button>
      )}
    </section>
  );
}