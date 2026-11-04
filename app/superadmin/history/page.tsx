import MoHistoryPage from "@/components/history/MoHistoryPage";
import { HISTORY_BASE_PATH } from "@/lib/mo-detail/access";

export default function SuperadminHistoryPage() {
  return (
    <MoHistoryPage
      sidebarVariant="superadmin"
      historyHref={HISTORY_BASE_PATH.superadmin}
    />
  );
}
