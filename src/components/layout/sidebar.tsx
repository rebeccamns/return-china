"use client";

import {
  ChevronDown,
  ChevronsUpDown,
  History,
  LayoutDashboard,
  LogOut,
  Table2,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

const navigationItems = [
  { label: "MO Entry", href: "/operational/mo-entry" },
  { label: "WO Entry", href: "/operational/wo-entry" },
];

export const DashboardNavigationSection = (): JSX.Element => {
  const pathname = usePathname();
  const [entryOpen, setEntryOpen] = useState(true);

  const linkClass = (href: string) =>
    `flex h-10 items-center rounded px-2 transition-colors ${
      pathname === href
        ? "bg-backgroundbg-green text-text-colortext-green hover:bg-backgroundbg-green/80"
        : "text-mode-sidebar-foreground hover:bg-slate-50"
    }`;

  return (
    <aside className="fixed inset-y-0 left-0 z-[3] flex w-full max-w-[255px] flex-col overflow-hidden border-r border-strokestroke-gray bg-white">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-96 overflow-hidden">
        <img
          className="absolute left-0 top-0 h-[317px] w-full object-cover"
          src="/rec-1.png"
          alt=""
          aria-hidden="true"
        />
        <img
          className="absolute left-0 top-[67px] h-[317px] w-full object-cover"
          src="/rec-2.png"
          alt=""
          aria-hidden="true"
        />
      </div>

      <header className="relative flex h-[52px] shrink-0 items-start bg-white p-2">
        <div className="flex min-w-0 flex-1 items-center gap-3 p-2">
          <div className="flex w-[59px] shrink-0 flex-col justify-center">
            <img
              className="h-auto w-full object-cover"
              src="/oppo-logo.png"
              alt="OPPO"
            />
          </div>

          <div className="flex min-w-0 flex-col justify-center">
            <span className="font-['Inter-Medium',Helvetica] text-[10px] font-medium leading-[10px] text-text-colortext-black">
              Indonesia
            </span>
            <span className="whitespace-nowrap font-['Inter-Medium',Helvetica] text-[10px] font-medium leading-5 text-text-colortext-black">
              Manufacturing
            </span>
          </div>
        </div>

        <img
          className="h-[31px] w-[31px] shrink-0 object-cover"
          src="/ollie.png"
          alt="Ollie"
        />
      </header>

      <nav
        className="relative flex flex-col gap-1 px-4 py-2"
        aria-label="Main navigation"
      >
        <div className="flex h-8 items-center opacity-70">
          <span className="font-inter-xs-medium-xs text-xs font-medium leading-4 text-text-colortext-dark">
            MENU
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <Link
            className={linkClass("/operational")}
            href="/operational"
          >
            <LayoutDashboard
              className="mr-2 h-6 w-6 shrink-0"
              strokeWidth={1.5}
            />

            <span className="truncate font-inter-sm-medium-sm text-sm font-medium leading-5">
              Dashboard
            </span>
          </Link>

          <section className="flex flex-col gap-2">
            <Button
              type="button"
              variant="ghost"
              className="h-10 w-full justify-start rounded bg-white px-2 text-left text-mode-sidebar-foreground hover:bg-slate-50"
              aria-expanded={entryOpen}
              onClick={() => setEntryOpen((open) => !open)}
            >
              <Table2
                className="mr-2 h-6 w-6 shrink-0"
                strokeWidth={1.5}
              />

              <span className="flex-1 truncate font-inter-sm-medium-sm text-sm font-medium leading-5">
                Entry
              </span>

              <ChevronDown
                className={`h-4 w-4 shrink-0 transition-transform ${
                  entryOpen ? "rotate-0" : "-rotate-90"
                }`}
                strokeWidth={1.5}
              />
            </Button>

            {entryOpen && (
              <div className="ml-5 border-l border-mode-sidebar-border pl-3">
                <div className="flex flex-col gap-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.label}
                      className={linkClass(item.href)}
                      href={item.href}
                    >
                      <span className="truncate font-inter-sm-medium-sm text-sm font-medium leading-5">
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>

          <Link
            className={linkClass("/operational/history")}
            href="/operational/history"
          >
            <History
              className="mr-2 h-6 w-6 shrink-0"
              strokeWidth={1.5}
            />

            <span className="truncate font-inter-sm-medium-sm text-sm font-medium leading-5">
              History
            </span>
          </Link>
        </div>
      </nav>

      <footer className="relative mt-auto flex shrink-0">
        <Button
          type="button"
          variant="ghost"
          className="h-auto w-full justify-start gap-2.5 rounded-none p-4 hover:bg-slate-50"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[linear-gradient(0deg,rgba(11,89,52,1)_0%,rgba(5,131,70,1)_100%)] p-1 text-white">
            <UserRound
              className="h-4 w-4"
              strokeWidth={1.5}
            />
          </span>

          <span className="flex min-w-0 flex-1 flex-col items-start text-left">
            <span className="w-full truncate font-inter-sm-semibold-sm text-sm font-semibold leading-5 text-text-colortext-black">
              Bagus Saputra
            </span>

            <span className="w-full truncate text-xs leading-5 text-text-colortext-black">
              I0123456
            </span>
          </span>

          <ChevronsUpDown
            className="h-4 w-4 shrink-0"
            strokeWidth={1.5}
          />
        </Button>

       
      </footer>
    </aside>
  );
};

export default DashboardNavigationSection;