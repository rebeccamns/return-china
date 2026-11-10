import { DEMO } from "@/lib/demo-data";

export const MATERIAL_CODE_OPTIONS = [
  {
    code: DEMO.materialCodes.batteryCover,
    englishName: "Battery cover Lychee F4",
    chinaName: "电池盖组件 AC175 绿",
  },
  {
    code: DEMO.materialCodes.displayPanel,
    englishName: "Display Panel Lychee F4",
    chinaName: "显示屏面板",
  },
  {
    code: DEMO.materialCodes.cameraModule,
    englishName: "Camera Module Lychee F4",
    chinaName: "相机模组",
  },
] as const;

export function getMaterialCodeOption(code: string) {
  return MATERIAL_CODE_OPTIONS.find((item) => item.code === code);
}
