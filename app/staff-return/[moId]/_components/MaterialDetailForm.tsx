"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Camera,
  ChevronDown,
  Package,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { Material } from "./MaterialList";

type MaterialDetailFormProps = {
  cartonCode: string;
  material: Material;
  completedCount: number;
  totalMaterials: number;
  onBack: () => void;
  onComplete: (material: Material) => void;
};

type DetailStep = "carton-details" | "upload-photos";

export default function MaterialDetailForm({
  cartonCode,
  material,
  completedCount,
  totalMaterials,
  onBack,
  onComplete,
}: MaterialDetailFormProps) {
  const [detailStep, setDetailStep] =
    useState<DetailStep>("carton-details");

  const [quantity, setQuantity] = useState("10");
  const [singleNetWeight, setSingleNetWeight] =
    useState("67.5");
  const [grossWeight, setGrossWeight] = useState("3.455");

  const [volumeLength, setVolumeLength] =
    useState("500");
  const [volumeWidth, setVolumeWidth] =
    useState("420");
  const [volumeHeight, setVolumeHeight] =
    useState("290");

  const [frontPhoto, setFrontPhoto] =
    useState(false);
  const [backPhoto, setBackPhoto] =
    useState(false);
  const [upnPhoto, setUpnPhoto] =
    useState(false);

  const [upnBarcode, setUpnBarcode] = useState("");

  function handleFinish() {
    onComplete(material);
  }

  return (
    <section className="w-full overflow-hidden rounded-lg border border-strokestroke-gray bg-backgroundbg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-strokestroke-gray px-4 py-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={
              detailStep === "carton-details"
                ? onBack
                : () => setDetailStep("carton-details")
            }
            className="flex h-7 w-7 items-center justify-center"
            aria-label="Back"
          >
            <ArrowLeft
              className="h-5 w-5 text-text-colortext-dark"
              strokeWidth={2}
            />
          </button>

          <span className="text-[16px] font-semibold leading-[150%] text-text-colortext-black">
            {cartonCode}
          </span>
        </div>

        <span className="text-[14px] font-medium leading-[125%] text-text-colortext-gray">
          {completedCount}/{totalMaterials} Material
        </span>
      </div>

      <div className="p-4">
        {/* Material Code */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium leading-[125%] text-text-colortext-dark">
            Material Code
          </label>

          <div className="relative">
            <div className="flex h-[56px] items-center rounded-md border border-strokestroke-gray bg-backgroundbg-white px-4 text-[14px] text-text-colortext-black">
              {material.code}
            </div>

            <ChevronDown
              className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-colortext-dark"
              strokeWidth={1.8}
            />
          </div>
        </div>

        {/* Progress */}
        <div className="mt-6 flex gap-4">
          <div
            className={`h-4 flex-1 rounded-full ${
              detailStep === "carton-details"
                ? "bg-[#008348]"
                : "bg-[#008348]"
            }`}
          />

          <div
            className={`h-4 flex-1 rounded-full ${
              detailStep === "upload-photos"
                ? "bg-[#008348]"
                : "bg-[#E6E6E6]"
            }`}
          />
        </div>

        {detailStep === "carton-details" && (
          <CartonDetailsStep
            quantity={quantity}
            singleNetWeight={singleNetWeight}
            grossWeight={grossWeight}
            volumeLength={volumeLength}
            volumeWidth={volumeWidth}
            volumeHeight={volumeHeight}
            onQuantityChange={setQuantity}
            onSingleNetWeightChange={setSingleNetWeight}
            onGrossWeightChange={setGrossWeight}
            onVolumeLengthChange={setVolumeLength}
            onVolumeWidthChange={setVolumeWidth}
            onVolumeHeightChange={setVolumeHeight}
            onContinue={() =>
              setDetailStep("upload-photos")
            }
          />
        )}

        {detailStep === "upload-photos" && (
          <UploadPhotosStep
            frontPhoto={frontPhoto}
            backPhoto={backPhoto}
            upnPhoto={upnPhoto}
            upnBarcode={upnBarcode}
            onFrontPhoto={() => setFrontPhoto(true)}
            onBackPhoto={() => setBackPhoto(true)}
            onUpnPhoto={() => setUpnPhoto(true)}
            onUpnBarcodeChange={setUpnBarcode}
            onComplete={handleFinish}
          />
        )}
      </div>
    </section>
  );
}

