"use client";

import { useState } from "react";
import { CalendarDays, ListFilter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const chartItems = [
  { label: "BATCH202609", normal: 2.9, abnormal: 0.8 },
  { label: "BATCH202610", normal: 5.5, abnormal: 2.8 },
  { label: "BATCH202611", normal: 4.3, abnormal: 3.5 },
  { label: "BATCH202612", normal: 2.0, abnormal: 4.3 },
  { label: "BATCH202613", normal: 4.7, abnormal: 2.9 },
  { label: "BATCH202614", normal: 4.3, abnormal: 3.5 },
];

const axisValues = [8, 6, 4, 2, 0];
const chartMax = 8;
const chartHeight = 184;

// Same column template for the bars row and the labels row keeps them aligned
const columns = {
  gridTemplateColumns: `repeat(${chartItems.length}, minmax(0, 1fr))`,
};

export default function KpiCard() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [taskFilter, setTaskFilter] = useState("all");

  const showNormal = taskFilter === "all" || taskFilter === "normal";
  const showAbnormal = taskFilter === "all" || taskFilter === "abnormal";
  const lastIndex = chartItems.length - 1;

  return (
    <Card className="min-w-0 flex-1 overflow-visible rounded-lg border-slate-200 bg-white shadow-none">
      <CardHeader className="flex flex-row items-center justify-between gap-3 border-b px-5 py-3">
        <CardTitle className="text-sm font-semibold text-slate-900">
          KPI
        </CardTitle>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-8 gap-2 px-3 text-xs font-normal"
            type="button"
          >
            <CalendarDays className="h-3.5 w-3.5" />
            Today
          </Button>

          <Select value={taskFilter} onValueChange={setTaskFilter}>
            <SelectTrigger className="h-8 w-[132px] gap-2 border-slate-200 px-3 text-xs font-normal">
              <ListFilter className="h-3.5 w-3.5 shrink-0" />
              <SelectValue placeholder="All Tasks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="normal">Flow Normal</SelectItem>
              <SelectItem value="abnormal">Flow Abnormal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5 pt-6 sm:px-7">
        <div className="flex gap-1">
          {/* Y-axis title: its own column, centered on the plot area only */}
          <div
            className="flex w-4 shrink-0 items-center justify-center"
            style={{ height: chartHeight }}
          >
            <span
              className="whitespace-nowrap text-[9px] text-slate-500"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              Lead time (days)
            </span>
          </div>

          {/* Y-axis ticks: each label is centered exactly on its gridline */}
          <div
            className="relative w-6 shrink-0"
            style={{ height: chartHeight }}
          >
            {axisValues.map((value) => (
              <span
                key={value}
                className="absolute right-1.5 -translate-y-1/2 text-[10px] leading-none text-slate-600"
                style={{ top: `${((chartMax - value) / chartMax) * 100}%` }}
              >
                {value}
              </span>
            ))}
          </div>

          {/* Plot area */}
          <div className="min-w-0 flex-1">
            <div
              className="relative border-b border-l border-slate-200"
              style={{ height: chartHeight }}
            >
              {/* Dashed gridlines (0 is the solid baseline) */}
              {axisValues
                .filter((value) => value !== 0)
                .map((value) => (
                  <div
                    key={value}
                    className="pointer-events-none absolute inset-x-0 border-t border-dashed border-slate-200"
                    style={{
                      top: `${((chartMax - value) / chartMax) * 100}%`,
                    }}
                  />
                ))}

              {/* Bars */}
              <div
                className="absolute inset-0 grid gap-2 px-1 sm:px-2"
                style={columns}
              >
                {chartItems.map((item, index) => {
                  const isActive = activeIndex === index;
                  const dimmed = activeIndex !== null && !isActive;

                  const normalHeight = (item.normal / chartMax) * chartHeight;
                  const abnormalHeight =
                    (item.abnormal / chartMax) * chartHeight;
                  const tallest = Math.max(
                    showNormal ? normalHeight : 0,
                    showAbnormal ? abnormalHeight : 0
                  );

                  // Keep the first/last tooltips inside the card edges
                  const tooltipAlign =
                    index === 0
                      ? "left-0"
                      : index === lastIndex
                        ? "right-0"
                        : "left-1/2 -translate-x-1/2";

                  return (
                    <div
                      key={item.label}
                      className="relative flex h-full items-end justify-center gap-1"
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      {/* Hover highlight band */}
                      <div
                        className={cn(
                          "pointer-events-none absolute inset-0 rounded-t-md bg-slate-100/70 opacity-0 transition-opacity duration-150",
                          isActive && "opacity-100"
                        )}
                      />

                      {/* Tooltip sits just above the taller bar */}
                      {isActive && (
                        <div
                          className={cn(
                            "pointer-events-none absolute z-20 w-max rounded-md border border-slate-200 bg-white p-3 text-[10px] shadow-md",
                            tooltipAlign
                          )}
                          style={{ bottom: tallest + 10 }}
                        >
                          <p className="mb-2 font-semibold text-slate-900">
                            {item.label}
                          </p>

                          {showNormal && (
                            <div className="flex items-center justify-between gap-4">
                              <span className="flex items-center gap-1.5 text-slate-600">
                                <span className="h-2 w-2 rounded-full bg-[#128d2a]" />
                                Flow Normal
                              </span>
                              <span className="font-semibold text-slate-900">
                                {item.normal.toFixed(1)} days
                              </span>
                            </div>
                          )}

                          {showAbnormal && (
                            <div className="mt-1.5 flex items-center justify-between gap-4">
                              <span className="flex items-center gap-1.5 text-slate-600">
                                <span className="h-2 w-2 rounded-full bg-[#cf2635]" />
                                Flow Abnormal
                              </span>
                              <span className="font-semibold text-slate-900">
                                {item.abnormal.toFixed(1)} days
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {showNormal && (
                        <div
                          className={cn(
                            "relative w-3 rounded-t-[2px] bg-gradient-to-t from-[#4ce498] to-[#128d2a] transition-all duration-150 sm:w-[22px]",
                            dimmed && "opacity-40",
                            isActive && "brightness-110"
                          )}
                          style={{ height: normalHeight }}
                        />
                      )}

                      {showAbnormal && (
                        <div
                          className={cn(
                            "relative w-3 rounded-t-[2px] bg-gradient-to-t from-[#ff8b4d] to-[#cf2635] transition-all duration-150 sm:w-[22px]",
                            dimmed && "opacity-40",
                            isActive && "brightness-110"
                          )}
                          style={{ height: abnormalHeight }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* X-axis labels: same grid as the bars, so each is centered under its pair */}
            <div className="mt-2 grid gap-2 px-1 sm:px-2" style={columns}>
              {chartItems.map((item, index) => (
                <span
                  key={item.label}
                  className={cn(
                    "whitespace-nowrap text-center text-[8px] font-medium transition-colors sm:text-[10px]",
                    activeIndex === index ? "text-slate-900" : "text-slate-600"
                  )}
                >
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[10px] text-slate-600">
          {showNormal && (
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#128d2a]" />
              Flow Normal
            </span>
          )}

          {showAbnormal && (
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#cf2635]" />
              Flow Abnormal
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}