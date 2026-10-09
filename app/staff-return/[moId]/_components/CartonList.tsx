import { ChevronRight, Package, Plus, Check} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type Carton = {
  id: string;
  code: string;
  materialCount: number;
  totalMaterials: number;
};

type CartonListProps = {
  cartons: Carton[];
  onOpenCarton: (carton: Carton) => void;
  onAddCarton: () => void;
};

export default function CartonList({
  cartons,
  onOpenCarton,
  onAddCarton,
}: CartonListProps) {
  return (
    <section className="mt-5 w-full">
      <h2 className="mb-3 text-[16px] font-semibold leading-[150%] text-text-colortext-black">
        Carton List
      </h2>

      {/* Add carton */}
      <div className="rounded-lg border border-strokestroke-gray bg-backgroundbg-white p-4">
        <h3 className="text-[16px] font-semibold leading-[150%] text-text-colortext-black">
          Carton Number
        </h3>

        <div className="mt-4 grid grid-cols-[1fr_1fr_auto] items-end gap-2">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-text-colortext-dark">
              Code
            </label>

            <Input
              value="CT"
              readOnly
              className="h-[52px] rounded-md border-strokestroke-gray bg-backgroundbg-white px-3 text-[13px] font-medium text-text-colortext-black"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-text-colortext-dark">
              Number
            </label>

            <Input
              value={String(cartons.length + 1).padStart(4, "0")}
              readOnly
              className="h-[52px] rounded-md border-strokestroke-gray bg-slate-50 px-3 text-[13px] text-text-colortext-gray"
            />
          </div>

          <Button
            type="button"
            onClick={onAddCarton}
            className="h-[52px] rounded-md bg-[linear-gradient(0deg,rgba(11,89,52,1)_0%,rgba(5,131,70,1)_100%)] px-4 text-[13px] font-semibold text-white shadow-none hover:opacity-90"
          >
            Add
          </Button>
        </div>

        <p className="mt-3 text-[12px] leading-[125%] text-text-colortext-gray">
          *The carton code number will be generated automatically
        </p>
      </div>

      {/* Carton list */}
      <div className="mt-5 flex flex-col gap-3">
  {cartons.map((carton) => {
    const isComplete =
      carton.materialCount >= carton.totalMaterials;

    return (
      <button
        key={carton.id}
        type="button"
        onClick={() => onOpenCarton(carton)}
        className="flex w-full items-center gap-4 rounded-lg border border-strokestroke-gray bg-backgroundbg-white p-4 text-left transition-colors hover:bg-backgroundbg-gray"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-slate-50">
          <Package
            className="h-6 w-6 text-[#929292]"
            strokeWidth={1.5}
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[16px] font-semibold leading-[125%] text-text-colortext-black">
            {carton.code}
          </p>

          <p className="mt-1 text-[14px] leading-[125%] text-text-colortext-gray">
            {carton.materialCount}/{carton.totalMaterials} Material
          </p>
        </div>

        {isComplete && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e7f5ed]">
            <Check
              className="h-5 w-5 text-primaryprimary-green"
              strokeWidth={2.5}
            />
          </div>
        )}

        <ChevronRight
          className="h-5 w-5 shrink-0 text-text-colortext-dark"
          strokeWidth={1.8}
        />
      </button>
    );
  })}
</div>
    </section>
  );
}