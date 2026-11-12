import type { ReactNode } from "react";

export const primaryButton =
  "h-12 max-md:h-11 rounded-[14px] border border-[#08783F] bg-[#08783F] px-4 text-[15px] max-md:text-button font-semibold text-white shadow-sm " +
  "transition active:scale-[0.98] hover:border-[#066B3B] hover:bg-[#066B3B] " +
  "dark:border-[#0D663B] dark:bg-[#0D663B] dark:text-white dark:[&_svg]:text-white dark:hover:border-[#0B5934] dark:hover:bg-[#0B5934] " +
  "disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300 disabled:hover:bg-slate-300 dark:disabled:border-slate-700 dark:disabled:bg-slate-700 dark:disabled:hover:bg-slate-700 dark:disabled:text-slate-400 disabled:active:scale-100";

export const secondaryButton =
  "h-12 max-md:h-11 rounded-[14px] border border-[#08783F]/25 bg-white/65 px-4 backdrop-blur-sm " +
  "text-[15px] max-md:text-button font-semibold text-[#08783F] transition active:scale-[0.98] " +
  "hover:border-[#08783F]/40 hover:bg-[#E7F5EC] hover:text-[#066B3B] " +
  "dark:border-[#4A4A4A] dark:bg-[#252525] dark:text-white dark:hover:border-[#5A5A5A] dark:hover:bg-[#303030] dark:hover:text-white";

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
      className={`fixed inset-x-0 z-30 border-t border-black/[0.06] bg-white/80 backdrop-blur-xl backdrop-saturate-150 supports-[not_(backdrop-filter:blur(1px))]:bg-white dark:border-strokestroke-gray dark:bg-[#171717]/95 dark:supports-[not_(backdrop-filter:blur(1px))]:bg-[#171717] ${
        aboveNav
          ? "bottom-[var(--bottom-nav-h)] max-md:h-[var(--action-bar-h)] md:bottom-0 md:left-[255px]"
          : "bottom-0 max-md:h-[calc(var(--action-bar-h)+env(safe-area-inset-bottom,0px))] md:left-[255px]"
      }`}
      style={{ paddingBottom: aboveNav ? 0 : "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto flex h-full w-full max-w-[412px] items-center gap-3 px-5 max-md:px-4 py-3 max-md:py-2.5 md:max-w-5xl md:px-6">
        {children}
      </div>
    </div>
  );
}