import { Button } from "@/components/ui/button";

type MoSummaryCardProps = {
  onCreatePackingList?: () => void;
  showCreateButton?: boolean;
};

const mo = {
  code: "MO-321654987",
  submittedAt: "2026-09-02 09:05",
  returnId: "RC-20260831-002",
  model: "Latte-M",
  wo: "ABC-XY12400YZ",
};

export default function MoSummaryCard({
  onCreatePackingList,
  showCreateButton = false,
}: MoSummaryCardProps) {
  return (
    <section className="w-full rounded-lg border border-strokestroke-gray bg-backgroundbg-white shadow-none">
      <div className="p-4">
        <div className="flex flex-col gap-3">
          {/* MO */}
          <div>
            <h2 className="text-[16px] font-semibold leading-[150%] text-text-colortext-black">
              {mo.code}
            </h2>

            <p className="mt-1 text-[12px] font-medium leading-[125%] text-text-colortext-gray">
              Submitted at {mo.submittedAt}
            </p>
          </div>

          {/* Return ID + Model */}
          <dl className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <dt className="text-[14px] font-medium leading-[125%] text-text-colortext-dark">
                Return ID
              </dt>

              <dd className="text-[16px] font-medium leading-[125%] text-text-colortext-black">
                {mo.returnId}
              </dd>
            </div>

            <div className="flex flex-col gap-1">
              <dt className="text-[14px] font-medium leading-[125%] text-text-colortext-dark">
                Model
              </dt>

              <dd className="text-[16px] font-medium leading-[125%] text-text-colortext-black">
                {mo.model}
              </dd>
            </div>
          </dl>

          {/* WO */}
          <div className="flex items-center gap-4 rounded-md border border-strokestroke-gray bg-backgroundbg-white px-4 py-3">
            <span className="text-[14px] font-medium leading-[125%] text-text-colortext-dark">
              WO
            </span>

            <span className="text-[16px] font-semibold leading-[125%] text-text-colortext-black">
              {mo.wo}
            </span>
          </div>

          <div className="h-px w-full bg-strokestroke-gray" />

          {showCreateButton && (
            <Button
              type="button"
              onClick={onCreatePackingList}
              className="h-10 w-full rounded-md bg-[linear-gradient(0deg,rgba(11,89,52,1)_0%,rgba(5,131,70,1)_100%)] px-3 text-[12px] font-semibold leading-[125%] text-white shadow-none hover:opacity-90"
            >
              Create Packing List
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}