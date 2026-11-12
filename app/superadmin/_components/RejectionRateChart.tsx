"use client";

import { useEffect, useId, useMemo, useState } from "react";

import { useI18n } from "@/i18n";
import { useElementWidth } from "../_lib/useElementWidth";
import type { TrendPoint } from "../_lib/types";

const SVG_H = 205;
const PLOT_TOP = 20;
const PLOT_H = 130;
const AREA_EXTRA = 8;
const LABEL_Y = 178;
const Y_AXIS_W = 42;
const SIDE_PAD = 24;
const MIN_LABEL_GAP = 54;

const TOOLTIP_W = 190;
const TOOLTIP_H = 75;

// Linked semantic color: Forest Green for Pass Rate / Healthy yield
const LINE = "#16A34A";
const STEPS = [1, 2, 5, 10, 20, 25, 50];

type Metric = "rejection" | "pass";

type Props = {
  points: TrendPoint[];
  title?: string;
  metric?: Metric;
};

function niceScale(rates: number[]) {
  if (!rates.length) {
    return { lo: 0, hi: 100, ticks: [100, 75, 50, 25, 0] };
  }

  const min = Math.min(...rates);
  const max = Math.max(...rates);

  if (min === max && max === 100) {
    return { lo: 95, hi: 100, ticks: [100, 99, 98, 97, 96, 95] };
  }

  const lo = Math.max(0, Math.floor(min));
  const rawHi = Math.min(Math.ceil(max) + 1, 100);
  const range = Math.max(rawHi - lo, 1);
  const step = STEPS.find((s) => range / s <= 5) ?? 50;
  const hi = Math.min(100, lo + Math.ceil(range / step) * step);

  const ticks: number[] = [];
  for (let v = hi; v >= lo; v -= step) ticks.push(v);

  return { lo, hi: Math.max(hi, lo + 1), ticks };
}

const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

