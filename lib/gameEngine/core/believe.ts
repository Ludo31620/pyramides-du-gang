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

  assertPendingAction(state);

  const action =
    state.turn.pendingAction;

  const drinks = [
    ...state.drinks,
  ];

  drinks[action.target] +=
    action.drinks;

  return {
    ...state,

    phase: "BLUFF_RESULT",

    drinks,

    bluffResult: {
      giver: action.giver,
      target: action.target,
      drinks: action.drinks,
      outcome: "BELIEVED",
      revealedCard: null,
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

      /**
       * L’action n’attend plus de réponse.
       * Le donneur reste cependant dans
       * bluffResult pour permettre au moteur
       * de reprendre après lui.
       */
      pendingAction: null,
    },
  };
}