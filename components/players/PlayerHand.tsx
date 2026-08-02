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
    <div className="w-full">
      {/*
       * Version téléphone :
       * les cartes utilisent une vraie taille
       * plus petite, sans scale artificiel.
       */}
      <div className="grid w-full grid-cols-4 place-items-center gap-1 px-1 sm:hidden">
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
                    ? `mobile-${card.valeur}-${card.couleur}-${index}`
                    : `mobile-hidden-${index}`
                }
                card={
                  cardIsHidden
                    ? HIDDEN_CARD
                    : card
                }
                faceUp={
                  !cardIsHidden
                }
                size="md"
              />
            );
          }
        )}
      </div>

      {/*
       * Version tablette et ordinateur :
       * on conserve la taille actuelle.
       */}
      <div className="hidden flex-wrap justify-center gap-4 sm:flex">
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
                    ? `desktop-${card.valeur}-${card.couleur}-${index}`
                    : `desktop-hidden-${index}`
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
    </div>
  );
}