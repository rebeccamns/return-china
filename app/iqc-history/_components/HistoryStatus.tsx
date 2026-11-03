import { CheckCircle2, Circle, Clock3, XCircle } from "lucide-react";

import type { MOStatus, StageStatus } from "@/lib/mo-detail/types";

type Props = {
  status: MOStatus | StageStatus;
  label: string;
};

export default function HistoryStatus({ status, label }: Props) {
  const completed = status === "Completed" || status === "completed";
  const rejected = status === "Rejected" || status === "rejected";
  const inProgress = status === "In Progress" || status === "in-progress";
  const Icon = completed
    ? CheckCircle2
    : rejected
      ? XCircle
      : inProgress
        ? Clock3
        : Circle;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold leading-4 ${
        completed
          ? "bg-[#E7F5EC] text-[#006B3C]"
          : rejected
            ? "bg-red-50 text-red-600"
            : inProgress
              ? "bg-amber-50 text-amber-700"
              : "bg-slate-100 text-text-colortext-gray"
      }`}
    >
      <Icon aria-hidden="true" className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
