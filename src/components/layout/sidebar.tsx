
"use client";

import {
  ChevronDown,
  ClipboardList,
  History,
  LayoutDashboard,
  MonitorCheck,
  Ship,
  type LucideIcon,
} from "lucide-react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { DEMO } from "@/lib/demo-data";

type NavLink = {
  labelKey: TranslationKey;
  href: string;
  icon: LucideIcon;
  match?: string;
};

type NavGroup = {
  labelKey: TranslationKey;
  icon: LucideIcon;
  children: {
    labelKey: TranslationKey;
    href: string;
  }[];
};

type NavItem = NavLink | NavGroup;

export type SidebarVariant =
  | "pmc"
  | "exim"
  | "superadmin"
  | "warehouse"
  | "iqc";

const NAV: Record<SidebarVariant, NavItem[]> = {
  pmc: [
    {
      labelKey: "navigation.dashboard",
      href: "/operational",
      icon: LayoutDashboard,
    },
    {
      labelKey: "navigation.entry",
      icon: ClipboardList,
      children: [
        {
          labelKey: "navigation.moEntry",
          href: "/operational/mo-entry",
        },
        {
          labelKey: "navigation.woEntry",
          href: "/operational/wo-entry",
        },
      ],
    },
    {
      labelKey: "navigation.history",
      href: "/operational/history",
      icon: History,
    },
  ],

  exim: [
    {
      labelKey: "navigation.exim",
      href: "/exim",
      icon: Ship,
    },
    {
      labelKey: "navigation.history",
      href: "/exim/history",
      icon: History,
    },
  ],

  superadmin: [
    {
      labelKey: "navigation.dashboard",
      href: "/superadmin",
      icon: LayoutDashboard,
    },
    {
      labelKey: "navigation.moMonitoring",
      href: "/superadmin/mo-monitoring",
      icon: MonitorCheck,
    },
    {
      labelKey: "navigation.history",
      href: "/superadmin/history",
      icon: History,
    },
  ],

  warehouse: [
    {
      labelKey: "navigation.moList",
      href: "/warehouse",
      icon: ClipboardList,
    },
    {
      labelKey: "navigation.history",
      href: "/warehouse/history",
      icon: History,
    },
  ],

  iqc: [
    {
      labelKey: "navigation.iqcIdentity",
      href: "/iqc",
      match: "/iqc/",
      icon: ClipboardList,
    },
    {
      labelKey: "navigation.iqcVerification",
      href: `/iqc-verification/${DEMO.moNumber}`,
      match: "/iqc-verification/",
      icon: MonitorCheck,
    },
    {
      labelKey: "navigation.history",
      href: "/iqc-history",
      match: "/iqc-history",
      icon: History,
    },
  ],
};

// Dashboard/root routes must use exact matching.
const ROOT_ROUTES = [
  "/operational",
  "/exim",
  "/superadmin",
  "/warehouse",
];

