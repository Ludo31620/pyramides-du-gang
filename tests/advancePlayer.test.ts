import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  Carte,
} from "@/lib/deck";

import {
  advancePlayer,
} from "@/lib/gameEngine/core/advancePlayer";

import {
  createTestGame,
} from "./helpers/createTestGame";

function prepareGame() {
  const game =
    createTestGame();

  const claimedCard: Carte = {
    valeur: "As",
    couleur: "♠",
    revelee: true,
  };

  game.phase =
    "PLAYER_TURN";

  game.progress = {
    revealedCards: 1,
    totalCards: 15,
    nextRow: 0,
    nextColumn: 1,
  };

  game.turn = {
    currentPlayer: 0,
    remainingPlayers: [
      0,
      1,
      2,
      3,
    ],
    pendingAction: {
      giver: 0,
      target: 2,
      drinks: 5,
      claimedCard,
    },
  };

  return game;
}

describe(
  "advancePlayer",
  () => {
    it(
      "removes the selected player from remaining players",
      () => {
        const game =
          prepareGame();

        const result =
          advancePlayer(
            game,
            0
          );

        expect(
          result.turn
            .remainingPlayers
        ).toEqual([
          1,
          2,
          3,
        ]);

        expect(
          result.turn
            .remainingPlayers
        ).not.toContain(0);
      }
    );

    it(
      "moves the turn to the first remaining player",
      () => {
        const game =
          prepareGame();

        const result =
          advancePlayer(
            game,
            0
          );

        expect(
          result.phase
        ).toBe(
          "PLAYER_TURN"
        );

        expect(
          result.turn
            .currentPlayer
        ).toBe(1);
      }
    );

    it(
      "respects the order stored in remaining players",
      () => {
        const game =
          prepareGame();

        game.turn
          .remainingPlayers = [
          2,
          0,
          3,
          1,
        ];

        const result =
          advancePlayer(
            game,
            2
          );

        expect(
          result.turn
            .remainingPlayers
        ).toEqual([
          0,
          3,
          1,
        ]);

        expect(
          result.turn
            .currentPlayer
        ).toBe(0);
      }
    );

    it(
      "can remove a player from the middle of the remaining players",
      () => {
        const game =
          prepareGame();

        const result =
          advancePlayer(
            game,
            2
          );

        expect(
          result.turn
            .remainingPlayers
        ).toEqual([
          0,
          1,
          3,
        ]);

        expect(
          result.turn
            .currentPlayer
        ).toBe(0);
      }
    );

    it(
      "clears any pending action when moving to another player",
      () => {
        const game =
          prepareGame();

        const result =
          advancePlayer(
            game,
            0
          );

        expect(
          result.turn
            .pendingAction
        ).toBeNull();
      }
    );

    it(
      "moves to waiting when no players remain and the pyramid is not finished",
      () => {
        const game =
          prepareGame();

        game.turn
          .remainingPlayers = [
          3,
        ];

        game.turn.currentPlayer =
          3;

        game.progress
          .revealedCards = 8;

        game.progress
          .totalCards = 15;

        const result =
          advancePlayer(
            game,
            3
          );

        expect(
          result.phase
        ).toBe(
          "WAITING"
        );

        expect(
          result.turn
        ).toEqual({
          currentPlayer: 0,
          remainingPlayers: [],
          pendingAction: null,
        });
      }
    );

    it(
      "ends the game when no players remain and every pyramid card is revealed",
      () => {
        const game =
          prepareGame();

        game.turn
          .remainingPlayers = [
          3,
        ];

        game.turn.currentPlayer =
          3;

        game.progress
          .revealedCards = 15;

        game.progress
          .totalCards = 15;

        const result =
          advancePlayer(
            game,
            3
          );

        expect(
          result.phase
        ).toBe(
          "GAME_OVER"
        );

        expect(
          result.turn
        ).toEqual({
          currentPlayer: 0,
          remainingPlayers: [],
          pendingAction: null,
        });
      }
    );

    it(
      "ends the game when revealed cards exceed the expected total",
      () => {
        const game =
          prepareGame();

        game.turn
          .remainingPlayers = [
          0,
        ];

        game.progress
          .revealedCards = 16;

        game.progress
          .totalCards = 15;

        const result =
          advancePlayer(
            game,
            0
          );

        expect(
          result.phase
        ).toBe(
          "GAME_OVER"
        );
      }
    );

    it(
      "keeps the remaining players when the player to remove is absent",
      () => {
        const game =
          prepareGame();

        game.turn
          .remainingPlayers = [
          1,
          2,
          3,
        ];

        const result =
          advancePlayer(
            game,
            0
          );

        expect(
          result.turn
            .remainingPlayers
        ).toEqual([
          1,
          2,
          3,
        ]);

        expect(
          result.turn
            .currentPlayer
        ).toBe(1);

        expect(
          result.phase
        ).toBe(
          "PLAYER_TURN"
        );
      }
    );

    it(
      "does not mutate the original state or remaining players array",
      () => {
        const game =
          prepareGame();

        const originalTurn =
          game.turn;

        const originalRemainingPlayers =
          game.turn
            .remainingPlayers;

        const originalPendingAction =
          game.turn
            .pendingAction;

        const result =
          advancePlayer(
            game,
            0
          );

        expect(
          game.turn
        ).toBe(
          originalTurn
        );

        expect(
          game.turn
            .remainingPlayers
        ).toEqual([
          0,
          1,
          2,
          3,
        ]);

        expect(
          game.turn
            .pendingAction
        ).toBe(
          originalPendingAction
        );

        expect(
          result
        ).not.toBe(game);

        expect(
          result.turn
        ).not.toBe(
          originalTurn
        );

        expect(
          result.turn
            .remainingPlayers
        ).not.toBe(
          originalRemainingPlayers
        );
      }
    );
  }
);