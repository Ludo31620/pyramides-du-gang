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
  doubt,
} from "@/lib/gameEngine/core/doubt";

import {
  createTestGame,
} from "./helpers/createTestGame";

function createCard(
  valeur: Carte["valeur"],
  couleur: Carte["couleur"],
  revelee = false
): Carte {
  return {
    valeur,
    couleur,
    revelee,
  };
}

function preparePlayerResponse() {
  const game =
    createTestGame();

  const claimedCard =
    createCard(
      "As",
      "♠",
      true
    );

  game.phase =
    "PLAYER_RESPONSE";

  game.current = {
    row: 4,
    column: 0,
    card: claimedCard,
  };

  game.players = [
    [
      createCard(
        "As",
        "♥"
      ),
      createCard(
        "4",
        "♣"
      ),
      createCard(
        "7",
        "♦"
      ),
      createCard(
        "Roi",
        "♠"
      ),
    ],
    [
      createCard(
        "2",
        "♥"
      ),
      createCard(
        "5",
        "♣"
      ),
      createCard(
        "8",
        "♦"
      ),
      createCard(
        "Dame",
        "♠"
      ),
    ],
    [
      createCard(
        "3",
        "♥"
      ),
      createCard(
        "6",
        "♣"
      ),
      createCard(
        "9",
        "♦"
      ),
      createCard(
        "Valet",
        "♠"
      ),
    ],
    [
      createCard(
        "10",
        "♥"
      ),
      createCard(
        "2",
        "♣"
      ),
      createCard(
        "5",
        "♦"
      ),
      createCard(
        "8",
        "♠"
      ),
    ],
  ];

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
  "doubt",
  () => {
    it(
      "moves the game to the bluff result phase",
      () => {
        const game =
          preparePlayerResponse();

        const result =
          doubt(game);

        expect(
          result.phase
        ).toBe(
          "BLUFF_RESULT"
        );
      }
    );

    it(
      "detects the truth when the giver owns a card with the same value",
      () => {
        const game =
          preparePlayerResponse();

        const result =
          doubt(game);

        expect(
          result.bluffResult
            ?.outcome
        ).toBe("TRUTH");
      }
    );

    it(
      "checks only the card value and ignores its suit",
      () => {
        const game =
          preparePlayerResponse();

        game.turn
          .pendingAction!
          .claimedCard =
          createCard(
            "As",
            "♣",
            true
          );

        const result =
          doubt(game);

        expect(
          result.bluffResult
            ?.outcome
        ).toBe("TRUTH");

        expect(
          result.bluffResult
            ?.revealedCard
            ?.couleur
        ).toBe("♥");
      }
    );

    it(
      "punishes the target when the giver told the truth",
      () => {
        const game =
          preparePlayerResponse();

        const result =
          doubt(game);

        expect(
          result.bluffResult
            ?.punishedPlayer
        ).toBe(2);

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
      "reveals the matching card when the giver told the truth",
      () => {
        const game =
          preparePlayerResponse();

        const result =
          doubt(game);

        expect(
          result.bluffResult
            ?.revealedCard
        ).toEqual({
          valeur: "As",
          couleur: "♥",
          revelee: true,
        });
      }
    );

    it(
      "does not mutate the matching card stored in the giver hand",
      () => {
        const game =
          preparePlayerResponse();

        const originalCard =
          game.players[0][0];

        const result =
          doubt(game);

        expect(
          originalCard.revelee
        ).toBe(false);

        expect(
          game.players[0][0]
            .revelee
        ).toBe(false);

        expect(
          result.bluffResult
            ?.revealedCard
            ?.revelee
        ).toBe(true);

        expect(
          result.bluffResult
            ?.revealedCard
        ).not.toBe(
          originalCard
        );
      }
    );

    it(
      "detects a bluff when the giver owns no card with the claimed value",
      () => {
        const game =
          preparePlayerResponse();

        game.players[0] = [
          createCard(
            "2",
            "♥"
          ),
          createCard(
            "4",
            "♣"
          ),
          createCard(
            "7",
            "♦"
          ),
          createCard(
            "Roi",
            "♠"
          ),
        ];

        const result =
          doubt(game);

        expect(
          result.bluffResult
            ?.outcome
        ).toBe("BLUFF");
      }
    );

    it(
      "punishes the giver when a bluff is detected",
      () => {
        const game =
          preparePlayerResponse();

        game.players[0] = [
          createCard(
            "2",
            "♥"
          ),
          createCard(
            "4",
            "♣"
          ),
          createCard(
            "7",
            "♦"
          ),
          createCard(
            "Roi",
            "♠"
          ),
        ];

        const result =
          doubt(game);

        expect(
          result.bluffResult
            ?.punishedPlayer
        ).toBe(0);

        expect(
          result.drinks
        ).toEqual([
          5,
          0,
          0,
          0,
        ]);
      }
    );

    it(
      "does not reveal a card when a bluff is detected",
      () => {
        const game =
          preparePlayerResponse();

        game.players[0] = [
          createCard(
            "2",
            "♥"
          ),
          createCard(
            "4",
            "♣"
          ),
          createCard(
            "7",
            "♦"
          ),
          createCard(
            "Roi",
            "♠"
          ),
        ];

        const result =
          doubt(game);

        expect(
          result.bluffResult
            ?.revealedCard
        ).toBeNull();
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
          doubt(game);

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
      "creates the complete truth result",
      () => {
        const game =
          preparePlayerResponse();

        const result =
          doubt(game);

        expect(
          result.bluffResult
        ).toEqual({
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
        });
      }
    );

    it(
      "creates the complete bluff result",
      () => {
        const game =
          preparePlayerResponse();

        game.players[0] = [
          createCard(
            "2",
            "♥"
          ),
          createCard(
            "4",
            "♣"
          ),
          createCard(
            "7",
            "♦"
          ),
          createCard(
            "Roi",
            "♠"
          ),
        ];

        const result =
          doubt(game);

        expect(
          result.bluffResult
        ).toEqual({
          giver: 0,
          target: 2,
          drinks: 5,
          outcome: "BLUFF",
          revealedCard: null,
          punishedPlayer: 0,
        });
      }
    );

    it(
      "clears the pending action after the doubt is resolved",
      () => {
        const game =
          preparePlayerResponse();

        const result =
          doubt(game);

        expect(
          result.turn
            .pendingAction
        ).toBeNull();
      }
    );

    it(
      "keeps remaining players unchanged until continuing after the bluff",
      () => {
        const game =
          preparePlayerResponse();

        const result =
          doubt(game);

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
      "keeps the target as current player during the result phase",
      () => {
        const game =
          preparePlayerResponse();

        const result =
          doubt(game);

        expect(
          result.turn
            .currentPlayer
        ).toBe(2);
      }
    );

    it(
      "adds a history event when the target contests incorrectly",
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
          doubt(game);

        expect(
          result.history
        ).toEqual([
          {
            player: 2,
            message:
              "Le joueur 3 a contesté à tort et boit 5 gorgée(s).",
            timestamp:
              123456789,
          },
        ]);
      }
    );

    it(
      "adds a history event when a bluff is detected",
      () => {
        vi.spyOn(
          Date,
          "now"
        ).mockReturnValue(
          987654321
        );

        const game =
          preparePlayerResponse();

        game.players[0] = [
          createCard(
            "2",
            "♥"
          ),
          createCard(
            "4",
            "♣"
          ),
          createCard(
            "7",
            "♦"
          ),
          createCard(
            "Roi",
            "♠"
          ),
        ];

        const result =
          doubt(game);

        expect(
          result.history
        ).toEqual([
          {
            player: 0,
            message:
              "Bluff détecté ! Le joueur 1 boit 5 gorgée(s).",
            timestamp:
              987654321,
          },
        ]);
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
          doubt(game);

        expect(
          result.history
        ).toHaveLength(2);

        expect(
          result.history[0]
        ).toEqual({
          player: 1,
          message:
            "Ancien événement",
          timestamp: 1000,
        });

        expect(
          result.history[1]
        ).toEqual({
          player: 2,
          message:
            "Le joueur 3 a contesté à tort et boit 5 gorgée(s).",
          timestamp: 2000,
        });
      }
    );

    it(
      "refuses to doubt outside the player response phase",
      () => {
        const game =
          preparePlayerResponse();

        game.phase =
          "PLAYER_TURN";

        expect(() =>
          doubt(game)
        ).toThrow(
          'Cannot doubt during phase "PLAYER_TURN".'
        );
      }
    );

    it(
      "refuses to doubt when there is no pending action",
      () => {
        const game =
          preparePlayerResponse();

        game.turn
          .pendingAction =
          null;

        expect(() =>
          doubt(game)
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
          doubt(game)
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
          claimedCard:
            createCard(
              "As",
              "♠",
              true
            ),
        };

        expect(() =>
          doubt(game)
        ).toThrow();
      }
    );

    it(
      "refuses an action with zero drinks",
      () => {
        const game =
          preparePlayerResponse();

        game.turn
          .pendingAction!
          .drinks = 0;

        expect(() =>
          doubt(game)
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

        const originalPlayers =
          game.players;

        const result =
          doubt(game);

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
          game.players[0][0]
            .revelee
        ).toBe(false);

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

        expect(
          result.players
        ).toBe(
          originalPlayers
        );
      }
    );
  }
);