"use client";

import { useSyncExternalStore } from "react";

import type { IQCMaterial } from "../[moId]/_components/iqc-types";

export type IqcSubmission = {
  moCode: string;
  materials: IQCMaterial[];
  submittedAt: number;
};

const EMPTY_SUBMISSIONS: IqcSubmission[] = [];
let submissions = EMPTY_SUBMISSIONS;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return submissions;
}

function getServerSnapshot() {
  return EMPTY_SUBMISSIONS;
}

export function getIqcSubmission(moCode: string) {
  return submissions.find((submission) => submission.moCode === moCode) ?? null;
}

export function recordIqcSubmission(
  moCode: string,
  materials: IQCMaterial[],
) {
  const submission = {
    moCode,
    materials: materials.map((material) => ({ ...material })),
    submittedAt: Date.now(),
  };

  submissions = [
    ...submissions.filter((item) => item.moCode !== moCode),
    submission,
  ];
  listeners.forEach((listener) => listener());
}

export function useIqcSubmissions() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
