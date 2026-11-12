import { Check, Clock, TrendingDown, TrendingUp, Truck, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import type { Kpis } from "../_lib/types";

type Tone = "inverse" | "good" | "bad";

const TONE_CLASS: Record<Tone, string> = {
  inverse: "text-white/90",
  good: "text-[#0b6b3a]",
  bad: "text-[#b3202d]",
};

type CardProps = {
  title: string;
  value: string;
  delta: number;
  compareLabel: string;
  tone: Tone;
  icon: LucideIcon;
  hero?: boolean;
  iconWrap?: string;
  iconColor?: string;
};

function KpiCard({
  title,
  value,
  delta,
  compareLabel,
  tone,
  icon: Icon,
  hero = false,
  iconWrap,
  iconColor,
}: CardProps) {
  const Trend = delta >= 0 ? TrendingUp : TrendingDown;

  return (
    <div
      className={cn(
        "flex min-h-[96px] sm:min-h-[102px] flex-col justify-between rounded-lg border p-3.5 sm:p-4 transition-shadow hover:shadow-xs",
        hero
          ? "border-transparent bg-gradient-to-br from-[#058346] to-[#0b5934] text-white shadow-xs"
          : "border-strokestroke-gray bg-white",
      )}
    >
      {/* Top row: Title + Icon */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "text-xs sm:text-[13px] font-medium truncate",
            hero ? "text-white/95" : "text-[#555554]",
          )}
          title={title}
        >
          {title}
        </span>
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            hero ? "bg-white/20 text-white" : cn(iconWrap, iconColor),
          )}
        >
          <Icon className="h-4 w-4" strokeWidth={2} />
        </span>
      </div>

      {/* Bottom row: Value + Trend delta */}
      <div className="mt-1 flex items-baseline justify-between gap-2">
        <p
          className={cn(
            "text-2xl font-bold tracking-tight leading-none sm:text-[26px]",
            hero ? "text-white" : "text-[#111111]",
          )}
        >
          {value}
        </p>

        <div
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium shrink-0",
            TONE_CLASS[tone],
          )}
        >
          <Trend className="h-3.5 w-3.5" strokeWidth={2} />
          <span>{Math.abs(delta).toFixed(1)}%</span>
          <span className="hidden text-[11px] opacity-80 sm:inline">
            {compareLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function KpiCards({
  kpis,
  compareLabel,
}: {
  kpis: Kpis;
  compareLabel: string;
}) {
  const { t } = useI18n();
  const fmt = (n: number) => n.toLocaleString("en-US");

  return (
    <section
      aria-label={t("superadmin.keyFigures")}
      className="grid grid-cols-2 gap-3 sm:gap-3.5 xl:grid-cols-4"
    >
      <KpiCard
        hero
        title={t("superadmin.kpi.totalShipments")}
        value={fmt(kpis.total)}
        delta={kpis.totalDelta}
        compareLabel={compareLabel}
        tone="inverse"
        icon={Truck}
      />

      <KpiCard
        title={t("superadmin.kpi.completedShipments")}
        value={fmt(kpis.completed)}
        delta={kpis.completedDelta}
        compareLabel={compareLabel}
        tone={kpis.completedDelta >= 0 ? "good" : "bad"}
        icon={Check}
        iconWrap="bg-backgroundbg-green"
        iconColor="text-[#0b6b3a]"
      />

      <KpiCard
        title={t("superadmin.kpi.rejectedShipments")}
        value={fmt(kpis.rejected)}
        delta={kpis.rejectedDelta}
        compareLabel={compareLabel}
        tone="bad"
        icon={Truck}
        iconWrap="bg-backgroundbg-red"
        iconColor="text-[#c92230]"
      />

      <KpiCard
        title={t("superadmin.kpi.avgLeadTime")}
        value={t("superadmin.kpi.daysValue", {
          value: kpis.leadTimeDays.toFixed(1),
        })}
        delta={kpis.leadTimeDelta}
        compareLabel={compareLabel}
        tone={kpis.leadTimeDelta <= 0 ? "good" : "bad"}
        icon={Clock}
        iconWrap="bg-backgroundbg-blue"
        iconColor="text-[#2736d9]"
      />
    </section>
  );
}
