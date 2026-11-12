"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import type { EximRow } from "../_lib/data";

type Props = {
  rows: EximRow[];
  onChange?: (id: string, field: "model" | "brand", value: string) => void;
  readOnly?: boolean;
};

const PHOTO_COLUMNS: { key: "frontPhoto" | "backPhoto" | "upnPhoto"; labelKey: TranslationKey }[] = [
  { key: "frontPhoto", labelKey: "common.frontPhoto" },
  { key: "backPhoto", labelKey: "common.backPhoto" },
  { key: "upnPhoto", labelKey: "common.upnPhoto" },
];

const headClass =
  "h-10 whitespace-nowrap bg-backgroundbg-bluish-gray px-3 text-xs font-medium text-text-colortext-dark dark:bg-backgroundbg-black dark:text-text-colortext-black";

const inputClass =
  "h-9 w-[200px] rounded-md border-strokestroke-gray px-3 text-xs placeholder:text-text-colortext-gray";

function Unit({ children }: { children: React.ReactNode }) {
  return <span className="ml-1 font-normal text-text-colortext-gray">{children}</span>;
}

export default function EximMaterialTable({
  rows,
  onChange,
  readOnly = false,
}: Props) {
  const { t } = useI18n();
  const [preview, setPreview] = useState<{
    title: string;
    code: string;
    src: string;
  } | null>(null);

  return (
    <>
      <div className="overflow-hidden rounded-md border border-strokestroke-gray">
        <Table className="min-w-[1800px]">
          <TableHeader className="bg-backgroundbg-bluish-gray">
            <TableRow className="hover:bg-backgroundbg-bluish-gray">
              <TableHead
                className={cn(
                  headClass,
                  "sticky left-0 z-20 border-r border-strokestroke-gray",
                )}
              >
                {t("common.materialCode")}
              </TableHead>
              <TableHead className={headClass}>{t("common.englishName")}</TableHead>
              <TableHead className={headClass}>{t("common.chinaName")}</TableHead>
              <TableHead className={headClass}>{t("exim.table.model")}</TableHead>
              <TableHead className={headClass}>{t("exim.table.brand")}</TableHead>
              <TableHead className={headClass}>
                {t("exim.table.qty")}<Unit>{t("common.units.pcs")}</Unit>
              </TableHead>
              <TableHead className={headClass}>
                {t("exim.table.singleNet")}<Unit>{t("common.units.g")}</Unit>
              </TableHead>
              <TableHead className={headClass}>
                {t("exim.table.netWeight")}<Unit>{t("common.units.kg")}</Unit>
              </TableHead>
              <TableHead className={headClass}>
                {t("exim.table.grossWeight")}<Unit>{t("common.units.kg")}</Unit>
              </TableHead>
              <TableHead className={headClass}>
                {t("exim.table.volume")}<Unit>{t("common.units.mm")}</Unit>
              </TableHead>
              {PHOTO_COLUMNS.map((col) => (
                <TableHead key={col.key} className={headClass}>
                  {t(col.labelKey)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={row.id} className="h-[53px] hover:bg-backgroundbg-bluish-gray">
                <TableCell className="sticky left-0 z-10 border-r border-strokestroke-gray bg-backgroundbg-white px-3 py-2 text-xs font-medium text-text-colortext-black">
                  {row.code}
                </TableCell>

                <TableCell className="max-w-[240px] px-3 py-2 text-xs text-text-colortext-black">
                  <span className="block truncate" title={row.englishName}>
                    {row.englishName}
                  </span>
                </TableCell>

                <TableCell className="max-w-[240px] px-3 py-2 text-xs text-text-colortext-black">
                  <span className="block truncate" title={row.chinaName}>
                    {row.chinaName}
                  </span>
                </TableCell>

                <TableCell className="px-3 py-2">
                  {readOnly ? (
                    <span className="text-xs text-text-colortext-black">{row.model}</span>
                  ) : (
                    <Input
                      value={row.model}
                      placeholder={t("exim.table.inputModel")}
                      aria-label={t("exim.table.modelRowLabel", { row: index + 1 })}
                      onChange={(e) =>
                        onChange?.(row.id, "model", e.target.value)
                      }
                      className={inputClass}
                    />
                  )}
                </TableCell>

                <TableCell className="px-3 py-2">
                  {readOnly ? (
                    <span className="text-xs text-text-colortext-black">{row.brand}</span>
                  ) : (
                    <Input
                      value={row.brand}
                      placeholder={t("exim.table.inputBrand")}
                      aria-label={t("exim.table.brandRowLabel", { row: index + 1 })}
                      onChange={(e) =>
                        onChange?.(row.id, "brand", e.target.value)
                      }
                      className={inputClass}
                    />
                  )}
                </TableCell>

                <TableCell className="px-3 py-2 text-xs text-text-colortext-black">
                  {row.qty}
                </TableCell>
                <TableCell className="px-3 py-2 text-xs text-text-colortext-black">
                  {row.singleNet}
                </TableCell>
                <TableCell className="px-3 py-2 text-xs text-text-colortext-black">
                  {row.netWeight}
                </TableCell>
                <TableCell className="px-3 py-2 text-xs text-text-colortext-black">
                  {row.grossWeight}
                </TableCell>
                <TableCell className="whitespace-nowrap px-3 py-2 text-xs text-text-colortext-black">
                  {row.volume}
                </TableCell>

                {PHOTO_COLUMNS.map((col) => (
                  <TableCell key={col.key} className="px-3 py-2">
                    <button
                      type="button"
                      className="text-xs font-medium text-blue-600 hover:underline"
                      onClick={() =>
                        setPreview({
                          title: t(col.labelKey),
                          code: row.code,
                          src: row[col.key],
                        })
                      }
                    >
                      {t("common.seeImage")}
                    </button>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

<Dialog
  open={!!preview}
  onOpenChange={(open: boolean) => {
    if (!open) setPreview(null);
  }}
>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{preview?.title}</DialogTitle>
            <DialogDescription>{preview?.code}</DialogDescription>
          </DialogHeader>

          <div className="flex min-h-[240px] items-center justify-center overflow-hidden rounded-md bg-slate-50">
            {preview?.src ? (
              <img
                src={preview.src}
                alt={t("exim.table.photoAlt", { title: preview.title, code: preview.code })}
                className="max-h-[60vh] w-full object-contain"
              />
            ) : (
              <ImageOff className="h-8 w-8 text-text-colortext-gray" strokeWidth={1.5} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}