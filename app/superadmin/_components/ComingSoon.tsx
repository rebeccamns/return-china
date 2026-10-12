import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";

export default function ComingSoon({ title }: { title: string }) {
  return (
    <main className="min-h-screen w-full bg-backgroundbg-gray">
      <Sidebar variant="superadmin" />

      <div className="flex min-h-screen flex-col pl-[255px]">
        <TopBar />

        <div className="mt-[52px] w-full px-[18px] py-5">
          <nav className="mb-4 flex items-center gap-2 text-xs">
            <span className="text-text-colortext-gray">Dashboard</span>
            <span className="text-[#B5B5B3]">›</span>
            <span className="font-medium text-text-colortext-dark">{title}</span>
          </nav>
          <h1 className="text-lg font-semibold text-[#111111]">{title}</h1>
          <p className="mt-2 text-xs text-slate-500">Coming soon.</p>
        </div>
      </div>
    </main>
  );
}