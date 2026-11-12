"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
} from "react";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useI18n } from "@/i18n";

import { matchesScan } from "../../_lib/scan-match";
import {
  type VerificationCarton,
  type VerificationMaterial,
  isMaterialScanned,
} from "../verification-types";

type Props = {
  carton: VerificationCarton;
  onScanMaterial: (cartonId: string, materialId: string) => void;
};

const headClass =
  "h-10 whitespace-nowrap bg-[#F8F8F8] px-3 text-xs font-medium text-slate-700 dark:bg-backgroundbg-black dark:text-text-colortext-black";

const inputClass =
  "h-9 w-[240px] rounded-md border-strokestroke-gray bg-backgroundbg-white px-3 text-xs text-text-colortext-black placeholder:text-text-colortext-gray";

export default function MaterialScanTable({
  carton,
  onScanMaterial,
}: Props) {
  const { t } = useI18n();
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const confirmedValues = useRef<Record<string, string>>({});

  function clearError(materialId: string) {
    setErrors((current) => {
      const next = { ...current };
      delete next[materialId];
      return next;
    });
  }

  function handleValueChange(
    material: VerificationMaterial,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setValues((current) => ({
      ...current,
      [material.id]: event.target.value,
    }));
    delete confirmedValues.current[material.id];
    clearError(material.id);
  }

  function handleMaterialBlur(
    material: VerificationMaterial,
    event: FocusEvent<HTMLInputElement>,
  ) {
    const scanned = event.currentTarget.value.trim();

    if (!scanned) {
      setErrors((current) => ({
        ...current,
        [material.id]: t("iqc.form.errorUpnRequired"),
      }));
      return;
    }

    if (!matchesScan(scanned, material.code)) {
      setErrors((current) => ({
        ...current,
        [material.id]: t("iqc.form.errorUpnMismatch"),
      }));
      return;
    }

    if (confirmedValues.current[material.id] === scanned) return;
    if (isMaterialScanned(material) && values[material.id] === undefined) return;

    clearError(material.id);
    confirmedValues.current[material.id] = scanned;
    onScanMaterial(carton.id, material.id);

    const nextMaterial = carton.materials.find(
      (item) => item.id !== material.id && !isMaterialScanned(item),
    );
    if (nextMaterial) inputRefs.current[nextMaterial.id]?.focus();
  }

  function handleEnter(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    event.currentTarget.blur();
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-strokestroke-gray bg-backgroundbg-white">
      <Table className="min-w-[1100px]">
        <TableHeader className="bg-[#F8F8F8]">
          <TableRow className="hover:bg-[#F8F8F8] dark:hover:bg-backgroundbg-black">
            <TableHead className={headClass}>#</TableHead>
            <TableHead className={headClass}>
              {t("common.materialCode")}
            </TableHead>
            <TableHead className={headClass}>
              {t("common.englishName")} / {t("common.chinaName")}
            </TableHead>
            <TableHead className={headClass}>
              {t("common.scanUpnBarcode")}
            </TableHead>
            <TableHead className={headClass}>{t("common.status")}</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {carton.materials.map((material, index) => {
            const scanned = isMaterialScanned(material);
            const error = errors[material.id];
            const inputId = `${carton.id}-${material.id}-upn`;

            return (
              <TableRow
                key={material.id}
                className="h-[53px] hover:bg-[#FAFAFA] dark:hover:bg-backgroundbg-black"
              >
                <TableCell className="px-3 py-2 text-xs text-text-colortext-black">
                  {index + 1}
                </TableCell>
                <TableCell className="px-3 py-2 text-xs font-medium text-text-colortext-black">
                  {material.code}
                </TableCell>
                <TableCell className="max-w-[260px] px-3 py-2 text-xs text-text-colortext-black">
                  <span className="block truncate" title={material.englishName}>
                    {material.englishName}
                  </span>
                  <span
                    className="mt-0.5 block truncate text-slate-500 dark:text-text-colortext-gray"
                    title={material.chinaName}
                  >
                    {material.chinaName}
                  </span>
                </TableCell>
                <TableCell className="px-3 py-2">
                  <Input
                    ref={(element) => {
                      inputRefs.current[material.id] = element;
                    }}
                    id={inputId}
                    value={
                      values[material.id] ??
                      (scanned ? material.code : "")
                    }
                    aria-label={`${t("common.scanUpnBarcode")} ${material.code}`}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    autoCapitalize="characters"
                    autoCorrect="off"
                    spellCheck={false}
                    onFocus={(event) => event.currentTarget.select()}
                    onChange={(event) => handleValueChange(material, event)}
                    onBlur={(event) => handleMaterialBlur(material, event)}
                    onKeyDown={handleEnter}
                    placeholder={t("common.scanOrTypePlaceholder")}
                    className={inputClass}
                  />
                  {error && (
                    <p
                      id={`${inputId}-error`}
                      role="alert"
                      className="mt-1 max-w-[240px] text-xs leading-4 text-red-700 dark:text-red-300"
                    >
                      {error}
                    </p>
                  )}
                </TableCell>
                <TableCell className="px-3 py-2">
                  <span
                    className={`inline-flex h-6 items-center rounded-full px-2 text-xs font-medium ${
                      scanned
                        ? "bg-[#E7F5EC] text-[#006B3C] dark:bg-backgroundbg-green dark:text-text-colortext-green"
                        : "bg-slate-100 text-[#737373] dark:bg-backgroundbg-bluish-gray dark:text-text-colortext-gray"
                    }`}
                  >
                    {scanned
                      ? t("iqc.verify.scanned")
                      : t("iqc.verify.pending")}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
