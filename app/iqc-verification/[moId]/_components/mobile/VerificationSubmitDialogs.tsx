"use client";

import InspectionModal from "@/components/iqc/InspectionModal";
import { useI18n } from "@/i18n";

type Props = {
  open: boolean;
  successOpen: boolean;
  cartonCount: number;
  moNumber: string;
  onCancelSubmit: () => void;
  onConfirmSubmit: () => void;
  onDismissSuccess: () => void;
};

export default function VerificationSubmitDialogs({
  open,
  successOpen,
  cartonCount,
  moNumber,
  onCancelSubmit,
  onConfirmSubmit,
  onDismissSuccess,
}: Props) {
  const { t } = useI18n();

  return (
    <>
      <InspectionModal
        open={open}
        title={t("iqc.verify.submitTitle")}
        description={t("iqc.verify.submitDescription", {
          count: cartonCount,
          mo: moNumber,
        })}
        confirmLabel={t("common.submit")}
        onCancel={onCancelSubmit}
        onConfirm={onConfirmSubmit}
      />

      <InspectionModal
        open={successOpen}
        title={t("iqc.modal.successTitle")}
        description={t("iqc.modal.successDescription")}
        onCancel={onDismissSuccess}
        onConfirm={onDismissSuccess}
        success
      />
    </>
  );
}
