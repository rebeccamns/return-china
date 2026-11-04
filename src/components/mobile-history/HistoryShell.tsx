"use client";

import type { ReactNode } from "react";

import MobileBottomNav from "@/components/layout/mobile-bottom-nav";
import MobileCircleBackground from "@/components/layout/mobile-circle-background";
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
    <main className="mobile-body-copy relative min-h-screen w-full overflow-x-hidden bg-backgroundbg-gray antialiased max-md:bg-white">
      <section
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[255px] overflow-hidden max-md:hidden"
      >
        <div className="absolute -left-[90px] -top-[80px] h-[270px] w-[620px] rounded-[50%] bg-[#d8f4e2]" />
        <div className="absolute -left-[100px] top-[80px] h-[190px] w-[620px] rounded-[50%] bg-[#effbf3]" />
      </section>
      <MobileCircleBackground />

      <MobileHeader />

      <section className="relative z-10 mx-auto w-full max-w-[412px] px-4 pt-[calc(var(--mobile-header-h)+0.5rem)] pb-[calc(var(--bottom-nav-h)+24px)]">
        {children}
      </section>

      <MobileBottomNav items={items} activeItem="history" onNavigate={onNavigate} />
    </main>
  );
}
