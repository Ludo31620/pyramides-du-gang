"use client";

import PlayingCard from "@/components/game/cards/PlayingCard";

import type {
  Carte,
} from "@/lib/deck";

type PlayerHandProps = {
  cards: Array<
    Carte | null
  >;

  hidden?: boolean;
};

const HIDDEN_CARD: Carte = {
  valeur: "As",
  couleur: "♠",
  revelee: false,
};

export default function PlayerHand({
  cards,
  hidden = false,
}: PlayerHandProps) {
  return (
    <div
      className="
        flex
        flex-nowrap
        justify-center
        gap-2
        overflow-x-auto
        px-2
        sm:flex-wrap
        sm:gap-4
        sm:overflow-visible
      "
    >
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
              className="
                shrink-0
                scale-[0.82]
                sm:scale-100
              "
            >
              <PlayingCard
                card={
                  cardIsHidden
                    ? HIDDEN_CARD
                    : card
                }
                faceUp={
                  !cardIsHidden
                }
                size="lg"
              />
            </div>
          );
        }
      )}
    </div>
  );
}