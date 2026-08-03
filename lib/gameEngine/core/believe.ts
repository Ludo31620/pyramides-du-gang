import type {
  GameState,
} from "../types";

import {
  assertPendingAction,
} from "../utils/assertPendingAction";

export function believe(
  state: GameState
): GameState {
  if (
    state.phase !==
    "PLAYER_RESPONSE"
  ) {
    throw new Error(
      `Cannot believe during phase "${state.phase}".`
    );
  }

  assertPendingAction(
    state
  );

  const action =
    state.turn
      .pendingAction;

  const drinks = [
    ...state.drinks,
  ];

  drinks[
    action.target
  ] += action.drinks;

  const giverCards =
    state.players[
      action.giver
    ];

  const giverHasMatchingCard =
    giverCards.some(
      (card) =>
        card.valeur ===
        action.claimedCard
          .valeur
    );

  const bluffSucceeded =
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
            action.giver
          ) {
            return stats;
          }

          return {
            ...stats,

            drinksGiven:
              stats.drinksGiven +
              action.drinks,

            successfulBluffs:
              stats.successfulBluffs +
              (
                bluffSucceeded
                  ? 1
                  : 0
              ),
          };
        }
      );

  return {
    ...state,

    phase:
      "BLUFF_RESULT",

    drinks,

    gameStats: {
      ...state.gameStats,

      drinksGiven:
        state.gameStats
          .drinksGiven +
        action.drinks,

      successfulBluffs:
        state.gameStats
          .successfulBluffs +
        (
          bluffSucceeded
            ? 1
            : 0
        ),

      players:
        playerStats,
    },

    bluffResult: {
      giver:
        action.giver,

      target:
        action.target,

      drinks:
        action.drinks,

      outcome:
        "BELIEVED",

      revealedCard:
        null,

      punishedPlayer:
        action.target,
    },

    history: [
      ...state.history,

      {
        player:
          action.target,

        message:
          `Le joueur ${action.target + 1} ` +
          `accepte de boire ` +
          `${action.drinks} gorgée(s).`,

        timestamp:
          Date.now(),
      },
    ],

    turn: {
      ...state.turn,

      pendingAction:
        null,
    },
  };
}