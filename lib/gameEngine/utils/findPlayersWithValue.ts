import type { Carte } from "@/lib/deck";

/**
 * Retourne les index des joueurs possédant au moins
 * une carte de la valeur recherchée.
 *
 * Exemple :
 * - résultat [0, 3]
 * - les joueurs 1 et 4 possèdent cette valeur
 *
 * Un joueur est ajouté une seule fois, même s'il possède
 * plusieurs cartes de la même valeur.
 */
export function findPlayersWithValue(
  players: Carte[][],
  value: Carte["valeur"]
): number[] {
  return players.reduce<number[]>(
    (
      matchingPlayers,
      playerCards,
      playerIndex
    ) => {
      const hasValue = playerCards.some(
        (card) => card.valeur === value
      );

      if (hasValue) {
        matchingPlayers.push(playerIndex);
      }

      return matchingPlayers;
    },
    []
  );
}