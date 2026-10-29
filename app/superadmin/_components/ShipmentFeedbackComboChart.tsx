
"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";

import { useElementWidth } from "../_lib/useElementWidth";
import type { TrendPoint } from "../_lib/types";

const SVG_HEIGHT = 250;
const PLOT_TOP = 24;
const PLOT_HEIGHT = 145;
const LABEL_Y = 195;

const LEFT_AXIS = 42;
const RIGHT_AXIS = 42;
const SIDE_PADDING = 16;

const SHIPMENT_COLOR = "#168D48";
const FEEDBACK_COLOR = "#F28A63";
const LINE_COLOR = "#174F3A";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

type Props = {
  points: TrendPoint[];
};

export default function ShipmentFeedbackComboChart({
  points,
}: Props) {
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

    const plotWidth = Math.max(
      width - LEFT_AXIS - RIGHT_AXIS,
      0,
    );

    const usableWidth = Math.max(
      plotWidth - SIDE_PADDING * 2,
      0,
    );

    const gap =
      points.length > 1
        ? usableWidth / (points.length - 1)
        : 0;

    const xAt = (index: number) =>
      LEFT_AXIS +
      (points.length > 1
        ? SIDE_PADDING + index * gap
        : plotWidth / 2);

    const yCount = (value: number) =>
      PLOT_TOP +
      PLOT_HEIGHT -
      (value / maxShipments) * PLOT_HEIGHT;

    const yRate = (value: number) =>
      PLOT_TOP +
      PLOT_HEIGHT -
      (clamp(value, 0, 100) / 100) * PLOT_HEIGHT;

    const linePath = points
      .map(
        (point, index) =>
          `${index === 0 ? "M" : "L"}${xAt(index).toFixed(1)},${yRate(
            point.shipments > 0
              ? (point.rejected / point.shipments) * 100
              : 0,
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

  const activePoint =
    activeIndex !== null ? points[activeIndex] : null;

  const activeRate =
    activePoint && activePoint.shipments > 0
      ? (activePoint.rejected / activePoint.shipments) * 100
      : 0;

  const barWidth = Math.min(
    16,
    Math.max(5, chart.gap * 0.2),
  );

  const countTicks = [
    chart.maxShipments,
    Math.round(chart.maxShipments / 2),
    0,
  ].filter((value, index, array) => array.indexOf(value) === index);

  return (
    <section className="min-w-0 overflow-hidden rounded-lg border border-strokestroke-gray bg-white">
      <header className="flex min-h-[55px] flex-wrap items-center justify-between gap-3 border-b border-strokestroke-gray px-5 py-3">
        <div>
          <h2 className="text-base font-semibold text-[#111111]">
            Shipment &amp; Feedback Trend
          </h2>

          <p className="mt-1 text-xs text-[#777775]">
            Total shipments, abnormal feedback, and abnormal rate
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-md border border-strokestroke-gray px-2.5 py-1.5 text-xs text-[#777775]">
          <CalendarDays className="h-3.5 w-3.5" />
          Monthly trend
        </span>
      </header>

      <div className="px-3 pb-2 pt-3 sm:px-4">
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

                  const rect =
                    event.currentTarget.getBoundingClientRect();

                  const x = event.clientX - rect.left;

                  const raw =
                    points.length > 1 && chart.gap > 0
                      ? Math.round(
                          (x - LEFT_AXIS - SIDE_PADDING) /
                            chart.gap,
                        )
                      : 0;

                  setActiveIndex(
                    clamp(raw, 0, points.length - 1),
                  );
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
                        stroke="#E8EAE8"
                        strokeDasharray="4 4"
                      />

                      <text
                        x={LEFT_AXIS - 8}
                        y={y}
                        textAnchor="end"
                        dominantBaseline="central"
                        fontSize={10}
                        fill="#777775"
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
                    fill="#777775"
                  >
                    {tick}%
                  </text>
                ))}

                {/* Grouped vertical bars */}
                {points.map((point, index) => {
                  const center = chart.xAt(index);
                  const shipmentY = chart.yCount(
                    point.shipments,
                  );
                  const feedbackY = chart.yCount(
                    point.rejected,
                  );

                  const shipmentHeight =
                    PLOT_TOP + PLOT_HEIGHT - shipmentY;

                  const feedbackHeight =
                    PLOT_TOP + PLOT_HEIGHT - feedbackY;

                  return (
                    <g key={`${point.label}-${index}`}>
                      {activeIndex === index && (
                        <rect
                          x={center - chart.gap * 0.36}
                          y={PLOT_TOP - 6}
                          width={Math.max(
                            chart.gap * 0.72,
                            24,
                          )}
                          height={PLOT_HEIGHT + 12}
                          rx={5}
                          fill="#EAF7EF"
                        />
                      )}

                      <rect
                        x={center - barWidth - 2}
                        y={shipmentY}
                        width={barWidth}
                        height={shipmentHeight}
                        rx={2}
                        fill={SHIPMENT_COLOR}
                        opacity={0.9}
                      />

                      <rect
                        x={center + 2}
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
                        fill={
                          activeIndex === index
                            ? "#111111"
                            : "#777775"
                        }
                        fontWeight={
                          activeIndex === index ? 600 : 400
                        }
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
                  strokeWidth={2.5}
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
                        fill="white"
                        stroke={LINE_COLOR}
                        strokeWidth={2}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Hover / touch details */}
              {activePoint && (
                <div
                  className="pointer-events-none absolute right-2 top-2 z-10 w-[190px] rounded-lg border border-strokestroke-gray bg-white p-3 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
                >
                  <p className="text-xs font-semibold text-[#111111]">
                    {activePoint.tooltipLabel}
                  </p>

                  <div className="mt-2 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[#777775]">
                        Total shipments
                      </span>
                      <span className="font-medium text-[#168D48]">
                        {activePoint.shipments.toLocaleString("en-US")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[#777775]">
                        Abnormal feedback
                      </span>
                      <span className="font-medium text-[#D96D4D]">
                        {activePoint.rejected.toLocaleString("en-US")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-[#EEEEEC] pt-1.5">
                      <span className="text-[#777775]">
                        Abnormal rate
                      </span>
                      <span className="font-semibold text-[#174F3A]">
                        {activeRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-[#EEEEEC] py-3 text-xs text-[#555555]">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-[#168D48]" />
            Total shipments
          </span>

          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-[#F28A63]" />
            Abnormal feedback
          </span>

          <span className="flex items-center gap-2">
            <span className="h-[2px] w-4 bg-[#174F3A]" />
            Abnormal rate (%)
          </span>
        </div>
      </div>
    </section>
  );
}
