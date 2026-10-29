
"use client";

import { useEffect, useId, useMemo, useState } from "react";

import { useI18n } from "@/i18n";
import { useElementWidth } from "../_lib/useElementWidth";
import { stageLabelKey } from "../_lib/stageLabel";
import type { TrendPoint } from "../_lib/types";

const SVG_H = 204;
const PLOT_TOP = 32;
const PLOT_H = 99;
const AREA_EXTRA = 8;
const LABEL_Y = PLOT_TOP + PLOT_H + 41;
const Y_AXIS_W = 44;
const SIDE_PAD = 40;
const MIN_LABEL_GAP = 56;

const TOOLTIP_W = 210;
const TOOLTIP_H = 88;

const LINE = "#1e9e4f";
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

  const heading =
    title ??
    t("superadmin.chart.rejectionRate");

  useEffect(() => setActive(null), [points]);

  const n = points.length;

  const { lo, hi, ticks } = useMemo(
    () => niceScale(points.map((point) => point.rate)),
    [points],
  );

  const plotW = Math.max(width - Y_AXIS_W, 0);
  const gap =
    n > 1
      ? Math.max(plotW - SIDE_PAD * 2, 0) / (n - 1)
      : 0;

  const xAt = (i: number) =>
    Y_AXIS_W +
    (n > 1 ? SIDE_PAD + i * gap : plotW / 2);

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
    gap > 0
      ? Math.max(1, Math.ceil(MIN_LABEL_GAP / gap))
      : 1;

  function handleMove(event: React.PointerEvent<SVGSVGElement>) {
    if (n === 0) return;

    const x =
      event.clientX -
      event.currentTarget.getBoundingClientRect().left;

    const raw =
      n > 1
        ? Math.round((x - Y_AXIS_W - SIDE_PAD) / gap)
        : 0;

    setActive(clamp(raw, 0, n - 1));
  }

  const point = active !== null ? points[active] : null;
  const px = active !== null ? xAt(active) : 0;
  const py = point ? yAt(point.rate) : 0;

  const above = py - 11 - TOOLTIP_H >= -6;

  const center = clamp(
    px,
    TOOLTIP_W / 2 - 16,
    width + 24 - TOOLTIP_W / 2,
  );

  return (
    <section className="overflow-hidden rounded-lg border border-strokestroke-gray bg-white">
      <header className="flex h-[55px] items-center border-b border-strokestroke-gray px-6">
        <h2 className="text-base font-semibold text-[#111111]">
          {heading}
        </h2>
      </header>

      <div className="pl-6 pr-8">
        <div
          ref={ref}
          className="relative"
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
                      stopOpacity="0.16"
                    />
                    <stop
                      offset="100%"
                      stopColor={LINE}
                      stopOpacity="0"
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
                      stroke="#e4e4e2"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={Y_AXIS_W - 12}
                      y={yAt(tick)}
                      textAnchor="end"
                      dominantBaseline="central"
                      fontSize={12}
                      fill="#5f5f5e"
                    >
                      {tick}%
                    </text>
                  </g>
                ))}

                {n > 1 && (
                  <>
                    <path
                      d={areaPath}
                      fill={`url(#${gradientId})`}
                    />
                    <path
                      d={linePath}
                      fill="none"
                      stroke={LINE}
                      strokeWidth={2}
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
                      fontSize={12}
                      fill={
                        active === i
                          ? "#111111"
                          : "#5f5f5e"
                      }
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
                    fill="#ffffff"
                    stroke={LINE}
                    strokeWidth={2}
                  />
                )}
              </svg>

              {point && (
                <div
                  className="pointer-events-none absolute z-10"
                  style={{
                    left: center,
                    top: above ? py - 11 : py + 15,
                    transform: above
                      ? "translate(-50%, -100%)"
                      : "translate(-50%, 0)",
                  }}
                >
                  <div className="relative min-w-[190px] whitespace-nowrap rounded-lg border border-strokestroke-gray bg-white px-3 py-2 text-[11px] leading-4 text-[#444444] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
                    <p className="mb-1.5 text-xs font-semibold text-[#111111]">
                      {point.tooltipLabel}
                    </p>

                    {metric === "pass" ? (
                      <>
                        <p>
                          Pass Rate: {point.rate.toFixed(1)}%
                        </p>
                        <p>
                          Target achievement rate
                        </p>
                      </>
                    ) : point.shipments === 0 ? (
                      <p>{t("superadmin.chart.noShipments")}</p>
                    ) : (
                      <>
                        <p>
                          {t("superadmin.chart.rejectionRateValue", {
                            rate: point.rate,
                          })}
                        </p>
                        <p>
                          {t("superadmin.chart.rejectedOf", {
                            rejected: point.rejected,
                            shipments: point.shipments.toLocaleString("en-US"),
                          })}
                        </p>
                        {point.topStage && (
                          <p>
                            {t("superadmin.chart.mostRejections", {
                              stage: stageLabelKey(point.topStage)
                                ? t(stageLabelKey(point.topStage)!)
                                : point.topStage,
                              count: point.topStageCount,
                              total: point.rejected,
                            })}
                          </p>
                        )}
                      </>
                    )}

                    <span
                      aria-hidden="true"
                      className={
                        above
                          ? "absolute -bottom-1 h-2 w-2 rotate-45 border-b border-r border-strokestroke-gray bg-white"
                          : "absolute -top-1 h-2 w-2 rotate-45 border-l border-t border-strokestroke-gray bg-white"
                      }
                      style={{
                        left: `calc(50% + ${px - center}px)`,
                        marginLeft: -4,
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
