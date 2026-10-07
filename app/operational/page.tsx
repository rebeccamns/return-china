import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import DashboardContent from "./_components/DashboardContent";

export default function OperationalPage() {
  return (
    <main className="min-h-screen w-full bg-backgroundbg-gray">
      <Sidebar />

      <div className="flex min-h-screen flex-col pl-[255px]">
        <TopBar />

        <div className="mt-[52px] w-full px-[18px] py-5">
          <DashboardContent />
        </div>
      </div>
    </main>
  );
}