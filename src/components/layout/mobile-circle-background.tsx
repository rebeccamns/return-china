export default function MobileCircleBackground() {
  return (
    <section
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden overflow-hidden max-md:block"
    >
      <div className="absolute -right-40 -top-44 h-[420px] w-[420px] rounded-full border border-emerald-100 dark:border-emerald-900/30" />
      <div className="absolute -right-24 -top-28 h-[280px] w-[280px] rounded-full bg-emerald-50/70 dark:bg-emerald-950/20" />
    </section>
  );
}
