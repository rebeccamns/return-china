import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";

export type Material = {
  id: string;
  code: string;
  englishName: string;
  chinaName: string;
};

type MaterialListProps = {
  cartonCode: string;
  completedMaterials: Material[];
  totalMaterials: number;
  selectedMaterialCode: string;
  materialOptions: Material[];
  onBack: () => void;
  onSelectMaterial: (code: string) => void;
};

export default function MaterialList({
  cartonCode,
  completedMaterials,
  totalMaterials,
  selectedMaterialCode,
  materialOptions,
  onBack,
  onSelectMaterial,
}: MaterialListProps) {
  const remainingMaterials = materialOptions.filter(
    (material) =>
      !completedMaterials.some(
        (completed) => completed.code === material.code
      )
  );

  return (
    <section className="w-full overflow-hidden rounded-lg border border-strokestroke-gray bg-backgroundbg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-strokestroke-gray px-4 py-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex h-7 w-7 items-center justify-center"
            aria-label="Back to carton list"
          >
            <ArrowLeft
              className="h-5 w-5 text-text-colortext-dark"
              strokeWidth={2}
            />
          </button>

          <span className="text-[16px] font-semibold leading-[150%] text-text-colortext-black">
            {cartonCode}
          </span>
        </div>

        <span className="text-[14px] font-medium leading-[125%] text-text-colortext-gray">
          {completedMaterials.length}/{totalMaterials} Material
        </span>
      </div>

      <div className="p-4">
        {/* Completed materials */}
        {completedMaterials.length > 0 && (
          <div className="flex flex-col gap-3">
            {completedMaterials.map((material, index) => (
              <button
                key={material.id}
                type="button"
                className="flex w-full items-center gap-4 rounded-md border border-strokestroke-gray bg-backgroundbg-white p-4 text-left"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E7F8ED] text-[14px] font-medium text-[#006B3C]">
                  {index + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-semibold leading-[125%] text-text-colortext-black">
                    {material.code}
                  </p>

                  <p className="mt-1 text-[14px] font-medium leading-[125%] text-text-colortext-dark">
                    {material.englishName} {material.chinaName}
                  </p>
                </div>

                <ChevronRight
                  className="h-5 w-5 shrink-0 text-text-colortext-gray"
                  strokeWidth={1.8}
                />
              </button>
            ))}
          </div>
        )}

        {/* Material code */}
        <div className="mt-6 flex flex-col gap-2">
          <label className="text-[14px] font-medium leading-[125%] text-text-colortext-dark">
            Material Code
          </label>

          <div className="relative">
            <select
              value={selectedMaterialCode}
              onChange={(event) =>
                onSelectMaterial(event.target.value)
              }
              className="h-[56px] w-full appearance-none rounded-md border border-strokestroke-gray bg-backgroundbg-white px-4 pr-12 text-[14px] text-text-colortext-black outline-none focus:border-primaryprimary-green focus:ring-1 focus:ring-primaryprimary-green"
            >
              <option value="">Choose material code</option>

              {remainingMaterials.map((material) => (
                <option
                  key={material.id}
                  value={material.code}
                >
                  {material.code}
                </option>
              ))}
            </select>

            <ChevronDown
              className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-colortext-dark"
              strokeWidth={1.8}
            />
          </div>
        </div>

        {/* Empty helper */}
        <p className="mt-12 text-center text-[14px] font-medium italic leading-[125%] text-text-colortext-gray">
          Choose material code to input material details
        </p>
      </div>
    </section>
  );
}