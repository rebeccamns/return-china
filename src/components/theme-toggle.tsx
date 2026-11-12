"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type Theme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "sidebar" | "compact";
}

const OPTIONS: { key: Theme; label: string; icon: typeof Sun }[] = [
  { key: "light", label: "Light", icon: Sun },
  // { key: "system", label: "Auto", icon: Monitor },
  { key: "dark", label: "Dark", icon: Moon },
];

export function ThemeToggle({ className, variant = "sidebar" }: ThemeToggleProps) {
  const { theme, setTheme, mounted } = useTheme();

  // Until mounted, default to system rendering
  const activeTheme = mounted ? theme : "system";

  if (variant === "compact") {
    return (
      <div
        role="group"
        aria-label="Theme mode"
        className={cn(
          "inline-flex h-8 items-center rounded-lg border border-strokestroke-gray bg-backgroundbg-bluish-gray p-0.5",
          className
        )}
      >
        {OPTIONS.map(({ key, label, icon: Icon }) => {
          const isActive = activeTheme === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTheme(key)}
              title={`${label} mode`}
              aria-label={`${label} mode`}
              aria-pressed={isActive}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md transition-all",
                isActive
                  ? "bg-backgroundbg-white text-text-colortext-black shadow-xs"
                  : "text-text-colortext-gray hover:text-text-colortext-dark"
              )}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="Theme selection"
      className={cn(
        "flex w-full items-center rounded-lg border border-strokestroke-gray bg-backgroundbg-bluish-gray p-1",
        className
      )}
    >
      {OPTIONS.map(({ key, label, icon: Icon }) => {
        const isActive = activeTheme === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => setTheme(key)}
            aria-pressed={isActive}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-all",
              isActive
                ? "bg-backgroundbg-white text-text-colortext-black shadow-xs font-semibold"
                : "text-text-colortext-gray hover:text-text-colortext-dark"
            )}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default ThemeToggle;

