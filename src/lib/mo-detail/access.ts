import { STAGE_KEYS, type Role, type StageKey } from "./types";

export const STAGE_VISIBILITY: Record<Role, StageKey[]> = {
  pmc: [...STAGE_KEYS],
};

export function canViewStageDetail(role: string, stageKey: StageKey): boolean {
  if (role !== "pmc") return false;
  return STAGE_VISIBILITY.pmc.includes(stageKey);
}

export const HISTORY_BASE_PATH: Record<Role, string> = {
  pmc: "/operational/history",
};
