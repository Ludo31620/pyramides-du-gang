import type {
  GameState,
} from "../types";

import {
  assertPendingAction,
} from "../utils/assertPendingAction";

export function doubt(
  state: GameState
): GameState {
  if (
    state.phase !==
    "PLAYER_RESPONSE"
  ) {
    throw new Error(
      `Cannot doubt during phase "${state.phase}".`
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

  const giverCards =
    state.players[
      action.giver
    ];

  const matchingCard =
    giverCards.find(
      (card) =>
        card.valeur ===
        action.claimedCard
          .valeur
    ) ?? null;

  const giverToldTruth =
    matchingCard !==
    null;

  const revealedCard =
    matchingCard
      ? {
          ...matchingCard,
          revelee: true,
        }
      : null;

  const punishedPlayer =
    giverToldTruth
      ? action.target
      : action.giver;

  drinks[
    punishedPlayer
  ] += action.drinks;

  const message =
    giverToldTruth
      ? `Le joueur ${
          action.target + 1
        } a contesté à tort et boit ${
          action.drinks
        } gorgée(s).`
      : `Bluff détecté ! Le joueur ${
          action.giver + 1
        } boit ${
          action.drinks
        } gorgée(s).`;

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
              (
                giverToldTruth
                  ? action.drinks
                  : 0
              ),

            caughtBluffs:
              stats.caughtBluffs +
              (
                giverToldTruth
                  ? 0
                  : 1
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
        (
          giverToldTruth
            ? action.drinks
            : 0
        ),

      caughtBluffs:
        state.gameStats
          .caughtBluffs +
        (
          giverToldTruth
            ? 0
            : 1
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
        giverToldTruth
          ? "TRUTH"
          : "BLUFF",

      revealedCard,

      punishedPlayer,
    },

    history: [
      ...state.history,

      {
        player:
          punishedPlayer,

        message,

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