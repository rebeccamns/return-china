"use client";

import { useState } from "react";
import { Check, ChevronRight, Minus, Package, Plus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useI18n } from "@/i18n";

import { primaryButton } from "./StickyActionBar";
import {
  type Carton,
  cartonRange,
  formatCartonCode,
  nextNumberForPrefix,
  totalPieces,
} from "./types";

const MAX_BATCH = 50;

type CartonListProps = {
  cartons: Carton[];
  onOpenCarton: (carton: Carton) => void;
  /** Create `count` cartons that share the same input. */
  onAddCartons: (
    count: number,
    prefix: string,
    startNumber: number,
  ) => void;
};

export default function CartonList({
  cartons,
  onOpenCarton,
  onAddCartons,
}: CartonListProps) {
  const { t } = useI18n();

  const [prefix, setPrefix] = useState("CT");
  const [quantityRaw, setQuantityRaw] = useState("1");
  const [startRaw, setStartRaw] = useState(() =>
    String(Math.min(nextNumberForPrefix(cartons, "CT"), 9999)).padStart(
      4,
      "0",
    ),
  );
  const [numberTouched, setNumberTouched] = useState(false);
  const count = Math.min(
    MAX_BATCH,
    Math.max(1, parseInt(quantityRaw, 10) || 1),
  );
  const startNumber = parseInt(startRaw, 10) || 0;
  const endNumber = startNumber + count - 1;
  const existingCodes = new Set(cartons.flatMap((carton) => carton.codes));
  const generatedCodes = Array.from({ length: count }, (_, i) =>
    formatCartonCode(startNumber + i, prefix),
  );
  const hasCodeConflict =
    prefix.length === 0 ||
    !/^[A-Z0-9]+$/.test(prefix) ||
    startNumber === 0 ||
    endNumber > 9999 ||
    generatedCodes.some((code) => existingCodes.has(code));

  function setCount(n: number) {
    setQuantityRaw(String(Math.min(MAX_BATCH, Math.max(1, n))));
  }

  const previewRange = cartonRange(generatedCodes);

  function handleAdd() {
    if (hasCodeConflict) return;

    onAddCartons(count, prefix, startNumber);
    setStartRaw(
      String(
        Math.min(
          Math.max(nextNumberForPrefix(cartons, prefix), endNumber + 1),
          9999,
        ),
      ).padStart(4, "0"),
    );
    setQuantityRaw("1");
    setNumberTouched(false);
  }

  function handlePrefixChange(value: string) {
    const nextPrefix = value.replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase();
    setPrefix(nextPrefix);
    if (!numberTouched) {
      setStartRaw(
        String(Math.min(nextNumberForPrefix(cartons, nextPrefix), 9999)).padStart(
          4,
          "0",
        ),
      );
    }
  }

  function handlePrefixBlur() {
    if (prefix.length === 0) {
      setPrefix("CT");
      if (!numberTouched) {
        setStartRaw(
          String(Math.min(nextNumberForPrefix(cartons, "CT"), 9999)).padStart(
            4,
            "0",
          ),
        );
      }
    }
  }

  function handleStartChange(value: string) {
    setStartRaw(value.replace(/\D/g, "").slice(0, 4));
    setNumberTouched(true);
  }

  return (
    <section className="mt-5 w-full">
      {/* Add cartons */}
      <div className="rounded-2xl border border-strokestroke-gray bg-backgroundbg-white p-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-2 block text-[12px] font-medium leading-4 text-text-colortext-gray">
              {t("staffReturn.code")}
            </label>
            <Input
              value={prefix}
              onChange={(e) => handlePrefixChange(e.target.value)}
              onBlur={handlePrefixBlur}
              maxLength={6}
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              aria-label={t("staffReturn.code")}
              className="h-12 rounded-xl border-strokestroke-gray bg-backgroundbg-white px-4 text-[16px] text-text-colortext-black"
            />
          </div>
          <div>
            <label className="mb-2 block text-[12px] font-medium leading-4 text-text-colortext-gray">
              {t("staffReturn.number")}
            </label>
            <Input
              value={startRaw}
              onChange={(e) => handleStartChange(e.target.value)}
              onBlur={() => setStartRaw(String(startNumber).padStart(4, "0"))}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              aria-label={t("staffReturn.number")}
              className="h-12 rounded-xl border-strokestroke-gray bg-backgroundbg-white px-4 text-[16px] text-text-colortext-black"
            />
          </div>
        </div>

        <label className="mb-2 mt-4 block text-[12px] font-medium leading-4 text-text-colortext-gray">
          {t("staffReturn.cartonQuantity")}
        </label>

        <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-1.5">
          <button
            type="button"
            onClick={() => setCount(count - 1)}
            disabled={count <= 1}
            aria-label={t("common.decrease")}
            className="flex h-11 w-11 items-center justify-center text-text-colortext-black transition active:scale-95 disabled:opacity-40"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-backgroundbg-white shadow-sm">
              <Minus className="h-5 w-5" strokeWidth={2} />
            </span>
          </button>

          <Input
            value={quantityRaw}
            onChange={(e) =>
              setQuantityRaw(e.target.value.replace(/\D/g, ""))
            }
            onBlur={() => setCount(count)}
            inputMode="numeric"
            pattern="[0-9]*"
            aria-label={t("staffReturn.cartonQuantity")}
            className="h-12 w-24 border-0 bg-transparent p-0 text-center text-[20px] font-semibold text-text-colortext-black shadow-none focus-visible:ring-0"
          />

          <button
            type="button"
            onClick={() => setCount(count + 1)}
            disabled={count >= MAX_BATCH}
            aria-label={t("common.increase")}
            className="flex h-11 w-11 items-center justify-center text-text-colortext-black transition active:scale-95 disabled:opacity-40"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-backgroundbg-white shadow-sm">
              <Plus className="h-5 w-5" strokeWidth={2} />
            </span>
          </button>
        </div>

        <p className="mt-3 text-center text-[13px] font-medium leading-[18px] text-[#006B3C]">
          {t("staffReturn.willCreate", { range: previewRange })}
        </p>

        {hasCodeConflict && (
          <p className="mt-2 text-[12px] text-text-colortext-red">
            {t("staffReturn.codeExists")}
          </p>
        )}

        <p className="mt-2 text-[12px] leading-4 text-text-colortext-gray">
          {t("staffReturn.autoGeneratedNote")}
        </p>
        <p className="mt-1 text-[12px] leading-4 text-text-colortext-gray">
          {t("staffReturn.sameDetailsNote")}
        </p>

        <button
          type="button"
          onClick={handleAdd}
          disabled={hasCodeConflict}
          className={`${primaryButton} mt-4 w-full`}
        >
          {t("staffReturn.addCartons", { count })}
        </button>
      </div>

      {/* Carton list */}
      <h2 className="mb-3 mt-5 text-[16px] font-semibold leading-6 text-text-colortext-black">
        {t("staffReturn.cartonList")}
      </h2>

      <div className="overflow-hidden rounded-2xl border border-strokestroke-gray bg-backgroundbg-white">
        <ul className="divide-y divide-strokestroke-gray">
          {cartons.map((carton) => {
            const hasMaterials = carton.materials.length > 0;

            const details = hasMaterials
              ? [
                  carton.codes.length > 1
                    ? t("staffReturn.cartonsCount", {
                        count: carton.codes.length,
                      })
                    : null,
                  t("staffReturn.materialsCount", {
                    count: carton.materials.length,
                  }),
                  t("staffReturn.piecesCount", {
                    count: totalPieces(carton),
                  }),
                ]
                  .filter(Boolean)
                  .join(" · ")
              : carton.codes.length > 1
                ? `${t("staffReturn.cartonsCount", {
                    count: carton.codes.length,
                  })} · ${t("staffReturn.notFilled")}`
                : t("staffReturn.notFilled");

            return (
              <li key={carton.id}>
                <button
                  type="button"
                  onClick={() => onOpenCarton(carton)}
                  className="flex min-h-[60px] w-full items-center gap-4 px-4 py-2.5 text-left transition-colors active:bg-backgroundbg-gray"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50">
                    <Package
                      className="h-6 w-6 text-[#929292]"
                      strokeWidth={1.5}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold leading-5 text-text-colortext-black">
                      {cartonRange(carton.codes)}
                    </p>

                    <p className="mt-0.5 truncate text-[13px] leading-[18px] text-text-colortext-gray">
                      {details}
                    </p>
                  </div>

                  {carton.saved ? (
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E7F5EC]">
                      <Check
                        className="h-4 w-4 text-primaryprimary-green"
                        strokeWidth={3}
                      />
                    </span>
                  ) : hasMaterials ? (
                    <span className="shrink-0 text-[12px] font-medium leading-4 text-text-colortext-gray">
                      {t("staffReturn.inProgress")}
                    </span>
                  ) : null}

                  <ChevronRight
                    className="h-5 w-5 shrink-0 text-[#C4C4C4]"
                    strokeWidth={2}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}