import Card from "@/components/game/Card";

import type { Carte } from "@/lib/deck";

type HandCardSize =
  | "small"
  | "medium"
  | "large";

type HandProps = {
  cards: Array<Carte | null>;
  hidden?: boolean;
  disabled?: boolean;
  selectedCardIndex?: number | null;
  cardSize?: HandCardSize;
  className?: string;
};

export default function Hand({
  cards,
  hidden = false,
  disabled = false,
  selectedCardIndex = null,
  cardSize = "medium",
  className = "",
}: HandProps) {
  if (cards.length === 0) {
    return (
      <div
        className={[
          "rounded-2xl border border-[#2E313A]",
          "bg-[#181A20] px-5 py-8 text-center",
          className,
        ].join(" ")}
      >
        <p className="text-sm text-zinc-500">
          Aucune carte disponible.
        </p>
      </div>
    );
  }

  return (
    <div
      aria-label="Main du joueur"
      className={[
        "flex w-full items-end",
        "justify-center gap-2",
        "sm:gap-3",
        className,
      ].join(" ")}
    >
      {cards.map(
        (card, index) => (
          <Card
            key={
              card
                ? `${card.valeur}-${card.couleur}-${index}`
                : `hidden-card-${index}`
            }
            card={card}
            hidden={
              hidden ||
              card === null
            }
            disabled={disabled}
            selected={
              selectedCardIndex ===
              index
            }
            size={cardSize}
            className={[
              "min-w-0",
              cardSize === "medium"
                ? "max-sm:h-[132px] max-sm:w-[89px]"
                : "",
            ].join(" ")}
          />
        )
      )}
    </div>
  );
}