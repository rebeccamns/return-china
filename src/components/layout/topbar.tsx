"use client";

import { useEffect, useState } from "react";

import LanguageSwitcher from "./language-switcher";
import UserMenu from "./user-menu";
import { useI18n } from "@/i18n";

const TopBarSection = (): JSX.Element => {
  const { locale } = useI18n();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const updateTime = () => setNow(new Date());
    updateTime();
    const intervalId = window.setInterval(updateTime, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const dateLocale = locale === "zh-CN" ? "zh-CN" : "en-US";
  const topBarDetails = now
    ? [
        new Intl.DateTimeFormat(dateLocale, {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(now),
        new Intl.DateTimeFormat(dateLocale, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(now),
      ]
    : ["—", "--:--"];

  return (
    <header className="fixed top-0 left-[255px] right-0 z-[2] flex h-[52px] items-center border-b border-strokestroke-gray bg-glass pl-0 pr-6 backdrop-blur-xl backdrop-saturate-150 supports-[not(backdrop-filter)]:bg-backgroundbg-white">
      <div className="flex flex-1 self-stretch items-center justify-end gap-6 px-5">
        <LanguageSwitcher />
        <div className="inline-flex flex-[0_0_auto] items-center gap-6">
          {topBarDetails.map((detail) => (
            <span
              key={detail}
              className="relative mt-[-1.00px] w-fit whitespace-nowrap text-xs font-medium leading-4 text-text-colortext-black"
            >
              {detail}
            </span>
          ))}
        </div>
        <UserMenu />
      </div>
    </header>
  );
};

export default TopBarSection;