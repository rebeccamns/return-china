import type { en } from "./dictionaries/en";

export type Locale = "en" | "zh-CN";

export type Dictionary = typeof en;

type LeafPaths<T> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : T[K] extends readonly unknown[]
      ? never
      : `${K}.${LeafPaths<T[K]>}`;
}[keyof T & string];

export type TranslationKey = LeafPaths<Dictionary>;

export type TranslationParams = Record<string, string | number>;
