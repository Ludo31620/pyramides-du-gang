import type { GameState } from "../types";

export function advancePlayer(
  state: GameState,
  playerToRemove: number
): GameState {
  const remainingPlayers =
    state.turn.remainingPlayers.filter(
      (player) => player !== playerToRemove
    );

  if (remainingPlayers.length === 0) {
    const pyramidIsFinished =
      state.progress.revealedCards >=
      state.progress.totalCards;

    return {
      ...state,

      phase: pyramidIsFinished
        ? "GAME_OVER"
        : "WAITING",

      turn: {
        currentPlayer: 0,
        remainingPlayers: [],
        pendingAction: null,
      },
    };
  }

  return {
    ...state,

    phase: "PLAYER_TURN",

    turn: {
      currentPlayer: remainingPlayers[0],
      remainingPlayers,
      pendingAction: null,
    },
  };
}