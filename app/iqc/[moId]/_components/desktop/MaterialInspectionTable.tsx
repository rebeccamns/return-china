"use client";

import { useI18n } from "@/i18n";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { UseIqcIdentityReturn } from "../../_hooks/useIqcIdentity";
import MaterialInspectionRow from "./MaterialInspectionRow";

type Props = {
  identity: UseIqcIdentityReturn;
};

const headClass =
  "h-10 whitespace-nowrap bg-[#F8F8F8] px-3 text-xs font-medium text-slate-700";

export default function MaterialInspectionTable({ identity }: Props) {
  const { t } = useI18n();

  return (
    <div
      className="overflow-x-auto rounded-lg border border-strokestroke-gray bg-white"
      style={{ scrollbarWidth: "none" }}
    >
      <Table className="min-w-[1600px]">
        <TableHeader className="bg-[#F8F8F8]">
          <TableRow className="hover:bg-[#F8F8F8]">
            <TableHead className={headClass}>#</TableHead>
            <TableHead className={headClass}>
              {t("common.materialCode")}
            </TableHead>
            <TableHead className={headClass}>
              {t("common.englishName")} / {t("common.chinaName")}
            </TableHead>
            <TableHead className={headClass}>{t("common.qtyPcs")}</TableHead>
            <TableHead className={headClass}>
              {t("common.scanUpnBarcode")}
            </TableHead>
            <TableHead className={headClass}>{t("common.upnPhoto")}</TableHead>
            <TableHead className={headClass}>{t("common.status")}</TableHead>
            <TableHead className={headClass}>{t("common.notes")}</TableHead>
            <TableHead className={headClass}>{t("common.action")}</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {identity.materials.map((material, index) => (
            <MaterialInspectionRow
              key={material.id}
              material={material}
              index={index}
              onSave={identity.saveMaterial}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
