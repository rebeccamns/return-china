
"use client";

import { ClipboardList, Tags, History } from "lucide-react";

export type MobileNavItem =
  | "identity"
  | "verification"
  | "history"
  | "packing-list"
  | "carton-sticker";

type NavItem = {
  id: MobileNavItem;
  label: string;
  icon: typeof ClipboardList;
};

type MobileBottomNavProps = {
  activeItem: MobileNavItem;
  onNavigate: (item: MobileNavItem) => void;
  items?: NavItem[];
};

const IQC_ITEMS: NavItem[] = [
  // Move these labels to i18n keys when navigation localization is added.
  { id: "identity", label: "Identity", icon: ClipboardList },
  { id: "verification", label: "Verification", icon: Tags },
  { id: "history", label: "History", icon: History },
];

const STAFF_RETURN_ITEMS: NavItem[] = [
  { id: "packing-list", label: "Packing List", icon: ClipboardList },
  { id: "carton-sticker", label: "Carton Sticker", icon: Tags },
  { id: "history", label: "History", icon: History },
];

export { IQC_ITEMS, STAFF_RETURN_ITEMS };

export default function MobileBottomNav({
  activeItem,
  onNavigate,
  items = IQC_ITEMS,
}: MobileBottomNavProps) {
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 bg-white/90 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-xl"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 border-t border-strokestroke-gray"
      />
      <div
        className="mx-auto flex w-full max-w-[412px] items-center px-2"
        style={{ height: "var(--bottom-nav-content-h)" }}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const active = activeItem === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl transition-transform active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryprimary-green focus-visible:ring-offset-1 md:hover:bg-slate-50 ${
                active
                  ? "text-text-colortext-green"
                  : "text-text-colortext-gray md:hover:text-text-colortext-dark"
              }`}
            >
              <span
                className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors duration-200 ${
                  active ? "bg-[#E7F5EC]" : "bg-transparent"
                }`}
              >
                <Icon
                  className={`h-6 w-6 ${
                    active
                      ? "text-text-colortext-green"
                      : "text-text-colortext-gray"
                  }`}
                  strokeWidth={active ? 2 : 1.7}
                  aria-hidden="true"
                />
              </span>
              <span
                className={`block max-w-full truncate whitespace-nowrap text-[11px] leading-[14px] ${
                  active
                    ? "font-semibold text-text-colortext-green"
                    : "font-medium text-text-colortext-gray"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
