const topBarDetails = ["Mon, 22 Sep 2026", "10:24"];

const TopBarSection = (): JSX.Element => {
  return (
    <header className="fixed top-0 left-[255px] right-0 z-[2] flex h-[52px] items-center border-b border-mode-app-border bg-white pl-0 pr-6">
      <div className="flex flex-1 self-stretch items-center justify-end gap-6 px-5">
        <div className="inline-flex flex-[0_0_auto] items-center gap-6">
          {topBarDetails.map((detail) => (
            <span
              key={detail}
              className="relative mt-[-1.00px] w-fit whitespace-nowrap font-inter-sm-medium-sm text-[length:var(--inter-sm-medium-sm-font-size)] font-[number:var(--inter-sm-medium-sm-font-weight)] leading-[var(--inter-sm-medium-sm-line-height)] tracking-[var(--inter-sm-medium-sm-letter-spacing)] text-text-colortext-dark [font-style:var(--inter-sm-medium-sm-font-style)]"
            >
              {detail}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
};

export default TopBarSection;
