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

  assertPendingAction(state);

  const action =
    state.turn.pendingAction;

  const drinks = [
    ...state.drinks,
  ];

  const giverCards =
    state.players[action.giver];

  /**
   * Le donneur dit vrai s’il possède
   * au moins une carte de la même valeur
   * que la carte révélée dans la pyramide.
   *
   * La couleur ne compte pas.
   */
  const matchingCard =
    giverCards.find(
      (card) =>
        card.valeur ===
        action.claimedCard.valeur
    ) ?? null;

  const giverToldTruth =
    matchingCard !== null;

  /**
   * La carte affichée dans le résultat
   * est une copie temporairement révélée.
   *
   * La carte originale dans la main
   * reste secrète et n’est pas modifiée.
   */
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

  drinks[punishedPlayer] +=
    action.drinks;

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

  return {
    ...state,

    phase: "BLUFF_RESULT",

    drinks,

    bluffResult: {
      giver: action.giver,
      target: action.target,
      drinks: action.drinks,

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
      pendingAction: null,
    },
  };
}