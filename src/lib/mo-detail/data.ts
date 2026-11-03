import {
  STAGE_KEYS,
  type MaterialInput,
  type MoDetail,
  type PhotoInput,
  type StageDetail,
  type StageKey,
  type StageRecord,
} from "./types";

const COMPLETION_MESSAGE_KEYS: Record<StageKey, `history.detail.completionMessages.${StageKey}`> = {
  pmcEntry: "history.detail.completionMessages.pmcEntry",
  iqcScan: "history.detail.completionMessages.iqcScan",
  pmcOpenWo: "history.detail.completionMessages.pmcOpenWo",
  staffReturn: "history.detail.completionMessages.staffReturn",
  exim: "history.detail.completionMessages.exim",
  staffReturnSticker: "history.detail.completionMessages.staffReturnSticker",
  iqcQaPass: "history.detail.completionMessages.iqcQaPass",
};

const cameraModule: MaterialInput = {
  code: "721032000320",
  englishName: "Camera Module",
  chinaName: "相机模组",
  quantity: 7,
};

const batteryCover: MaterialInput = {
  code: "621032000320",
  englishName: "Battery cover AC175",
  chinaName: "电池盖组件 AC175 绿",
  quantity: 5,
};

const displayPanel: MaterialInput = {
  code: "621032000321",
  englishName: "Display Panel",
  chinaName: "显示屏面板",
  quantity: 10,
};

const photoInputs: PhotoInput = {
  front: "/ollie.png",
  back: "/ollie.png",
  upn: "/ollie.png",
};

function stage<K extends (typeof STAGE_KEYS)[number]>(
  stageKey: K,
  data: StageRecord<K>["data"],
  options: Partial<Omit<StageRecord<K>, "stageKey" | "data">> = {},
): StageRecord<K> {
  return {
    stageKey,
    status: options.status ?? "completed",
    timestamp: options.timestamp ?? "2026-09-20 14:32",
    employeeName: options.employeeName ?? "Bagus Saputra",
    employeeId: options.employeeId ?? "I0123456",
    completionMessage:
      options.completionMessage === undefined
        ? COMPLETION_MESSAGE_KEYS[stageKey]
        : options.completionMessage,
    rejectionReason: options.rejectionReason ?? null,
    data,
  };
}

function completedStages(returnId: string, workOrder: string) {
  const cartonMaterials = [
    {
      ...cameraModule,
      singleNetWeight: 12.5,
      netWeight: 0.0875,
      grossWeight: 0.12,
      length: 220,
      width: 180,
      height: 140,
      upnBarcode: "UPN721032000320001",
      photos: photoInputs,
    },
    {
      ...batteryCover,
      singleNetWeight: 18,
      netWeight: 0.09,
      grossWeight: 0.13,
      length: 220,
      width: 180,
      height: 140,
      upnBarcode: "UPN621032000320001",
      photos: photoInputs,
    },
  ];

  return [
    stage("pmcEntry", {
      model: "Latte-M",
      projectNumber: "9991028",
      targetDeliveryDate: "2026-10-15",
      materials: [cameraModule, batteryCover],
    }),
    stage("iqcScan", {
      materials: [
        {
          ...cameraModule,
          upnBarcode: "UPN721032000320001",
          upnPhoto: "/ollie.png",
          status: "PASS",
          notes: "",
        },
        {
          ...batteryCover,
          upnBarcode: "UPN621032000320001",
          upnPhoto: "/ollie.png",
          status: "PASS",
          notes: "",
        },
      ],
    }),
    stage("pmcOpenWo", {
      workOrder,
      iqcStatus: "Passed",
      materials: [cameraModule, batteryCover],
    }),
    stage("staffReturn", {
      returnId,
      cartons: [
        { code: "CT0003 – CT0008", count: 6, materials: cartonMaterials },
      ],
    }),
    stage("exim", {
      model: "Latte-M",
      brand: "OPPO",
      materials: [
        {
          ...cameraModule,
          singleNetWeight: 67.5,
          netWeight: 0.0875,
          grossWeight: 0.12,
          volume: "500×420×290",
          upnBarcode: "UPN721032000320001",
          photos: photoInputs,
        },
        {
          ...batteryCover,
          singleNetWeight: 67.5,
          netWeight: 0.09,
          grossWeight: 0.13,
          volume: "500×420×290",
          upnBarcode: "UPN621032000320001",
          photos: photoInputs,
        },
      ],
    }),
    stage("staffReturnSticker", {
      cartons: Array.from({ length: 6 }, (_, index) => ({
        code: `CT${String(index + 3).padStart(4, "0")}`,
        scanned: true,
      })),
    }),
    stage("iqcQaPass", {
      cartons: Array.from({ length: 6 }, (_, index) => ({
        code: `CT${String(index + 3).padStart(4, "0")}`,
        materialsScanned: 2,
        totalMaterials: 2,
        upnScanned: true,
        cartonStickerScanned: true,
        verified: true,
      })),
    }),
  ] satisfies MoDetail["stages"];
}

