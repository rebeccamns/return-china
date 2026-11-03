"use client";

import { CheckCircle2, FileQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useI18n } from "@/i18n";

export type SubmitStep = "confirm" | "success" | null;

type Props = {
  step: SubmitStep;
  confirmTitle: string;
  confirmDescription: string;
  successTitle: string;
  successDescription: string;
  onConfirm: () => void;
  onClose: () => void;
};

export default function SubmitFlowDialog({
  step,
  confirmTitle,
  confirmDescription,
  successTitle,
  successDescription,
  onConfirm,
  onClose,
}: Props) {
  const { t } = useI18n();
  const isSuccess = step === "success";

  return (
    <Dialog open={step !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={false} className="items-center text-center sm:max-w-sm">
        <div
          className={
            isSuccess
              ? "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E7F5EC] text-[#008348]"
              : "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600"
          }
        >
          {isSuccess ? (
            <CheckCircle2 className="h-6 w-6" />
          ) : (
            <FileQuestion className="h-6 w-6" />
          )}
        </div>

        <DialogHeader className="items-center text-center">
          <DialogTitle className="text-base font-semibold leading-snug">
            {isSuccess ? successTitle : confirmTitle}
          </DialogTitle>
          <DialogDescription>
            {isSuccess ? successDescription : confirmDescription}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <Button type="button" variant="primary" className="w-full" onClick={onClose}>
            {t("common.done")}
          </Button>
        ) : (
          <div className="grid w-full grid-cols-2 gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button type="button" variant="primary" onClick={onConfirm}>
              {t("submitFlow.confirm")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
