export const MATERIAL_CODE_OPTIONS = [
  {
    code: "621032000320",
    englishName: "Battery cover AC175",
    chinaName: "电池盖组件 AC175 绿",
  },
  {
    code: "621032000321",
    englishName: "Display Panel",
    chinaName: "显示屏面板",
  },
  {
    code: "621032000322",
    englishName: "Camera Module",
    chinaName: "相机模组",
  },
] as const;

export function getMaterialCodeOption(code: string) {
  return MATERIAL_CODE_OPTIONS.find((item) => item.code === code);
}
