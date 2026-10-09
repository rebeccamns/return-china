"use client";

import { ChangeEvent, useState } from "react";
import { ArrowLeft, Camera, ScanLine } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { IQCMaterial, InspectionStatus } from "./iqc-types";

type Props = {
  material: IQCMaterial;
  onBack: () => void;
  onSave: (updatedMaterial: IQCMaterial) => void;
};

export default function MaterialInspectionForm({
  material,
  onBack,
  onSave,
}: Props) {
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
      setError("Please scan or enter the UPN barcode.");
      return;
    }

    if (upnBarcode.trim() !== material.code) {
      setError("The scanned UPN does not match this material code. Please check again.");
      return;
    }

    if (!photoName) {
      setError("Please take or upload the UPN photo.");
      return;
    }

    if (!status) {
      setError("Please select PASS / OK or REJECT.");
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

  return (
    <section className="w-full overflow-hidden rounded-xl border border-strokestroke-gray bg-backgroundbg-white">
      <div className="flex items-center justify-between gap-3 border-b border-strokestroke-gray px-4 py-3.5">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-3 text-left"
          aria-label="Back to material list"
        >
          <ArrowLeft className="h-5 w-5 text-text-colortext-dark" />
          <span className="text-[16px] font-semibold text-text-colortext-black">
            Material Inspection
          </span>
        </button>
        <span className="text-[12px] text-text-colortext-gray">Required fields *</span>
      </div>

      <div className="p-4">
        <div className="rounded-lg border border-strokestroke-gray bg-white p-3">
          <p className="text-[16px] font-semibold leading-[150%] text-text-colortext-black">
            {material.code}
          </p>
          <p className="mt-1 text-[14px] leading-[125%] text-text-colortext-gray">
            {material.englishName} {material.chinaName}
          </p>
          <p className="mt-2 text-[12px] text-text-colortext-gray">
            Quantity: {material.qty} pcs
          </p>
        </div>

        <div className="mt-5">
          <label htmlFor="iqc-upn-barcode" className="mb-2 block text-[14px] font-medium text-text-colortext-dark">
            Scan UPN Barcode <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              id="iqc-upn-barcode"
              value={upnBarcode}
              onChange={(event) => {
                setUpnBarcode(event.target.value);
                setError("");
              }}
              placeholder="Scan or type manually..."
              className="h-[48px] rounded-md border-strokestroke-gray px-3 pr-11 text-[14px]"
            />
            <ScanLine className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-colortext-gray" />
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-[14px] font-medium text-text-colortext-dark">
            UPN Photo <span className="text-red-500">*</span>
          </label>
          <label className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#b8d9c5] bg-[#f5fbf7] p-4 text-center transition-colors hover:bg-[#edf8f1]">
            {photoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoPreview} alt="UPN photo preview" className="mb-3 max-h-36 rounded object-contain" />
            ) : (
              <Camera className="mb-2 h-7 w-7 text-primaryprimary-green" strokeWidth={1.8} />
            )}
            <span className="text-[14px] font-medium text-text-colortext-dark">
              {photoName || "Take or Upload Photo"}
            </span>
            <span className="mt-1 text-[12px] text-text-colortext-gray">
              Tap to open your camera or gallery
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

        <fieldset className="mt-5">
          <legend className="mb-3 text-[14px] font-medium text-text-colortext-dark">
            Status Item <span className="text-red-500">*</span>
          </legend>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              aria-pressed={status === "REJECT"}
              onClick={() => {
                setStatus("REJECT");
                setError("");
              }}
              className={`h-11 rounded-md border text-[14px] font-semibold ${
                status === "REJECT"
                  ? "border-red-600 bg-red-50 text-red-700"
                  : "border-red-200 bg-white text-red-600"
              }`}
            >
              {status === "REJECT" ? "✓ REJECT" : "REJECT"}
            </button>
            <button
              type="button"
              aria-pressed={status === "PASS"}
              onClick={() => {
                setStatus("PASS");
                setError("");
              }}
              className={`h-11 rounded-md border text-[14px] font-semibold ${
                status === "PASS"
                  ? "border-primaryprimary-green bg-[#E7F5EC] text-[#006B3C]"
                  : "border-[#b7ddc5] bg-white text-[#006B3C]"
              }`}
            >
              {status === "PASS" ? "✓ PASS / OK" : "PASS / OK"}
            </button>
          </div>
        </fieldset>

        <div className="mt-5">
          <label htmlFor="iqc-notes" className="mb-2 block text-[14px] font-medium text-text-colortext-dark">
            Notes <span className="text-[12px] font-normal text-text-colortext-gray">(Optional)</span>
          </label>
          <textarea
            id="iqc-notes"
            rows={3}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Enter inspection notes..."
            className="w-full resize-y rounded-md border border-strokestroke-gray px-3 py-3 text-[14px] outline-none focus:border-primaryprimary-green"
          />
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-md bg-red-50 p-3 text-[13px] text-red-700">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleSave}
          className="mt-6 h-11 w-full rounded-md bg-[linear-gradient(0deg,rgba(11,89,52,1)_0%,rgba(5,131,70,1)_100%)] text-[14px] font-semibold text-white shadow-none hover:opacity-90"
        >
          Save Inspection
        </button>
      </div>
    </section>
  );
}
