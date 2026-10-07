import { UserRound } from "lucide-react";

export default function MobileHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-20 w-full bg-backgroundbg-white">
      {/* Device / network header */}
      <div className="flex h-[91px] flex-col items-center gap-4 border-b border-strokestroke-gray bg-backgroundbg-white pb-4">
        <div className="flex w-full items-center justify-between px-8 py-2">
          <time
            dateTime="03:30"
            className="w-[54px] text-[14px] font-semibold leading-normal text-[#202124]"
          >
            3:30
          </time>

          <div
            aria-label="Mobile status indicators"
            className="flex items-center gap-2"
          >
            <span className="text-[16px]">▮▮▮</span>
            <span className="text-[16px]">⌁</span>
            <span className="text-[16px]">▰</span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2.5">
          <div className="flex items-center gap-[5px]">
            <span className="text-[13px] text-[#202124]">🔒</span>

            <span className="text-[14px] leading-normal text-[#202124]">
              10.121.123.456
            </span>
          </div>
        </div>
      </div>

      {/* OPPO header */}
      <div className="flex h-[58px] items-center justify-between border-b border-strokestroke-gray bg-backgroundbg-white px-4 py-1">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2">
          <img
            src="/oppo-logo.png"
            alt="OPPO"
            className="h-3 w-[52px] object-contain"
          />

          <div className="flex flex-col justify-center text-[10px] font-medium leading-[10px] text-black">
            <span>Indonesia</span>
            <span>Manufacturing</span>
          </div>
        </div>

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end justify-center gap-0.5">
            <span className="text-[12px] font-medium leading-[125%] text-text-colortext-black">
              Bagus Saputra
            </span>

            <span className="text-[10px] leading-4 text-text-colortext-black">
              I0123456
            </span>
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 p-1">
            <UserRound
              className="h-4 w-4 text-text-colortext-black"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </header>
  );
}