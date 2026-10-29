import type { TranslationKey } from "@/i18n";

// Flow/stage names stay unchanged as internal values (they come from the
// data layer); only their display labels are translated.
const STAGE_LABEL_KEYS: Record<string, TranslationKey> = {
  "PMC MO Entry": "stages.pmcMoEntry",
  "IQC Scan": "stages.iqcScan",
  "PMC Open WO": "stages.pmcOpenWo",
  "Staff Return": "stages.staffReturn",
  "Exim": "stages.exim",
  "Staff Return 2": "stages.staffReturn2",
  "IQC QA Pass": "stages.iqcQaPass",
  // MO monitoring step aliases (short names)
  "PMC Entry": "stages.pmcMoEntry",
  "IQC": "stages.iqcScan",
};

export function stageLabelKey(stage: string): TranslationKey | null {
  return STAGE_LABEL_KEYS[stage] ?? null;
}
