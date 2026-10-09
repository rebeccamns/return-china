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
import type { EximRow } from "../_lib/data";

type Props = {
  rows: EximRow[];
  onChange: (id: string, field: "model" | "brand", value: string) => void;
};

const PHOTO_COLUMNS = [
  { key: "frontPhoto", label: "Front Photo" },
  { key: "backPhoto", label: "Back Photo" },
  { key: "upnPhoto", label: "UPN Photo" },
] as const;

const headClass =
  "h-10 whitespace-nowrap bg-[#F8F8F8] px-3 text-xs font-medium text-slate-700";

const inputClass =
  "h-9 w-[200px] rounded-md border-strokestroke-gray px-3 text-xs placeholder:text-[#A3A3A1]";

function Unit({ children }: { children: React.ReactNode }) {
  return <span className="ml-1 font-normal text-slate-400">{children}</span>;
}

export default function EximMaterialTable({ rows, onChange }: Props) {
  const [preview, setPreview] = useState<{
    title: string;
    code: string;
    src: string;
  } | null>(null);

  return (
    <>
      <div className="overflow-hidden rounded-md border border-strokestroke-gray">
        <Table className="min-w-[1800px]">
          <TableHeader className="bg-[#F8F8F8]">
            <TableRow className="hover:bg-[#F8F8F8]">
              <TableHead
                className={cn(
                  headClass,
                  "sticky left-0 z-20 border-r border-strokestroke-gray",
                )}
              >
                Material Code
              </TableHead>
              <TableHead className={headClass}>English Name</TableHead>
              <TableHead className={headClass}>China Name</TableHead>
              <TableHead className={headClass}>Model</TableHead>
              <TableHead className={headClass}>Brand</TableHead>
              <TableHead className={headClass}>
                Qty<Unit>(pcs)</Unit>
              </TableHead>
              <TableHead className={headClass}>
                Single Net<Unit>(g)</Unit>
              </TableHead>
              <TableHead className={headClass}>
                Net Weight<Unit>(kg)</Unit>
              </TableHead>
              <TableHead className={headClass}>
                Gross Weight<Unit>(kg)</Unit>
              </TableHead>
              <TableHead className={headClass}>
                Volume<Unit>(mm)</Unit>
              </TableHead>
              {PHOTO_COLUMNS.map((col) => (
                <TableHead key={col.key} className={headClass}>
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={row.id} className="h-[53px] hover:bg-[#FAFAFA]">
                <TableCell className="sticky left-0 z-10 border-r border-strokestroke-gray bg-white px-3 py-2 text-xs font-medium text-[#111111]">
                  {row.code}
                </TableCell>

                <TableCell className="max-w-[240px] px-3 py-2 text-xs text-[#111111]">
                  <span className="block truncate" title={row.englishName}>
                    {row.englishName}
                  </span>
                </TableCell>

                <TableCell className="max-w-[240px] px-3 py-2 text-xs text-[#111111]">
                  <span className="block truncate" title={row.chinaName}>
                    {row.chinaName}
                  </span>
                </TableCell>

                <TableCell className="px-3 py-2">
                  <Input
                    value={row.model}
                    placeholder="Input model..."
                    aria-label={`Model, row ${index + 1}`}
                    onChange={(e) => onChange(row.id, "model", e.target.value)}
                    className={inputClass}
                  />
                </TableCell>

                <TableCell className="px-3 py-2">
                  <Input
                    value={row.brand}
                    placeholder="Input brand..."
                    aria-label={`Brand, row ${index + 1}`}
                    onChange={(e) => onChange(row.id, "brand", e.target.value)}
                    className={inputClass}
                  />
                </TableCell>

                <TableCell className="px-3 py-2 text-xs text-[#111111]">
                  {row.qty}
                </TableCell>
                <TableCell className="px-3 py-2 text-xs text-[#111111]">
                  {row.singleNet}
                </TableCell>
                <TableCell className="px-3 py-2 text-xs text-[#111111]">
                  {row.netWeight}
                </TableCell>
                <TableCell className="px-3 py-2 text-xs text-[#111111]">
                  {row.grossWeight}
                </TableCell>
                <TableCell className="whitespace-nowrap px-3 py-2 text-xs text-[#111111]">
                  {row.volume}
                </TableCell>

                {PHOTO_COLUMNS.map((col) => (
                  <TableCell key={col.key} className="px-3 py-2">
                    <button
                      type="button"
                      className="text-xs font-medium text-blue-600 hover:underline"
                      onClick={() =>
                        setPreview({
                          title: col.label,
                          code: row.code,
                          src: row[col.key],
                        })
                      }
                    >
                      See image
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
                alt={`${preview.title} for ${preview.code}`}
                className="max-h-[60vh] w-full object-contain"
              />
            ) : (
              <ImageOff className="h-8 w-8 text-slate-300" strokeWidth={1.5} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}