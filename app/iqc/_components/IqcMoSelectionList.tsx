"use client";

import Link from "next/link";
import { ChevronRight, Package } from "lucide-react";

import { useI18n } from "@/i18n";
import { getMoDetail } from "@/lib/mo-detail/data";
import { formatDateTime } from "@/lib/date-utils";
import MoDeadline from "@/components/history/MoDeadline";
import type { MoSummary } from "@/lib/mo-detail/types";

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
  submitted = false,
  submittedAtByCode,
}: {
  summaries: MoSummary[];
  submitted?: boolean;
  submittedAtByCode?: ReadonlyMap<string, number>;
}) {
  const { t, locale } = useI18n();

  return (
    <div className="divide-y divide-strokestroke-gray">
      {summaries.map((summary) => {
        const materialCount = getMaterialCount(summary.moCode);
        const submittedAt = submittedAtByCode?.get(summary.moCode);

        return (
          <Link
            key={summary.moCode}
            href={`/iqc/${encodeURIComponent(summary.moCode)}`}
            className="flex w-full items-center gap-4 bg-white px-[18px] py-4 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primaryprimary-green"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F4F4F4]">
              <Package
                className="h-5 w-5 text-[#737373]"
                strokeWidth={1.7}
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#111111]">
                {summary.moCode}
              </p>
              <p className="mt-1 text-xs text-[#8F8F8E]">
                {t(
                  materialCount === 1
                    ? "common.materialSingular"
                    : "common.materialPlural",
                  { count: materialCount },
                )}
              </p>
              <MoDeadline moCode={summary.moCode} />
              {submitted && submittedAt !== undefined && (
                <p className="mt-1 text-[11px] text-[#8F8F8E]">
                  {formatDateTime(submittedAt, locale)}
                </p>
              )}
            </div>

            <span className="hidden text-xs text-[#8F8F8E] sm:block">
              {t(
                submitted
                  ? "common.viewSubmittedDetails"
                  : "iqc.viewMaterials",
              )}
            </span>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md">
              <ChevronRight className="h-4 w-4 text-[#737373]" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
