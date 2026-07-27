import type { GameState } from "../types";

export function revealCard(state: GameState): GameState {
  if (
    state.progress.revealedCards >=
    state.progress.totalCards
  ) {
    return {
      ...state,
      phase: "GAME_OVER",
    };
  }

  const pyramid = state.pyramid.map((row) =>
    row.map((card) => ({ ...card }))
  );

  const row = state.progress.nextRow;
  const column = state.progress.nextColumn;

  const realRow = pyramid.length - 1 - row;

  if (realRow < 0) {
    return {
      ...state,
      phase: "GAME_OVER",
    };
  }

  const card = pyramid[realRow]?.[column];

  if (!card) {
    return {
      ...state,
      phase: "GAME_OVER",
    };
  }

  card.revelee = true;

  let nextRow = row;
  let nextColumn = column + 1;

  if (nextColumn >= pyramid[realRow].length) {
    nextRow += 1;
    nextColumn = 0;
  }

  const revealedCards =
    state.progress.revealedCards + 1;

  return {
    ...state,

    pyramid,

    current: {
      row,
      column,
      card,
    },

    progress: {
      ...state.progress,
      revealedCards,
      nextRow,
      nextColumn,
    },

    phase: "PLAYER_TURN",

    turn: {
      currentPlayer: 0,
      remainingPlayers: [
        ...Array(state.players.length).keys(),
      ],
      pendingAction: null,
    },
  };
}