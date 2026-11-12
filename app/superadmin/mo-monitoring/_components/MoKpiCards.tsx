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
      text: "text-indigo-900",
      iconBg: "bg-indigo-100 dark:bg-backgroundbg-bluish-gray",
      iconColor: "text-indigo-500 dark:text-[#A5A0FF]",
    },
    icon: FileText,
    getValue: (mos) => mos.length,
  },
  {
    titleKey: "moMonitoring.kpi.moInProgress",
    color: {
      bg: "bg-white",
      text: "text-yellow-900",
      iconBg: "bg-yellow-100 dark:bg-backgroundbg-yellow",
      iconColor: "text-yellow-500 dark:text-text-colortext-yellow",
    },
    icon: Clock,
    getValue: (mos) => mos.filter((m) => m.status === "In Progress").length,
  },
  {
    titleKey: "moMonitoring.kpi.moCompleted",
    color: {
      bg: "bg-white",
      text: "text-green-900",
      iconBg: "bg-green-100 dark:bg-backgroundbg-green",
      iconColor: "text-green-600 dark:text-text-colortext-green",
    },
    icon: Check,
    getValue: (mos) => mos.filter((m) => m.status === "Completed").length,
  },
  {
    titleKey: "moMonitoring.kpi.needIntervene",
    color: {
      bg: "bg-white",
      text: "text-red-900",
      iconBg: "bg-red-100 dark:bg-backgroundbg-red",
      iconColor: "text-red-500 dark:text-text-colortext-red",
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
            className={`flex min-h-[88px] items-center justify-between rounded-md border border-gray-200 bg-white px-4 py-3 dark:border-strokestroke-gray dark:bg-backgroundbg-white ${card.color.bg}`}
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-600 dark:text-text-colortext-gray">
                {t(card.titleKey as Parameters<typeof t>[0])}
              </span>
              <span className="text-2xl font-bold text-black dark:text-text-colortext-black">
                {value}
              </span>
            </div>
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${card.color.iconBg}`}
            >
              <Icon
                className={`h-4 w-4 ${card.color.iconColor}`}
                strokeWidth={1.75}
              />
            </span>
          </div>
        );
      })}
    </section>
  );
}
