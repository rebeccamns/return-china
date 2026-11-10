export const DEMO = {
  moNumber: "T20260206",
  model: "Lychee F4",
  materialCodes: {
    batteryCover: "6200026",
    displayPanel: "6200027",
    cameraModule: "6200028",
  },
  projectNumber: "CPH2026ID",
  projectCode: "9992026",
  workOrder: "BMMK---Y2026AB",
  upnCode: "2000A-2000B-6000C",
  eximModelDimension: "无型号",
} as const;

export function demoMoNumber(index = 0): string {
  return `T202602${String(6 + index).padStart(2, "0")}`;
}

export function resolveDemoMoNumber(value?: string): string {
  if (!value) return DEMO.moNumber;

  const match = /^T202602(\d{2})$/.exec(value);
  if (!match) return DEMO.moNumber;

  const suffix = Number(match[1]);
  return suffix >= 6 && suffix <= 30 ? value : DEMO.moNumber;
}

export function demoMaterialCode(index = 0): string {
  return String(6200026 + index);
}
