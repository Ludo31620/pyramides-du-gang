import PlayingCard from "@/components/game/cards/PlayingCard";

import type {
  Carte,
} from "@/lib/deck";

type CardSize =
  | "small"
  | "medium"
  | "large";

interface PyramidCardProps {
  card?: Carte | null;
  hidden?: boolean;
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

const EMPTY_SIZE_CLASSES: Record<
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
  card = null,
  hidden,
  selected = false,
  disabled = false,
  size = "medium",
  label,
  onClick,
}: PyramidCardProps) {
  const faceUp =
    hidden !== undefined
      ? !hidden
      : Boolean(
          card?.revelee
        );

  /*
   * Une carte à null ne signifie pas
   * que l'emplacement est vide.
   *
   * Le serveur masque volontairement
   * les cartes non révélées pour ne pas
   * envoyer leur valeur aux joueurs.
   *
   * On affiche donc un dos de carte
   * générique.
   */
  if (!card) {
    const isClickable =
      Boolean(onClick) &&
      !disabled;

    const Component =
      isClickable
        ? "button"
        : "div";

    return (
      <Component
        {...(
          isClickable
            ? {
                type:
                  "button" as const,

                onClick,
              }
            : {}
        )}
        aria-label={
          label ??
          "Carte de pyramide cachée"
        }
        className={[
          "relative shrink-0 overflow-hidden",
          "border-2 border-zinc-500",
          "bg-zinc-950",
          "shadow-lg",
          "transition",
          EMPTY_SIZE_CLASSES[
            size
          ],
          disabled
            ? "cursor-not-allowed opacity-45"
            : "",
          isClickable
            ? "cursor-pointer active:scale-95"
            : "",
          selected
            ? "ring-2 ring-yellow-400 ring-offset-2 ring-offset-zinc-950"
            : "",
        ].join(" ")}
      >
        <span className="absolute inset-1 rounded-[inherit] border border-zinc-700 bg-zinc-900">
          <span className="absolute inset-1 rounded-[inherit] border border-zinc-600/60">
            <span className="absolute inset-0 flex items-center justify-center">
              <span
                aria-hidden="true"
                className={[
                  "font-black text-zinc-500",
                  size ===
                  "small"
                    ? "text-xl"
                    : size ===
                        "large"
                      ? "text-5xl"
                      : "text-3xl",
                ].join(" ")}
              >
                🂠
              </span>
            </span>

            <span
              aria-hidden="true"
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent 0, transparent 4px, rgba(255,255,255,0.16) 4px, rgba(255,255,255,0.16) 5px)",
              }}
            />
          </span>
        </span>
      </Component>
    );
  }

  return (
    <PlayingCard
      card={card}
      faceUp={faceUp}
      size={SIZE_MAP[size]}
      selected={selected}
      disabled={disabled}
      onClick={onClick}
    />
  );
}