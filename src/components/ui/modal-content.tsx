"use client";

import * as React from "react";
import {
  CircleCheck,
  CircleHelp,
  CircleAlert,
} from "lucide-react";

import { cn } from "@/lib/utils";

type ModalIconType = "confirm" | "success" | "error";

type ModalContentProps = {
  type: ModalIconType;
  title: string;
  description: string;
  children?: React.ReactNode;
};

const icons = {
  confirm: CircleHelp,
  success: CircleCheck,
  error: CircleAlert,
};

export function ModalContent({
  type,
  title,
  description,
  children,
}: ModalContentProps) {
  const Icon = icons[type];

  return (
    <>
      {/* Icon */}
      <div className="mb-3 flex justify-center">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full",
            type === "error"
              ? "bg-red-50"
              : "bg-[#EAF5EF]"
          )}
        >
          <Icon
            className={cn(
              "h-4 w-4",
              type === "error"
                ? "text-red-500"
                : "text-primaryprimary-green"
            )}
          />
        </div>
      </div>

      {/* Content */}
      <div className="text-center">
        <h2 className="text-[13px] font-semibold text-[#111111]">
          {title}
        </h2>

        <p className="mx-auto mt-1 max-w-[270px] text-[11px] leading-[15px] text-[#666666]">
          {description}
        </p>
      </div>

      {children}
    </>
  );
}