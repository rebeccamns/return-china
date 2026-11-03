"use client";

import { useState } from "react";
import {
  CheckCircle2,
  X,
  XCircle,
} from "lucide-react";

import BackTitle from "@/components/layout/BackTitle";
import {
  DialogClose,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useI18n, type TranslationKey } from "@/i18n";
import { canViewStageDetail } from "@/lib/mo-detail/access";
import type {
  MoDetail,
  Role,
  StageDetail,
  StageKey,
  StageRecord,
} from "@/lib/mo-detail/types";

import HistoryStatus from "./HistoryStatus";
import { DetailValue, MoreDetails } from "./RowPrimitives";
import StageRows from "./StageRows";

const STAGE_LABELS: Record<StageKey, TranslationKey> = {
  pmcEntry: "history.detail.stages.pmcEntry",
  iqcScan: "history.detail.stages.iqcScan",
  pmcOpenWo: "history.detail.stages.pmcOpenWo",
  staffReturn: "history.detail.stages.staffReturn",
  exim: "history.detail.stages.exim",
  staffReturnSticker: "history.detail.stages.staffReturnSticker",
  iqcQaPass: "history.detail.stages.iqcQaPass",
};

function getIdentityStage(
  stages: StageDetail[],
): StageRecord<"iqcScan"> | undefined {
  return stages.find(
    (stage): stage is StageRecord<"iqcScan"> => stage.stageKey === "iqcScan",
  );
}

