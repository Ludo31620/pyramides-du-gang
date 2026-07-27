import { createGame } from "@/lib/gameEngine/core/createGame";
import type { GameState } from "@/lib/gameEngine/types";

/**
 * Crée une partie de test.
 *
 * Le nombre de joueurs peut être
 * personnalisé si nécessaire.
 */
export function createTestGame(
  playerCount = 4
): GameState {
  return createGame(playerCount);
}