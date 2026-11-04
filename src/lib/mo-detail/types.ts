import type { TranslationKey } from "@/i18n";

export const STAGE_KEYS = [
  "pmcEntry",
  "iqcScan",
  "pmcOpenWo",
  "staffReturn",
  "exim",
  "staffReturnSticker",
  "iqcQaPass",
] as const;

export type StageKey = (typeof STAGE_KEYS)[number];
export type Role = "pmc" | "iqc" | "staff" | "exim" | "superadmin" | "warehouse";
export type MOStatus = "Completed" | "In Progress" | "Rejected" | "Pending";
export type StageStatus = "completed" | "in-progress" | "pending" | "rejected";
export type IQCStatus = "PASS" | "REJECT";

export type MaterialInput = {
  code: string;
  englishName: string;
  chinaName: string;
  quantity: number;
};

export type PhotoInput = {
  front: string | null;
  back: string | null;
  upn: string | null;
};

export type StaffReturnMaterial = MaterialInput & {
  singleNetWeight: number;
  netWeight: number;
  grossWeight: number;
  length: number;
  width: number;
  height: number;
  upnBarcode: string;
  photos: PhotoInput;
};

export type StageDataMap = {
  pmcEntry: {
    model: string;
    projectNumber: string;
    targetDeliveryDate: string;
    materials: MaterialInput[];
  };
  iqcScan: {
    materials: {
      code: string;
      englishName: string;
      chinaName: string;
      quantity: number;
      upnBarcode: string;
      upnPhoto: string | null;
      status: IQCStatus;
      notes: string;
    }[];
  };
  pmcOpenWo: {
    workOrder: string;
    iqcStatus: "Passed" | "Failed";
    materials: MaterialInput[];
  };
  staffReturn: {
    returnId: string;
    cartons: {
      code: string;
      count: number;
      materials: StaffReturnMaterial[];
    }[];
  };
  exim: {
    model: string;
    brand: string;
    materials: (MaterialInput & {
      singleNetWeight: number;
      netWeight: number;
      grossWeight: number;
      volume: string;
      upnBarcode: string;
      photos: PhotoInput;
    })[];
  };
  staffReturnSticker: {
    cartons: { code: string; scanned: boolean }[];
  };
  iqcQaPass: {
    cartons: {
      code: string;
      materialsScanned: number;
      totalMaterials: number;
      upnScanned: boolean;
      cartonStickerScanned: boolean;
      verified: boolean;
    }[];
  };
};

export type StageRecord<K extends StageKey> = {
  stageKey: K;
  status: StageStatus;
  timestamp: string | null;
  employeeName: string | null;
  employeeId: string | null;
  completionMessage: TranslationKey | null;
  rejectionReason: string | null;
  data: StageDataMap[K] | null;
};

export type StageDetail = {
  [K in StageKey]: StageRecord<K>;
}[StageKey];

export type MoDetail = {
  moCode: string;
  returnId: string;
  batchNumber: string;
  productDescription: string;
  overallStatus: MOStatus;
  model: string;
  projectNumber: string;
  submittedBy: string;
  submittedAt: string;
  stages: StageDetail[];
};

export type MoSummary = Pick<
  MoDetail,
  "moCode" | "returnId" | "model" | "submittedAt" | "overallStatus"
> & {
  completedStages: number;
  totalStages: number;
};
