import type {
  PlayingCardSize,
} from "./cardUtils";

import {
  CARD_CORNER_CLASSES,
  joinClasses,
} from "./cardUtils";

interface CardBackProps {
  size?: PlayingCardSize;
  className?: string;
}

export default function CardBack({
  size = "md",
  className,
}: CardBackProps) {
  return (
    <div
      aria-hidden="true"
      className={joinClasses(
        "relative h-full w-full overflow-hidden border border-[#FFD166]/45 bg-[#0B0E13]",
        CARD_CORNER_CLASSES[size],
        className
      )}
    >
      <div className="absolute inset-[5%] rounded-[inherit] border border-[#FFD166]/25" />

      <div className="absolute inset-[10%] rounded-[inherit] border border-[#FFD166]/15" />

      <div className="absolute left-1/2 top-1/2 h-[135%] w-[46%] -translate-x-1/2 -translate-y-1/2 rotate-45 border-x border-[#FFD166]/10" />

      <div className="absolute left-1/2 top-1/2 h-[135%] w-[46%] -translate-x-1/2 -translate-y-1/2 -rotate-45 border-x border-[#FFD166]/10" />

      <div className="absolute left-1/2 top-[12%] h-[23%] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#FFD166]/40 to-transparent" />

      <div className="absolute bottom-[12%] left-1/2 h-[23%] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#FFD166]/40 to-transparent" />

      <div className="absolute left-1/2 top-1/2 flex aspect-square w-[52%] -translate-x-1/2 -translate-y-1/2 rotate-45 items-center justify-center border border-[#FFD166]/50 bg-[#111722] shadow-[0_0_22px_rgba(255,209,102,0.12)]">
        <div className="flex h-[72%] w-[72%] items-center justify-center border border-[#FFD166]/30">
          <div className="-rotate-45 text-center">
            <div className="mx-auto h-0 w-0 border-x-[12px] border-b-[20px] border-x-transparent border-b-[#FFD166]" />

            <div className="mx-auto mt-1 h-px w-7 bg-[#FFD166]/70" />

            <span className="mt-1 block text-[7px] font-black uppercase tracking-[0.3em] text-[#FFD166] sm:text-[8px]">
              Gang
            </span>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-[20%] top-[8%] h-px bg-gradient-to-r from-transparent via-[#FFD166]/30 to-transparent" />

      <div className="absolute inset-x-[20%] bottom-[8%] h-px bg-gradient-to-r from-transparent via-[#FFD166]/30 to-transparent" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/25" />
    </div>
  );
}