function PhotoPreview({ src }: { src: string | null }) {
  const { t } = useI18n();

  if (!src) {
    return (
      <span className="text-[12px] leading-4 text-text-colortext-gray">
        {t("history.detail.photoNotAdded")}
      </span>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex min-h-11 items-center rounded-lg border border-strokestroke-gray px-3 text-[13px] font-medium text-text-colortext-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryprimary-green"
        >
          {t("iqcHistory.viewPhoto")}
        </button>
      </DialogTrigger>
      <DialogContent
        className="w-[calc(100vw-2rem)] max-w-sm"
        showCloseButton={false}
      >
        <DialogTitle>{t("iqcHistory.upnPhoto")}</DialogTitle>
        <img
          src={src}
          alt={t("iqcHistory.upnPhoto")}
          className="max-h-[70vh] w-full rounded-lg object-contain"
        />
        <DialogClose asChild>
          <button
            type="button"
            className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-strokestroke-gray px-3 text-[13px] font-medium text-text-colortext-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryprimary-green"
          >
            <X aria-hidden="true" className="h-4 w-4" />
            {t("common.close")}
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

function MaterialRow({
  material,
}: {
  material: NonNullable<StageRecord<"iqcScan">["data"]>["materials"][number];
}) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const passed = material.status === "PASS";

  return (
    <li className="px-3.5">
      <div className="flex min-h-[56px] items-center gap-2">
        <span className="min-w-0 flex-1">
          <span className="flex min-w-0 items-center justify-between gap-2">
            <span className="truncate text-[14px] font-semibold leading-5 text-text-colortext-black">
              {material.code}
            </span>
            <span
              className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold leading-4 ${
                passed
                  ? "bg-[#E7F5EC] text-[#006B3C]"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {passed ? (
                <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />
              ) : (
                <XCircle aria-hidden="true" className="h-3.5 w-3.5" />
              )}
              {t(passed ? "status.pass" : "status.reject")}
            </span>
          </span>
          <span className="mt-0.5 block truncate text-[13px] leading-[18px] text-text-colortext-gray">
            {material.englishName} · {material.chinaName} ·{" "}
            {t("iqcHistory.quantity", { count: material.quantity })}
          </span>
        </span>
      </div>
      <MoreDetails
        expanded={expanded}
        onToggle={() => setExpanded((current) => !current)}
      />
      {expanded && (
        <dl className="space-y-2 pb-3 text-[13px] leading-[18px]">
          <DetailValue label={t("iqcHistory.upnBarcode")} value={material.upnBarcode} />
          <DetailValue
            label={t("iqcHistory.notes")}
            value={material.notes || t("iqcHistory.noData")}
          />
          <div className="flex items-center justify-between gap-3">
            <dt className="text-text-colortext-gray">{t("iqcHistory.upnPhoto")}</dt>
            <dd>
              <PhotoPreview src={material.upnPhoto} />
            </dd>
          </div>
        </dl>
      )}
    </li>
  );
}

function CartonRow({
  carton,
  materials,
}: {
  carton: NonNullable<StageRecord<"iqcQaPass">["data"]>["cartons"][number];
  materials: NonNullable<StageRecord<"iqcScan">["data"]>["materials"];
}) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);

  return (
    <li className="px-3.5">
      <div className="flex min-h-[56px] items-center gap-2">
        <span className="min-w-0 flex-1">
          <span className="flex min-w-0 items-center justify-between gap-2">
            <span className="truncate text-[14px] font-semibold leading-5 text-text-colortext-black">
              {carton.code}
            </span>
            <span
              className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold leading-4 ${
                carton.verified
                  ? "bg-[#E7F5EC] text-[#006B3C]"
                  : "bg-slate-100 text-text-colortext-gray"
              }`}
            >
              {carton.verified ? (
                <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />
              ) : (
                <XCircle aria-hidden="true" className="h-3.5 w-3.5" />
              )}
              {t(carton.verified ? "iqcHistory.verified" : "iqcHistory.notVerified")}
            </span>
          </span>
          <span className="mt-0.5 block truncate text-[12px] leading-4 text-text-colortext-gray">
            {t("iqcHistory.materialsScanned", {
              scanned: carton.materialsScanned,
              total: carton.totalMaterials,
            })}{" "}
            · {t(carton.cartonStickerScanned ? "iqcHistory.stickerScanned" : "iqcHistory.notScanned")}
          </span>
        </span>
      </div>
      <MoreDetails
        expanded={expanded}
        onToggle={() => setExpanded((current) => !current)}
      />
      {expanded && (
        <ul className="space-y-2 pb-3">
          <li className="text-[12px] leading-4 text-text-colortext-gray">
            {t("iqcHistory.upnScanned")}:{" "}
            {t(carton.upnScanned ? "iqcHistory.verified" : "iqcHistory.notScanned")}
          </li>
          {materials.slice(0, carton.materialsScanned).map((material) => (
            <li
              key={material.code}
              className="flex flex-col gap-0.5 text-[12px] leading-4"
            >
              <span className="font-semibold text-text-colortext-black">
                {material.code} · {material.englishName} {material.chinaName}
              </span>
              <span className="break-all text-text-colortext-gray">
                {material.upnBarcode}
              </span>
            </li>
          ))}
          {materials.length === 0 && (
            <li className="text-[12px] leading-4 text-text-colortext-gray">
              {t("iqcHistory.noData")}
            </li>
          )}
        </ul>
      )}
    </li>
  );
}

export default function StageDetailView({
  mo,
  stage,
  onBack,
  role,
}: {
  role: Role;
  mo: MoDetail;
  stage: StageDetail;
  onBack: () => void;
}) {
  const { t } = useI18n();

  if (!canViewStageDetail(role, stage.stageKey)) {
    return (
      <>
        <BackTitle
          title={t(STAGE_LABELS[stage.stageKey])}
          onBack={onBack}
          backLabel={t("common.back")}
        />
        <p className="mt-3 rounded-2xl border border-strokestroke-gray bg-backgroundbg-white p-4 text-[13px] leading-[18px] text-text-colortext-gray">
          {t("iqcHistory.noAccess")}
        </p>
      </>
    );
  }

  const identity = stage.stageKey === "iqcScan" ? stage.data : null;
  const verification = stage.stageKey === "iqcQaPass" ? stage.data : null;
  const identityStage = getIdentityStage(mo.stages);
  const scannedMaterials = identityStage?.data?.materials ?? [];
  const isIqcStage = identity !== null || verification !== null;
  const count = identity?.materials.length ?? verification?.cartons.length ?? 0;
  const pieces =
    identity?.materials.reduce((sum, material) => sum + material.quantity, 0) ??
    0;
  const statusText =
    stage.status === "completed"
      ? t("status.completed")
      : stage.status === "rejected"
        ? t("status.rejected")
        : stage.status === "in-progress"
          ? t("status.inProgress")
          : t("status.notStarted");

  return (
    <>
      <div className="mb-2">
        <BackTitle
          title={t(STAGE_LABELS[stage.stageKey])}
          onBack={onBack}
          backLabel={t("common.back")}
        />
      </div>

      <section className="rounded-2xl border border-strokestroke-gray bg-backgroundbg-white p-3.5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[14px] font-semibold leading-5 text-text-colortext-black">
            {t("iqcHistory.recordedDetails")}
          </h2>
          <HistoryStatus status={stage.status} label={statusText} />
        </div>
        {stage.timestamp && (
          <p className="mt-2 text-[12px] leading-4 text-text-colortext-gray">
            {stage.timestamp}
          </p>
        )}
        {stage.employeeName && (
          <p className="mt-1 text-[13px] leading-[18px] text-text-colortext-black">
            {stage.employeeName}
            {stage.employeeId ? ` · ${stage.employeeId}` : ""}
          </p>
        )}
        {stage.completionMessage && (
          <p className="mt-1 text-[13px] leading-[18px] text-text-colortext-gray">
            {t(stage.completionMessage)}
          </p>
        )}
        {stage.rejectionReason && (
          <p className="mt-2 rounded-lg bg-red-50 p-3 text-[13px] leading-[18px] text-red-700">
            <span className="font-semibold">
              {t("history.detail.rejectionReason")}:{" "}
            </span>
            {stage.rejectionReason}
          </p>
        )}
      </section>

      {stage.status === "pending" || stage.data === null ? (
        <p className="mt-3 rounded-2xl border border-strokestroke-gray bg-backgroundbg-white p-4 text-center text-[13px] leading-[18px] text-text-colortext-gray">
          {stage.status === "pending"
            ? t("iqcHistory.notStartedYet")
            : t("iqcHistory.noData")}
        </p>
      ) : !isIqcStage ? (
        <section className="mt-3">
          <StageRows stage={stage} />
        </section>
      ) : count === 0 ? (
        <p className="mt-3 rounded-2xl border border-strokestroke-gray bg-backgroundbg-white p-4 text-center text-[13px] leading-[18px] text-text-colortext-gray">
          {t("iqcHistory.noData")}
        </p>
      ) : (
        <section className="mt-3">
          {identity && (
            <ul className="overflow-hidden rounded-2xl border border-strokestroke-gray bg-backgroundbg-white divide-y divide-strokestroke-gray">
              {identity.materials.map((material, index) => (
                <MaterialRow
                  key={`${material.code}-${index}`}
                  material={material}
                />
              ))}
            </ul>
          )}
          {verification && (
            <ul className="overflow-hidden rounded-2xl border border-strokestroke-gray bg-backgroundbg-white divide-y divide-strokestroke-gray">
              {verification.cartons.map((carton) => (
                <CartonRow
                  key={carton.code}
                  carton={carton}
                  materials={scannedMaterials}
                />
              ))}
            </ul>
          )}
          <p className="mt-2 rounded-xl bg-[#E7F5EC] px-3.5 py-3 text-[13px] font-medium leading-[18px] text-[#006B3C]">
            {identity
              ? t("iqcHistory.materialsSummary", { count, pieces })
              : t("iqcHistory.cartonsSummary", { count })}
          </p>
        </section>
      )}
    </>
  );
}
