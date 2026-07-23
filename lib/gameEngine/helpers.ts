import { Carte } from "@/lib/deck";
import { DRINKS_PER_ROW, PYRAMID_LAYOUT } from "./constants";

/**
 * Retourne le nombre de gorgées d'une ligne.
 */
export function getDrinkValue(row: number): number {
  return DRINKS_PER_ROW[row];
}

/**
 * Vérifie qu'un joueur possède exactement la carte révélée.
 */
export function playerHasExactCard(
  hand: Carte[],
  card: Carte
): boolean {
  return hand.some(
    (c) =>
      c.valeur === card.valeur &&
      c.couleur === card.couleur
  );
}

/**
 * Retourne la position de la prochaine carte à révéler.
 */
export function getNextCardPosition(
  row: number,
  column: number
) {
  column++;

  if (column >= PYRAMID_LAYOUT[row]) {
    row++;
    column = 0;
  }

  return {
    row,
    column,
  };
}

/**
 * Vérifie si toute la pyramide est terminée.
 */
export function isPyramidFinished(
  row: number
): boolean {
  return row >= PYRAMID_LAYOUT.length;
}

/**
 * Retourne la liste des joueurs qui doivent jouer.
 */
export function createPlayerQueue(
  playerCount: number
): number[] {
  return Array.from(
    { length: playerCount },
    (_, index) => index
  );
}