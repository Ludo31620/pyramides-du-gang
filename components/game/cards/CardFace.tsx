import type { Carte } from "@/lib/deck";

import type { PlayingCardSize } from "./cardUtils";

import {
  CARD_CENTER_SUIT_CLASSES,
  CARD_CORNER_CLASSES,
  CARD_VALUE_CLASSES,
  getShortValue,
  getSuitColorClass,
  joinClasses,
} from "./cardUtils";

interface CardFaceProps {
  card: Carte;
  size?: PlayingCardSize;
  className?: string;
}

export default function CardFace({
  card,
  size = "md",
  className,
}: CardFaceProps) {
  const shortValue = getShortValue(card.valeur);
  const colorClass = getSuitColorClass(card.couleur);

  return (
    <div
      aria-label={`${card.valeur} ${card.couleur}`}
      className={joinClasses(
        "relative h-full w-full overflow-hidden border border-[#D6C08D] bg-[#FCFAF5]",
        "shadow-[inset_0_0_18px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.18)]",
        CARD_CORNER_CLASSES[size],
        colorClass,
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-white/90 via-[#FCFAF5] to-[#EEE9DE]" />

      <div className="pointer-events-none absolute inset-[3%] z-0 rounded-[inherit] border border-black/[0.06]" />

      <div
        className={joinClasses(
          "absolute left-[9%] top-[7%] z-10 flex flex-col items-center font-black",
          CARD_VALUE_CLASSES[size]
        )}
      >
        <span>{shortValue}</span>

        <span className="mt-[2px]">
          {card.couleur}
        </span>
      </div>

      <div
        className={joinClasses(
          "absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 font-black",
          CARD_CENTER_SUIT_CLASSES[size]
        )}
      >
        {card.couleur}
      </div>

      <div
        className={joinClasses(
          "absolute bottom-[7%] right-[9%] z-10 flex rotate-180 flex-col items-center font-black",
          CARD_VALUE_CLASSES[size]
        )}
      >
        <span>{shortValue}</span>

        <span className="mt-[2px]">
          {card.couleur}
        </span>
      </div>

      <div className="pointer-events-none absolute inset-x-[12%] top-0 z-20 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
    </div>
  );
}