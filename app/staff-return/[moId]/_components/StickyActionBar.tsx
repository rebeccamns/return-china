import type { ReactNode } from "react";

export const primaryButton =
  "h-12 max-md:h-11 rounded-[14px] px-4 text-[15px] max-md:text-button font-semibold text-white " +
  "bg-[linear-gradient(0deg,rgba(11,89,52,1)_0%,rgba(5,131,70,1)_100%)] " +
  "transition active:scale-[0.98] hover:opacity-90 " +
  "disabled:cursor-not-allowed disabled:bg-none disabled:bg-slate-300 disabled:active:scale-100";

export const secondaryButton =
  "h-12 max-md:h-11 rounded-[14px] border border-strokestroke-gray bg-backgroundbg-white px-4 " +
  "text-[15px] max-md:text-button font-semibold text-text-colortext-black transition active:scale-[0.98] " +
  "hover:bg-backgroundbg-gray";

type StickyActionBarProps = {
  children: ReactNode;
  /** Sit above the bottom nav instead of the screen edge. */
  aboveNav?: boolean;
};

export default function StickyActionBar({
  children,
  aboveNav = false,
}: StickyActionBarProps) {
  return (
    <div
      className={`fixed inset-x-0 z-30 border-t border-black/[0.06] bg-white/80 backdrop-blur-xl backdrop-saturate-150 supports-[not_(backdrop-filter:blur(1px))]:bg-white ${
        aboveNav
          ? "max-md:h-[var(--action-bar-h)]"
          : "max-md:h-[calc(var(--action-bar-h)+env(safe-area-inset-bottom,0px))]"
      }`}
      style={{
        bottom: aboveNav ? "var(--bottom-nav-h)" : 0,
        paddingBottom: aboveNav ? 0 : "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="mx-auto flex h-full w-full max-w-[412px] items-center gap-3 px-5 max-md:px-4 py-3 max-md:py-2.5">
        {children}
      </div>
    </div>
  );
}