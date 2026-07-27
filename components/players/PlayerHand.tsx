"use client";

import type { Carte } from "@/lib/deck";

type PlayerHandProps = {
  cards: Carte[];
  hidden?: boolean;
};

export default function PlayerHand({
  cards,
  hidden = false,
}: PlayerHandProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="
            flex
            h-32
            w-24
            items-center
            justify-center
            rounded-xl
            border-2
            border-zinc-700
            bg-white
            text-2xl
            font-bold
            shadow-lg
            transition-all
            duration-300
          "
        >
          {hidden ? (
            <span className="text-4xl text-zinc-700">
              🂠
            </span>
          ) : (
            <span
              className={
                card.couleur === "♥" ||
                card.couleur === "♦"
                  ? "text-red-600"
                  : "text-black"
              }
            >
              {card.valeur}
              {card.couleur}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}