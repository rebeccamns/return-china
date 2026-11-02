type Props = {
  moNumber: string;
  model: string;
  returnId: string;
};

/** One-line MO context for inner steps, so forms get the screen space. */
export default function MoCompactCard({ moNumber, model, returnId }: Props) {
  return (
    <section className="flex w-full items-center justify-between gap-3 rounded-2xl border border-strokestroke-gray bg-backgroundbg-white px-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-[15px] font-semibold leading-5 text-text-colortext-black">
          {moNumber}
        </p>
        <p className="mt-0.5 truncate text-[13px] leading-[18px] text-text-colortext-gray">
          {model}
        </p>
      </div>

      <span className="shrink-0 text-[13px] text-text-colortext-gray">
        {returnId}
      </span>
    </section>
  );
}