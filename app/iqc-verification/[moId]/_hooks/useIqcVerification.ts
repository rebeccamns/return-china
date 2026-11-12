"use client";

import { useState } from "react";

import { DEMO } from "@/lib/demo-data";

import { INITIAL_CARTONS } from "../../_lib/initial-cartons";
import type { VerificationCarton } from "../_components/verification-types";

export function useIqcVerification() {
  const [cartons, setCartons] = useState<VerificationCarton[]>(() =>
    INITIAL_CARTONS.map((carton) => ({
      ...carton,
      materials: carton.materials.map((material) => ({ ...material })),
    })),
  );
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
