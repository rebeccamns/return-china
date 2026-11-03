import type { ReactNode } from "react";

/**
 * Shared by Staff Return and IQC.
 * `aboveNav` positions the bar exactly on top of <MobileBottomNav /> using the
 * --bottom-nav-h CSS variable (defined in globals.css), so they never overlap.
 */

export const primaryButton =
  "h-12 max-md:h-11 rounded-[14px] border border-[#08783F] bg-[#08783F] px-4 text-[15px] max-md:text-button font-semibold text-white shadow-sm " +
  "transition active:scale-[0.98] hover:border-[#066B3B] hover:bg-[#066B3B] " +
  "disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300 disabled:hover:bg-slate-300 disabled:active:scale-100";

export const secondaryButton =
  "h-12 max-md:h-11 rounded-[14px] border border-[#08783F]/25 bg-white/65 px-4 backdrop-blur-sm " +
  "text-[15px] max-md:text-button font-semibold text-[#08783F] transition active:scale-[0.98] " +
  "hover:border-[#08783F]/40 hover:bg-[#E7F5EC] hover:text-[#066B3B]";

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
      <div className="mx-auto flex w-full max-w-[412px] gap-3 px-4 py-3 max-md:h-full max-md:items-center max-md:py-2.5">
        {children}
      </div>
    </div>
  );
}