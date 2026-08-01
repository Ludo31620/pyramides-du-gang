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
    <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
      {cards.map(
        (
          card,
          index
        ) => {
          const cardIsHidden =
            hidden ||
            card === null;

          return (
            <PlayingCard
              key={
                card
                  ? `${card.valeur}-${card.couleur}-${index}`
                  : `hidden-card-${index}`
              }
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
          );
        }
      )}
    </div>
  );
}