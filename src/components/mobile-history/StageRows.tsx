"use client";

import { useState, type ReactNode } from "react";

import PhotoGroup from "@/components/history/PhotoGroup";
import { useI18n } from "@/i18n";
import type {
  MaterialInput,
  PhotoInput,
  StageDataMap,
  StageDetail,
} from "@/lib/mo-detail/types";

import { DetailValue, MoreDetails } from "./RowPrimitives";

const LIST_CLASS =
  "overflow-hidden rounded-2xl border border-strokestroke-gray bg-backgroundbg-white divide-y divide-strokestroke-gray";
const CARD_CLASS =
  "rounded-2xl border border-strokestroke-gray bg-backgroundbg-white p-3.5";

function SummaryCard({ fields }: { fields: { label: string; value: string }[] }) {
  return (
    <dl className={`${CARD_CLASS} mb-3 space-y-2 text-[13px] leading-[18px]`}>
      {fields.map((field) => (
        <DetailValue
          key={field.label}
          label={field.label}
          value={field.value || "—"}
        />
      ))}
    </dl>
  );
}

function Row({
  title,
  subtitle,
  trailing,
  details,
}: {
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  details?: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <li className="px-3.5">
      <div className="flex min-h-[56px] items-center gap-2 py-2">
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-semibold leading-5 text-text-colortext-black">
            {title}
          </span>
          {subtitle && (
            <span className="mt-0.5 block break-words text-[13px] leading-[18px] text-text-colortext-gray">
              {subtitle}
            </span>
          )}
        </span>
        {trailing}
      </div>
      {details && (
        <>
          <MoreDetails
            expanded={expanded}
            onToggle={() => setExpanded((current) => !current)}
          />
          {expanded && (
            <dl className="space-y-2 pb-3 text-[13px] leading-[18px]">
              {details}
            </dl>
          )}
        </>
      )}
    </li>
  );
}

function Photos({ photos }: { photos: PhotoInput }) {
  const { t } = useI18n();

  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-text-colortext-gray">
        {t("history.detail.columns.photos")}
      </dt>
      <dd>
        <PhotoGroup photos={photos} />
      </dd>
    </div>
  );
}

