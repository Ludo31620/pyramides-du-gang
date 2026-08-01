import PlayingCard from "@/components/game/cards/PlayingCard";

import type {
  Carte,
} from "@/lib/deck";

type CardSize =
  | "small"
  | "medium"
  | "large";

interface PyramidCardProps {
  card: Carte | null;
  hidden: boolean;

  /**
   * Carte actuellement jouée dans
   * la pyramide.
   */
  active?: boolean;

  /**
   * Ancienne carte déjà révélée.
   */
  dimmed?: boolean;

  selected?: boolean;
  disabled?: boolean;
  size?: CardSize;
  label?: string;
  onClick?: () => void;
}

const SIZE_MAP = {
  small: "sm",
  medium: "md",
  large: "lg",
} as const;

/**
 * Carte factice utilisée uniquement pour
 * afficher le dos d'une carte cachée.
 *
 * Sa valeur n'est jamais visible puisque
 * PlayingCard reçoit faceUp={false}.
 */
const HIDDEN_CARD: Carte = {
  valeur: "As",
  couleur: "♠",
  revelee: false,
};

const CARD_SIZE_CLASSES: Record<
  CardSize,
  string
> = {
  small:
    "h-20 w-14 rounded-lg",

  medium:
    "h-28 w-20 rounded-xl",

  large:
    "h-40 w-28 rounded-2xl",
};

export default function PyramidCard({
  card,
  hidden,
  active = false,
  dimmed = false,
  selected = false,
  disabled = false,
  size = "medium",
  label,
  onClick,
}: PyramidCardProps) {
  if (hidden) {
    return (
      <div
        aria-label={
          label ??
          "Carte de pyramide cachée"
        }
        className="relative"
      >
        <PlayingCard
          card={
            HIDDEN_CARD
          }
          faceUp={false}
          size={
            SIZE_MAP[size]
          }
          selected={
            selected
          }
          disabled={
            disabled
          }
          onClick={
            onClick
          }
        />
      </div>
    );
  }

  if (!card) {
    return (
      <div
        aria-label={
          label ??
          "Carte indisponible"
        }
        className={[
          "flex shrink-0 items-center justify-center",
          "border border-dashed border-red-400/40",
          "bg-red-950/20",
          "font-black text-red-300",
          CARD_SIZE_CLASSES[
            size
          ],
        ].join(" ")}
      >
        !
      </div>
    );
  }

  return (
    <div
      aria-label={
        label
      }
      className={[
        "relative shrink-0 transition duration-300",
        active
          ? "z-10 scale-[1.06]"
          : "",
        dimmed
          ? "scale-[0.97] opacity-55 saturate-50"
          : "",
      ].join(" ")}
    >
      {active && (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-2 animate-pulse rounded-[inherit] bg-yellow-400/20 blur-md"
          />

          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-1 rounded-[inherit] border-2 border-yellow-400/70 shadow-[0_0_24px_rgba(250,204,21,0.55)]"
          />
        </>
      )}

      <div className="relative">
        <PlayingCard
          card={card}
          faceUp
          size={
            SIZE_MAP[size]
          }
          selected={
            selected
          }
          disabled={
            disabled
          }
          onClick={
            onClick
          }
        />
      </div>
    </div>
  );
}