import { DEMO } from "@/lib/demo-data";

import type {
  VerificationCarton,
  VerificationMaterial,
} from "../[moId]/_components/verification-types";

const createMaterial = (
  id: string,
  code: string,
  englishName: string,
  chinaName: string,
): VerificationMaterial => ({
  id,
  code,
  englishName,
  chinaName,
  scannedUpn: "",
});

export const INITIAL_CARTONS: VerificationCarton[] = [
  {
    id: "carton-1",
    code: "CT0001",
    scannedSticker: "",
    verified: false,
    materials: [
      createMaterial(
        "1-1",
        DEMO.materialCodes.cameraModule,
        "Camera Module Lychee F4",
        "相机模组",
      ),
      createMaterial(
        "1-2",
        DEMO.materialCodes.batteryCover,
        "Battery cover Lychee F4",
        "电池盖组件 AC175 绿",
      ),
      createMaterial(
        "1-3",
        DEMO.materialCodes.batteryCover,
        "Battery cover Lychee F4",
        "电池盖组件 AC175 绿",
      ),
    ],
  },
  {
    id: "carton-2",
    code: "CT0002",
    scannedSticker: "",
    verified: false,
    materials: [
      createMaterial(
        "2-1",
        DEMO.materialCodes.cameraModule,
        "Camera Module Lychee F4",
        "相机模组",
      ),
      createMaterial(
        "2-2",
        DEMO.materialCodes.displayPanel,
        "Display Panel Lychee F4",
        "显示屏面板",
      ),
    ],
  },
  {
    id: "carton-3",
    code: "CT0003",
    scannedSticker: "",
    verified: false,
    materials: [
      createMaterial(
        "3-1",
        DEMO.materialCodes.batteryCover,
        "Battery cover Lychee F4",
        "电池盖组件 AC175 绿",
      ),
      createMaterial(
        "3-2",
        DEMO.materialCodes.displayPanel,
        "Display Panel Lychee F4",
        "显示屏面板",
      ),
      createMaterial(
        "3-3",
        DEMO.materialCodes.batteryCover,
        "Battery cover Lychee F4",
        "电池盖组件 AC175 绿",
      ),
    ],
  },
];
