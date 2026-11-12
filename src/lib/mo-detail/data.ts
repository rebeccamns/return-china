import {
  STAGE_KEYS,
  type MaterialInput,
  type MoDetail,
  type PhotoInput,
  type StageDetail,
  type StageKey,
  type StageRecord,
} from "./types";
import { DEMO, demoMoNumber } from "@/lib/demo-data";

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
  code: DEMO.materialCodes.cameraModule,
  englishName: "Camera Module Lychee F4",
  chinaName: "相机模组",
  quantity: 7,
};

const batteryCover: MaterialInput = {
  code: DEMO.materialCodes.batteryCover,
  englishName: "Battery cover Lychee F4",
  chinaName: "电池盖组件 AC175 绿",
  quantity: 5,
};

const displayPanel: MaterialInput = {
  code: DEMO.materialCodes.displayPanel,
  englishName: "Display Panel Lychee F4",
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
      upnBarcode: DEMO.upnCode,
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
      upnBarcode: DEMO.upnCode,
      photos: photoInputs,
    },
  ];

  return [
    stage("pmcEntry", {
      model: DEMO.model,
      projectNumber: DEMO.projectNumber,
      targetDeliveryDate: "2026-10-15",
      materials: [cameraModule, batteryCover],
    }),
    stage("iqcScan", {
      materials: [
        {
          ...cameraModule,
          upnBarcode: DEMO.upnCode,
          upnPhoto: "/ollie.png",
          status: "PASS",
          notes: "",
        },
        {
          ...batteryCover,
          upnBarcode: DEMO.upnCode,
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
      model: DEMO.eximModelDimension,
      brand: "OPPO",
      materials: [
        {
          ...cameraModule,
          singleNetWeight: 67.5,
          netWeight: 0.0875,
          grossWeight: 0.12,
          volume: "500×420×290",
          upnBarcode: DEMO.upnCode,
          photos: photoInputs,
        },
        {
          ...batteryCover,
          singleNetWeight: 67.5,
          netWeight: 0.09,
          grossWeight: 0.13,
          volume: "500×420×290",
          upnBarcode: DEMO.upnCode,
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
  moCode: DEMO.moNumber,
  returnId: "RC-20260831-002",
  batchNumber: "BATCH202609",
  productDescription: "Return Idle Lychee F4",
  overallStatus: "Completed",
  model: DEMO.model,
  projectNumber: DEMO.projectNumber,
  submittedBy: "Bagus Saputra",
  submittedAt: "Sep 20, 2026 14:32",
  stages: completedStages("RC-20260831-002", DEMO.workOrder),
};

const inProgress: MoDetail = {
  moCode: demoMoNumber(2),
  returnId: completed.returnId,
  batchNumber: "BATCH202608",
  productDescription: "Verify Material Lychee F4",
  overallStatus: "In Progress",
  model: DEMO.model,
  projectNumber: DEMO.projectNumber,
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
          "Previously rejected: wrong material code on Display Panel Lychee F4",
      };
    }
    return pendingStage(currentStage);
  }),
};

const rejected: MoDetail = {
  ...completed,
  moCode: demoMoNumber(1),
  batchNumber: "BATCH202609",
  productDescription: "Receive Material Lychee F4",
  overallStatus: "Rejected",
  model: DEMO.model,
  projectNumber: DEMO.projectNumber,
  submittedAt: "Sep 19, 2026 09:15",
  stages: completed.stages.map((currentStage, index) => {
    if (index === 0) return currentStage;
    if (index === 1) {
      return {
        ...currentStage,
        status: "rejected" as const,
        rejectionReason:
          "Quantity mismatch on Camera Module Lychee F4 (expected 7, received 5)",
      };
    }
    return pendingStage(currentStage);
  }),
};

const olderCompleted: MoDetail = {
  ...completed,
  moCode: demoMoNumber(3),
  batchNumber: "BATCH202608",
  productDescription: "Return Idle Lychee F4",
  projectNumber: DEMO.projectNumber,
  submittedAt: "Sep 17, 2026 11:02",
};

const olderRejected: MoDetail = {
  ...rejected,
  moCode: demoMoNumber(4),
  batchNumber: "BATCH202608",
  productDescription: "Receive Material Lychee F4",
  model: DEMO.model,
  projectNumber: DEMO.projectNumber,
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

export function getMoWorkOrder(moId: string): string | null {
  const stage = getMoDetail(moId)?.stages.find(
    (item) => item.stageKey === "pmcOpenWo",
  );

  return stage?.stageKey === "pmcOpenWo"
    ? (stage.data?.workOrder ?? null)
    : null;
}

export function listMoSummaries() {
  return [...details.values()]
    .map((mo) => ({
      moCode: mo.moCode,
      returnId: mo.returnId,
      model: mo.model,
      submittedAt: mo.submittedAt,
      overallStatus: mo.overallStatus,
      completedStages: mo.stages.filter((stage) => stage.status === "completed")
        .length,
      totalStages: mo.stages.length,
    }))
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
    );
}
