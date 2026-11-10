"use client";

import { useSyncExternalStore } from "react";

export const DESKTOP_BREAKPOINT = 768;

const MEDIA_QUERY = `(min-width: ${DESKTOP_BREAKPOINT}px)`;

function subscribe(onStoreChange: () => void) {
  const mediaQueryList = window.matchMedia(MEDIA_QUERY);
  mediaQueryList.addEventListener("change", onStoreChange);

  return () => mediaQueryList.removeEventListener("change", onStoreChange);
}

function getSnapshot() {
  return window.matchMedia(MEDIA_QUERY).matches;
}

function getServerSnapshot() {
  return undefined;
}

export function useIsDesktop(): boolean | undefined {
  return useSyncExternalStore<boolean | undefined>(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
}
