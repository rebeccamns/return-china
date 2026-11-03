import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

type BackTitleProps = {
  title: string;
  /** Omit on top-level screens: renders a plain title with no chevron. */
  onBack?: () => void;
  backLabel?: string;
  subtitle?: string;
  /** Optional content rendered inline beside the title. */
  titleExtra?: ReactNode;
};

/** Back button merged with the page title:  ‹ Title */
export default function BackTitle({
  title,
  onBack,
  backLabel = "Back",
  subtitle,
  titleExtra,
}: BackTitleProps) {
  const titleClass =
    "truncate text-[22px] max-md:text-title font-semibold leading-7 tracking-[-0.01em] text-text-colortext-black";

  return (
    <div>
      <h1 className="m-0">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label={`${backLabel} ${title}`}
            className="-ml-1 flex min-h-11 max-w-full items-center gap-1 text-left"
          >
            <ChevronLeft
              className="h-6 w-6 shrink-0 text-primaryprimary-green"
              strokeWidth={2}
            />
            <span className={titleClass}>{title}</span>
            {titleExtra}
          </button>
        ) : (
          <span className={`block py-1.5 ${titleClass}`}>{title}</span>
        )}
      </h1>

      {subtitle && (
        <p
          className={`mt-0.5 text-[13px] max-md:text-secondary leading-[18px] text-text-colortext-gray ${
            onBack ? "pl-6" : ""
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}