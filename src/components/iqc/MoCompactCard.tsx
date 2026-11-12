import type { ReactNode } from "react";

type Props = {
  moNumber: string;
  model: string;
  returnId: string;
  progress?: { label: string; percent: number };
  status?: ReactNode;
};

/** One-line MO context for inner steps, so forms get the screen space. */
export default function MoCompactCard({
  moNumber,
  model,
  returnId,
  progress,
  status,
}: Props) {
  const percent = progress
    ? Math.max(0, Math.min(100, progress.percent))
    : 0;

  return (
    <section className="flex w-full items-center justify-between gap-3 rounded-2xl border border-strokestroke-gray bg-backgroundbg-white px-4 py-3 max-md:px-3.5 max-md:py-3.5">
      {progress ? (
        <div className="w-full min-w-0">
          <div className="flex min-w-0 items-baseline justify-between gap-3">
            <p className="min-w-0 flex-1 truncate text-[15px] max-md:text-body font-semibold leading-5 text-text-colortext-black">
              {moNumber}
            </p>
            <span className="shrink-0 whitespace-nowrap text-[13px] max-md:text-secondary leading-[18px] text-text-colortext-gray">
              {returnId}
            </span>
          </div>
          <div className="mt-0.5 flex min-w-0 items-center justify-between gap-2">
            <p className="min-w-0 truncate text-[13px] max-md:text-secondary leading-[18px] text-text-colortext-gray">
              {model}
            </p>
            {status}
          </div>

          <div className="mt-3 border-t border-strokestroke-gray pt-3">
            <div className="flex items-center justify-between gap-3">
              <p className="min-w-0 text-[13px] max-md:text-secondary leading-[18px] text-text-colortext-gray">
                {progress.label}
              </p>
              <p className="shrink-0 text-[13px] max-md:text-secondary font-semibold leading-[18px] text-text-colortext-black">
                {percent}%
              </p>
            </div>

            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
              className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E6E6E6] dark:bg-backgroundbg-black"
            >
              <div
                className="h-full rounded-full bg-[#008348] transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="min-w-0">
            <p className="truncate text-[15px] max-md:text-body font-semibold leading-5 text-text-colortext-black">
              {moNumber}
            </p>
            <p className="mt-0.5 truncate text-[13px] max-md:text-secondary leading-[18px] text-text-colortext-gray">
              {model}
            </p>
          </div>

          <span className="shrink-0 text-[13px] max-md:text-secondary text-text-colortext-gray">
            {returnId}
          </span>
        </>
      )}
    </section>
  );
}
