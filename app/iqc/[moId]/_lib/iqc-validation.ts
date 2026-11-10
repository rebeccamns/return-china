import type { TranslationKey } from "@/i18n/types";

import type { IQCMaterial } from "../_components/iqc-types";

export type InspectionDraft = Pick<
  IQCMaterial,
  "upnBarcode" | "photoName" | "status"
>;

export type InspectionValidationError = Extract<
  TranslationKey,
  | "iqc.form.errorUpnRequired"
  | "iqc.form.errorUpnMismatch"
  | "iqc.form.errorPhotoRequired"
  | "iqc.form.errorStatusRequired"
>;

export function validateInspection(
  material: Pick<IQCMaterial, "code">,
  draft: InspectionDraft,
): InspectionValidationError | null {
  if (!draft.upnBarcode.trim()) {
    return "iqc.form.errorUpnRequired";
  }

  if (draft.upnBarcode.trim() !== material.code) {
    return "iqc.form.errorUpnMismatch";
  }

  if (!draft.photoName) {
    return "iqc.form.errorPhotoRequired";
  }

  if (!draft.status) {
    return "iqc.form.errorStatusRequired";
  }

  return null;
}
