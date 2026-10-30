"use client";

import { UserRound } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const initials = userName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();

  function handleUserClick() {
    if (onUserClick) {
      onUserClick();
      return;
    }

    sessionStorage.clear();
    router.replace("/");
    router.refresh();
  }

  return (
    <header className="fixed inset-x-0 top-0 z-20 w-full bg-white/90 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between gap-2 border-b border-strokestroke-gray px-5">
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

        <button
          type="button"
          onClick={handleUserClick}
          aria-label={userName}
          className="flex min-h-11 min-w-0 max-w-[60%] items-center gap-2 rounded-full p-1 transition active:bg-backgroundbg-gray focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryprimary-green"
        >
          <span className="flex min-w-0 flex-col items-end">
            <span className="max-w-[120px] truncate text-[13px] font-semibold leading-4 text-text-colortext-black">
              {userName}
            </span>
            <span className="max-w-[120px] truncate text-[11px] leading-4 text-text-colortext-gray">
              {userId}
            </span>
          </span>

          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E7F5EC] text-[12px] font-semibold text-[#006B3C]">
            {initials || (
              <UserRound
                className="h-[18px] w-[18px]"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            )}
          </span>
        </button>
      </div>
    </header>
  );
}
