import type { GameState } from "../types";
import { revealCard } from "./reveal";

export function nextCard(state: GameState): GameState {
  if (state.phase !== "WAITING") {
    throw new Error(
      `Cannot reveal the next card during phase "${state.phase}".`
    );
  }

  return revealCard(state);
}