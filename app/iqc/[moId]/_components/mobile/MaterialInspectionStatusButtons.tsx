"use client";

import { useI18n } from "@/i18n";

import type { InspectionStatus } from "../iqc-types";

type Props = {
  status: InspectionStatus;
  labelClass: string;
  disabled?: boolean;
  onStatusChange: (status: InspectionStatus) => void;
};

export default function MaterialInspectionStatusButtons({
  status,
  labelClass,
  disabled = false,
  onStatusChange,
}: Props) {
  const { t } = useI18n();

  return (
    <fieldset className="mt-5 max-md:mt-3">
      <legend className={labelClass}>
        {t("iqc.form.statusItem")}{" "}
        {!disabled && <span className="text-red-500">*</span>}
      </legend>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={disabled}
          aria-pressed={status === "REJECT"}
          onClick={() => onStatusChange("REJECT")}
          className={`h-12 max-md:h-11 rounded-xl border text-[15px] max-md:text-button font-semibold transition active:scale-[0.98] ${
            status === "REJECT"
              ? "border-red-600 bg-red-50 text-red-700"
              : "border-red-200 bg-white text-red-600"
          }`}
        >
          {status === "REJECT" ? `✓ ${t("status.reject")}` : t("status.reject")}
        </button>

        <button
          type="button"
          disabled={disabled}
          aria-pressed={status === "PASS"}
          onClick={() => onStatusChange("PASS")}
          className={`h-12 max-md:h-11 rounded-xl border text-[15px] max-md:text-button font-semibold transition active:scale-[0.98] ${
            status === "PASS"
              ? "border-primaryprimary-green bg-[#E7F5EC] text-[#006B3C]"
              : "border-[#b7ddc5] bg-white text-[#006B3C]"
          }`}
        >
          {status === "PASS" ? `✓ ${t("status.passOk")}` : t("status.passOk")}
        </button>
      </div>
    </fieldset>
  );
}
