"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { useI18n } from "@/i18n";

import {
  validateInspection,
  type InspectionDraft,
  type InspectionValidationError,
} from "../../_lib/iqc-validation";
import type { IQCMaterial } from "../iqc-types";

type Props = {
  material: IQCMaterial;
  index: number;
  onSave: (material: IQCMaterial) => void;
};

const inputClass =
  "h-9 w-[200px] rounded-md border-strokestroke-gray px-3 text-xs placeholder:text-[#A3A3A1]";

export default function MaterialInspectionRow({
  material,
  index,
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

    setDraft(updatedDraft);
    onSave({ ...material, ...updatedDraft });
  }

  return (
    <>
      <TableRow className="h-[53px] hover:bg-[#FAFAFA]">
        <TableCell className="px-3 py-2 text-xs text-[#111111]">
          {index + 1}
        </TableCell>

        <TableCell className="px-3 py-2 text-xs font-medium text-[#111111]">
          {material.code}
        </TableCell>

        <TableCell className="max-w-[260px] px-3 py-2 text-xs text-[#111111]">
          <span className="block truncate" title={material.englishName}>
            {material.englishName}
          </span>
          <span
            className="mt-0.5 block truncate text-slate-500"
            title={material.chinaName}
          >
            {material.chinaName}
          </span>
        </TableCell>

        <TableCell className="whitespace-nowrap px-3 py-2 text-xs text-[#111111]">
          {material.qty} {t("common.units.pcs")}
        </TableCell>

        <TableCell className="px-3 py-2">
          <Input
            value={draft.upnBarcode}
            placeholder={t("common.scanOrTypePlaceholder")}
            aria-label={`${t("common.scanUpnBarcode")} ${material.code}`}
            onChange={(event) =>
              updateDraft({ upnBarcode: event.target.value })
            }
            className={inputClass}
          />
        </TableCell>

        <TableCell className="px-3 py-2">
          <div className="flex w-[200px] items-center gap-2">
            {photoPreview && (
              <img
                src={photoPreview}
                alt={t("iqc.form.photoPreviewAlt")}
                className="h-8 w-8 shrink-0 rounded object-cover"
              />
            )}
            <label className="flex h-9 min-w-0 flex-1 cursor-pointer items-center rounded-md border border-strokestroke-gray bg-white px-3 text-xs text-[#111111] hover:bg-slate-50">
              <Input
                type="file"
                accept="image/*"
                aria-label={t("common.upnPhoto")}
                onChange={handlePhotoChange}
                className="sr-only"
              />
              <span className="truncate">
                {draft.photoName || t("common.takeOrUploadPhoto")}
              </span>
            </label>
          </div>
        </TableCell>

        <TableCell className="px-3 py-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-pressed={draft.status === "PASS"}
              onClick={() => updateDraft({ status: "PASS" })}
              className={`h-8 rounded-md border px-2 text-xs font-semibold transition-colors ${
                draft.status === "PASS"
                  ? "border-[#B7DEC4] bg-[#E7F5EC] text-[#006B3C]"
                  : "border-strokestroke-gray bg-white text-[#5F5F5E] hover:bg-slate-50"
              }`}
            >
              {t("status.passOk")}
            </button>
            <button
              type="button"
              aria-pressed={draft.status === "REJECT"}
              onClick={() => updateDraft({ status: "REJECT" })}
              className={`h-8 rounded-md border px-2 text-xs font-semibold transition-colors ${
                draft.status === "REJECT"
                  ? "border-red-200 bg-red-50 text-red-600"
                  : "border-strokestroke-gray bg-white text-[#5F5F5E] hover:bg-slate-50"
              }`}
            >
              {t("status.reject")}
            </button>
          </div>
        </TableCell>

        <TableCell className="px-3 py-2">
          <Input
            value={draft.notes}
            placeholder={t("iqc.form.notesPlaceholder")}
            aria-label={`${t("common.notes")} ${material.code}`}
            onChange={(event) => updateDraft({ notes: event.target.value })}
            className={inputClass}
          />
        </TableCell>

        <TableCell className="px-3 py-2">
          <Button
            type="button"
            variant={material.status ? "secondary" : "primary"}
            size="lg"
            onClick={handleSave}
            className="h-9 gap-2 rounded-md px-3 text-xs font-semibold"
          >
            {material.status && <Check className="h-4 w-4" />}
            {material.status ? t("iqc.saved") : t("common.save")}
          </Button>
        </TableCell>
      </TableRow>

      {error && (
        <TableRow className="hover:bg-white">
          <TableCell colSpan={9} className="border-0 px-3 py-0 pb-2">
            <p className="text-xs leading-4 text-red-700">{t(error)}</p>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
