import MoHistoryPage from "@/components/history/MoHistoryPage";
import { HISTORY_BASE_PATH } from "@/lib/mo-detail/access";

export default function WarehouseHistoryPage() {
  return (
    <MoHistoryPage
      sidebarVariant="warehouse"
      historyHref={HISTORY_BASE_PATH.warehouse}
    />
  );
}
