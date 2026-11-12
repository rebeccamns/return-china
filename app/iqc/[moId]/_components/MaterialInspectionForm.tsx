"use client";

import { ChangeEvent, useState } from "react";
import { Camera, Check, ScanLine } from "lucide-react";

import BackTitle from "@/components/layout/BackTitle";
import StickyActionBar, {
  primaryButton,
} from "@/components/layout/StickyActionBar";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/i18n";

import type { IQCMaterial, InspectionStatus } from "./iqc-types";
import MoCompactCard from "@/components/iqc/MoCompactCard";
import { validateInspection } from "../_lib/iqc-validation";
import MaterialInspectionStatusButtons from "./mobile/MaterialInspectionStatusButtons";

type Props = {
  material: IQCMaterial;
  moNumber: string;
  model: string;
  returnId: string;
  readOnly?: boolean;
  onBack: () => void;
  onSave: (updatedMaterial: IQCMaterial) => void;
};

const labelClass =
  "mb-2 max-md:mb-1.5 block text-[12px] max-md:text-caption font-medium leading-4 text-text-colortext-gray";

export default function MaterialInspectionForm({
  material,
  moNumber,
  model,
  returnId,
  readOnly = false,
  onBack,
  onSave,
}: Props) {
  const { t } = useI18n();

  const [upnBarcode, setUpnBarcode] = useState(material.upnBarcode);
  const [photoName, setPhotoName] = useState(material.photoName);
  const [photoPreview, setPhotoPreview] = useState("");
  const [status, setStatus] = useState<InspectionStatus>(material.status);
  const [notes, setNotes] = useState(material.notes);
  const [error, setError] = useState("");

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setPhotoName(file.name);
    setPhotoPreview(URL.createObjectURL(file));
    setError("");
  }

  function handleSave() {
    const validationError = validateInspection(material, {
      upnBarcode,
      photoName,
      status,
    });

    if (validationError) {
      setError(t(validationError));
      return;
    }

    onSave({
      ...material,
      upnBarcode: upnBarcode.trim(),
      photoName,
      status,
      notes: notes.trim(),
    });
  }

  const hasPhoto = Boolean(photoName);

  return (
    <div>
      <BackTitle
        title={material.code}
        titleExtra={
          <span className="ml-1 truncate text-[13px] max-md:text-secondary font-normal leading-[18px] text-text-colortext-gray">
            {material.englishName} {material.chinaName}
          </span>
        }
        onBack={onBack}
        backLabel={t("iqc.form.backToList")}
      />

      <div className="mt-3">
        <MoCompactCard moNumber={moNumber} model={model} returnId={returnId} />
      </div>

      <section className="mt-4 max-md:mt-3 rounded-2xl border border-strokestroke-gray bg-backgroundbg-white p-4 max-md:p-3.5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[13px] max-md:text-secondary font-medium max-md:font-normal leading-[18px] text-text-colortext-black">
            {t("iqc.form.quantity", { qty: material.qty })}
          </p>
          <p className="text-[12px] max-md:text-caption leading-4 text-text-colortext-gray">
            {t(readOnly ? "common.submitted" : "iqc.form.requiredFields")}
          </p>
        </div>

        {/* UPN barcode */}
        <div className="mt-5 max-md:mt-3">
          <label htmlFor="iqc-upn-barcode" className={labelClass}>
            {t("common.scanUpnBarcode")}{" "}
            {!readOnly && <span className="text-red-500">*</span>}
          </label>

          <div className="relative">
            <Input
              id="iqc-upn-barcode"
              value={upnBarcode}
              disabled={readOnly}
              onChange={(event) => {
                setUpnBarcode(event.target.value);
                setError("");
              }}
              placeholder={t("common.scanOrTypePlaceholder")}
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              className="h-12 max-md:h-11 rounded-xl border-strokestroke-gray px-4 pr-12 text-[16px] max-md:text-field"
            />
            <ScanLine className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-colortext-gray dark:text-[#A7D7B9]" />
          </div>
        </div>

        {/* UPN photo */}
        <div className="mt-5 max-md:mt-3">
          <span className={labelClass}>
            {t("common.upnPhoto")}{" "}
            {!readOnly && <span className="text-red-500">*</span>}
          </span>

          <label
            className={`flex items-center gap-3 rounded-2xl p-3 max-md:p-2.5 ${
              readOnly ? "" : "cursor-pointer transition active:scale-[0.99]"
            } ${
              hasPhoto
                ? "border border-[#008348] bg-[#E7F5EC] dark:border-[#4F9B6F] dark:bg-backgroundbg-green"
                : "border-2 border-dashed border-[#b8d9c5] bg-[#f5fbf7] hover:bg-[#edf8f1] dark:border-[#4F9B6F] dark:bg-backgroundbg-bluish-gray dark:hover:bg-backgroundbg-black"
            }`}
          >
            <span className="flex h-14 w-14 max-md:h-12 max-md:w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-backgroundbg-white text-primaryprimary-green dark:text-[#A7D7B9]">
              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoPreview}
                  alt={t("iqc.form.photoPreviewAlt")}
                  className="h-full w-full object-cover"
                />
              ) : hasPhoto ? (
                <Check className="h-6 w-6" strokeWidth={2.5} />
              ) : (
                <Camera className="h-6 w-6" strokeWidth={1.8} />
              )}
            </span>

            <span className="min-w-0">
              <span className="block truncate text-[14px] max-md:text-body font-semibold leading-5 text-text-colortext-black">
                {photoName || t("common.takeOrUploadPhoto")}
              </span>
              <span className="mt-0.5 block text-[12px] max-md:text-caption leading-4 text-text-colortext-gray">
                {t("iqc.form.upnPhotoHint")}
              </span>
            </span>

            <input
              type="file"
              accept="image/*"
              capture="environment"
              disabled={readOnly}
              onChange={handlePhotoChange}
              className="sr-only"
            />
          </label>
        </div>

        <MaterialInspectionStatusButtons
          status={status}
          labelClass={labelClass}
          disabled={readOnly}
          onStatusChange={(nextStatus) => {
            setStatus(nextStatus);
            setError("");
          }}
        />

        {/* Notes */}
        <div className="mt-5 max-md:mt-3">
          <label htmlFor="iqc-notes" className={labelClass}>
            {t("iqc.form.notesLabel")}{" "}
            <span className="font-normal">{t("common.optional")}</span>
          </label>

          <textarea
            id="iqc-notes"
            rows={3}
            value={notes}
            readOnly={readOnly}
            onChange={(event) => setNotes(event.target.value)}
            placeholder={t("iqc.form.notesPlaceholder")}
            className="w-full resize-none rounded-xl border border-strokestroke-gray bg-backgroundbg-white px-4 py-3 text-[16px] max-md:text-field leading-6 text-text-colortext-black outline-none focus:border-primaryprimary-green"
          />
        </div>

        {error && (
          <p
            role="alert"
            className="mt-4 max-md:mt-3 rounded-xl bg-red-50 px-4 py-3 max-md:px-3.5 max-md:py-3.5 text-[13px] max-md:text-secondary leading-[18px] text-red-700 dark:bg-red-950 dark:text-red-200"
          >
            {error}
          </p>
        )}
      </section>

      {/* Sticky save (form flow hides the bottom nav) */}
      {!readOnly && (
        <StickyActionBar>
          <button
            type="button"
            onClick={handleSave}
            className={`${primaryButton} flex-1`}
          >
            {t("iqc.form.save")}
          </button>
        </StickyActionBar>
      )}
    </div>
  );
}