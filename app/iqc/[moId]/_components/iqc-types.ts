export type InspectionStatus = "PASS" | "REJECT" | null;

export type IQCMaterial = {
  id: string;
  code: string;
  englishName: string;
  chinaName: string;
  qty: number;
  upnBarcode: string;
  status: InspectionStatus;
  notes: string;
  photoName: string;
};
