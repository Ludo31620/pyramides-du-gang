import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  Carte,
} from "@/lib/deck";

import {
  passTurn,
} from "@/lib/gameEngine/core/pass";

import {
  createTestGame,
} from "./helpers/createTestGame";

function preparePlayerTurn() {
  const game =
    createTestGame();

  const activeCard: Carte = {
    valeur: "As",
    couleur: "♠",
    revelee: true,
  };

  game.phase =
    "PLAYER_TURN";

  game.current = {
    row: 0,
    column: 0,
    card: activeCard,
  };

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
    pendingAction: null,
  };

  return game;
}

describe(
  "passTurn",
  () => {
    it(
      "removes the current player from the remaining players",
      () => {
        const game =
          preparePlayerTurn();

        const result =
          passTurn(game);

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
      "moves the turn to the next remaining player",
      () => {
        const game =
          preparePlayerTurn();

        const result =
          passTurn(game);

        expect(
          result.phase
        ).toBe("PLAYER_TURN");

        expect(
          result.turn.currentPlayer
        ).toBe(1);
      }
    );

    it(
      "uses the order of remainingPlayers to select the next player",
      () => {
        const game =
          preparePlayerTurn();

        game.turn.currentPlayer =
          1;

        game.turn.remainingPlayers = [
          1,
          3,
        ];

        const result =
          passTurn(game);

        expect(
          result.turn
            .remainingPlayers
        ).toEqual([3]);

        expect(
          result.turn.currentPlayer
        ).toBe(3);

        expect(
          result.phase
        ).toBe("PLAYER_TURN");
      }
    );

    it(
      "moves to waiting after the final player passes",
      () => {
        const game =
          preparePlayerTurn();

        game.turn.currentPlayer =
          3;

        game.turn.remainingPlayers = [
          3,
        ];

        game.progress.revealedCards =
          1;

        game.progress.totalCards =
          15;

        const result =
          passTurn(game);

        expect(
          result.turn
            .remainingPlayers
        ).toEqual([]);

        expect(
          result.phase
        ).toBe("WAITING");
      }
    );

    it(
      "ends the game after the final player passes on the final card",
      () => {
        const game =
          preparePlayerTurn();

        game.turn.currentPlayer =
          3;

        game.turn.remainingPlayers = [
          3,
        ];

        game.progress.revealedCards =
          15;

        game.progress.totalCards =
          15;

        const result =
          passTurn(game);

        expect(
          result.turn
            .remainingPlayers
        ).toEqual([]);

        expect(
          result.phase
        ).toBe("GAME_OVER");
      }
    );

    it(
      "refuses to pass outside the player turn phase",
      () => {
        const game =
          preparePlayerTurn();

        game.phase =
          "WAITING";

        expect(() =>
          passTurn(game)
        ).toThrow(
          'Cannot pass during phase "WAITING".'
        );
      }
    );

    it(
      "refuses to pass when the current player has already played",
      () => {
        const game =
          preparePlayerTurn();

        game.turn.currentPlayer =
          0;

        game.turn.remainingPlayers = [
          1,
          2,
          3,
        ];

        expect(() =>
          passTurn(game)
        ).toThrow(
          "Player 0 has already played on the current card."
        );
      }
    );

    it(
      "refuses to pass while an action is waiting for a response",
      () => {
        const game =
          preparePlayerTurn();

        game.turn.pendingAction = {
          giver: 0,
          target: 1,
          drinks: 1,
          claimedCard: {
            valeur: "As",
            couleur: "♥",
            revelee: false,
          },
        };

        expect(() =>
          passTurn(game)
        ).toThrow(
          "Cannot pass while an action is awaiting a response."
        );
      }
    );

    it(
      "does not mutate the original remaining players array",
      () => {
        const game =
          preparePlayerTurn();

        const originalRemainingPlayers =
          game.turn
            .remainingPlayers;

        const result =
          passTurn(game);

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
          result.turn
            .remainingPlayers
        ).not.toBe(
          originalRemainingPlayers
        );
      }
    );
  }
);