function Pill({ children, ok }: { children: ReactNode; ok: boolean }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold leading-4 ${
        ok ? "bg-[#E7F5EC] text-[#006B3C]" : "bg-slate-100 text-text-colortext-gray"
      }`}
    >
      {children}
    </span>
  );
}

const materialName = (m: MaterialInput) => `${m.englishName} · ${m.chinaName}`;

function MaterialList({ materials }: { materials: MaterialInput[] }) {
  const { t } = useI18n();

  return (
    <ul className={LIST_CLASS}>
      {materials.map((material, index) => (
        <Row
          key={`${material.code}-${index}`}
          title={material.code}
          subtitle={`${materialName(material)} · ${t("iqcHistory.quantity", { count: material.quantity })}`}
        />
      ))}
    </ul>
  );
}

function PmcEntry({ data }: { data: StageDataMap["pmcEntry"] }) {
  const { t } = useI18n();

  return (
    <>
      <SummaryCard
        fields={[
          { label: t("common.model"), value: data.model },
          {
            label: t("history.detail.columns.projectNumber"),
            value: data.projectNumber,
          },
          {
            label: t("history.detail.fields.targetDeliveryDate"),
            value: data.targetDeliveryDate,
          },
        ]}
      />
      <MaterialList materials={data.materials} />
    </>
  );
}

function PmcOpenWo({ data }: { data: StageDataMap["pmcOpenWo"] }) {
  const { t } = useI18n();

  return (
    <>
      <SummaryCard
        fields={[
          { label: t("history.detail.fields.workOrder"), value: data.workOrder },
          {
            label: t("history.detail.fields.iqcStatus"),
            value: t(
              data.iqcStatus === "Passed" ? "status.passed" : "status.failed",
            ),
          },
        ]}
      />
      <MaterialList materials={data.materials} />
    </>
  );
}

function StaffReturn({ data }: { data: StageDataMap["staffReturn"] }) {
  const { t } = useI18n();

  return (
    <div className="space-y-3">
      {data.cartons.map((carton) => (
        <section key={carton.code}>
          <h3 className="mb-2 text-[13px] font-semibold leading-[18px] text-text-colortext-black">
            {carton.code} ·{" "}
            {t("history.detail.totalCartons", { count: carton.count })}
          </h3>
          <ul className={LIST_CLASS}>
            {carton.materials.map((material, index) => (
              <Row
                key={`${material.code}-${index}`}
                title={material.code}
                subtitle={`${materialName(material)} · ${t("history.detail.columns.quantityPerCarton")}: ${material.quantity} · ${t("history.detail.columns.totalQuantity")}: ${material.quantity * carton.count}`}
                details={
                  <>
                    <DetailValue
                      label={t("history.detail.columns.singleNetWeight")}
                      value={String(material.singleNetWeight)}
                    />
                    <DetailValue
                      label={t("history.detail.columns.netWeight")}
                      value={material.netWeight.toFixed(3)}
                    />
                    <DetailValue
                      label={t("history.detail.columns.grossWeight")}
                      value={material.grossWeight.toFixed(3)}
                    />
                    <DetailValue
                      label={t("history.detail.columns.volume")}
                      value={`${material.length} × ${material.width} × ${material.height}`}
                    />
                    <DetailValue
                      label={t("history.detail.columns.upnBarcode")}
                      value={material.upnBarcode || "—"}
                    />
                    <Photos photos={material.photos} />
                  </>
                }
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function Exim({ data }: { data: StageDataMap["exim"] }) {
  const { t } = useI18n();

  return (
    <>
      <SummaryCard
        fields={[
          { label: t("common.model"), value: data.model },
          { label: t("common.brand"), value: data.brand },
        ]}
      />
      <ul className={LIST_CLASS}>
        {data.materials.map((material, index) => (
          <Row
            key={`${material.code}-${index}`}
            title={material.code}
            subtitle={`${materialName(material)} · ${t("iqcHistory.quantity", { count: material.quantity })}`}
            details={
              <>
                <DetailValue
                  label={t("history.detail.columns.singleNetWeight")}
                  value={String(material.singleNetWeight)}
                />
                <DetailValue
                  label={t("history.detail.columns.netWeight")}
                  value={material.netWeight.toFixed(3)}
                />
                <DetailValue
                  label={t("history.detail.columns.grossWeight")}
                  value={material.grossWeight.toFixed(3)}
                />
                <DetailValue
                  label={t("history.detail.columns.volume")}
                  value={material.volume}
                />
                <DetailValue
                  label={t("history.detail.columns.upnBarcode")}
                  value={material.upnBarcode || "—"}
                />
                <Photos photos={material.photos} />
              </>
            }
          />
        ))}
      </ul>
    </>
  );
}

function Sticker({ data }: { data: StageDataMap["staffReturnSticker"] }) {
  const { t } = useI18n();
  const scanned = data.cartons.filter((carton) => carton.scanned).length;

  return (
    <>
      <ul className={LIST_CLASS}>
        {data.cartons.map((carton) => (
          <Row
            key={carton.code}
            title={carton.code}
            trailing={
              <Pill ok={carton.scanned}>
                {t(carton.scanned ? "history.detail.yes" : "history.detail.no")}
              </Pill>
            }
          />
        ))}
      </ul>
      <p className="mt-2 rounded-xl bg-[#E7F5EC] px-3.5 py-3 text-[13px] font-medium leading-[18px] text-[#006B3C]">
        {t("history.detail.totalCartons", { count: data.cartons.length })} ·{" "}
        {scanned} / {data.cartons.length}
      </p>
    </>
  );
}

// Stage bodies for the stages without a dedicated IQC layout.
export default function StageRows({ stage }: { stage: StageDetail }) {
  const { t } = useI18n();

  if (!stage.data) return null;

  switch (stage.stageKey) {
    case "pmcEntry":
      return stage.data && <PmcEntry data={stage.data} />;
    case "pmcOpenWo":
      return stage.data && <PmcOpenWo data={stage.data} />;
    case "staffReturn":
      return stage.data && <StaffReturn data={stage.data} />;
    case "exim":
      return stage.data && <Exim data={stage.data} />;
    case "staffReturnSticker":
      return stage.data && <Sticker data={stage.data} />;
    default:
      return (
        <p className="text-[13px] text-text-colortext-gray">
          {t("history.detail.noData")}
        </p>
      );
  }
}
