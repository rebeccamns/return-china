"use client";

import Link from "next/link";
import { ChevronRight, Package } from "lucide-react";

import { useI18n } from "@/i18n";
import { getMoDetail, getMoWorkOrder } from "@/lib/mo-detail/data";
import { formatDateTime } from "@/lib/date-utils";
import MoDeadline from "@/components/history/MoDeadline";
import type { MoSummary } from "@/lib/mo-detail/types";
import { INITIAL_CARTONS } from "../../iqc-verification/_lib/initial-cartons";

export type IqcMoListWorkflow =
  | "identity"
  | "verification"
  | "staffReturn"
  | "staffReturnSticker";

function getMaterialCount(moCode: string) {
  const stage = getMoDetail(moCode)?.stages.find(
    (item) => item.stageKey === "pmcEntry",
  );

  return stage?.stageKey === "pmcEntry"
    ? (stage.data?.materials.length ?? 0)
    : 0;
}

export default function IqcMoSelectionList({
  summaries,
  workflow = "identity",
  submitted = false,
  submittedAtByCode,
}: {
  summaries: MoSummary[];
  workflow?: IqcMoListWorkflow;
  submitted?: boolean;
  submittedAtByCode?: ReadonlyMap<string, number>;
}) {
  const { t, locale } = useI18n();
  const detailPath =
    workflow === "verification" ? "iqc-verification" : "iqc";

  return (
    <div className="divide-y divide-strokestroke-gray">
      {summaries.map((summary) => {
        const itemCount =
          workflow === "verification"
            ? INITIAL_CARTONS.length
            : getMaterialCount(summary.moCode);
        const isStaffReturn =
          workflow === "staffReturn" || workflow === "staffReturnSticker";
        const countLabelKey =
          workflow === "verification"
            ? itemCount === 1
              ? "common.cartonSingular"
              : "common.cartonPlural"
            : itemCount === 1
              ? "common.materialSingular"
              : "common.materialPlural";
        const workOrder = isStaffReturn
          ? getMoWorkOrder(summary.moCode)
          : null;
        const submittedAt = submittedAtByCode?.get(summary.moCode);
        const detailPath =
          workflow === "identity"
            ? "iqc"
            : workflow === "verification"
              ? "iqc-verification"
              : workflow === "staffReturn"
                ? "staff-return"
                : "staff-return-sticker";

        return (
          <Link
            key={summary.moCode}
            href={`/${detailPath}/${encodeURIComponent(summary.moCode)}`}
            className="flex w-full items-center gap-4 bg-backgroundbg-white px-[18px] py-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-backgroundbg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primaryprimary-green"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F4F4F4] dark:bg-backgroundbg-black">
              <Package
                className="h-5 w-5 text-[#737373] dark:text-text-colortext-gray"
                strokeWidth={1.7}
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-text-colortext-black">
                {summary.moCode}
              </p>
              {isStaffReturn ? (
                <p className="mt-1 truncate text-xs text-text-colortext-gray">
                  {summary.model} · {t("common.wo")}: {workOrder ?? "—"}
                </p>
              ) : (
                <p className="mt-1 text-xs text-text-colortext-gray">
                  {t(countLabelKey, { count: itemCount })}
                </p>
              )}
              <MoDeadline moCode={summary.moCode} />
              {submitted && submittedAt !== undefined && (
                <p className="mt-1 text-[11px] text-text-colortext-gray">
                  {formatDateTime(submittedAt, locale)}
                </p>
              )}
            </div>

            <span className="hidden text-xs text-text-colortext-gray sm:block">
              {t(
                submitted
                  ? "common.viewSubmittedDetails"
                  : workflow === "verification"
                    ? "iqc.verify.title"
                    : isStaffReturn
                      ? workflow === "staffReturn"
                        ? "staffReturn.createPackingList"
                        : "staffReturnSticker.title"
                      : "iqc.viewMaterials",
              )}
            </span>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md">
              <ChevronRight className="h-4 w-4 text-[#737373] dark:text-text-colortext-gray" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
