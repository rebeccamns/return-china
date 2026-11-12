"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { listMoSummaries } from "@/lib/mo-detail/data";
import type { MobileNavItem } from "@/components/layout/mobile-bottom-nav";

import HistoryList from "@/components/mobile-history/HistoryList";
import HistoryLoading from "@/components/mobile-history/HistoryLoading";
import HistoryShell from "@/components/mobile-history/HistoryShell";

export default function IqcHistoryMobile() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  function navigate(item: MobileNavItem) {
    switch (item) {
      case "identity":
        router.push("/iqc");
        break;
      case "verification":
        router.push("/iqc-verification");
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
