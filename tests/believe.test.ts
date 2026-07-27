import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type {
  Carte,
} from "@/lib/deck";

import {
  believe,
} from "@/lib/gameEngine/core/believe";

import {
  createTestGame,
} from "./helpers/createTestGame";

function preparePlayerResponse() {
  const game =
    createTestGame();

  const claimedCard: Carte = {
    valeur: "As",
    couleur: "♠",
    revelee: true,
  };

  game.phase =
    "PLAYER_RESPONSE";

  game.current = {
    row: 4,
    column: 0,
    card: claimedCard,
  };

  game.drinks = [
    0,
    0,
    0,
    0,
  ];

  game.history = [];

  game.bluffResult =
    null;

  game.turn = {
    /**
     * Pendant PLAYER_RESPONSE,
     * le joueur courant est la cible.
     */
    currentPlayer: 2,

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

afterEach(() => {
  vi.restoreAllMocks();
});

describe(
  "believe",
  () => {
    it(
      "moves the game to the bluff result phase",
      () => {
        const game =
          preparePlayerResponse();

        const result =
          believe(game);

        expect(
          result.phase
        ).toBe(
          "BLUFF_RESULT"
        );
      }
    );

    it(
      "adds the announced drinks to the target",
      () => {
        const game =
          preparePlayerResponse();

        const result =
          believe(game);

        expect(
          result.drinks
        ).toEqual([
          0,
          0,
          5,
          0,
        ]);
      }
    );

    it(
      "preserves drinks already received by every player",
      () => {
        const game =
          preparePlayerResponse();

        game.drinks = [
          2,
          4,
          3,
          1,
        ];

        const result =
          believe(game);

        expect(
          result.drinks
        ).toEqual([
          2,
          4,
          8,
          1,
        ]);
      }
    );

    it(
      "creates a believed bluff result",
      () => {
        const game =
          preparePlayerResponse();

        const result =
          believe(game);

        expect(
          result.bluffResult
        ).toEqual({
          giver: 0,
          target: 2,
          drinks: 5,
          outcome:
            "BELIEVED",
          revealedCard:
            null,
          punishedPlayer: 2,
        });
      }
    );

    it(
      "does not reveal a card when the target believes the announcement",
      () => {
        const game =
          preparePlayerResponse();

        const result =
          believe(game);

        expect(
          result.bluffResult
            ?.revealedCard
        ).toBeNull();
      }
    );

    it(
      "marks the target as the punished player",
      () => {
        const game =
          preparePlayerResponse();

        const result =
          believe(game);

        expect(
          result.bluffResult
            ?.punishedPlayer
        ).toBe(2);
      }
    );

    it(
      "clears the pending action after the response",
      () => {
        const game =
          preparePlayerResponse();

        const result =
          believe(game);

        expect(
          result.turn
            .pendingAction
        ).toBeNull();
      }
    );

    it(
      "keeps the target as current player during the result phase",
      () => {
        const game =
          preparePlayerResponse();

        const result =
          believe(game);

        expect(
          result.turn
            .currentPlayer
        ).toBe(2);
      }
    );

    it(
      "keeps remainingPlayers unchanged until continuing after the bluff",
      () => {
        const game =
          preparePlayerResponse();

        const result =
          believe(game);

        expect(
          result.turn
            .remainingPlayers
        ).toEqual([
          0,
          1,
          2,
          3,
        ]);
      }
    );

    it(
      "adds a history event describing the accepted drinks",
      () => {
        vi.spyOn(
          Date,
          "now"
        ).mockReturnValue(
          123456789
        );

        const game =
          preparePlayerResponse();

        const result =
          believe(game);

        expect(
          result.history
        ).toHaveLength(1);

        expect(
          result.history[0]
        ).toEqual({
          player: 2,
          message:
            "Le joueur 3 accepte de boire 5 gorgée(s).",
          timestamp:
            123456789,
        });
      }
    );

    it(
      "preserves existing history events",
      () => {
        vi.spyOn(
          Date,
          "now"
        ).mockReturnValue(
          2000
        );

        const game =
          preparePlayerResponse();

        game.history = [
          {
            player: 1,
            message:
              "Ancien événement",
            timestamp: 1000,
          },
        ];

        const result =
          believe(game);

        expect(
          result.history
        ).toEqual([
          {
            player: 1,
            message:
              "Ancien événement",
            timestamp: 1000,
          },
          {
            player: 2,
            message:
              "Le joueur 3 accepte de boire 5 gorgée(s).",
            timestamp: 2000,
          },
        ]);
      }
    );

    it(
      "refuses to believe outside the player response phase",
      () => {
        const game =
          preparePlayerResponse();

        game.phase =
          "PLAYER_TURN";

        expect(() =>
          believe(game)
        ).toThrow(
          'Cannot believe during phase "PLAYER_TURN".'
        );
      }
    );

    it(
      "refuses to believe when there is no pending action",
      () => {
        const game =
          preparePlayerResponse();

        game.turn
          .pendingAction =
          null;

        expect(() =>
          believe(game)
        ).toThrow();
      }
    );

    it(
      "refuses a response from a player other than the target",
      () => {
        const game =
          preparePlayerResponse();

        game.turn.currentPlayer =
          1;

        expect(() =>
          believe(game)
        ).toThrow();
      }
    );

    it(
      "refuses an action where the giver targets themselves",
      () => {
        const game =
          preparePlayerResponse();

        game.turn.currentPlayer =
          0;

        game.turn.pendingAction = {
          giver: 0,
          target: 0,
          drinks: 5,
          claimedCard: {
            valeur: "As",
            couleur: "♠",
            revelee: true,
          },
        };

        expect(() =>
          believe(game)
        ).toThrow();
      }
    );

    it(
      "refuses an action with zero drinks",
      () => {
        const game =
          preparePlayerResponse();

        if (
          game.turn
            .pendingAction
        ) {
          game.turn
            .pendingAction
            .drinks = 0;
        }

        expect(() =>
          believe(game)
        ).toThrow();
      }
    );

    it(
      "does not mutate the original state",
      () => {
        const game =
          preparePlayerResponse();

        const originalDrinks =
          game.drinks;

        const originalHistory =
          game.history;

        const originalTurn =
          game.turn;

        const result =
          believe(game);

        expect(
          game.phase
        ).toBe(
          "PLAYER_RESPONSE"
        );

        expect(
          game.drinks
        ).toEqual([
          0,
          0,
          0,
          0,
        ]);

        expect(
          game.history
        ).toEqual([]);

        expect(
          game.turn
            .pendingAction
        ).not.toBeNull();

        expect(
          result
        ).not.toBe(game);

        expect(
          result.drinks
        ).not.toBe(
          originalDrinks
        );

        expect(
          result.history
        ).not.toBe(
          originalHistory
        );

        expect(
          result.turn
        ).not.toBe(
          originalTurn
        );
      }
    );
  }
);