import { GameState } from "../types";

type GameStateWithCurrentCard = GameState & {
  current: GameState["current"] & {
    card: NonNullable<GameState["current"]["card"]>;
  };
};

export function assertCurrentCard(
  state: GameState
): asserts state is GameStateWithCurrentCard {
  if (!state.current.card) {
    throw new Error("No current card is revealed.");
  }
}