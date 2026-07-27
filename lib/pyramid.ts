import type { Carte } from "@/lib/deck";

const MINIMUM_PYRAMID_CARD_COUNT = 15;

/**
 * Calcule la taille de chaque étage de la pyramide.
 *
 * Les tailles sont retournées du sommet vers la base.
 *
 * Exemple avec 16 cartes :
 * [1, 2, 3, 4, 6]
 *
 * Exemple avec 28 cartes :
 * [1, 2, 3, 4, 5, 6, 7]
 *
 * Exemple avec 44 cartes :
 * [2, 3, 4, 5, 6, 7, 8, 9]
 */
function calculerTaillesRangees(
  nombreCartes: number
): number[] {
  const taillesRangees: number[] = [];

  let cartesUtilisees = 0;
  let prochaineTaille = 1;

  /*
   * Construction de la plus grande pyramide parfaite
   * possible :
   *
   * 1
   * 1 + 2
   * 1 + 2 + 3
   * etc.
   */
  while (
    cartesUtilisees + prochaineTaille <=
    nombreCartes
  ) {
    taillesRangees.push(prochaineTaille);

    cartesUtilisees += prochaineTaille;
    prochaineTaille += 1;
  }

  let cartesSupplementaires =
    nombreCartes - cartesUtilisees;

  /*
   * Les cartes restantes sont distribuées
   * une par une, en partant de la base
   * et en remontant vers le sommet.
   */
  for (
    let index =
      taillesRangees.length - 1;
    index >= 0 &&
    cartesSupplementaires > 0;
    index -= 1
  ) {
    taillesRangees[index] += 1;
    cartesSupplementaires -= 1;
  }

  return taillesRangees;
}

export function creerPyramide(
  paquet: Carte[]
): Carte[][] {
  if (
    paquet.length <
    MINIMUM_PYRAMID_CARD_COUNT
  ) {
    throw new Error(
      `Impossible de construire la pyramide : ` +
        `${paquet.length} carte(s) disponible(s), ` +
        `${MINIMUM_PYRAMID_CARD_COUNT} minimum nécessaires.`
    );
  }

  const taillesRangees =
    calculerTaillesRangees(paquet.length);

  const pyramide: Carte[][] = [];

  let indexCarte = 0;

  for (const tailleRangee of taillesRangees) {
    const rangee = paquet.slice(
      indexCarte,
      indexCarte + tailleRangee
    );

    if (rangee.length !== tailleRangee) {
      throw new Error(
        "Impossible de construire complètement la pyramide."
      );
    }

    pyramide.push(rangee);

    indexCarte += tailleRangee;
  }

  if (indexCarte !== paquet.length) {
    throw new Error(
      "Certaines cartes n'ont pas été ajoutées à la pyramide."
    );
  }

  return pyramide;
}