function pendingStage(stage: StageDetail): StageDetail {
  return {
    ...stage,
    status: "pending",
    timestamp: null,
    employeeName: null,
    employeeId: null,
    completionMessage: null,
    rejectionReason: null,
    data: null,
  };
}

const completed: MoDetail = {
  moCode: "T2026090410261301048",
  batchNumber: "BATCH202609",
  productDescription: "Return Idle Latte M",
  overallStatus: "Completed",
  model: "Latte-M",
  projectNumber: "9991028",
  submittedBy: "Bagus Saputra",
  submittedAt: "Sep 20, 2026 14:32",
  stages: completedStages("RC-20260831-002", "WO-20260920-001"),
};

const inProgress: MoDetail = {
  moCode: "T2026090410261301039",
  batchNumber: "BATCH202608",
  productDescription: "Verify Material A77",
  overallStatus: "In Progress",
  model: "A77",
  projectNumber: "9991026",
  submittedBy: "Bagus Saputra",
  submittedAt: "Sep 18, 2026 16:48",
  stages: completed.stages.map((currentStage, index) => {
    if (index < 4) return currentStage;
    if (index === 4) {
      return {
        ...currentStage,
        status: "in-progress" as const,
        timestamp: "Sep 18, 2026 16:48",
        completionMessage: null,
        rejectionReason:
          "Previously rejected: wrong material code on Display Panel",
      };
    }
    return pendingStage(currentStage);
  }),
};

const rejected: MoDetail = {
  ...completed,
  moCode: "T2026090410261301041",
  batchNumber: "BATCH202609",
  productDescription: "Receive Material A58",
  overallStatus: "Rejected",
  model: "A58",
  projectNumber: "9991027",
  submittedAt: "Sep 19, 2026 09:15",
  stages: completed.stages.map((currentStage, index) => {
    if (index === 0) return currentStage;
    if (index === 1) {
      return {
        ...currentStage,
        status: "rejected" as const,
        rejectionReason:
          "Quantity mismatch on Camera Module (expected 7, received 5)",
      };
    }
    return pendingStage(currentStage);
  }),
};

const olderCompleted: MoDetail = {
  ...completed,
  moCode: "T2026090410261301033",
  batchNumber: "BATCH202608",
  productDescription: "Return Idle Latte M",
  projectNumber: "9991025",
  submittedAt: "Sep 17, 2026 11:02",
};

const olderRejected: MoDetail = {
  ...rejected,
  moCode: "T2026090410261301028",
  batchNumber: "BATCH202608",
  productDescription: "Receive Material A98",
  model: "A98",
  projectNumber: "9991024",
  submittedAt: "Sep 16, 2026 08:40",
  stages: rejected.stages.map((currentStage, index) =>
    index === 1 && currentStage.stageKey === "iqcScan"
      ? {
          ...currentStage,
          rejectionReason: "China name does not match the master list",
        }
      : currentStage,
  ),
};

const details = new Map<string, MoDetail>([
  [completed.moCode, completed],
  [rejected.moCode, rejected],
  [inProgress.moCode, inProgress],
  [olderCompleted.moCode, olderCompleted],
  [olderRejected.moCode, olderRejected],
]);

export function getMoDetail(moId: string): MoDetail | null {
  return details.get(moId) ?? null;
}
