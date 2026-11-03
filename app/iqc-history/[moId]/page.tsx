"use client";

import { use, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import BackTitle from "@/components/layout/BackTitle";
import type { MobileNavItem } from "@/components/layout/mobile-bottom-nav";
import { useI18n } from "@/i18n";
import { getMoDetail } from "@/lib/mo-detail/data";
import type { StageDetail, StageKey } from "@/lib/mo-detail/types";

import HistoryShell, { DEFAULT_MO_ID } from "../_components/HistoryShell";
import HistoryLoading from "../_components/HistoryLoading";
import MoTimeline from "../_components/MoTimeline";
import StageDetailView from "../_components/StageDetailView";

export default function IQCHistoryDetailPage({
  params,
}: {
  params: Promise<{ moId: string }>;
}) {
  const { moId } = use(params);
  const router = useRouter();
  const { t } = useI18n();
  const mo = getMoDetail(moId);
  const [ready, setReady] = useState(false);
  const [selectedStageKey, setSelectedStageKey] = useState<StageKey | null>(
    null,
  );
  const timelineScrollY = useRef<number | null>(null);

  useEffect(() => setReady(true), []);

  useLayoutEffect(() => {
    if (selectedStageKey === null && timelineScrollY.current !== null) {
      window.scrollTo(0, timelineScrollY.current);
      timelineScrollY.current = null;
    }
  }, [selectedStageKey]);

  function navigate(item: MobileNavItem) {
    switch (item) {
      case "identity":
        router.push(`/iqc/${moId || DEFAULT_MO_ID}`);
        break;
      case "verification":
        router.push(`/iqc-verification/${moId || DEFAULT_MO_ID}`);
        break;
      case "history":
        router.push("/iqc-history");
        break;
      case "packing-list":
      case "carton-sticker":
        break;
    }
  }

  function selectStage(stage: StageDetail) {
    timelineScrollY.current = window.scrollY;
    setSelectedStageKey(stage.stageKey);
    window.scrollTo(0, 0);
  }

  const selectedStage = mo?.stages.find(
    (stage) => stage.stageKey === selectedStageKey,
  );

  return (
    <HistoryShell onNavigate={navigate}>
      {!ready ? (
        <HistoryLoading />
      ) : !mo ? (
        <section className="rounded-2xl border border-strokestroke-gray bg-backgroundbg-white p-4">
          <BackTitle
            title={t("iqcHistory.moNotFound")}
            onBack={() => router.push("/iqc-history")}
            backLabel={t("common.back")}
          />
          <p className="mt-2 text-[13px] leading-[18px] text-text-colortext-gray">
            {t("iqcHistory.moNotFoundHint", { moCode: moId })}
          </p>
        </section>
      ) : selectedStage ? (
        <StageDetailView
          mo={mo}
          stage={selectedStage}
          onBack={() => setSelectedStageKey(null)}
        />
      ) : (
        <MoTimeline
          mo={mo}
          onSelectStage={selectStage}
          onBack={() => router.push("/iqc-history")}
        />
      )}
    </HistoryShell>
  );
}
