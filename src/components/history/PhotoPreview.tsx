"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useI18n } from "@/i18n";

export default function PhotoPreview({
  label,
  src,
}: {
  label: string;
  src: string | null;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  if (!src) {
    return (
      <span className="text-text-colortext-gray">
        {t("history.detail.photoNotAdded")}
      </span>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={t("history.detail.viewPhoto", { label })}
          className="rounded border border-strokestroke-gray focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryprimary-green"
        >
          <img
            src={src}
            alt={label}
            className="h-10 w-10 rounded object-cover"
          />
        </button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-3xl sm:max-w-3xl">
        <DialogTitle>{label}</DialogTitle>
        <img
          src={src}
          alt={label}
          className="max-h-[75vh] w-full rounded-md object-contain"
        />
      </DialogContent>
    </Dialog>
  );
}
