import type {
  GameState,
} from "../types";

import {
  assertCurrentCard,
} from "../utils/assertCurrentCard";

import {
  assertPlayerIndex,
} from "../utils/assertPlayerIndex";

import {
  getDrinksForRow,
} from "./getDrinksForRow";

export function giveDrinks(
  state: GameState,
  target: number
): GameState {
  if (
    state.phase !==
    "PLAYER_TURN"
  ) {
    throw new Error(
      `Cannot give drinks during phase "${state.phase}".`
    );
  }

  assertCurrentCard(
    state
  );

  assertPlayerIndex(
    state,
    target
  );

  const giver =
    state.turn.currentPlayer;

  if (
    !state.turn
      .remainingPlayers
      .includes(
        giver
      )
  ) {
    throw new Error(
      `Player ${giver} has already played on the current card.`
    );
  }

  if (
    state.turn
      .pendingAction !==
    null
  ) {
    throw new Error(
      "An action is already awaiting a response."
    );
  }

  if (
    target ===
    giver
  ) {
    throw new Error(
      "A player cannot target themselves."
    );
  }

  const giverCards =
    state.players[
      giver
    ];

  const giverHasMatchingCard =
    giverCards.some(
      (card) =>
        card.valeur ===
        state.current
          .card.valeur
    );

  const isRealBluff =
    !giverHasMatchingCard;

  const playerStats =
    state.gameStats
      .players.map(
        (
          stats,
          playerIndex
        ) => {
          if (
            playerIndex !==
            giver
          ) {
            return stats;
          }

          return {
            ...stats,

            claimsMade:
              stats.claimsMade +
              1,

            bluffsAttempted:
              stats.bluffsAttempted +
              (
                isRealBluff
                  ? 1
                  : 0
              ),
          };
        }
      );

  return {
    ...state,

    phase:
      "PLAYER_RESPONSE",

    gameStats: {
      ...state.gameStats,

      claimsMade:
        state.gameStats
          .claimsMade +
        1,

      bluffsAttempted:
        state.gameStats
          .bluffsAttempted +
        (
          isRealBluff
            ? 1
            : 0
        ),

      players:
        playerStats,
    },

    turn: {
      currentPlayer:
        target,

      remainingPlayers:
        state.turn
          .remainingPlayers,

      pendingAction: {
        giver,
        target,

        drinks:
          getDrinksForRow(
            state.current
              .row
          ),

        claimedCard:
          state.current
            .card,
      },
    },
  };
}