export type VerificationStep = "landing" | "carton-list" | "carton-detail";
export type DetailStep = "materials" | "carton-sticker";

export type VerificationMaterial = {
  id: string;
  code: string;
  englishName: string;
  chinaName: string;
  /** Barcode captured by the scan. Empty string = not scanned yet. */
  scannedUpn: string;
};

export type VerificationCarton = {
  id: string;
  code: string;
  materials: VerificationMaterial[];
  /** Carton sticker captured by the scan. Empty string = not scanned yet. */
  scannedSticker: string;
  verified: boolean;
};

export type ScanTarget =
  | { kind: "material"; materialId: string }
  | { kind: "carton-sticker" };

export function isMaterialScanned(material: VerificationMaterial) {
  return material.scannedUpn !== "";
}

export function scannedCount(carton: VerificationCarton) {
  return carton.materials.filter(isMaterialScanned).length;
}

export function allMaterialsScanned(carton: VerificationCarton) {
  return carton.materials.length > 0 && scannedCount(carton) === carton.materials.length;
}
