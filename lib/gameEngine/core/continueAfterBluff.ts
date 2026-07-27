import type {
  GameState,
} from "../types";

import {
  advancePlayer,
} from "./advancePlayer";

export function continueAfterBluff(
  state: GameState
): GameState {
  if (
    state.phase !==
    "BLUFF_RESULT"
  ) {
    throw new Error(
      `Cannot continue after bluff during phase "${state.phase}".`
    );
  }

  if (!state.bluffResult) {
    throw new Error(
      "No bluff result to continue."
    );
  }

  const giver =
    state.bluffResult.giver;

  const cleanedState: GameState = {
    ...state,

    bluffResult: null,
  };

  return advancePlayer(
    cleanedState,
    giver
  );
}