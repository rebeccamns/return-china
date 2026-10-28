"use client";

import { Check, Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/i18n";
import type { Locale } from "@/i18n";

const OPTIONS: { value: Locale; labelKey: "language.english" | "language.chinese" }[] = [
  { value: "en", labelKey: "language.english" },
  { value: "zh-CN", labelKey: "language.chinese" },
];

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  const current = OPTIONS.find((option) => option.value === locale) ?? OPTIONS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="h-8 gap-1.5 rounded-md px-2 text-xs font-medium text-text-colortext-dark hover:bg-slate-50"
          aria-label={t("language.label")}
        >
          <Languages className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          <span>{t(current.labelKey)}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setLocale(option.value)}
            className="flex items-center justify-between gap-4"
            aria-current={locale === option.value ? "true" : undefined}
          >
            <span>{t(option.labelKey)}</span>
            {locale === option.value && (
              <Check className="h-4 w-4 text-[#0b5934]" aria-hidden="true" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
