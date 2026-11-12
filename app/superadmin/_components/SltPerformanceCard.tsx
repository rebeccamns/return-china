"use client";

import { useI18n } from "@/i18n";
import { stageLabelKey } from "../_lib/stageLabel";
import type { FlowRow } from "../_lib/types";

const ALERT_OVER_PCT = 25;
const SCALE_FLOOR_HOURS = 24;

export default function SltPerformanceCard({
  rows,
}: {
  rows: FlowRow[];
}) {
  const { t } = useI18n();

  const displayRows = rows;

  const longest = Math.max(
    ...displayRows.map((row) => row.sltHours + row.overHours),
    0,
  );

  const scale = Math.max(
    SCALE_FLOOR_HOURS,
    Math.ceil(longest * 1.4),
  );

  const pct = (hours: number) =>
    `${Math.min(100, (hours / scale) * 100)}%`;

  const maxOverPct = Math.max(
    ...displayRows.map((r) => r.overPct),
    0,
  );

  return (
    <section className="min-w-0 overflow-hidden rounded-lg border border-strokestroke-gray bg-white">
      {/* Header */}
      <header className="flex h-11 items-center justify-between border-b border-strokestroke-gray px-5">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-[#111111]">
            {t("superadmin.slt.title")}
          </h2>
          <span className="hidden text-xs text-[#777775] sm:inline">
            · {t("superadmin.slt.subtitle")}
          </span>
        </div>

        <span className="text-xs text-[#777775] font-medium">
          Target: 100% within SLT
        </span>
      </header>

      <div className="px-4 pt-3 pb-2 sm:px-5">
        <ul className="divide-y divide-dashed divide-[#F0F0EE]">
          {displayRows.map((row) => {
            const isBottleneck =
              row.overPct === maxOverPct && row.overPct >= ALERT_OVER_PCT;
            const alert = row.overPct >= ALERT_OVER_PCT;

            return (
              <li
                key={row.stage}
                className="grid h-8 sm:h-8.5 grid-cols-[160px_minmax(0,1fr)_140px] items-center px-2 transition-colors hover:bg-slate-50/70"
              >
                <span className="truncate text-xs sm:text-[13px] font-medium text-[#111111]">
                  {stageLabelKey(row.stage)
                    ? t(stageLabelKey(row.stage)!)
                    : row.stage}
                </span>

                <div className="flex items-center gap-1 pr-4">
                  <div
                    className="h-4 rounded-xs bg-gradient-to-r from-[#128d2a] to-[#3bb273]"
                    style={{ width: pct(row.sltHours) }}
                    title={t("superadmin.slt.withinSltTitle", {
                      hours: row.sltHours.toFixed(1),
                    })}
                  />

                  {row.overHours > 0 && (
                    <div
                      className="h-4 rounded-xs bg-gradient-to-r from-[#c92230] to-[#fb8a4c]"
                      style={{ width: pct(row.overHours) }}
                      title={t("superadmin.slt.beyondSltTitle", {
                        hours: row.overHours.toFixed(1),
                      })}
                    />
                  )}
                </div>

                <div className="flex items-center justify-end gap-2.5 text-right">
                  <span className="text-xs text-[#777775]">
                    {t(
                      row.mos === 1
                        ? "superadmin.slt.moSingular"
                        : "superadmin.slt.moPlural",
                      { count: row.mos },
                    )}
                  </span>

                  {isBottleneck ? (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                      {row.overPct}% over SLT
                    </span>
                  ) : alert ? (
                    <span className="text-xs font-medium text-[#b3202d]">
                      {row.overPct}% over
                    </span>
                  ) : (
                    <span className="text-xs text-[#8a8a88]">
                      {row.overPct}% over
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {/* Linked Color-coded Legends */}
        <div className="flex items-center justify-center gap-8 border-t border-[#EEEEEC] pt-3 pb-1.5 text-xs text-[#555555]">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-gradient-to-br from-[#128d2a] to-[#4fd18b]" />
            {t("superadmin.slt.withinSlt")}
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-gradient-to-br from-[#c92230] to-[#ff9a5a]" />
            {t("superadmin.slt.delayed")}
          </span>
        </div>
      </div>
    </section>
  );
}