type CartonDetailsStepProps = {
  quantity: string;
  singleNetWeight: string;
  grossWeight: string;
  volumeLength: string;
  volumeWidth: string;
  volumeHeight: string;

  onQuantityChange: (value: string) => void;
  onSingleNetWeightChange: (value: string) => void;
  onGrossWeightChange: (value: string) => void;
  onVolumeLengthChange: (value: string) => void;
  onVolumeWidthChange: (value: string) => void;
  onVolumeHeightChange: (value: string) => void;

  onContinue: () => void;
};

function CartonDetailsStep({
  quantity,
  singleNetWeight,
  grossWeight,
  volumeLength,
  volumeWidth,
  volumeHeight,
  onQuantityChange,
  onSingleNetWeightChange,
  onGrossWeightChange,
  onVolumeLengthChange,
  onVolumeWidthChange,
  onVolumeHeightChange,
  onContinue,
}: CartonDetailsStepProps) {
  return (
    <div className="mt-6">
      {/* Step heading */}
      <div className="flex items-center gap-4">
        <span className="rounded-full bg-[#E7F5EC] px-4 py-2 text-[14px] font-semibold text-[#006B3C]">
          Step 1
        </span>

        <h2 className="text-[20px] font-semibold text-text-colortext-black">
          Carton Details
        </h2>
      </div>

      <p className="mt-2 text-[14px] leading-[125%] text-text-colortext-gray">
        Fill the carton details based on the material details
      </p>

      {/* Quantity + Single Net Weight */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-[14px] font-medium text-black">
            Quantity of Carton
          </label>

          <Input
            value={quantity}
            onChange={(event) =>
              onQuantityChange(event.target.value)
            }
            className="h-[58px] rounded-md border-strokestroke-gray px-4 text-[16px]"
          />
        </div>

        <div>
          <label className="mb-2 block text-[14px] font-medium text-black">
            Single Net Weight
          </label>

          <div className="relative">
            <Input
              value={singleNetWeight}
              onChange={(event) =>
                onSingleNetWeightChange(
                  event.target.value
                )
              }
              className="h-[58px] rounded-md border-strokestroke-gray px-4 pr-16 text-[16px]"
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] text-text-colortext-gray">
              g/PCS
            </span>
          </div>
        </div>
      </div>

      {/* Net Weight */}
      <div className="mt-6">
        <label className="mb-2 block text-[14px] font-medium text-black">
          Net Weight
          <span className="mx-2 text-text-colortext-gray">
            •
          </span>
          <span className="text-text-colortext-gray">
            Calculated
          </span>
        </label>

        <div className="relative">
          <Input
            value="0.068"
            readOnly
            className="h-[58px] rounded-md border-strokestroke-gray bg-slate-50 px-4 pr-12 text-[16px] text-text-colortext-gray"
          />

          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] text-text-colortext-gray">
            kg
          </span>
        </div>
      </div>

      {/* Gross Weight */}
      <div className="mt-6">
        <label className="mb-2 block text-[14px] font-medium text-black">
          Gross Weight
        </label>

        <div className="relative">
          <Input
            value={grossWeight}
            onChange={(event) =>
              onGrossWeightChange(event.target.value)
            }
            className="h-[58px] rounded-md border-strokestroke-gray px-4 pr-12 text-[16px]"
          />

          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] text-text-colortext-gray">
            kg
          </span>
        </div>
      </div>

      {/* Volume */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-[14px] font-medium text-black">
            Volume
          </label>

          <span className="text-[14px] text-text-colortext-gray">
            mm
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Input
            value={volumeLength}
            onChange={(event) =>
              onVolumeLengthChange(event.target.value)
            }
            className="h-[58px] rounded-md border-strokestroke-gray px-4 text-[16px]"
          />

          <Input
            value={volumeWidth}
            onChange={(event) =>
              onVolumeWidthChange(event.target.value)
            }
            className="h-[58px] rounded-md border-strokestroke-gray px-4 text-[16px]"
          />

          <Input
            value={volumeHeight}
            onChange={(event) =>
              onVolumeHeightChange(event.target.value)
            }
            className="h-[58px] rounded-md border-strokestroke-gray px-4 text-[16px]"
          />
        </div>
      </div>

      <Button
        type="button"
        onClick={onContinue}
        className="mt-8 h-11 w-full rounded-md bg-[linear-gradient(0deg,rgba(11,89,52,1)_0%,rgba(5,131,70,1)_100%)] text-[14px] font-semibold text-white shadow-none hover:opacity-90"
      >
        Continue
      </Button>
    </div>
  );
}

