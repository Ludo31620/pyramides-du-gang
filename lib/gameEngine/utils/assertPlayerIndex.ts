import { GameState } from "../types";

export function assertPlayerIndex(
  state: GameState,
  playerIndex: number
): void {
  const isInteger = Number.isInteger(playerIndex);

  const isValidIndex =
    playerIndex >= 0 &&
    playerIndex < state.players.length;

  if (!isInteger || !isValidIndex) {
    throw new Error(
      `Invalid player index: ${playerIndex}.`
    );
  }
}