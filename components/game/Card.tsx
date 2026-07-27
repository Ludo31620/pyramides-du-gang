import type { Carte } from "@/lib/deck";

type CardSize =
  | "small"
  | "medium"
  | "large";

type GameCardProps = {
  card?: Carte | null;
  hidden?: boolean;
  selected?: boolean;
  disabled?: boolean;
  size?: CardSize;
  className?: string;
};

const SIZE_CLASSES: Record<
  CardSize,
  {
    container: string;
    cornerValue: string;
    cornerSuit: string;
    centerSuit: string;
  }
> = {
  small: {
    container:
      "h-[112px] w-[76px] rounded-[12px]",
    cornerValue:
      "text-[17px] leading-[16px]",
    cornerSuit:
      "text-[15px] leading-[15px]",
    centerSuit:
      "text-[38px]",
  },

  medium: {
    container:
      "h-[156px] w-[106px] rounded-[16px]",
    cornerValue:
      "text-[23px] leading-[21px]",
    cornerSuit:
      "text-[19px] leading-[18px]",
    centerSuit:
      "text-[53px]",
  },

  large: {
    container:
      "h-[224px] w-[152px] rounded-[20px]",
    cornerValue:
      "text-[32px] leading-[29px]",
    cornerSuit:
      "text-[27px] leading-[25px]",
    centerSuit:
      "text-[76px]",
  },
};

function estCouleurRouge(
  couleur: Carte["couleur"]
): boolean {
  return (
    couleur === "♥" ||
    couleur === "♦"
  );
}

function creerLibelleCarte(
  card: Carte
): string {
  const nomsCouleurs: Record<
    Carte["couleur"],
    string
  > = {
    "♠": "pique",
    "♥": "cœur",
    "♦": "carreau",
    "♣": "trèfle",
  };

  return `${card.valeur} de ${nomsCouleurs[card.couleur]}`;
}

export default function Card({
  card = null,
  hidden = false,
  selected = false,
  disabled = false,
  size = "medium",
  className = "",
}: GameCardProps) {
  const dimensions =
    SIZE_CLASSES[size];

  const doitAfficherDos =
    hidden || card === null;

  const couleurTexte =
    card &&
    estCouleurRouge(
      card.couleur
    )
      ? "text-[#D72D2D]"
      : "text-[#121318]";

  const etatVisuel = selected
    ? [
        "border-[#FFD166]",
        "shadow-[0_0_0_2px_rgba(255,209,102,0.35),0_0_28px_rgba(255,209,102,0.55)]",
        "-translate-y-1",
      ].join(" ")
    : [
        "border-[#E8C66A]",
        "shadow-[0_12px_28px_rgba(0,0,0,0.38)]",
      ].join(" ");

  const desactive =
    disabled
      ? "pointer-events-none opacity-40 grayscale"
      : "";

  if (doitAfficherDos) {
    return (
      <div
        role="img"
        aria-label="Carte cachée"
        className={[
          "relative shrink-0 overflow-hidden border-2",
          "bg-[#10131A]",
          "transition duration-200",
          dimensions.container,
          selected
            ? "border-[#FFD166] shadow-[0_0_28px_rgba(255,209,102,0.45)] -translate-y-1"
            : "border-[#C99724] shadow-[0_12px_28px_rgba(0,0,0,0.38)]",
          desactive,
          className,
        ].join(" ")}
      >
        <div className="absolute inset-[5px] rounded-[inherit] border border-[#FFD166]/45" />

        <div
          className={[
            "absolute inset-0 opacity-35",
            "bg-[linear-gradient(135deg,transparent_44%,rgba(255,209,102,0.24)_45%,rgba(255,209,102,0.24)_46%,transparent_47%),linear-gradient(45deg,transparent_44%,rgba(123,92,250,0.18)_45%,rgba(123,92,250,0.18)_46%,transparent_47%)]",
            "bg-[length:28px_28px]",
          ].join(" ")}
        />

        <div className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full border border-[#FFD166]" />

        <div className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full border border-[#FFD166]" />

        <div className="absolute bottom-2 left-2 h-1.5 w-1.5 rounded-full border border-[#FFD166]" />

        <div className="absolute bottom-2 right-2 h-1.5 w-1.5 rounded-full border border-[#FFD166]" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center text-[#FFD166]">
            <div
              className={
                size === "small"
                  ? "text-3xl"
                  : size === "medium"
                    ? "text-5xl"
                    : "text-7xl"
              }
            >
              Ⅲ
            </div>

            <div
              className={[
                "mt-1 h-px bg-[#FFD166]",
                size === "small"
                  ? "w-8"
                  : size === "medium"
                    ? "w-12"
                    : "w-16",
              ].join(" ")}
            />

            <span
              className={[
                "mt-2 font-black uppercase tracking-[0.18em]",
                size === "small"
                  ? "text-[6px]"
                  : size === "medium"
                    ? "text-[8px]"
                    : "text-[11px]",
              ].join(" ")}
            >
              Pyramide
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={
        card
          ? creerLibelleCarte(card)
          : "Carte"
      }
      className={[
        "relative shrink-0 overflow-hidden border-2",
        "bg-gradient-to-br from-[#FFFDF8] via-[#F5F5F5] to-[#EDE8DE]",
        "transition duration-200",
        dimensions.container,
        etatVisuel,
        desactive,
        className,
      ].join(" ")}
    >
      <div className="absolute inset-[5px] rounded-[inherit] border border-[#D8B453]/60" />

      <div
        className={[
          "absolute left-[10%] top-[7%] z-10 flex flex-col items-center font-serif font-black",
          couleurTexte,
        ].join(" ")}
      >
        <span className={dimensions.cornerValue}>
          {card.valeur}
        </span>

        <span className={dimensions.cornerSuit}>
          {card.couleur}
        </span>
      </div>

      <div
        className={[
          "absolute inset-0 flex items-center justify-center font-serif",
          couleurTexte,
          dimensions.centerSuit,
        ].join(" ")}
      >
        <span className="drop-shadow-sm">
          {card.couleur}
        </span>
      </div>

      <div
        className={[
          "absolute bottom-[7%] right-[10%] z-10 flex rotate-180 flex-col items-center font-serif font-black",
          couleurTexte,
        ].join(" ")}
      >
        <span className={dimensions.cornerValue}>
          {card.valeur}
        </span>

        <span className={dimensions.cornerSuit}>
          {card.couleur}
        </span>
      </div>

      {selected && (
        <div className="pointer-events-none absolute inset-0 bg-[#FFD166]/5" />
      )}
    </div>
  );
}