export default function Sidebar({
  variant = "pmc",
}: {
  variant?: SidebarVariant;
}) {
  const pathname = usePathname();
  const { t } = useI18n();

  const items = NAV[variant];

  const groups = items.filter(
    (item): item is NavGroup => "children" in item,
  );

  const [openGroups, setOpenGroups] = useState<
    Record<string, boolean>
  >(
    Object.fromEntries(
      groups.map((group) => [
        group.labelKey,
        group.children.some(
          (child) =>
            pathname === child.href ||
            pathname.startsWith(`${child.href}/`),
        ),
      ]),
    ),
  );

  // Automatically expand the group when navigating to one of its children.
  useEffect(() => {
    const activeGroup = groups.find((group) =>
      group.children.some(
        (child) =>
          pathname === child.href ||
          pathname.startsWith(`${child.href}/`),
      ),
    );

    if (activeGroup) {
      setOpenGroups((prev) => ({
        ...prev,
        [activeGroup.labelKey]: true,
      }));
    }
  }, [pathname, variant]);

  // Determine whether a navigation link is active.
  const isLinkActive = (href: string, match?: string) => {
    if (match) {
      return pathname.startsWith(match);
    }

    if (ROOT_ROUTES.includes(href)) {
      return pathname === href;
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  const linkClass = (href: string, match?: string) => {
    const isActive = isLinkActive(href, match);

    return `flex h-10 items-center rounded px-2 transition-colors ${
      isActive
        ? "bg-[#DDEFE5]/80 text-text-colortext-green shadow-[inset_0_0_0_1px_rgba(11,89,52,0.05)] hover:bg-[#DDEFE5]"
        : "text-mode-sidebar-foreground hover:bg-slate-50"
    }`;
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-[3] flex w-full max-w-[255px] flex-col overflow-hidden border-r border-strokestroke-gray bg-white/70 backdrop-blur-xl backdrop-saturate-150 supports-[not(backdrop-filter)]:bg-white">

      {/* Decorative background */}
{/* Decorative glass background */}
<div className="pointer-events-none absolute inset-x-0 bottom-0 h-96 overflow-hidden">
  <img
    className="absolute left-0 top-0 h-[317px] w-full object-cover opacity-60"
    src="/rec-1.png"
    alt=""
    aria-hidden="true"
  />

  <img
    className="absolute left-0 top-[67px] h-[317px] w-full object-cover opacity-50"
    src="/rec-2.png"
    alt=""
    aria-hidden="true"
  />

  {/* Soft white glass overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-white/25 to-white/50" />
</div>

      {/* Header */}
      <header className="relative flex h-[52px] shrink-0 items-start p-2">
        <div className="flex min-w-0 flex-1 items-center gap-3 p-2">
          <div className="flex w-[59px] shrink-0 flex-col justify-center">
            <img
              className="h-auto w-full object-cover"
              src="/oppo-logo.png"
              alt="OPPO"
            />
          </div>

          <div className="flex min-w-0 flex-col justify-center">
            <span className="font-sans text-[10px] font-medium leading-[10px] text-text-colortext-black">
              Indonesia
            </span>

            <span className="whitespace-nowrap font-sans text-[10px] font-medium leading-5 text-text-colortext-black">
              Manufacturing
            </span>
          </div>
        </div>
{/* 
        <img
          className="h-[31px] w-[31px] shrink-0 object-cover"
          src="/ollie.png"
          alt="Ollie"
        /> */}
      </header>

      {/* Navigation */}
      <nav
        className="relative flex flex-col gap-1 px-4 py-2"
        aria-label={t("navigation.mainNavigation")}
      >
        <div className="flex h-8 items-center opacity-70">
          <span className="font-inter-xs-medium-xs text-xs font-medium leading-4 text-text-colortext-dark">
            {t("navigation.menu")}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {items.map((item) => {
            const Icon = item.icon;

            // Navigation group
            if ("children" in item) {
              const open = openGroups[item.labelKey] ?? false;

              const hasActiveChild = item.children.some(
                (child) => isLinkActive(child.href),
              );

              return (
                <section
                  key={item.labelKey}
                  className="flex flex-col gap-2"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    className={`h-10 w-full justify-start rounded px-2 text-left transition-colors ${
hasActiveChild
  ? "bg-[#DDEFE5]/60 text-text-colortext-green"
  : "bg-transparent text-mode-sidebar-foreground hover:bg-slate-50"
                    }`}
                    aria-expanded={open}
                    onClick={() =>
                      setOpenGroups((prev) => ({
                        ...prev,
                        [item.labelKey]: !prev[item.labelKey],
                      }))
                    }
                  >
                    <Icon
                      className="mr-3 h-5 w-5 shrink-0"
                      strokeWidth={1.75}
                    />

                    <span className="flex-1 truncate font-inter-sm-medium-sm text-sm font-medium leading-5">
                      {t(item.labelKey)}
                    </span>

                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform ${
                        open ? "rotate-0" : "-rotate-90"
                      }`}
                      strokeWidth={1.5}
                    />
                  </Button>

                  {open && (
                    <div className="ml-5 border-l border-mode-sidebar-border pl-3">
                      <div className="flex flex-col gap-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            className={linkClass(child.href)}
                            href={child.href}
                          >
                            <span className="truncate font-inter-sm-medium-sm text-sm font-medium leading-5">
                              {t(child.labelKey)}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              );
            }

            // Normal navigation link
            return (
              <Link
                key={item.href}
                className={linkClass(item.href, item.match)}
                href={item.href}
              >
                <Icon
                  className="mr-3 h-5 w-5 shrink-0"
                  strokeWidth={1.75}
                />

                <span className="truncate font-inter-sm-medium-sm text-sm font-medium leading-5">
                  {t(item.labelKey)}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
