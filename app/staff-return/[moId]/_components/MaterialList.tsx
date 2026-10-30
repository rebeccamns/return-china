"use client";

import { ChevronLeft, ChevronRight, Layers } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

type MaterialListProps = {
  carton: Carton;
  materialOptions: Material[];
  selectedMaterialCode: string;
  /** Material totals already packed in OTHER cartons. */
  packedElsewhere: PackedSummary;
  onBack: () => void;
  onSelectMaterial: (code: string) => void;
  onEditMaterial: (entry: MaterialEntry) => void;
  onSaveCarton: () => void;
};

export default function MaterialList({
  carton,
  materialOptions,
  selectedMaterialCode,
  packedElsewhere,
  onBack,
  onSelectMaterial,
  onEditMaterial,
  onSaveCarton,
}: MaterialListProps) {
  const { t } = useI18n();

  const addedCodes = new Set(carton.materials.map((e) => e.material.code));
  const isGroup = carton.codes.length > 1;

  return (
    <div>
      {/* Header */}
      <h1 className="m-0 min-w-0">
        <button
          type="button"
          onClick={onBack}
          aria-label={`${t("common.back")} ${cartonRange(carton.codes)}`}
          className="-ml-1 flex min-h-11 min-w-0 items-center gap-1 text-left"
        >
          <ChevronLeft
            className="h-6 w-6 shrink-0 text-primaryprimary-green"
            strokeWidth={2}
          />
          <span className="truncate text-[22px] font-semibold leading-7 tracking-[-0.01em] text-text-colortext-black">
            {cartonRange(carton.codes)}
          </span>
        </button>
      </h1>

      <p className="mt-0.5 pl-7 text-[13px] leading-[18px] text-text-colortext-gray">
        {t("staffReturn.materialsCount", { count: carton.materials.length })}
      </p>

      <div className="mb-3 mt-2">
        <MoSummaryCard compact />
      </div>

      {isGroup && (
        <div className="mt-3 flex items-start gap-3 rounded-2xl bg-[#E7F5EC] p-4">
          <Layers
            className="mt-0.5 h-5 w-5 shrink-0 text-[#006B3C]"
            strokeWidth={1.8}
          />
          <p className="text-[13px] leading-[18px] text-[#006B3C]">
            {t("staffReturn.sameDetailsBanner", { count: carton.codes.length })}
          </p>
        </div>
      )}

      {/* Added materials */}
      {carton.materials.length > 0 && (
        <div className="mt-5 overflow-hidden rounded-2xl border border-strokestroke-gray bg-backgroundbg-white">
          <ul className="divide-y divide-strokestroke-gray">
            {carton.materials.map((entry, index) => (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => onEditMaterial(entry)}
                  className="flex min-h-[60px] w-full items-center gap-3 px-4 py-2.5 text-left transition-colors active:bg-backgroundbg-gray"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E7F5EC] text-[13px] font-semibold text-[#006B3C]">
                    {index + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold leading-5 text-text-colortext-black">
                      {entry.material.code}
                    </p>
                    <p className="truncate text-[13px] leading-[18px] text-text-colortext-gray">
                      {entry.material.englishName} {entry.material.chinaName}
                    </p>
                  </div>

                  <span className="shrink-0 text-[13px] leading-[18px] font-medium text-text-colortext-black">
                    {t("staffReturn.piecesCount", { count: entry.quantity })}
                  </span>

                  <ChevronRight
                    className="h-5 w-5 shrink-0 text-[#C4C4C4]"
                    strokeWidth={2}
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Material picker */}
      <div className="mt-5 rounded-2xl border border-strokestroke-gray bg-backgroundbg-white p-4">
        <label className="mb-2 block text-[12px] font-medium leading-4 text-text-colortext-gray">
          {t("common.materialCode")}
        </label>

        <Select value={selectedMaterialCode} onValueChange={onSelectMaterial}>
          <SelectTrigger className="h-12 w-full rounded-xl border-strokestroke-gray px-4 text-[16px]">
            <SelectValue placeholder={t("staffReturn.chooseMaterialCode")} />
          </SelectTrigger>

          <SelectContent>
            {materialOptions.map((option) => {
              const packed = packedElsewhere[option.code];

              return (
                <SelectItem
                  key={option.id}
                  value={option.code}
                  disabled={addedCodes.has(option.code)}
                  className="py-2.5"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[16px] font-medium leading-5">
                      {option.code}
                    </span>
                    <span className="text-[12px] font-medium leading-4 text-text-colortext-gray">
                      {option.englishName}
                    </span>
                    {packed && (
                      <span className="text-[12px] font-medium leading-4 text-[#006B3C]">
                        {t("staffReturn.packedSummary", {
                          pieces: packed.pieces,
                          cartons: packed.cartons,
                        })}
                      </span>
                    )}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {carton.materials.length === 0 && !selectedMaterialCode && (
          <p className="mt-4 text-center text-[13px] leading-[18px] text-text-colortext-gray">
            {t("staffReturn.chooseMaterialHint")}
          </p>
        )}
      </div>

      {/* Sticky Save */}
      <StickyActionBar>
        <button
          type="button"
          onClick={onSaveCarton}
          disabled={carton.materials.length === 0}
          className={`${primaryButton} flex-1`}
        >
          {t("staffReturn.saveCartonDetail")}
        </button>
      </StickyActionBar>
    </div>
  );
}