export default function RejectionRateChart({
  points,
  title,
  metric = "rejection",
}: Props) {
  const { t } = useI18n();
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const gradientId = `rate-fill-${useId().replace(/:/g, "")}`;

  const heading = title ?? t("superadmin.chart.rejectionRate");

  useEffect(() => setActive(null), [points]);

  const n = points.length;

  const { lo, hi, ticks } = useMemo(
    () => niceScale(points.map((point) => point.rate)),
    [points],
  );

  const plotW = Math.max(width - Y_AXIS_W, 0);
  const gap =
    n > 1 ? Math.max(plotW - SIDE_PAD * 2, 0) / (n - 1) : 0;

  const xAt = (i: number) =>
    Y_AXIS_W + (n > 1 ? SIDE_PAD + i * gap : plotW / 2);

  const yAt = (value: number) =>
    PLOT_TOP + ((hi - value) / (hi - lo)) * PLOT_H;

  const linePath = points
    .map(
      (point, i) =>
        `${i === 0 ? "M" : "L"}${xAt(i).toFixed(1)},${yAt(point.rate).toFixed(1)}`,
    )
    .join(" ");

  const areaBottom = PLOT_TOP + PLOT_H + AREA_EXTRA;

  const areaPath =
    n > 0
      ? `${linePath} L${xAt(n - 1).toFixed(1)},${areaBottom} L${xAt(0).toFixed(1)},${areaBottom} Z`
      : "";

  const labelStride =
    gap > 0 ? Math.max(1, Math.ceil(MIN_LABEL_GAP / gap)) : 1;

  function handleMove(event: React.PointerEvent<SVGSVGElement>) {
    if (n === 0) return;
    const x = event.clientX - event.currentTarget.getBoundingClientRect().left;
    const raw =
      n > 1 ? Math.round((x - Y_AXIS_W - SIDE_PAD) / gap) : 0;
    setActive(clamp(raw, 0, n - 1));
  }

  const point = active !== null ? points[active] : null;
  const px = active !== null ? xAt(active) : 0;
  const py = point ? yAt(point.rate) : 0;

  const above = py - 12 - TOOLTIP_H >= 0;

  const center = clamp(
    px,
    TOOLTIP_W / 2 - 14,
    width + 18 - TOOLTIP_W / 2,
  );

  return (
    <section className="min-w-0 overflow-hidden rounded-lg border border-strokestroke-gray bg-backgroundbg-white">
      {/* Header */}
      <header className="flex h-11 items-center justify-between border-b border-strokestroke-gray px-5">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-text-colortext-black">{heading}</h2>
          <span className="hidden text-xs text-text-colortext-gray sm:inline">
            · Yield &amp; quality compliance
          </span>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded border border-strokestroke-green bg-backgroundbg-green px-2.5 py-1 text-xs font-medium text-text-colortext-green">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
          Target: &gt;95%
        </span>
      </header>

      <div className="px-4 pt-3 sm:px-5">
        <div
          ref={ref}
          className="relative w-full"
          style={{ height: SVG_H }}
        >
          {width > 0 && n > 0 && (
            <>
              <svg
                width={width}
                height={SVG_H}
                role="img"
                aria-label={`${heading} trend chart`}
                className="block touch-pan-y select-none"
                onPointerMove={handleMove}
                onPointerLeave={() => setActive(null)}
              >
                <defs>
                  <linearGradient
                    id={gradientId}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={LINE}
                      stopOpacity="0.2"
                    />
                    <stop
                      offset="100%"
                      stopColor={LINE}
                      stopOpacity="0.02"
                    />
                  </linearGradient>
                </defs>

                {ticks.map((tick) => (
                  <g key={tick}>
                    <line
                      x1={Y_AXIS_W}
                      x2={width}
                      y1={yAt(tick)}
                      y2={yAt(tick)}
                      stroke="var(--strokestroke-gray)"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={Y_AXIS_W - 8}
                      y={yAt(tick)}
                      textAnchor="end"
                      dominantBaseline="central"
                      fontSize={10}
                      fill="var(--text-colortext-gray)"
                    >
                      {tick}%
                    </text>
                  </g>
                ))}

                {n > 1 && (
                  <>
                    <path d={areaPath} fill={`url(#${gradientId})`} />
                    <path
                      d={linePath}
                      fill="none"
                      stroke={LINE}
                      strokeWidth={2.25}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  </>
                )}

                {points.map((p, i) =>
                  i % labelStride === 0 ? (
                    <text
                      key={`${p.label}-${i}`}
                      x={xAt(i)}
                      y={LABEL_Y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={10}
                      fill={active === i ? "var(--text-colortext-black)" : "var(--text-colortext-gray)"}
                      fontWeight={active === i ? 600 : 400}
                    >
                      {p.label}
                    </text>
                  ) : null,
                )}

                {point && (
                  <circle
                    cx={px}
                    cy={py}
                    r={4.5}
                    fill="var(--backgroundbg-white)"
                    stroke={LINE}
                    strokeWidth={2}
                  />
                )}
              </svg>

              {/* Hover Tooltip */}
              {point && (
                <div
                  className="pointer-events-none absolute z-10"
                  style={{
                    left: center,
                    top: above ? py - 10 : py + 14,
                    transform: above
                      ? "translate(-50%, -100%)"
                      : "translate(-50%, 0)",
                  }}
                >
                  <div className="relative min-w-[160px] whitespace-nowrap rounded-lg border border-strokestroke-gray bg-backgroundbg-white px-3 py-2 text-xs leading-tight text-text-colortext-dark shadow-sm">
                    <p className="mb-1 text-xs font-semibold text-text-colortext-black">
                      {point.tooltipLabel}
                    </p>

                    {metric === "pass" ? (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-text-colortext-gray">Pass Rate</span>
                        <span className="font-bold text-text-colortext-green">
                          {point.rate.toFixed(1)}%
                        </span>
                      </div>
                    ) : point.shipments === 0 ? (
                      <p>{t("superadmin.chart.noShipments")}</p>
                    ) : (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-text-colortext-gray">Rate</span>
                        <span className="font-bold text-text-colortext-green">
                          {point.rate}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Linked Color-coded Legend */}
        <div className="flex items-center justify-center gap-6 border-t border-strokestroke-gray py-2.5 text-xs text-text-colortext-dark">
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-4 bg-[#16A34A]" />
            Pass Rate (%) Trend
          </span>
          <span className="flex items-center gap-1.5 text-text-colortext-gray">
            <span className="h-2 w-2 rounded-full bg-[#16A34A]/30" />
            Within tolerance
          </span>
        </div>
      </div>
    </section>
  );
}
