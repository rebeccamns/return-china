import type { DashboardData, Mode } from "./types";

type Cell = string | number;

const escape = (cell: Cell) => {
  const text = String(cell);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export function exportDashboardCsv(
  data: DashboardData,
  meta: { mode: Mode; periodLabel: string; compareLabel: string },
) {
  const { kpis } = data;

  const rows: Cell[][] = [
    ["Superadmin dashboard"],
    ["View", meta.mode],
    ["Period", meta.periodLabel],
    [],
    ["KPI", "Value", "Change (%)", "Compared with"],
    ["Total shipments", kpis.total, kpis.totalDelta, meta.compareLabel],
    ["Completed shipments", kpis.completed, kpis.completedDelta, meta.compareLabel],
    ["Rejected shipments", kpis.rejected, kpis.rejectedDelta, meta.compareLabel],
    ["Avg lead time (days)", kpis.leadTimeDays, kpis.leadTimeDelta, meta.compareLabel],
    [],
    ["Rejection rate"],
    ["Period", "Rate (%)", "Rejected", "Shipments", "Most rejections", "Rejected there"],
    ...data.trend.map((p) => [
      p.tooltipLabel,
      p.rate,
      p.rejected,
      p.shipments,
      p.topStage || "-",
      p.topStageCount,
    ]),
    [],
    ["SLT performance by flow"],
    ["Flow", "MOs", "Over SLT (%)", "Within SLT (h)", "Over SLT (h)"],
    ...data.flows.map((f) => [f.stage, f.mos, f.overPct, f.sltHours, f.overHours]),
  ];

  const csv = rows.map((row) => row.map(escape).join(",")).join("\r\n");
  // BOM so Excel opens it as UTF-8
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `dashboard-${meta.mode}-${meta.periodLabel
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}