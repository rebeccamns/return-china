"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle, ClipboardList, Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
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

import type { UseIqcIdentityReturn } from "../../_hooks/useIqcIdentity";
import MaterialInspectionList from "./MaterialInspectionList";
import MoSummaryPanel from "./MoSummaryPanel";

type Props = {
  identity: UseIqcIdentityReturn;
};

export default function IqcIdentityDesktop({ identity }: Props) {
  const { t } = useI18n();
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [noticeDismissed, setNoticeDismissed] = useState(false);

  function handleConfirmSubmit() {
    identity.submit();
    setSubmitDialogOpen(false);
  }

  return (
    <main className="min-h-screen w-full bg-backgroundbg-gray">
      <Sidebar variant="iqc" />

      <div className="flex min-h-screen flex-col pl-[255px]">
        <TopBar />

        <div className="mt-[52px] w-full px-[18px] py-5">
          <div className="mb-4">
            <Link
              href="/iqc"
              className="inline-flex h-8 items-center gap-2 rounded-md border border-strokestroke-gray bg-backgroundbg-white px-3 text-xs font-medium text-text-colortext-gray transition-colors hover:border-[#B7DEC4] hover:text-[#006B3C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008348]"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("iqc.selectMoTitle")}
            </Link>
          </div>

          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold text-text-colortext-black">
                {t("iqc.title")}
              </h1>
              <p className="mt-1 text-sm text-text-colortext-gray">
                {t("iqc.desktopSubtitle")}
              </p>
            </div>

            <div className="inline-flex h-8 shrink-0 items-center gap-2 rounded-lg border border-strokestroke-gray bg-backgroundbg-white px-3">
              <ClipboardList className="h-4 w-4 text-[#0B5934] dark:text-text-colortext-green" />
              <span className="text-sm text-text-colortext-gray">
                {t("iqc.inspectedSummary", {
                  inspected: identity.inspectedCount,
                  total: identity.moData.totalMaterials,
                })}
              </span>
            </div>
          </div>

          {identity.submitted && !noticeDismissed && (
            <div
              role="status"
              className="mb-4 flex items-start gap-3 rounded-lg border border-[#B7DEC4] bg-[#EAF6EE] px-4 py-3 text-xs text-[#0b5934] dark:border-emerald-900 dark:bg-backgroundbg-green dark:text-text-colortext-green"
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

          <MoSummaryPanel identity={identity} />

          <section className="overflow-hidden rounded-lg border border-strokestroke-gray bg-backgroundbg-white">
            <div className="flex items-center justify-between border-b border-strokestroke-gray px-[18px] py-4">
              <div>
                <h2 className="text-sm font-semibold text-text-colortext-black">
                  {t("common.materialList")}
                </h2>
                <p className="mt-1 text-xs text-text-colortext-gray">
                  {t(
                    identity.moData.totalMaterials === 1
                      ? "common.materialSingular"
                      : "common.materialPlural",
                    { count: identity.moData.totalMaterials },
                  )}
                </p>
              </div>
            </div>

            <div className="px-[18px] py-5">
              <MaterialInspectionList identity={identity} />

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-text-colortext-gray">
                  {t("iqc.inspectionProgress", {
                    inspected: identity.inspectedCount,
                    total: identity.moData.totalMaterials,
                  })}
                </span>

                <Button
                  type="button"
                  variant="primary"
                  disabled={!identity.allInspected || identity.submitted}
                  onClick={() => setSubmitDialogOpen(true)}
                  className="h-10 gap-2 rounded-md px-5 text-sm font-semibold"
                >
                  <Send className="h-4 w-4" />
                  {t("common.submit")}
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("iqc.modal.submitTitle")}</DialogTitle>
            <DialogDescription>
              {t("iqc.modal.submitDescription", {
                count: identity.moData.totalMaterials,
                mo: identity.moData.moNumber,
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
              disabled={!identity.allInspected || identity.submitted}
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
