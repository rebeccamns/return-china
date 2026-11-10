"use client";

import { useState } from "react";
import { CheckCircle, ClipboardList, Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import { useI18n } from "@/i18n";
import { DEMO, resolveDemoMoNumber } from "@/lib/demo-data";

import type { UseIqcVerificationReturn } from "../../_hooks/useIqcVerification";
import CartonRow from "./CartonRow";
import VerificationSummaryPanel from "./VerificationSummaryPanel";

type Props = {
  moId: string;
  verification: UseIqcVerificationReturn;
};

const SUBMITTED_AT = "2026-09-02 09:05";
const RETURN_ID = "RC-20260831-002";

export default function IqcVerificationDesktop({
  moId,
  verification,
}: Props) {
  const { t } = useI18n();
  const [expandedCartonId, setExpandedCartonId] = useState<string | null>(null);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [noticeDismissed, setNoticeDismissed] = useState(false);
  const moNumber = resolveDemoMoNumber(moId);

  function handleConfirmSubmit() {
    verification.submit();
    setSubmitDialogOpen(false);
  }

  return (
    <main className="min-h-screen w-full bg-backgroundbg-gray">
      <Sidebar variant="iqc" />

      <div className="flex min-h-screen flex-col pl-[255px]">
        <TopBar />

        <div className="mt-[52px] w-full px-[18px] py-5">
          <nav className="mb-4 text-xs text-text-colortext-gray">
            {t("iqc.title")} / {t("iqc.verify.title")}
          </nav>

          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold text-[#111111]">
                {t("iqc.verify.title")}
              </h1>
              <p className="mt-1 text-sm text-[#8F8F8E]">
                {t("iqc.verify.desktopSubtitle")}
              </p>
            </div>

            <div className="inline-flex h-8 shrink-0 items-center gap-2 rounded-lg border border-strokestroke-gray bg-white px-3">
              <ClipboardList className="h-4 w-4 text-[#0B5934]" />
              <span className="text-sm text-[#5F5F5E]">
                {t("iqc.verify.verifiedSummary", {
                  verified: verification.verifiedCount,
                  total: verification.cartons.length,
                })}
              </span>
            </div>
          </div>

          {verification.submitted && !noticeDismissed && (
            <div
              role="status"
              className="mb-4 flex items-start gap-3 rounded-lg border border-[#B7DEC4] bg-[#EAF6EE] px-4 py-3 text-xs text-[#0b5934]"
            >
              <CheckCircle className="mt-px h-4 w-4 shrink-0" />
              <div className="flex-1">
                <p className="font-semibold">{t("iqc.modal.successTitle")}</p>
                <p className="mt-1">{t("iqc.modal.successDescription")}</p>
              </div>
              <button
                type="button"
                aria-label={t("common.dismiss")}
                onClick={() => setNoticeDismissed(true)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <VerificationSummaryPanel
            moNumber={moNumber}
            submittedAt={SUBMITTED_AT}
            returnId={RETURN_ID}
            model={DEMO.model}
            verification={verification}
          />

          <section className="overflow-hidden rounded-lg border border-strokestroke-gray bg-white">
            <div className="flex items-center justify-between border-b border-strokestroke-gray px-[18px] py-4">
              <div>
                <h2 className="text-sm font-semibold text-[#111111]">
                  {t("staffReturn.cartonList")}
                </h2>
                <p className="mt-1 text-xs text-[#8F8F8E]">
                  {t("common.cartonPlural", {
                    count: verification.cartons.length,
                  })}
                </p>
              </div>
            </div>

            <div className="divide-y divide-strokestroke-gray">
              {verification.cartons.map((carton) => (
                <CartonRow
                  key={carton.id}
                  carton={carton}
                  expanded={expandedCartonId === carton.id}
                  onToggle={() =>
                    setExpandedCartonId((current) =>
                      current === carton.id ? null : carton.id,
                    )
                  }
                  onScanMaterial={verification.scanMaterial}
                  onScanSticker={verification.scanSticker}
                  onComplete={(cartonId) => {
                    verification.completeCarton(cartonId);
                    setExpandedCartonId(null);
                  }}
                />
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-strokestroke-gray px-[18px] py-4">
              <span className="text-xs text-[#5F5F5E]">
                {t("iqc.verify.cartonsVerified", {
                  verified: verification.verifiedCount,
                  total: verification.cartons.length,
                })}
              </span>

              <Button
                type="button"
                variant="primary"
                disabled={!verification.allVerified || verification.submitted}
                onClick={() => setSubmitDialogOpen(true)}
                className="h-10 gap-2 rounded-md px-5 text-sm font-semibold"
              >
                <Send className="h-4 w-4" />
                {t("common.submit")}
              </Button>
            </div>
          </section>
        </div>
      </div>

      <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("iqc.verify.submitTitle")}</DialogTitle>
            <DialogDescription>
              {t("iqc.verify.submitDescription", {
                count: verification.cartons.length,
                mo: moNumber,
              })}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setSubmitDialogOpen(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              variant="primary"
              disabled={!verification.allVerified || verification.submitted}
              onClick={handleConfirmSubmit}
            >
              {t("common.submit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
