
"use client";

import { ClipboardList, Tags, History } from "lucide-react";

export type MobileNavItem =
  | "identity"
  | "verification"
  | "history"
  | "packing-list"
  | "carton-sticker";

export type NavItem = {
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
      className="fixed inset-x-0 bottom-0 z-40 bg-white/70 pb-[calc(var(--bottom-nav-pad-b)+env(safe-area-inset-bottom,0px))] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] backdrop-blur-xl backdrop-saturate-150 supports-[not_(backdrop-filter:blur(1px))]:bg-white"
    >
      <div
        className="mx-auto flex h-[var(--bottom-nav-content-h)] w-full max-w-[412px] items-center px-2"
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
              className="group flex h-full min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 [-webkit-tap-highlight-color:transparent] focus-visible:outline-none"
            >
              <span
                className={`flex h-10 w-10 aspect-square shrink-0 items-center justify-center rounded-full transition-[background-color,transform] duration-200 group-active:scale-90 group-focus-visible:ring-2 group-focus-visible:ring-primaryprimary-green motion-reduce:transition-none motion-reduce:group-active:scale-100 ${
                  active
                    ? "bg-[#E7F5EC] text-[#006B3C]"
                    : "bg-transparent text-text-colortext-gray group-active:bg-backgroundbg-gray md:group-hover:bg-backgroundbg-gray md:group-hover:text-text-colortext-dark"
                }`}
              >
                <Icon
                  className="h-6 w-6"
                  strokeWidth={active ? 2 : 1.7}
                  aria-hidden="true"
                />
              </span>
              <span
                className={`max-w-full truncate whitespace-nowrap text-[11px] max-md:text-pill max-md:font-semibold max-md:leading-[14px] leading-[14px] ${
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
