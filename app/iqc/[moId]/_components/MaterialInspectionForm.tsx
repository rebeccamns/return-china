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
import MoCompactCard from "./MoCompactCard";

type Props = {
  material: IQCMaterial;
  moNumber: string;
  model: string;
  returnId: string;
  onBack: () => void;
  onSave: (updatedMaterial: IQCMaterial) => void;
};

const labelClass =
  "mb-2 block text-[12px] font-medium leading-4 text-text-colortext-gray";

export default function MaterialInspectionForm({
  material,
  moNumber,
  model,
  returnId,
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
    if (!upnBarcode.trim()) {
      setError(t("iqc.form.errorUpnRequired"));
      return;
    }

    if (upnBarcode.trim() !== material.code) {
      setError(t("iqc.form.errorUpnMismatch"));
      return;
    }

    if (!photoName) {
      setError(t("iqc.form.errorPhotoRequired"));
      return;
    }

    if (!status) {
      setError(t("iqc.form.errorStatusRequired"));
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
        subtitle={`${material.englishName} ${material.chinaName}`}
        onBack={onBack}
        backLabel={t("iqc.form.backToList")}
      />

      <div className="mt-3">
        <MoCompactCard moNumber={moNumber} model={model} returnId={returnId} />
      </div>

      <section className="mt-4 rounded-2xl border border-strokestroke-gray bg-backgroundbg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[13px] font-medium leading-[18px] text-text-colortext-black">
            {t("iqc.form.quantity", { qty: material.qty })}
          </p>
          <p className="text-[12px] leading-4 text-text-colortext-gray">
            {t("iqc.form.requiredFields")}
          </p>
        </div>

        {/* UPN barcode */}
        <div className="mt-5">
          <label htmlFor="iqc-upn-barcode" className={labelClass}>
            {t("common.scanUpnBarcode")} <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <Input
              id="iqc-upn-barcode"
              value={upnBarcode}
              onChange={(event) => {
                setUpnBarcode(event.target.value);
                setError("");
              }}
              placeholder={t("common.scanOrTypePlaceholder")}
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              className="h-12 rounded-xl border-strokestroke-gray px-4 pr-12 text-[16px]"
            />
            <ScanLine className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-colortext-gray" />
          </div>
        </div>

        {/* UPN photo */}
        <div className="mt-5">
          <span className={labelClass}>
            {t("common.upnPhoto")} <span className="text-red-500">*</span>
          </span>

          <label
            className={`flex cursor-pointer items-center gap-3 rounded-2xl p-3 transition active:scale-[0.99] ${
              hasPhoto
                ? "border border-[#008348] bg-[#E7F5EC]"
                : "border-2 border-dashed border-[#b8d9c5] bg-[#f5fbf7] hover:bg-[#edf8f1]"
            }`}
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white text-primaryprimary-green">
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
              <span className="block truncate text-[14px] font-semibold leading-5 text-text-colortext-black">
                {photoName || t("common.takeOrUploadPhoto")}
              </span>
              <span className="mt-0.5 block text-[12px] leading-4 text-text-colortext-gray">
                {t("iqc.form.upnPhotoHint")}
              </span>
            </span>

            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoChange}
              className="sr-only"
            />
          </label>
        </div>

        {/* Status */}
        <fieldset className="mt-5">
          <legend className={labelClass}>
            {t("iqc.form.statusItem")} <span className="text-red-500">*</span>
          </legend>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              aria-pressed={status === "REJECT"}
              onClick={() => {
                setStatus("REJECT");
                setError("");
              }}
              className={`h-12 rounded-xl border text-[15px] font-semibold transition active:scale-[0.98] ${
                status === "REJECT"
                  ? "border-red-600 bg-red-50 text-red-700"
                  : "border-red-200 bg-white text-red-600"
              }`}
            >
              {status === "REJECT" ? `✓ ${t("status.reject")}` : t("status.reject")}
            </button>

            <button
              type="button"
              aria-pressed={status === "PASS"}
              onClick={() => {
                setStatus("PASS");
                setError("");
              }}
              className={`h-12 rounded-xl border text-[15px] font-semibold transition active:scale-[0.98] ${
                status === "PASS"
                  ? "border-primaryprimary-green bg-[#E7F5EC] text-[#006B3C]"
                  : "border-[#b7ddc5] bg-white text-[#006B3C]"
              }`}
            >
              {status === "PASS" ? `✓ ${t("status.passOk")}` : t("status.passOk")}
            </button>
          </div>
        </fieldset>

        {/* Notes */}
        <div className="mt-5">
          <label htmlFor="iqc-notes" className={labelClass}>
            {t("iqc.form.notesLabel")}{" "}
            <span className="font-normal">{t("common.optional")}</span>
          </label>

          <textarea
            id="iqc-notes"
            rows={3}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder={t("iqc.form.notesPlaceholder")}
            className="w-full resize-none rounded-xl border border-strokestroke-gray px-4 py-3 text-[16px] leading-6 outline-none focus:border-primaryprimary-green"
          />
        </div>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-[13px] leading-[18px] text-red-700"
          >
            {error}
          </p>
        )}
      </section>

      {/* Sticky save (form flow hides the bottom nav) */}
      <StickyActionBar>
        <button
          type="button"
          onClick={handleSave}
          className={`${primaryButton} flex-1`}
        >
          {t("iqc.form.save")}
        </button>
      </StickyActionBar>
    </div>
  );
}