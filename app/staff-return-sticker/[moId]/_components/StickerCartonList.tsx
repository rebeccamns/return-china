"use client";

import { Check, ChevronRight, ScanLine } from "lucide-react";

import { useI18n } from "@/i18n";

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
  const { t } = useI18n();

  return (
    <div className="overflow-hidden rounded-2xl border border-strokestroke-gray bg-backgroundbg-white divide-y divide-strokestroke-gray">
      {cartons.map((carton) => (
        <button
          key={carton.id}
          type="button"
          onClick={() => onSelect(carton)}
          className="flex min-h-[60px] max-md:min-h-[52px] w-full items-center gap-3 px-4 py-2.5 max-md:px-3.5 max-md:py-2 text-left transition active:scale-[0.98] active:bg-backgroundbg-gray focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryprimary-green"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E7F5EC] text-[13px] max-md:text-secondary font-semibold text-[#006B3C] dark:bg-backgroundbg-green dark:text-text-colortext-green">
            {carton.code.slice(-2)}
          </span>

          <span className="min-w-0 flex-1">
            <span className="block truncate text-[15px] max-md:text-body font-semibold leading-5 text-text-colortext-black">
              {carton.code}
            </span>
            <span className="mt-0.5 block text-[13px] max-md:text-secondary leading-[18px] text-text-colortext-gray">
              {carton.scanned
                ? t("staffReturnSticker.stickerScanned")
                : t("staffReturnSticker.stickerNotScanned")}
            </span>
          </span>

          {carton.scanned ? (
            <span
              aria-label={t("staffReturnSticker.stickerScanned")}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E7F5EC] text-[#006B3C] dark:bg-backgroundbg-green dark:text-text-colortext-green"
            >
              <Check className="h-4 w-4" />
            </span>
          ) : (
            <span
              aria-label={t("staffReturnSticker.scanSticker")}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-backgroundbg-gray text-text-colortext-gray"
            >
              <ScanLine className="h-4 w-4" />
            </span>
          )}

          <ChevronRight className="h-5 w-5 shrink-0 text-text-colortext-gray" />
        </button>
      ))}
    </div>
  );
}
