import { demoMaterialCode, demoMoNumber } from "@/lib/demo-data";

export type EximMaterial = {
  id: string;
  code: string; // PMC Entry
  englishName: string; // PMC Entry
  chinaName: string; // PMC Entry
  qty: number; // PMC Entry
  singleNet: number; // grams per piece, Staff Return
  netWeight: number; // kg, calculated in Staff Return
  grossWeight: number; // kg, Staff Return
  volume: string; // "L×W×H" in mm, Staff Return
  frontPhoto: string; // Staff Return uploads
  backPhoto: string;
  upnPhoto: string;
};

// What Exim fills in
export type EximRow = EximMaterial & { model: string; brand: string };

export type EximMo = {
  code: string;
  materials: EximMaterial[];
};

// TODO: replace with the real photo URLs saved by Staff Return
const PLACEHOLDER_PHOTO = "/ollie.png";

function makeMaterials(prefix: string, count: number): EximMaterial[] {
  return Array.from({ length: count }, (_, i) => {
    const qty = 8 + (i % 3) * 2;
    const singleNet = 67.5;

    return {
      id: `${prefix}-${i + 1}`,
      code: demoMaterialCode(i),
      englishName: "Screen and upper cover assembly AA641 Deep purple",
      chinaName: "屏与上盖组件 AA641 深紫色",
      qty,
      singleNet,
      netWeight: Number(((qty * singleNet) / 1000).toFixed(3)),
      grossWeight: 3.421,
      volume: "500×420×290",
      frontPhoto: PLACEHOLDER_PHOTO,
      backPhoto: PLACEHOLDER_PHOTO,
      upnPhoto: PLACEHOLDER_PHOTO,
    };
  });
}

// TODO: replace with MOs that Staff Return has submitted (from your API)
export const pendingMos: EximMo[] = [
  { code: demoMoNumber(0), materials: makeMaterials("a", 11) },
  { code: demoMoNumber(1), materials: makeMaterials("b", 5) },
  { code: demoMoNumber(2), materials: makeMaterials("c", 3) },
];