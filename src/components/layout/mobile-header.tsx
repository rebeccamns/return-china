"use client";

import { LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/i18n";

type MobileHeaderProps = {
  userName?: string;
  userId?: string;
  onUserClick?: () => void;
};

export default function MobileHeader({
  userName = "Bagus Saputra",
  userId = "I0123456",
  onUserClick,
}: MobileHeaderProps = {}) {
  const router = useRouter();
  const { t } = useI18n();
  const initials = userName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();

  function handleLogout() {
    if (onUserClick) {
      onUserClick();
      return;
    }

    sessionStorage.clear();
    router.replace("/");
    router.refresh();
  }

  return (
    <header className="fixed inset-x-0 top-0 z-20 w-full border-b border-strokestroke-gray max-md:border-b-0 bg-glass pt-[env(safe-area-inset-top)] backdrop-blur-xl backdrop-saturate-150 supports-[not_(backdrop-filter:blur(1px))]:bg-backgroundbg-white">
      <div className="flex h-14 max-md:h-[52px] items-center justify-between gap-2 px-5 max-md:border-b max-md:border-strokestroke-gray max-md:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <img
            src="/oppo-logo.png"
            alt="OPPO"
            width={52}
            height={14}
            className="h-3.5 w-[52px] shrink-0 object-contain"
          />

          <span
            aria-hidden="true"
            className="h-4 w-px shrink-0 bg-strokestroke-gray"
          />

          <span className="min-w-0 text-[10px] font-medium leading-[12px] text-text-colortext-gray">
            Indonesia
            <br />
            Manufacturing
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="max-md:hidden">
            <ThemeToggle variant="compact" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={t("account.label")}
                className="flex min-h-11 min-w-0 max-w-[60%] items-center gap-2 rounded-full p-1 transition active:bg-backgroundbg-gray focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryprimary-green"
              >
                <span className="flex min-w-0 flex-col items-end max-md:hidden">
                  <span className="max-w-[120px] truncate text-[13px] font-semibold leading-4 text-text-colortext-black">
                    {userName}
                  </span>
                  <span className="max-w-[120px] truncate text-[11px] leading-4 text-text-colortext-gray">
                    {userId}
                  </span>
                </span>
                <span className="flex h-9 w-9 max-md:h-8 max-md:w-8 shrink-0 items-center justify-center rounded-full bg-[#E7F5EC] text-[12px] font-semibold text-[#006B3C] dark:bg-backgroundbg-green dark:text-brand-green-fg">
                  {initials || (
                    <UserRound
                      className="h-[18px] w-[18px]"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  )}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="flex items-center gap-3 px-2 py-2">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E7F5EC] text-sm font-semibold text-[#006B3C] dark:bg-backgroundbg-green dark:text-brand-green-fg">
                  {initials || (
                    <UserRound className="h-5 w-5" aria-hidden="true" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold leading-5 text-text-colortext-black">
                    {userName}
                  </p>
                  <p className="truncate text-xs leading-4 text-text-colortext-gray">
                    {userId}
                  </p>
                </div>
              </div>
              <div className="px-2 py-1.5">
                <ThemeToggle />
              </div>
              <div role="separator" className="-mx-1 my-1 h-px bg-strokestroke-gray" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer gap-2 text-text-colortext-red focus:text-text-colortext-red"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                {t("navigation.logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
