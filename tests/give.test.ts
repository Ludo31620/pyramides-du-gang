import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  Carte,
} from "@/lib/deck";

import {
  giveDrinks,
} from "@/lib/gameEngine/core/give";

import {
  createTestGame,
} from "./helpers/createTestGame";

function preparePlayerTurn(
  row = 0
) {
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
    row,
    column: 0,
    card: activeCard,
  };

  game.progress = {
    revealedCards: 1,
    totalCards: 15,
    nextRow: row,
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
  "giveDrinks",
  () => {
    it(
      "moves the game to the player response phase",
      () => {
        const game =
          preparePlayerTurn();

        const result =
          giveDrinks(
            game,
            2
          );

        expect(
          result.phase
        ).toBe(
          "PLAYER_RESPONSE"
        );
      }
    );

    it(
      "makes the target the current player during the response",
      () => {
        const game =
          preparePlayerTurn();

        const result =
          giveDrinks(
            game,
            2
          );

        expect(
          result.turn.currentPlayer
        ).toBe(2);
      }
    );

    it(
      "creates the pending action with the giver and target",
      () => {
        const game =
          preparePlayerTurn();

        const result =
          giveDrinks(
            game,
            2
          );

        expect(
          result.turn.pendingAction
        ).not.toBeNull();

        expect(
          result.turn
            .pendingAction
            ?.giver
        ).toBe(0);

        expect(
          result.turn
            .pendingAction
            ?.target
        ).toBe(2);
      }
    );

    it(
      "uses five drinks for the largest pyramid row",
      () => {
        const game =
          preparePlayerTurn(4);

        const result =
          giveDrinks(
            game,
            1
          );

        expect(
          result.turn
            .pendingAction
            ?.drinks
        ).toBe(5);
      }
    );

    it(
      "uses three drinks for the middle pyramid row",
      () => {
        const game =
          preparePlayerTurn(2);

        const result =
          giveDrinks(
            game,
            1
          );

        expect(
          result.turn
            .pendingAction
            ?.drinks
        ).toBe(3);
      }
    );

    it(
      "uses one drink for the pyramid summit",
      () => {
        const game =
          preparePlayerTurn(0);

        const result =
          giveDrinks(
            game,
            1
          );

        expect(
          result.turn
            .pendingAction
            ?.drinks
        ).toBe(1);
      }
    );

    it(
      "stores the current pyramid card as the claimed card",
      () => {
        const game =
          preparePlayerTurn();

        const result =
          giveDrinks(
            game,
            1
          );

        expect(
          result.turn
            .pendingAction
            ?.claimedCard
        ).toEqual({
          valeur: "As",
          couleur: "♠",
          revelee: true,
        });

        expect(
          result.turn
            .pendingAction
            ?.claimedCard
        ).toBe(
          game.current.card
        );
      }
    );

    it(
      "keeps the giver inside remainingPlayers until the bluff is resolved",
      () => {
        const game =
          preparePlayerTurn();

        const result =
          giveDrinks(
            game,
            2
          );

        expect(
          result.turn
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
        ).toContain(0);
      }
    );

    it(
      "preserves the remaining players array",
      () => {
        const game =
          preparePlayerTurn();

        const originalRemainingPlayers =
          game.turn
            .remainingPlayers;

        const result =
          giveDrinks(
            game,
            2
          );

        expect(
          result.turn
            .remainingPlayers
        ).toBe(
          originalRemainingPlayers
        );
      }
    );

    it(
      "refuses to give drinks outside the player turn phase",
      () => {
        const game =
          preparePlayerTurn();

        game.phase =
          "WAITING";

        expect(() =>
          giveDrinks(
            game,
            1
          )
        ).toThrow(
          'Cannot give drinks during phase "WAITING".'
        );
      }
    );

    it(
      "refuses to give drinks when there is no current card",
      () => {
        const game =
          preparePlayerTurn();

        game.current.card =
          null;

        expect(() =>
          giveDrinks(
            game,
            1
          )
        ).toThrow();
      }
    );

    it(
      "refuses an invalid negative target index",
      () => {
        const game =
          preparePlayerTurn();

        expect(() =>
          giveDrinks(
            game,
            -1
          )
        ).toThrow();
      }
    );

    it(
      "refuses a target index greater than the player count",
      () => {
        const game =
          preparePlayerTurn();

        expect(() =>
          giveDrinks(
            game,
            4
          )
        ).toThrow();
      }
    );

    it(
      "refuses to act when the giver has already played on the current card",
      () => {
        const game =
          preparePlayerTurn();

        game.turn.currentPlayer =
          0;

        game.turn
          .remainingPlayers = [
          1,
          2,
          3,
        ];

        expect(() =>
          giveDrinks(
            game,
            1
          )
        ).toThrow(
          "Player 0 has already played on the current card."
        );
      }
    );

    it(
      "refuses to create a second pending action",
      () => {
        const game =
          preparePlayerTurn();

        game.turn.pendingAction = {
          giver: 0,
          target: 1,
          drinks: 5,
          claimedCard: {
            valeur: "As",
            couleur: "♠",
            revelee: true,
          },
        };

        expect(() =>
          giveDrinks(
            game,
            2
          )
        ).toThrow(
          "An action is already awaiting a response."
        );
      }
    );

    it(
      "refuses to target the giver themselves",
      () => {
        const game =
          preparePlayerTurn();

        expect(() =>
          giveDrinks(
            game,
            0
          )
        ).toThrow(
          "A player cannot target themselves."
        );
      }
    );

    it(
      "does not mutate the original game state",
      () => {
        const game =
          preparePlayerTurn();

        const originalTurn =
          game.turn;

        const result =
          giveDrinks(
            game,
            2
          );

        expect(
          game.phase
        ).toBe(
          "PLAYER_TURN"
        );

        expect(
          game.turn.currentPlayer
        ).toBe(0);

        expect(
          game.turn.pendingAction
        ).toBeNull();

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