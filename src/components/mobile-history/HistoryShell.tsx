"use client";

import type { ReactNode } from "react";

import MobileBottomNav from "@/components/layout/mobile-bottom-nav";
import type {
  MobileNavItem,
  NavItem,
} from "@/components/layout/mobile-bottom-nav";
import MobileHeader from "@/components/layout/mobile-header";

export default function HistoryShell({
  children,
  onNavigate,
  items,
}: {
  children: ReactNode;
  onNavigate: (item: MobileNavItem) => void;
  items?: NavItem[];
}) {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-backgroundbg-gray antialiased">
      <section
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[255px] overflow-hidden"
      >
        <div className="absolute -left-[90px] -top-[80px] h-[270px] w-[620px] rounded-[50%] bg-[#d8f4e2]" />
        <div className="absolute -left-[100px] top-[80px] h-[190px] w-[620px] rounded-[50%] bg-[#effbf3]" />
      </section>

      <MobileHeader />

      <section className="relative z-10 mx-auto w-full max-w-[412px] px-4 pt-[calc(var(--mobile-header-h)+0.5rem)] pb-[calc(var(--bottom-nav-h)+24px)]">
        {children}
      </section>

      <MobileBottomNav items={items} activeItem="history" onNavigate={onNavigate} />
    </main>
  );
}
