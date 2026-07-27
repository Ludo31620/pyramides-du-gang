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

  assertCurrentCard(state);
  assertPlayerIndex(
    state,
    target
  );

  const giver =
    state.turn.currentPlayer;

  if (
    !state.turn.remainingPlayers.includes(
      giver
    )
  ) {
    throw new Error(
      `Player ${giver} has already played on the current card.`
    );
  }

  if (
    state.turn.pendingAction !== null
  ) {
    throw new Error(
      "An action is already awaiting a response."
    );
  }

  if (
    target === giver
  ) {
    throw new Error(
      "A player cannot target themselves."
    );
  }

  return {
    ...state,

    phase:
      "PLAYER_RESPONSE",

    turn: {
      /**
       * Pendant la réponse, le joueur courant
       * devient la cible. Seule cette cible
       * pourra croire ou contester l'annonce.
       */
      currentPlayer:
        target,

      /**
       * Le donneur reste dans la liste jusqu'à
       * la fin de la réponse et du résultat.
       *
       * Il sera retiré par advancePlayer()
       * après CONTINUE_AFTER_BLUFF.
       */
      remainingPlayers:
        state.turn.remainingPlayers,

      pendingAction: {
        giver,
        target,

        drinks:
          getDrinksForRow(
            state.current.row
          ),

        claimedCard:
          state.current.card,
      },
    },
  };
}