"use client";

import { LogOut, UserRound } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const USER = { name: "Bagus Saputra", nik: "I0123456" };

function roleKey(pathname: string): TranslationKey {
  if (pathname.startsWith("/exim")) return "account.exim";
  if (pathname.startsWith("/superadmin")) return "account.superadmin";
  return "account.pmc";
}

export default function UserMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();

  const handleLogout = () => {
    sessionStorage.clear();
    router.replace("/");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          aria-label={t("account.label")}
          className="h-9 gap-2 rounded-md px-2 text-black hover:bg-slate-50"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E7F5EC] text-[#08783F]">
            <UserRound className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <span className="max-w-[140px] truncate text-xs font-medium text-black">
            {USER.name}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <div className="flex items-center gap-3 px-2 py-2">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(0deg,rgba(11,89,52,1)_0%,rgba(5,131,70,1)_100%)] text-sm font-semibold text-white">
            {USER.name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold leading-5 text-text-colortext-black">
              {USER.name}
            </p>
            <p className="truncate text-xs leading-4 text-text-colortext-gray">
              {USER.nik}
            </p>
            <span className="mt-1 inline-flex rounded-full bg-[#E7F5EC] px-2 py-0.5 text-[11px] font-semibold leading-4 text-[#006B3C]">
              {t(roleKey(pathname))}
            </span>
          </div>
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
  );
}
