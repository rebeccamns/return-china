"use client";

import { useState } from "react";

import { DEMO } from "@/lib/demo-data";

import type {
  VerificationCarton,
  VerificationMaterial,
} from "../_components/verification-types";

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

const INITIAL_CARTONS: VerificationCarton[] = [
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

export function useIqcVerification() {
  const [cartons, setCartons] = useState<VerificationCarton[]>(INITIAL_CARTONS);
  const [submitted, setSubmitted] = useState(false);

  const verifiedCount = cartons.filter((carton) => carton.verified).length;
  const progressPercent =
    cartons.length > 0
      ? Math.round((verifiedCount / cartons.length) * 100)
      : 0;
  const allVerified = cartons.length > 0 && verifiedCount === cartons.length;

  function scanMaterial(cartonId: string, materialId: string) {
    setCartons((current) =>
      current.map((carton) =>
        carton.id === cartonId
          ? {
              ...carton,
              verified: false,
              materials: carton.materials.map((material) =>
                material.id === materialId
                  ? { ...material, scannedUpn: DEMO.upnCode }
                  : material,
              ),
            }
          : carton,
      ),
    );
  }

  function scanSticker(cartonId: string) {
    setCartons((current) =>
      current.map((carton) =>
        carton.id === cartonId
          ? { ...carton, scannedSticker: carton.code }
          : carton,
      ),
    );
  }

  function completeCarton(cartonId: string) {
    setCartons((current) =>
      current.map((carton) =>
        carton.id === cartonId ? { ...carton, verified: true } : carton,
      ),
    );
  }

  function submit() {
    setSubmitted(true);
  }

  return {
    cartons,
    verifiedCount,
    progressPercent,
    allVerified,
    submitted,
    scanMaterial,
    scanSticker,
    completeCarton,
    submit,
  };
}

export type UseIqcVerificationReturn = ReturnType<typeof useIqcVerification>;
