"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { en } from "./dictionaries/en";
import { zhCN } from "./dictionaries/zh-CN";
import type {
  Dictionary,
  Locale,
  TranslationKey,
  TranslationParams,
} from "./types";

const STORAGE_KEY = "return-china-locale";

const dictionaries: Record<Locale, Dictionary> = {
  en,
  "zh-CN": zhCN,
};

export const SUPPORTED_LOCALES = Object.keys(dictionaries) as Locale[];

function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "zh-CN";
}

function resolve(dict: Dictionary, key: string): string | undefined {
  let node: unknown = dict;

  for (const part of key.split(".")) {
    if (node === null || typeof node !== "object" || !(part in node)) {
      return undefined;
    }
    node = (node as Record<string, unknown>)[part];
  }

  return typeof node === "string" ? node : undefined;
}

function interpolate(template: string, params?: TranslationParams): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, params?: TranslationParams) => string;
  dictionary: Dictionary;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isLocale(stored)) setLocaleState(stored);
    } catch {
      // localStorage unavailable — keep the default locale
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage unavailable — the choice only lasts for this session
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: TranslationParams): string => {
      const value = resolve(dictionaries[locale], key) ?? resolve(en, key);

      if (value === undefined) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`[i18n] Missing translation for key "${key}"`);
        }
        return "";
      }

      return interpolate(value, params);
    },
    [locale],
  );

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t, dictionary: dictionaries[locale] }),
    [locale, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
