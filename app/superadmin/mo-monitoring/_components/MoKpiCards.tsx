"use client";

import { AlertTriangle, Check, Clock, FileText, type LucideIcon } from "lucide-react";
import { useI18n } from "@/i18n";
import type { MoRecord } from "../../_lib/types";

type Props = {
  mos: MoRecord[];
};

type CardDef = {
  titleKey: string;
  color: {
    bg: string;
    border: string;
    text: string;
    iconBg: string;
    iconColor: string;
  };
  icon: LucideIcon;
  getValue: (mos: MoRecord[]) => number;
};

const CARDS: CardDef[] = [
  {
    titleKey: "moMonitoring.kpi.totalMo",
    color: {
      bg: "bg-white",
      border: "border-l-indigo-400",
      text: "text-indigo-900",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-500",
    },
    icon: FileText,
    getValue: (mos) => mos.length,
  },
  {
    titleKey: "moMonitoring.kpi.moInProgress",
    color: {
      bg: "bg-white",
      border: "border-l-yellow-400",
      text: "text-yellow-900",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-500",
    },
    icon: Clock,
    getValue: (mos) => mos.filter((m) => m.status === "In Progress").length,
  },
  {
    titleKey: "moMonitoring.kpi.moCompleted",
    color: {
      bg: "bg-white",
      border: "border-l-green-500",
      text: "text-green-900",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    icon: Check,
    getValue: (mos) => mos.filter((m) => m.status === "Completed").length,
  },
  {
    titleKey: "moMonitoring.kpi.needIntervene",
    color: {
      bg: "bg-white",
      border: "border-l-red-400",
      text: "text-red-900",
      iconBg: "bg-red-100",
      iconColor: "text-red-500",
    },
    icon: AlertTriangle,
    getValue: (mos) => mos.filter((m) => m.status === "Blocked").length,
  },
];

export default function MoKpiCards({ mos }: Props) {
  const { t } = useI18n();

  return (
    <section
      aria-label={t("moMonitoring.title")}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {CARDS.map((card) => {
        const Icon = card.icon;
        const value = card.getValue(mos);
        return (
          <div
            key={card.titleKey}
            className={`flex min-h-[100px] items-center justify-between rounded-md border px-5 py-4 ${card.color.bg} ${card.color.border}`}
          >
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-600">
                {t(card.titleKey as Parameters<typeof t>[0])}
              </span>
              <span className={`text-3xl font-bold ${card.color.text}`}>
                {value}
              </span>
            </div>
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.color.iconBg}`}
            >
              <Icon
                className={`h-5 w-5 ${card.color.iconColor}`}
                strokeWidth={1.75}
              />
            </span>
          </div>
        );
      })}
    </section>
  );
}

