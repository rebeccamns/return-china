"use client";

import { useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const isDark = theme === "dark" || (theme === "system" && getSystemTheme() === "dark");
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = (localStorage.getItem("theme") as Theme) || "system";
    setThemeState(stored);
    applyTheme(stored);

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = () => {
      const current = (localStorage.getItem("theme") as Theme) || "system";
      if (current === "system") {
        applyTheme("system");
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme") {
        const nextTheme = (e.newValue as Theme) || "system";
        setThemeState(nextTheme);
        applyTheme(nextTheme);
      }
    };

    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<Theme>;
      if (customEvent.detail) {
        setThemeState(customEvent.detail);
        applyTheme(customEvent.detail);
      }
    };

    mql.addEventListener("change", handleMediaChange);
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("theme-change", handleCustomChange);

    return () => {
      mql.removeEventListener("change", handleMediaChange);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("theme-change", handleCustomChange);
    };
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("theme", newTheme);
    } catch {}
    applyTheme(newTheme);
    window.dispatchEvent(new CustomEvent<Theme>("theme-change", { detail: newTheme }));
  };

  const resolvedTheme =
    theme === "system" ? (mounted ? getSystemTheme() : "light") : theme;

  return {
    theme,
    setTheme,
    resolvedTheme,
    mounted,
  };
}