type UploadPhotosStepProps = {
  frontPhoto: boolean;
  backPhoto: boolean;
  upnPhoto: boolean;
  upnBarcode: string;

  onFrontPhoto: () => void;
  onBackPhoto: () => void;
  onUpnPhoto: () => void;
  onUpnBarcodeChange: (value: string) => void;

  onComplete: () => void;
};

function UploadPhotosStep({
  frontPhoto,
  backPhoto,
  upnPhoto,
  upnBarcode,
  onFrontPhoto,
  onBackPhoto,
  onUpnPhoto,
  onUpnBarcodeChange,
  onComplete,
}: UploadPhotosStepProps) {
  return (
    <div className="mt-6">
      {/* Step heading */}
      <div className="flex items-center gap-4">
        <span className="rounded-full bg-[#E7F5EC] px-4 py-2 text-[14px] font-semibold text-[#006B3C]">
          Step 2
        </span>

        <h2 className="text-[20px] font-semibold text-text-colortext-black">
          Upload Photos
        </h2>
      </div>

      <p className="mt-2 text-[14px] leading-[125%] text-text-colortext-gray">
        Take photos for each required view.
      </p>

      {/* Photos */}
      <div className="mt-8 flex flex-col gap-5">
        <PhotoUpload
          label="Front Photo"
          uploaded={frontPhoto}
          onUpload={onFrontPhoto}
        />

        <PhotoUpload
          label="Back Photo"
          uploaded={backPhoto}
          onUpload={onBackPhoto}
        />

        <PhotoUpload
          label="UPN Photo"
          uploaded={upnPhoto}
          onUpload={onUpnPhoto}
        />
      </div>

      {/* Barcode */}
      <div className="mt-8">
        <label className="mb-2 block text-[14px] font-medium text-black">
          Scan UPN Barcode{" "}
          <span className="text-red-500">*</span>
        </label>

        <Input
          value={upnBarcode}
          onChange={(event) =>
            onUpnBarcodeChange(event.target.value)
          }
          placeholder="Scan or type manually..."
          className="h-[58px] rounded-md border-strokestroke-gray px-4 text-[16px]"
        />
      </div>

      <Button
        type="button"
        onClick={onComplete}
        className="mt-8 h-11 w-full rounded-md bg-[linear-gradient(0deg,rgba(11,89,52,1)_0%,rgba(5,131,70,1)_100%)] text-[14px] font-semibold text-white shadow-none hover:opacity-90"
      >
        Add Material
      </Button>
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
  return (
    <div className="grid grid-cols-[150px_1fr] items-center gap-4">
      <div className="flex h-[132px] w-[132px] items-center justify-center rounded bg-slate-50">
        {uploaded ? (
          <div className="flex h-full w-full items-center justify-center rounded bg-[#E7F5EC] text-[12px] font-medium text-[#006B3C]">
            Photo Added
          </div>
        ) : (
          <Package
            className="h-12 w-12 text-[#929292]"
            strokeWidth={1.5}
          />
        )}
      </div>

      <div className="min-w-0">
        <p className="mb-3 text-[14px] font-medium text-black">
          {label}
        </p>

        <button
          type="button"
          onClick={onUpload}
          className="flex h-[88px] w-full items-center justify-center gap-2 rounded-md border-2 border-dashed border-[#4B4FF5] bg-[#F0F1FF] px-3 text-center text-[14px] font-medium text-[#272BC4] transition-colors hover:bg-[#E8E9FF]"
        >
          <Camera className="h-5 w-5" strokeWidth={1.8} />

          {uploaded
            ? "Photo Uploaded"
            : "Take or Upload Photo"}
        </button>
      </div>
    </div>
  );
}