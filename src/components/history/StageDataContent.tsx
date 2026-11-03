"use client";

import { useI18n } from "@/i18n";
import type { StageDetail } from "@/lib/mo-detail/types";
import EximTable from "./EximTable";
import IqcQaPassTable from "./IqcQaPassTable";
import IqcScanTable from "./IqcScanTable";
import PmcEntryTable from "./PmcEntryTable";
import PmcOpenWoTable from "./PmcOpenWoTable";
import StaffReturnTable from "./StaffReturnTable";
import StickerScanTable from "./StickerScanTable";

function isEmpty(stage: StageDetail): boolean {
  if (!stage.data) return true;

  switch (stage.stageKey) {
    case "pmcEntry":
    case "iqcScan":
    case "pmcOpenWo":
    case "exim":
      return stage.data.materials.length === 0;
    case "staffReturn":
      return stage.data.cartons.length === 0;
    case "staffReturnSticker":
    case "iqcQaPass":
      return stage.data.cartons.length === 0;
  }
}

export default function StageDataContent({
  stage,
}: {
  stage: StageDetail;
}) {
  const { t } = useI18n();

  if (isEmpty(stage)) {
    return (
      <p className="rounded-md bg-slate-50 p-3 text-xs text-text-colortext-gray">
        {t("history.detail.noData")}
      </p>
    );
  }

  switch (stage.stageKey) {
    case "pmcEntry":
      return stage.data && <PmcEntryTable data={stage.data} />;
    case "iqcScan":
      return stage.data && <IqcScanTable data={stage.data} />;
    case "pmcOpenWo":
      return stage.data && <PmcOpenWoTable data={stage.data} />;
    case "staffReturn":
      return stage.data && <StaffReturnTable data={stage.data} />;
    case "exim":
      return stage.data && <EximTable data={stage.data} />;
    case "staffReturnSticker":
      return stage.data && <StickerScanTable data={stage.data} />;
    case "iqcQaPass":
      return stage.data && <IqcQaPassTable data={stage.data} />;
    default: {
      const exhaustive: never = stage;
      return exhaustive;
    }
  }
}
