"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { listMoSummaries } from "@/lib/mo-detail/data";
import type { MobileNavItem } from "@/components/layout/mobile-bottom-nav";

import HistoryList from "@/components/mobile-history/HistoryList";
import HistoryLoading from "@/components/mobile-history/HistoryLoading";
import HistoryShell from "@/components/mobile-history/HistoryShell";

const DEFAULT_MO_ID = "20260831002";

export default function IQCHistoryPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  function navigate(item: MobileNavItem) {
    switch (item) {
      case "identity":
        // TODO: Replace this fallback with the selected/default MO when available.
        router.push(`/iqc/${DEFAULT_MO_ID}`);
        break;
      case "verification":
        // TODO: Replace this fallback with the selected/default MO when available.
        router.push(`/iqc-verification/${DEFAULT_MO_ID}`);
        break;
      case "history":
        router.push("/iqc-history");
        break;
      case "packing-list":
      case "carton-sticker":
        break;
    }
  }

  return (
    <HistoryShell onNavigate={navigate}>
      {ready ? (
        <HistoryList summaries={listMoSummaries()} basePath="/iqc-history" />
      ) : (
        <HistoryLoading />
      )}
    </HistoryShell>
  );
}
