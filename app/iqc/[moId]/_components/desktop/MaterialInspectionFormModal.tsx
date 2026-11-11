"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { Check, ScanLine, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useI18n } from "@/i18n";

import {
  validateInspection,
  type InspectionDraft,
  type InspectionValidationError,
} from "../../_lib/iqc-validation";
import type { IQCMaterial } from "../iqc-types";

type Props = {
  material: IQCMaterial;
  readOnly?: boolean;
  onClose: () => void;
  onSave: (material: IQCMaterial) => void;
};

export default function MaterialInspectionFormModal({
  material,
  readOnly = false,
  onClose,
  onSave,
}: Props) {
  const { t } = useI18n();
  const [draft, setDraft] = useState<InspectionDraft & { notes: string }>({
    upnBarcode: material.upnBarcode,
    photoName: material.photoName,
    status: material.status,
    notes: material.notes,
  });
  const [photoPreview, setPhotoPreview] = useState("");
  const [error, setError] = useState<InspectionValidationError | null>(null);

  useEffect(() => {
    if (!photoPreview) return;
    return () => URL.revokeObjectURL(photoPreview);
  }, [photoPreview]);

  function updateDraft(changes: Partial<typeof draft>) {
    setDraft((current) => ({ ...current, ...changes }));
    setError(null);
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    updateDraft({ photoName: file.name });
    setPhotoPreview(URL.createObjectURL(file));
    event.target.value = "";
  }

  function handleSave() {
    const validationError = validateInspection(material, draft);

    if (validationError) {
      setError(validationError);
      return;
    }

    const updatedDraft = {
      ...draft,
      upnBarcode: draft.upnBarcode.trim(),
      notes: draft.notes.trim(),
    };

    onSave({ ...material, ...updatedDraft });
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      className="max-h-[calc(100vh-2rem)] max-w-[640px] overflow-y-auto rounded-lg border border-strokestroke-gray px-5 pb-5 pt-9 sm:px-6"
    >
      <div className="mb-4 border-b border-strokestroke-gray pb-3">
        <p className="text-xs font-medium uppercase tracking-wide text-[#8F8F8E]">
          {t("iqc.form.title")}
        </p>
        <h2 className="mt-1 text-lg font-semibold text-[#111111]">
          {material.code}
        </h2>
        <p className="mt-1 text-sm text-[#5F5F5E]">
          {material.englishName} · {material.chinaName}
        </p>
        <p className="mt-1 text-xs text-[#8F8F8E]">
          {t("iqc.form.quantity", { qty: material.qty })}
        </p>
      </div>



      <div className="space-y-3">
        <div>
          <label
            htmlFor="iqc-modal-upn"
            className="mb-1 block text-xs font-medium text-[#5F5F5E]"
          >
            {t("common.scanUpnBarcode")}{" "}
            {!readOnly && <span className="text-red-500">*</span>}
          </label>
          <div className="flex min-w-0 gap-2">
            <Input
              id="iqc-modal-upn"
              value={draft.upnBarcode}
              placeholder={t("common.scanOrTypePlaceholder")}
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              disabled={readOnly}
              onChange={(event) =>
                updateDraft({ upnBarcode: event.target.value })
              }
              className="h-9 min-w-0 flex-1 border-strokestroke-gray text-sm"
            />
            <button
              type="button"
              disabled={readOnly}
              aria-label={`${t("iqc.form.scanButton")} ${t("common.scanUpnBarcode")} ${material.code}`}
              title={t("iqc.form.scanButton")}
              className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md border border-strokestroke-gray bg-white px-3 text-sm font-medium text-[#006B3C] transition-colors hover:bg-[#F5FBF7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008348]"
            >
              <ScanLine className="h-4 w-4" />
              {t("iqc.form.scanButton")}
            </button>
          </div>
        </div>

        <div>
          <span className="mb-1 block text-xs font-medium text-[#5F5F5E]">
            {t("common.upnPhoto")}{" "}
            {!readOnly && <span className="text-red-500">*</span>}
          </span>
          <label
            className={`flex min-h-[56px] items-center gap-3 rounded-lg border-2 border-dashed border-[#B7D9C5] bg-[#F5FBF7] px-3 py-2 ${
              readOnly
                ? ""
                : "cursor-pointer transition-colors hover:border-[#008348] hover:bg-[#EDF8F1]"
            }`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white text-[#006B3C]">
              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoPreview}
                  alt={t("iqc.form.photoPreviewAlt")}
                  className="h-full w-full object-cover"
                />
              ) : draft.photoName ? (
                <Check className="h-5 w-5" strokeWidth={2.5} />
              ) : (
                <Upload className="h-5 w-5" />
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-[#006B3C]">
                {draft.photoName || t("common.takeOrUploadPhoto")}
              </span>
              <span className="mt-0.5 block text-xs text-[#5F5F5E]">
                {t("iqc.form.upnPhotoHint")}
              </span>
            </span>
            <input
              type="file"
              accept="image/*"
              aria-label={t("common.upnPhoto")}
              disabled={readOnly}
              onChange={handlePhotoChange}
              className="sr-only"
            />
          </label>
        </div>

        <fieldset>
          <legend className="mb-1 text-xs font-medium text-[#5F5F5E]">
            {t("common.status")}{" "}
            {!readOnly && <span className="text-red-500">*</span>}
          </legend>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={readOnly}
              aria-pressed={draft.status === "PASS"}
              onClick={() => updateDraft({ status: "PASS" })}
              className={`flex h-9 items-center justify-center gap-2 rounded-md border text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008348] ${
                draft.status === "PASS"
                  ? "border-[#B7DEC4] bg-[#E7F5EC] text-[#006B3C]"
                  : "border-strokestroke-gray bg-white text-[#5F5F5E] hover:bg-slate-50"
              }`}
            >
              <Check className="h-4 w-4" />
              {t("status.pass")}
            </button>
            <button
              type="button"
              disabled={readOnly}
              aria-pressed={draft.status === "REJECT"}
              onClick={() => updateDraft({ status: "REJECT" })}
              className={`flex h-9 items-center justify-center gap-2 rounded-md border text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 ${
                draft.status === "REJECT"
                  ? "border-red-200 bg-red-50 text-red-600"
                  : "border-strokestroke-gray bg-white text-[#5F5F5E] hover:bg-slate-50"
              }`}
            >
              <X className="h-4 w-4" />
              {t("status.reject")}
            </button>
          </div>
        </fieldset>

        <div>
          <label
            htmlFor="iqc-modal-notes"
            className="mb-1 block text-xs font-medium text-[#5F5F5E]"
          >
            {t("common.notes")}
          </label>
          <textarea
            id="iqc-modal-notes"
            value={draft.notes}
            placeholder={t("iqc.form.notesPlaceholder")}
            readOnly={readOnly}
            onChange={(event) => updateDraft({ notes: event.target.value })}
            className="min-h-[64px] w-full resize-y rounded-md border border-strokestroke-gray bg-white px-3 py-2 text-sm placeholder:text-[#A3A3A1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008348]"
          />
        </div>
      </div>

      {!readOnly && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-strokestroke-gray pt-3">
          {error ? (
            <p role="alert" className="text-xs leading-4 text-red-700">
              {t(error)}
            </p>
          ) : (
            <span />
          )}
          <Button
            type="button"
            variant={material.status ? "secondary" : "primary"}
            onClick={handleSave}
            className="h-9 gap-2 rounded-md px-5 text-sm font-semibold"
          >
            {material.status && <Check className="h-4 w-4" />}
            {material.status ? t("iqc.saved") : t("common.save")}
          </Button>
        </div>
      )}
    </Modal>
  );
}
