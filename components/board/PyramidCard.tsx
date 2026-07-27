import type { Carte } from "@/lib/deck";

type CardSize = "small" | "medium" | "large";

interface PyramidCardProps {
  card?: Carte | null;
  hidden?: boolean;
  selected?: boolean;
  disabled?: boolean;
  size?: CardSize;
  label?: string;
  onClick?: () => void;
}

const VALUE_LABELS: Record<string, string> = {
  As: "A",
  Valet: "V",
  Dame: "D",
  Roi: "R",
};

const SIZE_CLASSES: Record<CardSize, string> = {
  small: "h-20 w-14 rounded-lg",
  medium: "h-28 w-20 rounded-xl",
  large: "h-40 w-28 rounded-2xl",
};

const CORNER_CLASSES: Record<CardSize, string> = {
  small: "text-xs leading-none",
  medium: "text-sm leading-none",
  large: "text-lg leading-none",
};

const CENTER_CLASSES: Record<CardSize, string> = {
  small: "text-2xl",
  medium: "text-4xl",
  large: "text-6xl",
};

function formatValue(value: string): string {
  return VALUE_LABELS[value] ?? value;
}

function isRedSuit(suit: string): boolean {
  return suit === "♥" || suit === "♦";
}

export default function PyramidCard({
  card = null,
  hidden,
  selected = false,
  disabled = false,
  size = "medium",
  label,
  onClick,
}: PyramidCardProps) {
  const isHidden =
  hidden !== undefined
    ? hidden
    : !card || card.revelee === false;

  const isClickable =
    typeof onClick === "function" &&
    !disabled;

  const value = card
    ? formatValue(card.valeur)
    : "";

  const suit = card?.couleur ?? "";

  const textColor =
    card && isRedSuit(card.couleur)
      ? "text-red-600"
      : "text-zinc-950";

  const commonClasses = [
    "relative shrink-0 overflow-hidden border",
    "transition duration-200",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-yellow-400",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-zinc-950",
    SIZE_CLASSES[size],
    selected
      ? "border-yellow-400 ring-2 ring-yellow-400 shadow-[0_0_24px_rgba(250,204,21,0.35)]"
      : "border-white/20",
    disabled
      ? "cursor-not-allowed opacity-45"
      : isClickable
        ? "cursor-pointer hover:-translate-y-1 hover:scale-105"
        : "cursor-default",
  ].join(" ");

  const content = isHidden ? (
    <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-yellow-500 to-amber-700 p-1.5">
      <div className="flex h-full w-full items-center justify-center rounded-[inherit] border border-black/25 bg-zinc-950">
        <div className="absolute inset-1.5 rounded-[inherit] border border-yellow-400/40" />

        <div className="absolute inset-3 rounded-[inherit] border border-dashed border-yellow-400/25" />

        <div className="relative flex h-10 w-10 rotate-45 items-center justify-center rounded-lg border border-yellow-400/50 bg-yellow-400/10">
          <span className="-rotate-45 text-xl font-black text-yellow-400">
            PG
          </span>
        </div>
      </div>
    </div>
  ) : card ? (
    <div className="absolute inset-0 bg-gradient-to-br from-white to-zinc-200">
      <div
        className={[
          "absolute left-2 top-2 flex flex-col items-center font-black",
          CORNER_CLASSES[size],
          textColor,
        ].join(" ")}
      >
        <span>{value}</span>
        <span>{suit}</span>
      </div>

      <div
        className={[
          "absolute inset-0 flex items-center justify-center font-black",
          CENTER_CLASSES[size],
          textColor,
        ].join(" ")}
      >
        {suit}
      </div>

      <div
        className={[
          "absolute bottom-2 right-2 flex rotate-180 flex-col items-center font-black",
          CORNER_CLASSES[size],
          textColor,
        ].join(" ")}
      >
        <span>{value}</span>
        <span>{suit}</span>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/50" />
    </div>
  ) : (
    <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
      <span className="text-xl font-bold text-zinc-600">
        ?
      </span>
    </div>
  );

  if (isClickable) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={
          label ??
          (isHidden
            ? "Carte cachée"
            : `${value} ${suit}`)
        }
        aria-pressed={selected}
        className={commonClasses}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      aria-label={
        label ??
        (isHidden
          ? "Carte cachée"
          : card
            ? `${value} ${suit}`
            : "Emplacement de carte vide")
      }
      className={commonClasses}
    >
      {content}
    </div>
  );
}