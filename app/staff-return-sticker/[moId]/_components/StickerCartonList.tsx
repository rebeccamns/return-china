"use client";

import { Check, ChevronRight, Package, ScanLine } from "lucide-react";

export type StickerCarton = {
  id: string;
  code: string;
  scanned: boolean;
};

type StickerCartonListProps = {
  cartons: StickerCarton[];
  onSelect: (carton: StickerCarton) => void;
};

export default function StickerCartonList({
  cartons,
  onSelect,
}: StickerCartonListProps) {
  return (
    <div className="space-y-3">
      {cartons.map((carton) => (
        <button
          key={carton.id}
          type="button"
          onClick={() => onSelect(carton)}
          className="flex min-h-[94px] w-full items-center gap-3 rounded-2xl border border-[#E3E3E3] bg-white px-3 py-3 text-left transition hover:border-[#B8DCC7] hover:bg-[#FCFEFC] focus:outline-none focus:ring-2 focus:ring-[#007A3D]/20 sm:px-4"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#F8F8F8] text-[#8F8F8E]">
            <Package className="h-8 w-8 stroke-[1.8]" />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-base font-semibold text-[#111111]">
              {carton.code}
            </span>
            <span
              className={`mt-0.5 block text-sm ${
                carton.scanned ? "text-[#0B5934]" : "text-[#8F8F8E]"
              }`}
            >
              {carton.scanned ? "Sticker scanned" : "Sticker not scanned"}
            </span>
          </span>

          {carton.scanned ? (
            <span
              aria-label="Sticker scanned"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E4F1EA]"
            >
              <Check className="h-5 w-5 text-[#075D32]" />
            </span>
          ) : (
            <span
              aria-label="Scan sticker"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#777777]"
            >
              <ScanLine className="h-5 w-5" />
            </span>
          )}

          <ChevronRight className="h-6 w-6 shrink-0 text-[#5F5F5E]" />
        </button>
      ))}
    </div>
  );
}
