import type { MoSummary, MOStatus } from "@/lib/mo-detail/types";
import { getMoWorkOrder } from "@/lib/mo-detail/data";

export type IqcMoStatusFilter = "All" | MOStatus;

export function filterIqcMoSummaries(
  summaries: MoSummary[],
  search: string,
  statusFilter: IqcMoStatusFilter,
) {
  const query = search.trim().toLowerCase();

  return summaries.filter((summary) => {
    if (
      statusFilter !== "All" &&
      summary.overallStatus !== statusFilter
    ) {
      return false;
    }

    if (!query) return true;

    return `${summary.moCode} ${summary.model} ${summary.returnId} ${getMoWorkOrder(summary.moCode) ?? ""}`
      .toLowerCase()
      .includes(query);
  });
}
