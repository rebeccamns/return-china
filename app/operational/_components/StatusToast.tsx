"use client";

import { CircleCheck, CircleX, X } from "lucide-react";

import { useI18n } from "@/i18n";

export type StatusToastMessage = {
  message: string;
  type: "success" | "error";
};

type Props = {
  message: StatusToastMessage | null;
  onDismiss: () => void;
};

export default function StatusToast({ message, onDismiss }: Props) {
  const { t } = useI18n();

  if (!message) return null;

  const isSuccess = message.type === "success";

  return (
    <div
      role={isSuccess ? "status" : "alert"}
      className="fixed right-6 top-[68px] z-[60] flex w-[calc(100vw-2rem)] max-w-[420px] items-start gap-3 rounded-lg border border-strokestroke-gray bg-backgroundbg-white px-4 py-3 text-xs text-[#555554] shadow-lg dark:text-text-colortext-dark"
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-1 rounded-l-lg ${
          isSuccess ? "bg-[#008348]" : "bg-red-600"
        }`}
      />

      {isSuccess ? (
        <CircleCheck className="mt-px h-4 w-4 shrink-0 text-[#008348] dark:text-text-colortext-green" />
      ) : (
        <CircleX className="mt-px h-4 w-4 shrink-0 text-red-600 dark:text-text-colortext-red" />
      )}

      <span className="flex-1">{message.message}</span>

      <button
        type="button"
        aria-label={t("common.dismiss")}
        onClick={onDismiss}
        className="shrink-0 text-current hover:text-[#262626] dark:text-text-colortext-gray dark:hover:text-text-colortext-black"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
