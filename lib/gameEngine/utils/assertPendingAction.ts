import type {
  GameState,
  PendingAction,
} from "../types";

type GameStateWithPendingAction =
  GameState & {
    turn:
      GameState["turn"] & {
        pendingAction:
          PendingAction;
      };
  };

export function assertPendingAction(
  state: GameState
): asserts state is GameStateWithPendingAction {
  const pendingAction =
    state.turn.pendingAction;

  if (!pendingAction) {
    throw new Error(
      "No action is waiting for a response."
    );
  }

  /**
   * Pendant PLAYER_RESPONSE,
   * le joueur courant doit obligatoirement
   * être la cible de l’annonce.
   */
  if (
    state.turn.currentPlayer !==
    pendingAction.target
  ) {
    throw new Error(
      "Only the targeted player can answer the pending action."
    );
  }

  if (
    pendingAction.giver ===
    pendingAction.target
  ) {
    throw new Error(
      "A player cannot target themselves."
    );
  }

  if (
    !Number.isInteger(
      pendingAction.drinks
    ) ||
    pendingAction.drinks <= 0
  ) {
    throw new Error(
      "Pending action drinks must be a positive integer."
    );
  }
}