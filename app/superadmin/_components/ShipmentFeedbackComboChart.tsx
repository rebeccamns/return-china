"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";

import { useElementWidth } from "../_lib/useElementWidth";
import type { TrendPoint } from "../_lib/types";

const SVG_HEIGHT = 205;
const PLOT_TOP = 20;
const PLOT_HEIGHT = 135;
const LABEL_Y = 178;

const LEFT_AXIS = 38;
const RIGHT_AXIS = 38;
const SIDE_PADDING = 16;

// Linked semantic colors:
const SHIPMENT_COLOR = "#008348"; // Green for total volume
const FEEDBACK_COLOR = "#EF4444"; // Red/coral for abnormal defects
const LINE_COLOR = "#DC2626"; // Crimson red for abnormal rate line

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

type Props = {
  points: TrendPoint[];
};

export default function ShipmentFeedbackComboChart({ points }: Props) {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    setActiveIndex(null);
  }, [points]);

  const chart = useMemo(() => {
    const maxShipments = Math.max(
      ...points.map((point) => point.shipments),
      1,
    );

    const plotWidth = Math.max(width - LEFT_AXIS - RIGHT_AXIS, 0);
    const usableWidth = Math.max(plotWidth - SIDE_PADDING * 2, 0);

    const gap =
      points.length > 1 ? usableWidth / (points.length - 1) : 0;

    const xAt = (index: number) =>
      LEFT_AXIS +
      (points.length > 1 ? SIDE_PADDING + index * gap : plotWidth / 2);

    const yCount = (value: number) =>
      PLOT_TOP + PLOT_HEIGHT - (value / maxShipments) * PLOT_HEIGHT;

    const yRate = (value: number) =>
      PLOT_TOP + PLOT_HEIGHT - (clamp(value, 0, 100) / 100) * PLOT_HEIGHT;

    const linePath = points
      .map(
        (point, index) =>
          `${index === 0 ? "M" : "L"}${xAt(index).toFixed(1)},${yRate(
            point.shipments > 0 ? (point.rejected / point.shipments) * 100 : 0,
          ).toFixed(1)}`,
      )
      .join(" ");

    return {
      maxShipments,
      xAt,
      yCount,
      yRate,
      linePath,
      gap,
    };
  }, [points, width]);

  const activePoint = activeIndex !== null ? points[activeIndex] : null;

  const activeRate =
    activePoint && activePoint.shipments > 0
      ? (activePoint.rejected / activePoint.shipments) * 100
      : 0;

  const barWidth = Math.min(16, Math.max(5, chart.gap * 0.22));

  const countTicks = [
    chart.maxShipments,
    Math.round(chart.maxShipments / 2),
    0,
  ].filter((value, index, array) => array.indexOf(value) === index);

  return (
    <section className="min-w-0 overflow-hidden rounded-lg border border-strokestroke-gray bg-backgroundbg-white">
      {/* Header */}
      <header className="flex h-11 items-center justify-between border-b border-strokestroke-gray px-5">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-text-colortext-black">
            Shipment &amp; Feedback Trend
          </h2>
          <span className="hidden text-xs text-text-colortext-gray sm:inline">
            · Total shipments vs abnormal feedback
          </span>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded bg-backgroundbg-bluish-gray px-2.5 py-1 text-xs font-medium text-text-colortext-gray">
          <CalendarDays className="h-3.5 w-3.5" />
          Monthly trend
        </span>
      </header>

      <div className="px-4 pt-3 sm:px-5">
        <div
          ref={ref}
          className="relative w-full"
          style={{ height: SVG_HEIGHT }}
        >
          {width > 0 && points.length > 0 && (
            <>
              <svg
                width={width}
                height={SVG_HEIGHT}
                role="img"
                aria-label="Monthly shipment counts, abnormal feedback counts, and abnormal rate"
                className="block touch-pan-y select-none"
                onPointerMove={(event) => {
                  if (points.length === 0) return;
                  const rect = event.currentTarget.getBoundingClientRect();
                  const x = event.clientX - rect.left;
                  const raw =
                    points.length > 1 && chart.gap > 0
                      ? Math.round((x - LEFT_AXIS - SIDE_PADDING) / chart.gap)
                      : 0;

                  setActiveIndex(clamp(raw, 0, points.length - 1));
                }}
                onPointerLeave={() => setActiveIndex(null)}
              >
                {/* Left axis: shipment counts */}
                {countTicks.map((tick) => {
                  const y = chart.yCount(tick);

                  return (
                    <g key={tick}>
                      <line
                        x1={LEFT_AXIS}
                        x2={width - RIGHT_AXIS}
                        y1={y}
                        y2={y}
                        stroke="var(--strokestroke-gray)"
                        strokeDasharray="3 3"
                      />
                      <text
                        x={LEFT_AXIS - 8}
                        y={y}
                        textAnchor="end"
                        dominantBaseline="central"
                        fontSize={10}
                        fill="var(--text-colortext-gray)"
                      >
                        {tick}
                      </text>
                    </g>
                  );
                })}

                {/* Right axis: abnormal rate */}
                {[0, 50, 100].map((tick) => (
                  <text
                    key={tick}
                    x={width - RIGHT_AXIS + 8}
                    y={chart.yRate(tick)}
                    textAnchor="start"
                    dominantBaseline="central"
                    fontSize={10}
                    fill="var(--text-colortext-gray)"
                  >
                    {tick}%
                  </text>
                ))}

                {/* Grouped vertical bars */}
                {points.map((point, index) => {
                  const center = chart.xAt(index);
                  const shipmentY = chart.yCount(point.shipments);
                  const feedbackY = chart.yCount(point.rejected);

                  const shipmentHeight =
                    PLOT_TOP + PLOT_HEIGHT - shipmentY;
                  const feedbackHeight =
                    PLOT_TOP + PLOT_HEIGHT - feedbackY;

                  return (
                    <g key={`${point.label}-${index}`}>
                      {activeIndex === index && (
                        <rect
                          x={center - chart.gap * 0.36}
                          y={PLOT_TOP - 4}
                          width={Math.max(chart.gap * 0.72, 22)}
                          height={PLOT_HEIGHT + 8}
                          rx={4}
                          fill="var(--backgroundbg-green)"
                        />
                      )}

                      <rect
                        x={center - barWidth - 1.5}
                        y={shipmentY}
                        width={barWidth}
                        height={shipmentHeight}
                        rx={2}
                        fill={SHIPMENT_COLOR}
                        opacity={0.9}
                      />

                      <rect
                        x={center + 1.5}
                        y={feedbackY}
                        width={barWidth}
                        height={feedbackHeight}
                        rx={2}
                        fill={FEEDBACK_COLOR}
                        opacity={0.95}
                      />

                      <text
                        x={center}
                        y={LABEL_Y}
                        textAnchor="middle"
                        fontSize={10}
                        fill={activeIndex === index ? "var(--text-colortext-black)" : "var(--text-colortext-gray)"}
                        fontWeight={activeIndex === index ? 600 : 400}
                      >
                        {point.label}
                      </text>
                    </g>
                  );
                })}

                {/* Abnormal rate trend line */}
                <path
                  d={chart.linePath}
                  fill="none"
                  stroke={LINE_COLOR}
                  strokeWidth={2.25}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />

                {/* Line markers */}
                {points.map((point, index) => {
                  const rate =
                    point.shipments > 0
                      ? (point.rejected / point.shipments) * 100
                      : 0;

                  const x = chart.xAt(index);
                  const y = chart.yRate(rate);

                  return (
                    <g key={`rate-${point.label}-${index}`}>
                      <circle
                        cx={x}
                        cy={y}
                        r={activeIndex === index ? 5 : 3.5}
                        fill="var(--backgroundbg-white)"
                        stroke={LINE_COLOR}
                        strokeWidth={2}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Hover tooltip */}
              {activePoint && (
                <div className="pointer-events-none absolute right-3 top-2 z-10 w-[180px] rounded-lg border border-strokestroke-gray bg-backgroundbg-white p-2.5 text-text-colortext-dark shadow-sm">
                  <p className="text-xs font-semibold text-text-colortext-black">
                    {activePoint.tooltipLabel}
                  </p>
                  <div className="mt-1.5 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-text-colortext-gray">Total shipments</span>
                      <span className="font-semibold text-text-colortext-green">
                        {activePoint.shipments.toLocaleString("en-US")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-colortext-gray">Abnormal feedback</span>
                      <span className="font-semibold text-text-colortext-red">
                        {activePoint.rejected.toLocaleString("en-US")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-strokestroke-gray pt-1">
                      <span className="text-text-colortext-gray">Abnormal rate</span>
                      <span className="font-bold text-text-colortext-red">
                        {activeRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Linked Color-coded Legends */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 border-t border-strokestroke-gray py-2.5 text-xs text-text-colortext-dark">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-xs bg-[#008348]" />
            Total shipments
          </span>

          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-xs bg-[#EF4444]" />
            Abnormal feedback
          </span>

          <span className="flex items-center gap-2">
            <span className="h-0.5 w-4 bg-[#DC2626]" />
            Abnormal rate (%)
          </span>
        </div>
      </div>
    </section>
  );
}
