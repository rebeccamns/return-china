
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
      className="fixed inset-x-0 bottom-0 z-40 border-t border-strokestroke-gray bg-white px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-2"
    >
      <div className="mx-auto flex w-full max-w-[412px] items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const active = activeItem === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-lg px-2 py-1.5 transition-colors ${
                active
                  ? "text-text-colortext-green"
                  : "text-text-colortext-gray hover:bg-slate-50 hover:text-text-colortext-dark"
              }`}
            >
              <Icon
                className="h-5 w-5"
                strokeWidth={active ? 2 : 1.7}
                aria-hidden="true"
              />
              <span
                className={`text-xs leading-4 ${
                  active ? "font-semibold" : "font-medium"
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
