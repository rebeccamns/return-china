"use client";

import { useState } from "react";
import { Camera, Check, ChevronLeft } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useI18n } from "@/i18n";

import StickyActionBar, { primaryButton } from "./StickyActionBar";
import MoSummaryCard from "./MoSummaryCard";
import {
  type Carton,
  type Material,
  type MaterialEntry,
  type PackedSummary,
  cartonRange,
} from "./types";

type MaterialDetailFormProps = {
  carton: Carton;
  material: Material;
  /** Pass when editing an existing entry. */
  initial?: MaterialEntry;
  /** What this material already has in OTHER cartons. */
  packedElsewhere?: PackedSummary[string];
  onBack: () => void;
  onSave: (entry: MaterialEntry) => void;
  onRemove?: () => void;
};

type DetailStep = "carton-details" | "upload-photos";

const DEFAULTS = {
  quantity: "10",
  singleNetWeight: "67.5",
  grossWeight: "3.455",
  length: "500",
  width: "420",
  height: "290",
};

const inputClass =
  "h-12 rounded-xl border-strokestroke-gray bg-backgroundbg-white px-4 text-[16px] text-text-colortext-black";

function toNumber(value: string) {
  const n = parseFloat(value.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

export default function MaterialDetailForm({
  carton,
  material,
  initial,
  packedElsewhere,
  onBack,
  onSave,
  onRemove,
}: MaterialDetailFormProps) {
  const { t } = useI18n();

  const [detailStep, setDetailStep] = useState<DetailStep>("carton-details");

  const [form, setForm] = useState(() =>
    initial
      ? {
          quantity: String(initial.quantity),
          singleNetWeight: String(initial.singleNetWeight),
          grossWeight: String(initial.grossWeight),
          length: String(initial.length),
          width: String(initial.width),
          height: String(initial.height),
        }
      : DEFAULTS,
  );

  const [photos, setPhotos] = useState(
    initial?.photos ?? { front: false, back: false, upn: false },
  );
  const [upnBarcode, setUpnBarcode] = useState(initial?.upnBarcode ?? "");

  const set = (key: keyof typeof DEFAULTS) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const quantity = Math.floor(toNumber(form.quantity));
  const cartonCount = carton.codes.length;
  const netWeightKg = ((quantity * toNumber(form.singleNetWeight)) / 1000).toFixed(3);

  function handleSave() {
    onSave({
      id: initial?.id ?? `${material.code}-${Date.now()}`,
      material,
      quantity,
      singleNetWeight: toNumber(form.singleNetWeight),
      grossWeight: toNumber(form.grossWeight),
      length: toNumber(form.length),
      width: toNumber(form.width),
      height: toNumber(form.height),
      upnBarcode: upnBarcode.trim(),
      photos,
    });
  }

  const isStep1 = detailStep === "carton-details";

  return (
    <div>
      {/* Header */}
      <h1 className="m-0 min-w-0">
        <button
          type="button"
          onClick={isStep1 ? onBack : () => setDetailStep("carton-details")}
          aria-label={`${t("common.back")} ${material.code}`}
          className="-ml-1 flex min-h-11 min-w-0 items-center gap-1 text-left"
        >
          <ChevronLeft
            className="h-6 w-6 shrink-0 text-primaryprimary-green"
            strokeWidth={2}
          />
          <span className="truncate text-[22px] font-semibold leading-7 tracking-[-0.01em] text-text-colortext-black">
            {material.code}
          </span>
        </button>
      </h1>

      <p className="mt-0.5 pl-7 text-[13px] leading-[18px] text-text-colortext-gray">
        {material.englishName} {material.chinaName}
      </p>

      {packedElsewhere && (
        <p className="mt-0.5 pl-7 text-[13px] font-medium leading-[18px] text-[#006B3C]">
          {t("staffReturn.packedSummary", {
            pieces: packedElsewhere.pieces,
            cartons: packedElsewhere.cartons,
          })}
        </p>
      )}

      <div className="mb-3 mt-2">
        <MoSummaryCard compact />
      </div>

      {/* Progress */}
      <div className="mt-5 flex gap-2" aria-hidden="true">
        <div className="h-1 flex-1 rounded-full bg-[#008348]" />
        <div
          className={`h-1 flex-1 rounded-full transition-colors ${
            isStep1 ? "bg-[#E6E6E6]" : "bg-[#008348]"
          }`}
        />
      </div>

      <div className="mt-5 rounded-2xl border border-strokestroke-gray bg-backgroundbg-white p-4">
        {isStep1 ? (
          <>
            <p className="text-[12px] font-medium leading-4 text-[#006B3C]">
              {t("staffReturn.step1")}
            </p>
            <h2 className="mt-1 text-[16px] font-semibold leading-6 text-text-colortext-black">
              {t("staffReturn.cartonDetails")}
            </h2>
            <p className="mt-1 text-[13px] leading-[18px] text-text-colortext-gray">
              {t("staffReturn.cartonDetailsHint")}
            </p>

            <div className="mt-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label={t("staffReturn.quantityOfCarton")}
                  value={form.quantity}
                  onChange={set("quantity")}
                  inputMode="numeric"
                />
                <Field
                  label={t("staffReturn.singleNetWeight")}
                  value={form.singleNetWeight}
                  onChange={set("singleNetWeight")}
                  suffix={t("common.units.gPerPcs")}
                />
              </div>

              {cartonCount > 1 && quantity > 0 && (
                <p className="-mt-2 rounded-xl bg-[#E7F5EC] px-4 py-3 text-[13px] leading-[18px] text-[#006B3C]">
                  {t("staffReturn.totalAcrossCartons", {
                    count: cartonCount,
                    total: quantity * cartonCount,
                  })}
                </p>
              )}

              <Field
                label={`${t("staffReturn.netWeight")} · ${t("common.calculated")}`}
                value={netWeightKg}
                readOnly
                suffix={t("common.units.kgBare")}
              />

              <Field
                label={t("staffReturn.grossWeight")}
                value={form.grossWeight}
                onChange={set("grossWeight")}
                suffix={t("common.units.kgBare")}
              />

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[12px] font-medium leading-4 text-text-colortext-gray">
                    {t("staffReturn.volume")}
                  </span>
                  <span className="text-[12px] font-medium leading-4 text-text-colortext-gray">
                    {t("common.units.mmBare")}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Input
                    value={form.length}
                    onChange={(e) => set("length")(e.target.value)}
                    inputMode="decimal"
                    aria-label={t("staffReturn.length")}
                    placeholder={t("staffReturn.length")}
                    className={inputClass}
                  />
                  <Input
                    value={form.width}
                    onChange={(e) => set("width")(e.target.value)}
                    inputMode="decimal"
                    aria-label={t("staffReturn.width")}
                    placeholder={t("staffReturn.width")}
                    className={inputClass}
                  />
                  <Input
                    value={form.height}
                    onChange={(e) => set("height")(e.target.value)}
                    inputMode="decimal"
                    aria-label={t("staffReturn.height")}
                    placeholder={t("staffReturn.height")}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="text-[12px] font-medium leading-4 text-[#006B3C]">
              {t("staffReturn.step2")}
            </p>
            <h2 className="mt-1 text-[16px] font-semibold leading-6 text-text-colortext-black">
              {t("staffReturn.uploadPhotos")}
            </h2>
            <p className="mt-1 text-[13px] leading-[18px] text-text-colortext-gray">
              {t("staffReturn.uploadPhotosHint")}
            </p>

            <div className="mt-5 flex flex-col gap-3">
              <PhotoUpload
                label={t("common.frontPhoto")}
                uploaded={photos.front}
                onUpload={() => setPhotos((p) => ({ ...p, front: true }))}
              />
              <PhotoUpload
                label={t("common.backPhoto")}
                uploaded={photos.back}
                onUpload={() => setPhotos((p) => ({ ...p, back: true }))}
              />
              <PhotoUpload
                label={t("common.upnPhoto")}
                uploaded={photos.upn}
                onUpload={() => setPhotos((p) => ({ ...p, upn: true }))}
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-[12px] font-medium leading-4 text-text-colortext-gray">
                {t("common.scanUpnBarcode")}{" "}
                <span className="text-red-500">*</span>
              </label>

              <Input
                value={upnBarcode}
                onChange={(e) => setUpnBarcode(e.target.value)}
                placeholder={t("common.scanOrTypePlaceholder")}
                autoCapitalize="characters"
                className={inputClass}
              />
            </div>

            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="mt-5 flex h-11 w-full items-center justify-center text-[15px] font-medium text-text-colortext-red"
              >
                {t("staffReturn.removeMaterial")}
              </button>
            )}
          </>
        )}
      </div>

      {/* Sticky action */}
      <StickyActionBar>
        {isStep1 ? (
          <button
            type="button"
            onClick={() => setDetailStep("upload-photos")}
            disabled={quantity <= 0}
            className={`${primaryButton} flex-1`}
          >
            {t("common.continue")}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSave}
            disabled={!upnBarcode.trim()}
            className={`${primaryButton} flex-1`}
          >
            {initial
              ? t("staffReturn.saveChanges")
              : t("staffReturn.addMaterial")}
          </button>
        )}
      </StickyActionBar>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  suffix,
  readOnly,
  inputMode = "decimal",
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  suffix?: string;
  readOnly?: boolean;
  inputMode?: "decimal" | "numeric";
}) {
  return (
    <div>
      <label className="mb-2 block text-[12px] font-medium leading-4 text-text-colortext-gray">
        {label}
      </label>

      <div className="relative">
        <Input
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange?.(e.target.value)}
          inputMode={inputMode}
          className={`${inputClass} ${suffix ? "pr-16" : ""} ${
            readOnly ? "bg-slate-50 text-text-colortext-gray" : ""
          }`}
        />

        {suffix && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-medium leading-4 text-text-colortext-gray">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function PhotoUpload({
  label,
  uploaded,
  onUpload,
}: {
  label: string;
  uploaded: boolean;
  onUpload: () => void;
}) {
  const { t } = useI18n();

  return (
    <button
      type="button"
      onClick={onUpload}
      className={`flex w-full items-center gap-4 rounded-2xl p-3 text-left transition active:scale-[0.99] ${
        uploaded
          ? "border border-[#008348] bg-[#E7F5EC]"
          : "border-2 border-dashed border-[#4B4FF5] bg-[#F0F1FF] hover:bg-[#E8E9FF]"
      }`}
    >
      <span
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white ${
          uploaded ? "text-[#006B3C]" : "text-[#4B4FF5]"
        }`}
      >
        {uploaded ? (
          <Check className="h-7 w-7" strokeWidth={2.5} />
        ) : (
          <Camera className="h-7 w-7" strokeWidth={1.8} />
        )}
      </span>

      <span className="min-w-0">
        <span className="block text-[14px] font-semibold leading-5 text-black">
          {label}
        </span>
        <span
          className={`mt-0.5 block text-[12px] font-medium leading-4 ${
            uploaded ? "text-[#006B3C]" : "text-[#272BC4]"
          }`}
        >
          {uploaded
            ? t("staffReturn.photoUploaded")
            : t("common.takeOrUploadPhoto")}
        </span>
      </span>
    </button>
  );
}