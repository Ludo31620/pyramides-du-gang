import {
  describe,
  expect,
  it,
} from "vitest";

import {
  continueAfterBluff,
} from "@/lib/gameEngine/core/continueAfterBluff";

import {
  createTestGame,
} from "./helpers/createTestGame";

function prepareBluffResult() {
  const game =
    createTestGame();

  game.phase =
    "BLUFF_RESULT";

  game.turn = {
    currentPlayer: 2,
    remainingPlayers: [
      0,
      1,
      2,
      3,
    ],
    pendingAction: null,
  };

  game.progress = {
    revealedCards: 1,
    totalCards: 15,
    nextRow: 0,
    nextColumn: 1,
  };

  game.bluffResult = {
    giver: 0,
    target: 2,
    drinks: 5,
    outcome: "TRUTH",
    revealedCard: {
      valeur: "As",
      couleur: "♥",
      revelee: true,
    },
    punishedPlayer: 2,
  };

  return game;
}

describe(
  "continueAfterBluff",
  () => {
    it(
      "clears the bluff result",
      () => {
        const game =
          prepareBluffResult();

        const result =
          continueAfterBluff(game);

        expect(
          result.bluffResult
        ).toBeNull();
      }
    );

    it(
      "removes the giver from remaining players",
      () => {
        const game =
          prepareBluffResult();

        const result =
          continueAfterBluff(game);

        expect(
          result.turn.remainingPlayers
        ).toEqual([
          1,
          2,
          3,
        ]);
      }
    );

    it(
      "moves to the next remaining player",
      () => {
        const game =
          prepareBluffResult();

        const result =
          continueAfterBluff(game);

        expect(
          result.turn.currentPlayer
        ).toBe(1);

        expect(
          result.phase
        ).toBe(
          "PLAYER_TURN"
        );
      }
    );

    it(
      "moves to waiting when the giver was the last remaining player",
      () => {
        const game =
          prepareBluffResult();

        game.turn.remainingPlayers = [
          0,
        ];

        const result =
          continueAfterBluff(game);

        expect(
          result.turn.remainingPlayers
        ).toEqual([]);

        expect(
          result.phase
        ).toBe(
          "WAITING"
        );
      }
    );

    it(
      "ends the game after the final card",
      () => {
        const game =
          prepareBluffResult();

        game.turn.remainingPlayers = [
          0,
        ];

        game.progress.revealedCards =
          15;

        game.progress.totalCards =
          15;

        const result =
          continueAfterBluff(game);

        expect(
          result.phase
        ).toBe(
          "GAME_OVER"
        );
      }
    );

    it(
      "refuses to continue outside the bluff result phase",
      () => {
        const game =
          prepareBluffResult();

        game.phase =
          "PLAYER_RESPONSE";

        expect(() =>
          continueAfterBluff(game)
        ).toThrow(
          'Cannot continue after bluff during phase "PLAYER_RESPONSE".'
        );
      }
    );

    it(
      "refuses when there is no bluff result",
      () => {
        const game =
          prepareBluffResult();

        game.bluffResult =
          null;

        expect(() =>
          continueAfterBluff(game)
        ).toThrow(
          "No bluff result to continue."
        );
      }
    );

    it(
      "does not mutate the original state",
      () => {
        const game =
          prepareBluffResult();

        const originalTurn =
          game.turn;

        const result =
          continueAfterBluff(game);

        expect(
          game.bluffResult
        ).not.toBeNull();

        expect(
          game.turn
        ).toBe(
          originalTurn
        );

        expect(
          result
        ).not.toBe(game);

        expect(
          result.turn
        ).not.toBe(
          originalTurn
        );
      }
    );
  }
);