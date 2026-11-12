"use client";

import { getMoDetail } from "@/lib/mo-detail/data";
import { useI18n } from "@/i18n";

export default function MoDeadline({ moCode }: { moCode: string }) {
  const { t, locale } = useI18n();
  const detail = getMoDetail(moCode);
  const pmcEntry = detail?.stages.find((stage) => stage.stageKey === "pmcEntry");
  const deadline =
    pmcEntry?.stageKey === "pmcEntry"
      ? pmcEntry.data?.targetDeliveryDate
      : undefined;

  if (!deadline) return null;

  const [year, month, day] = deadline.split("-").map(Number);
  const deadlineDate = new Date(year, month - 1, day);
  if (Number.isNaN(deadlineDate.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysUntilDeadline = Math.round(
    (deadlineDate.getTime() - today.getTime()) / 86_400_000,
  );
  const statusLabel =
    daysUntilDeadline < 0
      ? t("common.daysOverdue", { count: Math.abs(daysUntilDeadline) })
      : daysUntilDeadline === 0
        ? t("common.dueToday")
        : t("common.daysRemaining", { count: daysUntilDeadline });
  const dateLabel = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(deadlineDate);

  return (
    <span
      className={`mt-1 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] leading-4 ${
        daysUntilDeadline < 0
          ? "border-strokestroke-red bg-backgroundbg-red text-text-colortext-red"
          : daysUntilDeadline <= 3
            ? "border-strokestroke-yellow bg-backgroundbg-yellow text-text-colortext-yellow"
            : "border-strokestroke-gray-darker bg-backgroundbg-bluish-gray text-text-colortext-gray"
      }`}
    >
      {t("common.deadline", { date: dateLabel })} · {statusLabel}
    </span>
  );
}
