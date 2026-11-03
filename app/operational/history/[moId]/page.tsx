import MoDetailView from "@/components/history/MoDetailView";
import { HISTORY_BASE_PATH } from "@/lib/mo-detail/access";

export default async function MoDetailPage({
  params,
}: {
  params: Promise<{ moId: string }>;
}) {
  const { moId } = await params;

  return (
    <MoDetailView
      moId={moId}
      role="pmc"
      historyHref={HISTORY_BASE_PATH.pmc}
    />
  );
}
