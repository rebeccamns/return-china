"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

import { useI18n } from "@/i18n";

export function MoreDetails({
  expanded,
  onToggle,
}: {
  expanded: boolean;
  onToggle: () => void;
}) {
  const { t } = useI18n();
  const Icon = expanded ? ChevronUp : ChevronDown;

  return (
    <button
      type="button"
      aria-expanded={expanded}
      onClick={onToggle}
      className="flex min-h-11 w-full items-center justify-between gap-2 text-left text-[13px] font-medium text-text-colortext-gray focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryprimary-green"
    >
      {t(expanded ? "iqcHistory.lessDetails" : "iqcHistory.moreDetails")}
      <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
    </button>
  );
}

export function DetailValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="shrink-0 text-text-colortext-gray">{label}</dt>
      <dd className="min-w-0 break-all text-right text-text-colortext-black">
        {value}
      </dd>
    </div>
  );
}
