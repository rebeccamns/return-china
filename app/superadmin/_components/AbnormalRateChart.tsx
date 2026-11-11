
"use client";

import { useMemo, useState } from "react";

import { CalendarPickerModal } from "@/components/history/CalendarPickerModal";
import { useI18n } from "@/i18n";
import type { AbnormalRateRow } from "../_lib/types";

const MOCK_DATA: Record<number, AbnormalRateRow[]> = {
  0: [
    { stage: "PMC MO Entry", shipments: 12, feedback: 2 },
    { stage: "IQC Scan", shipments: 8, feedback: 1 },
    { stage: "Staff Return", shipments: 10, feedback: 3 },
    { stage: "Exim", shipments: 6, feedback: 1 },
  ],
  1: [
    { stage: "PMC MO Entry", shipments: 10, feedback: 1 },
    { stage: "IQC Scan", shipments: 9, feedback: 2 },
    { stage: "Staff Return", shipments: 12, feedback: 2 },
    { stage: "Exim", shipments: 8, feedback: 1 },
  ],
};

const DEFAULT_DATA: AbnormalRateRow[] = [
  { stage: "PMC MO Entry", shipments: 12, feedback: 2 },
  { stage: "IQC Scan", shipments: 8, feedback: 1 },
  { stage: "Staff Return", shipments: 10, feedback: 3 },
  { stage: "Exim", shipments: 6, feedback: 1 },
];

export default function AbnormalRateChart() {
  const { t } = useI18n();
  const [month, setMonth] = useState(9);
  const monthValue = `2026-${String(month + 1).padStart(2, "0")}`;

  const rows = useMemo(
    () => MOCK_DATA[month] ?? DEFAULT_DATA,
    [month],
  );

  const totals = useMemo(() => {
    const shipments = rows.reduce(
      (sum, row) => sum + row.shipments,
      0,
    );
    const feedback = rows.reduce(
      (sum, row) => sum + row.feedback,
      0,
    );

    return {
      shipments,
      feedback,
      rate:
        shipments > 0
          ? (feedback / shipments) * 100
          : 0,
    };
  }, [rows]);

  return (
    <section className="overflow-hidden rounded-lg border border-strokestroke-gray bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-strokestroke-gray px-6 py-4">
        <div>
          <h2 className="text-base font-semibold text-[#111111]">
            Abnormal Rate
          </h2>
          <p className="mt-1 text-xs text-[#777775]">
            China feedback compared with total shipments
          </p>
        </div>

        <CalendarPickerModal
          mode="month"
          value={monthValue}
          onChange={(value) => setMonth(Number(value.slice(5, 7)) - 1)}
          ariaLabel={t("superadmin.dashboard")}
          buttonClassName="h-9"
        />
      </header>

      <div className="grid grid-cols-1 gap-4 px-6 py-5 sm:grid-cols-3">
        <div className="rounded-lg border border-strokestroke-gray p-4">
          <p className="text-xs text-[#777775]">Total shipments</p>
          <p className="mt-2 text-2xl font-semibold text-[#111111]">
            {totals.shipments}
          </p>
        </div>

        <div className="rounded-lg border border-strokestroke-gray p-4">
          <p className="text-xs text-[#777775]">Abnormal feedback</p>
          <p className="mt-2 text-2xl font-semibold text-[#C92230]">
            {totals.feedback}
          </p>
        </div>

        <div className="rounded-lg border border-strokestroke-gray p-4">
          <p className="text-xs text-[#777775]">Abnormal rate</p>
          <p className="mt-2 text-2xl font-semibold text-[#111111]">
            {totals.rate.toFixed(1)}%
          </p>
          <p className="mt-1 text-xs text-[#777775]">
            Feedback ÷ shipments
          </p>
        </div>
      </div>

      <div className="px-6 pb-5">
        <div className="mb-3 grid grid-cols-[150px_minmax(0,1fr)_110px] gap-4 border-b border-strokestroke-gray pb-2 text-xs text-[#777775]">
          <span>Flow</span>
          <span>Abnormal rate</span>
          <span className="text-right">Feedback / total</span>
        </div>

        <div className="space-y-4">
          {rows.map((row) => {
            const rate =
              row.shipments > 0
                ? (row.feedback / row.shipments) * 100
                : 0;

            return (
              <div
                key={row.stage}
                className="grid grid-cols-[150px_minmax(0,1fr)_110px] items-center gap-4"
              >
                <span className="text-sm font-medium text-[#111111]">
                  {row.stage}
                </span>

                <div className="h-4 overflow-hidden rounded-md bg-[#F0F0EE]">
                  <div
                    className="h-full rounded-md bg-gradient-to-r from-[#C92230] to-[#FB8A4C] transition-all"
                    style={{
                      width: `${Math.min(rate, 100)}%`,
                    }}
                    title={`${rate.toFixed(1)}%`}
                  />
                </div>

                <span className="text-right text-xs text-[#5F5F5E]">
                  {row.feedback} / {row.shipments} (
                  {rate.toFixed(1)}%)
                </span>
              </div>
            );
          })}
        </div>

        <p className="mt-5 text-xs text-[#8F8F8E]">
          Demo data only. Each shipment should be counted once when
          calculating the abnormal rate.
        </p>
      </div>
    </section>
  );
}
