import { describe, expect, it } from "vitest";

import { createGame } from "@/lib/gameEngine/core/createGame";
import { createTestGame } from "./helpers/createTestGame";

describe("createGame", () => {
  it("creates a game with 4 players", () => {
    const game = createTestGame();

    expect(game.players).toHaveLength(4);
    expect(game.drinks).toHaveLength(4);

    expect(game.phase).toBe("DISTRIBUTION");

    expect(game.deck).toHaveLength(52);

    expect(game.history).toEqual([]);
  });

  it("refuses less than 2 players", () => {
    expect(() => createGame(1)).toThrow();
  });

  it("refuses more than 9 players", () => {
    expect(() => createGame(10)).toThrow();
  });
});