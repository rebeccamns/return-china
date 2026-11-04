import MoDetailView from "@/components/history/MoDetailView";

export default async function WarehouseMoDetailPage({
  params,
}: {
  params: Promise<{ moId: string }>;
}) {
  const { moId } = await params;

  return (
    <MoDetailView
      moId={moId}
      role="warehouse"
      historyHref="/warehouse/history"
    />
  );
}
