export type Material = {
  id: string;
  code: string;
  englishName: string;
  chinaName: string;
};

/** One material packed inside a carton (or a group of identical cartons). */
export type MaterialEntry = {
  id: string;
  material: Material;
  /** pcs inside ONE carton */
  quantity: number;
  /** g / pcs */
  singleNetWeight: number;
  /** kg, per carton */
  grossWeight: number;
  /** mm */
  length: number;
  width: number;
  height: number;
  upnBarcode: string;
  photos: { front: boolean; back: boolean; upn: boolean };
};

/**
 * A "carton group": 1..N cartons that share exactly the same input.
 * Fill the details once → applies to every code in `codes`.
 */
export type Carton = {
  id: string;
  codes: string[]; // e.g. ["CT0003", "CT0004", "CT0005"]
  materials: MaterialEntry[];
  saved: boolean;
};

/** Per material code: how much is already packed across cartons. */
export type PackedSummary = Record<string, { pieces: number; cartons: number }>;

export function formatCartonCode(n: number, prefix = "CT") {
  return `${prefix}${String(n).padStart(4, "0")}`;
}

export function cartonNumber(code: string) {
  return parseInt(code.match(/(\d{4})$/)?.[1] ?? "", 10) || 0;
}

export function cartonPrefix(code: string) {
  return /\d{4}$/.test(code) ? code.slice(0, -4) : code;
}

export function nextNumberForPrefix(cartons: Carton[], prefix: string) {
  return (
    Math.max(
      0,
      ...cartons.flatMap((carton) =>
        carton.codes
          .filter((code) => cartonPrefix(code) === prefix)
          .map(cartonNumber),
      ),
    ) + 1
  );
}

/** ["CT0003"] → "CT0003" · ["CT0003","CT0004","CT0005"] → "CT0003 – CT0005" */
export function cartonRange(codes: string[]) {
  if (codes.length === 0) return "";
  if (codes.length === 1) return codes[0];
  return `${codes[0]} – ${codes[codes.length - 1]}`;
}

export function totalPieces(carton: Carton) {
  return (
    carton.materials.reduce((sum, e) => sum + e.quantity, 0) *
    carton.codes.length
  );
}

export function computePacked(
  cartons: Carton[],
  excludeCartonId?: string | null,
): PackedSummary {
  const out: PackedSummary = {};

  for (const carton of cartons) {
    if (carton.id === excludeCartonId) continue;

    for (const entry of carton.materials) {
      const prev = out[entry.material.code] ?? { pieces: 0, cartons: 0 };

      out[entry.material.code] = {
        pieces: prev.pieces + entry.quantity * carton.codes.length,
        cartons: prev.cartons + carton.codes.length,
      };
    }
  }

  return out;
}