"use client";

import { useState } from "react";

import { DEMO, resolveDemoMoNumber } from "@/lib/demo-data";

import type { IQCMaterial } from "../_components/iqc-types";

const INITIAL_MATERIALS: IQCMaterial[] = [
  {
    id: "1",
    code: DEMO.materialCodes.cameraModule,
    englishName: "Camera Module Lychee F4",
    chinaName: "相机模组",
    qty: 10,
    upnBarcode: DEMO.upnCode,
    status: null,
    notes: "",
    photoName: "",
  },
  {
    id: "2",
    code: DEMO.materialCodes.batteryCover,
    englishName: "Battery cover Lychee F4",
    chinaName: "电池盖组件 AC175 绿",
    qty: 10,
    upnBarcode: DEMO.upnCode,
    status: null,
    notes: "",
    photoName: "",
  },
  {
    id: "3",
    code: DEMO.materialCodes.batteryCover,
    englishName: "Battery cover Lychee F4",
    chinaName: "电池盖组件 AC175 绿",
    qty: 10,
    upnBarcode: DEMO.upnCode,
    status: null,
    notes: "",
    photoName: "",
  },
  {
    id: "4",
    code: DEMO.materialCodes.batteryCover,
    englishName: "Battery cover Lychee F4",
    chinaName: "电池盖组件 AC175 绿",
    qty: 10,
    upnBarcode: DEMO.upnCode,
    status: null,
    notes: "",
    photoName: "",
  },
  {
    id: "5",
    code: DEMO.materialCodes.batteryCover,
    englishName: "Battery cover Lychee F4",
    chinaName: "电池盖组件 AC175 绿",
    qty: 10,
    upnBarcode: DEMO.upnCode,
    status: null,
    notes: "",
    photoName: "",
  },
  {
    id: "6",
    code: DEMO.materialCodes.batteryCover,
    englishName: "Battery cover Lychee F4",
    chinaName: "电池盖组件 AC175 绿",
    qty: 10,
    upnBarcode: DEMO.upnCode,
    status: null,
    notes: "",
    photoName: "",
  },
];

export function useIqcIdentity(moId: string) {
  const [materials, setMaterials] = useState<IQCMaterial[]>(INITIAL_MATERIALS);
  const [submitted, setSubmitted] = useState(false);

  const moData = {
    moNumber: resolveDemoMoNumber(moId),
    submittedAt: "2026-09-02 09:05",
    returnId: "RC-20260831-002",
    model: DEMO.model,
    totalMaterials: materials.length,
  };

  const inspectedCount = materials.filter(
    (material) => material.status !== null,
  ).length;
  const progressPercent =
    moData.totalMaterials > 0
      ? Math.round((inspectedCount / moData.totalMaterials) * 100)
      : 0;
  const allInspected =
    moData.totalMaterials > 0 && inspectedCount === moData.totalMaterials;

  function saveMaterial(updated: IQCMaterial) {
    setMaterials((current) =>
      current.map((material) =>
        material.id === updated.id ? updated : material,
      ),
    );
  }

  function submit() {
    setSubmitted(true);
  }

  return {
    materials,
    moData,
    inspectedCount,
    progressPercent,
    allInspected,
    submitted,
    saveMaterial,
    submit,
  };
}

export type UseIqcIdentityReturn = ReturnType<typeof useIqcIdentity>;
