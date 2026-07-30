"use client";

import type {
  Carte,
} from "@/lib/deck";

type PlayerHandProps = {
  cards: Array<
    Carte | null
  >;

  hidden?: boolean;
};

export default function PlayerHand({
  cards,
  hidden = false,
}: PlayerHandProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {cards.map(
        (
          card,
          index
        ) => {
          const cardIsHidden =
            hidden ||
            card === null;

          return (
            <div
              key={
                card
                  ? `${card.valeur}-${card.couleur}-${index}`
                  : `hidden-card-${index}`
              }
              className={[
                "flex",
                "h-32",
                "w-24",
                "items-center",
                "justify-center",
                "rounded-xl",
                "border-2",
                "text-2xl",
                "font-bold",
                "shadow-lg",
                "transition-all",
                "duration-300",
                cardIsHidden
                  ? "border-zinc-700 bg-zinc-950"
                  : "border-zinc-300 bg-white",
              ].join(" ")}
            >
              {cardIsHidden ? (
                <span className="text-4xl text-zinc-600">
                  🂠
                </span>
              ) : (
                <span
                  className={
                    card.couleur ===
                      "♥" ||
                    card.couleur ===
                      "♦"
                      ? "text-red-600"
                      : "text-black"
                  }
                >
                  {card.valeur}
                  {card.couleur}
                </span>
              )}
            </div>
          );
        }
      )}
    </div>
  );
}