import { GameState } from "../types";
import { advancePlayer } from "./advancePlayer";

export function nextPlayer(state: GameState): GameState {
  if (state.phase !== "PLAYER_TURN") {
    throw new Error(
      `Cannot move to the next player during phase "${state.phase}".`
    );
  }

  return advancePlayer(
    state,
    state.turn.currentPlayer
  );
}