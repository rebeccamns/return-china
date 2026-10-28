import { useI18n } from "@/i18n";
import { stageLabelKey } from "../_lib/stageLabel";
import type { FlowRow } from "../_lib/types";

const ALERT_OVER_PCT = 25; // rows at or above this share are shown in red
const SCALE_FLOOR_HOURS = 24; // the bar track represents at least 24 h

export default function SltPerformanceCard({ rows }: { rows: FlowRow[] }) {
  const { t } = useI18n();
  const longest = Math.max(...rows.map((r) => r.sltHours + r.overHours), 0);
  const scale = Math.max(SCALE_FLOOR_HOURS, Math.ceil(longest * 1.5));
  const pct = (hours: number) => `${Math.min(100, (hours / scale) * 100)}%`;

  return (
    <section className="overflow-hidden rounded-lg border border-strokestroke-gray bg-white">
      <header className="border-b border-strokestroke-gray px-6 pb-3.5 pt-4">
        <h2 className="text-base font-semibold leading-6 text-[#111111]">{t("superadmin.slt.title")}</h2>
        <p className="mt-1 text-xs leading-4 text-[#777775]">{t("superadmin.slt.subtitle")}</p>
      </header>

      <div className="px-6 pb-3 pt-3">
        <ul>
          {rows.map((row) => {
            const alert = row.overPct >= ALERT_OVER_PCT;

            return (
              <li
                key={row.stage}
                className="grid h-10 grid-cols-[192px_minmax(0,1fr)_160px] items-center border-b border-dashed border-[#e4e4e2] px-2 transition-colors hover:bg-slate-50/70"
              >
                <span className="text-sm font-medium text-[#111111]">
                  {stageLabelKey(row.stage) ? t(stageLabelKey(row.stage)!) : row.stage}
                </span>

                <div className="flex items-center gap-1">
                  <div
                    className="h-5 rounded-md bg-gradient-to-r from-[#128d2a] to-[#3bb273]"
                    style={{ width: pct(row.sltHours) }}
                    title={t("superadmin.slt.withinSltTitle", { hours: row.sltHours.toFixed(1) })}
                  />
                  {row.overHours > 0 && (
                    <div
                      className="h-5 rounded-md bg-gradient-to-r from-[#c92230] to-[#fb8a4c]"
                      style={{ width: pct(row.overHours) }}
                      title={t("superadmin.slt.beyondSltTitle", { hours: row.overHours.toFixed(1) })}
                    />
                  )}
                </div>

                <div
                  className={
                    alert
                      ? "flex justify-end gap-3 text-sm font-medium text-[#b3202d]"
                      : "flex justify-end gap-3 text-sm text-[#8a8a88]"
                  }
                >
                  <span>{t(row.mos === 1 ? "superadmin.slt.moSingular" : "superadmin.slt.moPlural", { count: row.mos })}</span>
                  <span>{t("superadmin.slt.overSlt", { pct: row.overPct })}</span>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-[30px] flex items-center justify-center gap-10 text-xs text-[#555555]">
          <span className="flex items-center gap-1.5">
            <span className="h-5 w-5 rounded-full bg-gradient-to-br from-[#128d2a] to-[#4fd18b]" />
            {t("superadmin.slt.withinSlt")}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-5 w-5 rounded-full bg-gradient-to-br from-[#c92230] to-[#ff9a5a]" />
            {t("superadmin.slt.delayed")}
          </span>
        </div>
      </div>
    </section>
  );
}