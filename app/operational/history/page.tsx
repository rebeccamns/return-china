import MoHistoryPage from "@/components/history/MoHistoryPage";
import { HISTORY_BASE_PATH } from "@/lib/mo-detail/access";

export default function HistoryPage() {
  return (
    <MoHistoryPage
      sidebarVariant="pmc"
      historyHref={HISTORY_BASE_PATH.pmc}
    />
  );
}
