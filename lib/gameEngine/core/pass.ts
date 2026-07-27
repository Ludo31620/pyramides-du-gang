import type {
  GameState,
} from "../types";

import {
  advancePlayer,
} from "./advancePlayer";

export function passTurn(
  state: GameState
): GameState {
  if (
    state.phase !==
    "PLAYER_TURN"
  ) {
    throw new Error(
      `Cannot pass during phase "${state.phase}".`
    );
  }

  const currentPlayer =
    state.turn.currentPlayer;

  if (
    !state.turn.remainingPlayers.includes(
      currentPlayer
    )
  ) {
    throw new Error(
      `Player ${currentPlayer} has already played on the current card.`
    );
  }

  if (
    state.turn.pendingAction !== null
  ) {
    throw new Error(
      "Cannot pass while an action is awaiting a response."
    );
  }

  return advancePlayer(
    state,
    currentPlayer
  );
}