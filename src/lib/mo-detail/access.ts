import { STAGE_KEYS, type Role, type StageKey } from "./types";

export const STAGE_VISIBILITY: Record<Role, StageKey[]> = {
  pmc: [...STAGE_KEYS],
  iqc: [...STAGE_KEYS],
  staff: [...STAGE_KEYS],
  exim: [...STAGE_KEYS],
};

function isRole(role: string): role is Role {
  return Object.prototype.hasOwnProperty.call(STAGE_VISIBILITY, role);
}

export function canViewStageDetail(role: string, stageKey: StageKey): boolean {
  if (!isRole(role)) return false;
  return STAGE_VISIBILITY[role].includes(stageKey);
}

export const HISTORY_BASE_PATH: Record<Role, string> = {
  pmc: "/operational/history",
  iqc: "/iqc-history",
  staff: "/staff-return-history",
  exim: "/exim/history",
};
