import MoDetailView from "@/components/history/MoDetailView";

export default async function EximMoDetailPage({
  params,
}: {
  params: Promise<{ moId: string }>;
}) {
  const { moId } = await params;

  return (
    <MoDetailView
      moId={moId}
      role="exim"
      historyHref="/exim/history"
    />
  );
}
