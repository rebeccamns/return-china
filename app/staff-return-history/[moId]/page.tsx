"use client";

import { use, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import BackTitle from "@/components/layout/BackTitle";
import { STAFF_RETURN_ITEMS } from "@/components/layout/mobile-bottom-nav";
import type { MobileNavItem } from "@/components/layout/mobile-bottom-nav";
import { useI18n } from "@/i18n";
import { getMoDetail } from "@/lib/mo-detail/data";
import type { StageDetail, StageKey } from "@/lib/mo-detail/types";

import HistoryShell from "@/components/mobile-history/HistoryShell";
import HistoryLoading from "@/components/mobile-history/HistoryLoading";
import MoTimeline from "@/components/mobile-history/MoTimeline";
import StageDetailView from "@/components/mobile-history/StageDetailView";

const DEFAULT_MO_ID = "M01234";

export default function StaffReturnHistoryDetailPage({
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
      case "packing-list":
        window.location.href = `/staff-return/${DEFAULT_MO_ID}`;
        break;
      case "carton-sticker":
        window.location.href = `/staff-return-sticker/${DEFAULT_MO_ID}`;
        break;
      case "history":
        router.push("/staff-return-history");
        break;
      case "identity":
      case "verification":
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
    <HistoryShell items={STAFF_RETURN_ITEMS} onNavigate={navigate}>
      {!ready ? (
        <HistoryLoading />
      ) : !mo ? (
        <section className="rounded-2xl border border-strokestroke-gray bg-backgroundbg-white p-4">
          <BackTitle
            title={t("iqcHistory.moNotFound")}
            onBack={() => router.push("/staff-return-history")}
            backLabel={t("common.back")}
          />
          <p className="mt-2 text-[13px] leading-[18px] text-text-colortext-gray">
            {t("iqcHistory.moNotFoundHint", { moCode: moId })}
          </p>
        </section>
      ) : selectedStage ? (
        <StageDetailView
          mo={mo}
          role="staff"
          stage={selectedStage}
          onBack={() => setSelectedStageKey(null)}
        />
      ) : (
        <MoTimeline
          mo={mo} role="staff"
          onSelectStage={selectStage}
          onBack={() => router.push("/staff-return-history")}
        />
      )}
    </HistoryShell>
  );
}

