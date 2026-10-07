"use client";

import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
};

export function Modal({
  open,
  onClose,
  children,
  className,
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/20
        px-4
      "
    >
      <div
        className={cn(
          `
          relative
          w-full
          max-w-[315px]
          rounded-md
          bg-white
          px-4
          pb-4
          pt-6
          shadow-lg
          `,
          className
        )}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="
            absolute
            right-3
            top-2.5
            flex
            h-6
            w-6
            items-center
            justify-center
            rounded-full
            text-[#9CA3AF]
            hover:bg-[#F5F5F5]
            hover:text-[#666666]
          "
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {children}
      </div>
    </div>
  );
}