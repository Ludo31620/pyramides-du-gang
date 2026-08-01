import type {
  Carte,
  Couleur,
  Valeur,
} from "@/lib/deck";

export type PlayingCardSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl";

export const CARD_SIZE_CLASSES: Record<
  PlayingCardSize,
  string
> = {
  xs: "w-10 sm:w-12",
  sm: "w-14 sm:w-16",
  md: "w-20 sm:w-24",
  lg: "w-28 sm:w-32",
  xl: "w-36 sm:w-44",
};

export const CARD_CORNER_CLASSES: Record<
  PlayingCardSize,
  string
> = {
  xs: "rounded-md",
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-2xl",
  xl: "rounded-3xl",
};

export const CARD_VALUE_CLASSES: Record<
  PlayingCardSize,
  string
> = {
  xs: "text-[9px] leading-none",
  sm: "text-xs leading-none",
  md: "text-base leading-none",
  lg: "text-xl leading-none",
  xl: "text-2xl leading-none",
};

export const CARD_CENTER_SUIT_CLASSES: Record<
  PlayingCardSize,
  string
> = {
  xs: "text-base",
  sm: "text-xl",
  md: "text-3xl",
  lg: "text-5xl",
  xl: "text-6xl",
};

/**
 * Taille des symboles disposés au centre
 * des cartes numériques.
 */
export const CARD_PIP_CLASSES: Record<
  PlayingCardSize,
  string
> = {
  xs: "text-[9px]",
  sm: "text-sm",
  md: "text-lg",
  lg: "text-[1.8rem]",
  xl: "text-[2.3rem]",
};

export function isRedSuit(
  couleur: Couleur
): boolean {
  return (
    couleur === "♥" ||
    couleur === "♦"
  );
}

export function isRedCard(
  card: Carte
): boolean {
  return isRedSuit(
    card.couleur
  );
}

export function getSuitColorClass(
  couleur: Couleur
): string {
  return isRedSuit(
    couleur
  )
    ? "text-[#D9485F]"
    : "text-[#1E1E1E]";
}

export function getShortValue(
  valeur: Valeur
): string {
  const values: Partial<
    Record<
      Valeur,
      string
    >
  > = {
    As: "A",
    Valet: "V",
    Dame: "D",
    Roi: "R",
  };

  return (
    values[valeur] ??
    valeur
  );
}

export function getCardLabel(
  card: Carte
): string {
  return `${card.valeur} ${card.couleur}`;
}

export function joinClasses(
  ...classes: Array<
    | string
    | false
    | null
    | undefined
  >
): string {
  return classes
    .filter(Boolean)
    .join(" ");
}