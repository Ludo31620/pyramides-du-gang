import {
  describe,
  expect,
  it,
} from "vitest";

import {
  hideMemoryJoker,
  startMemory,
  tickMemory,
  useMemoryJoker,
} from "@/lib/gameEngine/core/memory";

import {
  createTestGame,
} from "./helpers/createTestGame";

describe(
  "memory",
  () => {
    it(
      "starts the memory phase with 60 seconds",
      () => {
        const game =
          createTestGame();

        game.memory.remainingSeconds =
          12;

        game.memory.revealedPlayers = [
          0,
          2,
        ];

        const result =
          startMemory(game);

        expect(
          result.phase
        ).toBe("MEMORY");

        expect(
          result.memory
            .remainingSeconds
        ).toBe(60);

        expect(
          result.memory
            .revealedPlayers
        ).toEqual([]);
      }
    );

    it(
      "decreases the memory timer by one second",
      () => {
        const game =
          createTestGame();

        const memoryState =
          startMemory(game);

        const result =
          tickMemory(memoryState);

        expect(
          result.phase
        ).toBe("MEMORY");

        expect(
          result.memory
            .remainingSeconds
        ).toBe(59);
      }
    );

    it(
      "moves to waiting when the timer reaches zero",
      () => {
        const game =
          createTestGame();

        game.phase = "MEMORY";

        game.memory.remainingSeconds =
          1;

        game.memory.revealedPlayers = [
          0,
          1,
        ];

        const result =
          tickMemory(game);

        expect(
          result.phase
        ).toBe("WAITING");

        expect(
          result.memory
            .remainingSeconds
        ).toBe(0);

        expect(
          result.memory
            .revealedPlayers
        ).toEqual([]);
      }
    );

    it(
      "moves immediately to waiting when the timer is already zero",
      () => {
        const game =
          createTestGame();

        game.phase = "MEMORY";

        game.memory.remainingSeconds =
          0;

        const result =
          tickMemory(game);

        expect(
          result.phase
        ).toBe("WAITING");

        expect(
          result.memory
            .remainingSeconds
        ).toBe(0);
      }
    );

    it(
      "does nothing when ticking outside the memory phase",
      () => {
        const game =
          createTestGame();

        game.phase =
          "DISTRIBUTION";

        game.memory.remainingSeconds =
          42;

        const result =
          tickMemory(game);

        expect(result).toBe(game);

        expect(
          result.memory
            .remainingSeconds
        ).toBe(42);
      }
    );

    it(
      "allows a player to use a memory joker after the pyramid has started",
      () => {
        const game =
          createTestGame();

        game.phase = "WAITING";

        game.progress.revealedCards =
          1;

        const jokersBefore =
          game.memory.jokers[0];

        const drinksBefore =
          game.drinks[0];

        const result =
          useMemoryJoker(
            game,
            0
          );

        expect(
          result.memory.jokers[0]
        ).toBe(
          jokersBefore - 1
        );

        expect(
          result.drinks[0]
        ).toBe(
          drinksBefore + 1
        );

        expect(
          result.memory
            .revealedPlayers
        ).toContain(0);

        expect(
          result.history
        ).toHaveLength(
          game.history.length + 1
        );

        expect(
          result.history.at(-1)
            ?.player
        ).toBe(0);

        expect(
          result.history.at(-1)
            ?.message
        ).toBe(
          "Joueur 1 utilise un joker mémoire et boit 1 gorgée."
        );
      }
    );

    it.each([
      "PLAYER_TURN",
      "PLAYER_RESPONSE",
      "WAITING",
    ] as const)(
      "allows a memory joker during the %s phase",
      (phase) => {
        const game =
          createTestGame();

        game.phase = phase;

        game.progress.revealedCards =
          1;

        const result =
          useMemoryJoker(
            game,
            0
          );

        expect(
          result.memory
            .revealedPlayers
        ).toContain(0);

        expect(
          result.drinks[0]
        ).toBe(
          game.drinks[0] + 1
        );
      }
    );

    it(
      "refuses a memory joker before the first pyramid card is revealed",
      () => {
        const game =
          createTestGame();

        game.phase = "WAITING";

        game.progress.revealedCards =
          0;

        expect(() =>
          useMemoryJoker(
            game,
            0
          )
        ).toThrow(
          "Le joker mémoire ne peut pas être utilisé maintenant."
        );
      }
    );

    it(
      "refuses a memory joker during the distribution phase",
      () => {
        const game =
          createTestGame();

        game.phase =
          "DISTRIBUTION";

        game.progress.revealedCards =
          1;

        expect(() =>
          useMemoryJoker(
            game,
            0
          )
        ).toThrow(
          "Le joker mémoire ne peut pas être utilisé maintenant."
        );
      }
    );

    it(
      "refuses a memory joker during the initial memory phase",
      () => {
        const game =
          createTestGame();

        game.phase = "MEMORY";

        game.progress.revealedCards =
          1;

        expect(() =>
          useMemoryJoker(
            game,
            0
          )
        ).toThrow(
          "Le joker mémoire ne peut pas être utilisé maintenant."
        );
      }
    );

    it(
      "does nothing when the player has no memory joker left",
      () => {
        const game =
          createTestGame();

        game.phase = "WAITING";

        game.progress.revealedCards =
          1;

        game.memory.jokers[0] =
          0;

        const result =
          useMemoryJoker(
            game,
            0
          );

        expect(result).toBe(game);

        expect(
          result.drinks[0]
        ).toBe(
          game.drinks[0]
        );

        expect(
          result.memory
            .revealedPlayers
        ).not.toContain(0);
      }
    );

    it(
      "prevents using another joker while the player's cards are already revealed",
      () => {
        const game =
          createTestGame();

        game.phase = "WAITING";

        game.progress.revealedCards =
          1;

        const firstResult =
          useMemoryJoker(
            game,
            0
          );

        const jokersAfterFirstUse =
          firstResult.memory
            .jokers[0];

        const drinksAfterFirstUse =
          firstResult.drinks[0];

        const historyAfterFirstUse =
          firstResult.history.length;

        const secondResult =
          useMemoryJoker(
            firstResult,
            0
          );

        expect(
          secondResult
        ).toBe(firstResult);

        expect(
          secondResult.memory
            .jokers[0]
        ).toBe(
          jokersAfterFirstUse
        );

        expect(
          secondResult.drinks[0]
        ).toBe(
          drinksAfterFirstUse
        );

        expect(
          secondResult.history
        ).toHaveLength(
          historyAfterFirstUse
        );
      }
    );

    it(
      "allows the player to use another joker after hiding their cards",
      () => {
        const game =
          createTestGame();

        game.phase = "WAITING";

        game.progress.revealedCards =
          1;

        game.memory.jokers[0] =
          2;

        const firstUse =
          useMemoryJoker(
            game,
            0
          );

        const hiddenState =
          hideMemoryJoker(
            firstUse,
            0
          );

        const secondUse =
          useMemoryJoker(
            hiddenState,
            0
          );

        expect(
          secondUse.memory
            .jokers[0]
        ).toBe(0);

        expect(
          secondUse.drinks[0]
        ).toBe(
          game.drinks[0] + 2
        );

        expect(
          secondUse.memory
            .revealedPlayers
        ).toEqual([0]);

        expect(
          secondUse.history
        ).toHaveLength(
          game.history.length + 2
        );
      }
    );

    it(
      "hides the cards revealed by a memory joker",
      () => {
        const game =
          createTestGame();

        game.memory
          .revealedPlayers = [
            0,
            2,
          ];

        const result =
          hideMemoryJoker(
            game,
            0
          );

        expect(
          result.memory
            .revealedPlayers
        ).toEqual([2]);
      }
    );

    it(
      "does nothing when hiding cards that are not revealed",
      () => {
        const game =
          createTestGame();

        game.memory
          .revealedPlayers = [
            1,
          ];

        const result =
          hideMemoryJoker(
            game,
            0
          );

        expect(result).toBe(game);

        expect(
          result.memory
            .revealedPlayers
        ).toEqual([1]);
      }
    );

    it.each([
      -1,
      4,
      1.5,
      Number.NaN,
    ])(
      "refuses invalid player %s when using a joker",
      (player) => {
        const game =
          createTestGame();

        game.phase = "WAITING";

        game.progress.revealedCards =
          1;

        expect(() =>
          useMemoryJoker(
            game,
            player
          )
        ).toThrow(
          "Le joueur indiqué est invalide."
        );
      }
    );

    it.each([
      -1,
      4,
      1.5,
      Number.NaN,
    ])(
      "refuses invalid player %s when hiding a joker",
      (player) => {
        const game =
          createTestGame();

        expect(() =>
          hideMemoryJoker(
            game,
            player
          )
        ).toThrow(
          "Le joueur indiqué est invalide."
        );
      }
    );

    it(
      "refuses using a joker when the player's joker count is missing",
      () => {
        const game =
          createTestGame();

        game.phase = "WAITING";

        game.progress.revealedCards =
          1;

        game.memory.jokers = [];

        expect(() =>
          useMemoryJoker(
            game,
            0
          )
        ).toThrow(
          "Le nombre de jokers du joueur est introuvable."
        );
      }
    );
  }
);