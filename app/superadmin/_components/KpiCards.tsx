import { Check, Clock, TrendingDown, TrendingUp, Truck, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Kpis } from "../_lib/types";

type Tone = "inverse" | "good" | "bad";

const TONE_CLASS: Record<Tone, string> = {
  inverse: "text-white",
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
        "flex min-h-[124px] flex-col rounded-lg border px-5 pb-5 pt-3",
        hero
          ? "border-transparent bg-gradient-to-b from-[#058346] to-[#0b5934]"
          : "border-strokestroke-gray bg-white",
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            hero ? "bg-white/20" : iconWrap,
          )}
        >
          <Icon
            className={cn("h-5 w-5", hero ? "text-white" : iconColor)}
            strokeWidth={1.75}
          />
        </span>
        <span className={cn("text-sm font-medium", hero ? "text-white" : "text-[#555554]")}>
          {title}
        </span>
      </div>

      <p
        className={cn(
          "mt-3 text-[24px] font-bold leading-6",
          hero ? "text-white" : "text-[#111111]",
        )}
      >
        {value}
      </p>

      <div className={cn("mt-3.5 flex items-center gap-2 text-sm font-medium", TONE_CLASS[tone])}>
        <Trend className="h-[18px] w-[18px]" strokeWidth={1.75} />
        <span>
          {Math.abs(delta).toFixed(1)}% {compareLabel}
        </span>
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
  const fmt = (n: number) => n.toLocaleString("en-US");

  return (
    <section aria-label="Key figures" className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        hero
        title="Total Shipments"
        value={fmt(kpis.total)}
        delta={kpis.totalDelta}
        compareLabel={compareLabel}
        tone="inverse"
        icon={Truck}
      />

      <KpiCard
        title="Completed Shipments"
        value={fmt(kpis.completed)}
        delta={kpis.completedDelta}
        compareLabel={compareLabel}
        tone={kpis.completedDelta >= 0 ? "good" : "bad"}
        icon={Check}
        iconWrap="bg-backgroundbg-green"
        iconColor="text-[#0b6b3a]"
      />

      {/* Always red, as in the design (the card's own colour, not good/bad) */}
      <KpiCard
        title="Rejected Shipments"
        value={fmt(kpis.rejected)}
        delta={kpis.rejectedDelta}
        compareLabel={compareLabel}
        tone="bad"
        icon={Truck}
        iconWrap="bg-backgroundbg-red"
        iconColor="text-[#c92230]"
      />

      <KpiCard
        title="Avg Lead Time"
        value={`${kpis.leadTimeDays.toFixed(1)} days`}
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