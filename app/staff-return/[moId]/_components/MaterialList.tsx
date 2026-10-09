"use client";

import { ArrowLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Material = {
  id: string;
  code: string;
  englishName: string;
  chinaName: string;
};

type MaterialListProps = {
  cartonCode: string;
  completedMaterials: Material[];
  totalMaterials: number;
  selectedMaterialCode: string;
  materialOptions: Material[];
  onBack: () => void;
  onSelectMaterial: (code: string) => void;
  onSaveCarton: () => void;
};

export default function MaterialList({
  cartonCode,
  completedMaterials,
  totalMaterials,
  selectedMaterialCode,
  materialOptions,
  onBack,
  onSelectMaterial,
  onSaveCarton,
}: MaterialListProps) {
  const completedCodes = new Set(
    completedMaterials.map((m) => m.code)
  );

  const isCartonComplete =
    completedMaterials.length === totalMaterials;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3.5">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-3 text-base font-semibold text-slate-900"
          aria-label="Back to cartons"
        >
          <ArrowLeft className="h-4 w-4 text-slate-700" />
          {cartonCode}
        </button>

        <span className="text-sm text-slate-500">
          {completedMaterials.length}/{totalMaterials} Material
        </span>
      </div>

      <div className="space-y-3 p-4">
        {/* Materials already added to this carton */}
        {completedMaterials.map((material, index) => (
          <div
            key={material.code}
            className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-3"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e6f4ea] text-sm font-medium text-[#0b5934]">
              {index + 1}
            </span>

            <div className="min-w-0 flex-1">
              <div className="text-base font-semibold text-slate-900">
                {material.code}
              </div>

              <div className="truncate text-sm text-slate-600">
                {material.englishName}{" "}
                {material.chinaName}
              </div>
            </div>

            <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
          </div>
        ))}

        {/* Material code picker */}
        {!isCartonComplete && (
          <>
            <div className="space-y-2 pt-1">
              <label className="block text-sm text-slate-500">
                Material Code
              </label>

              <Select
                value={selectedMaterialCode}
                onValueChange={onSelectMaterial}
              >
                <SelectTrigger className="h-12 w-full rounded-lg border-strokestroke-gray px-3 text-sm">
                  <SelectValue placeholder="Choose material code" />
                </SelectTrigger>

                <SelectContent>
                  {materialOptions.map((option) => (
                    <SelectItem
                      key={option.id}
                      value={option.code}
                      disabled={completedCodes.has(
                        option.code
                      )}
                      className="text-sm"
                    >
                      <span className="font-medium">
                        {option.code}
                      </span>

                      <span className="ml-2 text-slate-500">
                        {option.englishName}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!selectedMaterialCode && (
              <p className="py-5 text-center text-sm italic text-slate-400">
                Choose material code to input material
                details
              </p>
            )}
          </>
        )}

        {/* Save Carton Detail */}
        {isCartonComplete && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onSaveCarton}
              className="flex h-11 w-full items-center justify-center rounded-lg bg-primaryprimary-green px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Save Carton Detail
            </button>
          </div>
        )}
      </div>
    </div>
  );
}