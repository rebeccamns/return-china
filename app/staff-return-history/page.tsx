"use client";

import { useEffect, useState } from "react";

import { STAFF_RETURN_ITEMS } from "@/components/layout/mobile-bottom-nav";
import type { MobileNavItem } from "@/components/layout/mobile-bottom-nav";
import HistoryList from "@/components/mobile-history/HistoryList";
import HistoryLoading from "@/components/mobile-history/HistoryLoading";
import HistoryShell from "@/components/mobile-history/HistoryShell";
import { listMoSummaries } from "@/lib/mo-detail/data";
import { DEMO } from "@/lib/demo-data";

const DEFAULT_MO_ID = DEMO.moNumber;

export default function StaffReturnHistoryPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  function navigate(item: MobileNavItem) {
    switch (item) {
      case "packing-list":
        window.location.href = `/staff-return/${DEFAULT_MO_ID}`;
        break;
      case "carton-sticker":
        window.location.href = `/staff-return-sticker/${DEFAULT_MO_ID}`;
        break;
      case "history":
      case "identity":
      case "verification":
        break;
    }
  }

  return (
    <HistoryShell items={STAFF_RETURN_ITEMS} onNavigate={navigate}>
      {ready ? (
        <HistoryList
          summaries={listMoSummaries()}
          basePath="/staff-return-history"
        />
      ) : (
        <HistoryLoading />
      )}
    </HistoryShell>
  );
}
