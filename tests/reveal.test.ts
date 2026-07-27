import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  Carte,
  Couleur,
  Valeur,
} from "@/lib/deck";

import {
  revealCard,
} from "@/lib/gameEngine/core/reveal";

import {
  createTestGame,
} from "./helpers/createTestGame";

function createCard(
  valeur: Valeur,
  couleur: Couleur
): Carte {
  return {
    valeur,
    couleur,
    revelee: false,
  };
}

describe(
  "revealCard",
  () => {
    it(
      "reveals the first card from the largest pyramid row",
      () => {
        const game =
          createTestGame();

        game.pyramid = [
          [
            createCard(
              "As",
              "♠"
            ),
          ],
          [
            createCard(
              "2",
              "♥"
            ),
            createCard(
              "3",
              "♦"
            ),
          ],
          [
            createCard(
              "4",
              "♣"
            ),
            createCard(
              "5",
              "♠"
            ),
            createCard(
              "6",
              "♥"
            ),
          ],
        ];

        game.progress = {
          revealedCards: 0,
          totalCards: 6,
          nextRow: 0,
          nextColumn: 0,
        };

        const result =
          revealCard(game);

        expect(
          result.phase
        ).toBe("PLAYER_TURN");

        expect(
          result.current.row
        ).toBe(0);

        expect(
          result.current.column
        ).toBe(0);

        expect(
          result.current.card
            ?.valeur
        ).toBe("4");

        expect(
          result.current.card
            ?.revelee
        ).toBe(true);

        expect(
          result.progress
            .revealedCards
        ).toBe(1);

        expect(
          result.progress.nextRow
        ).toBe(0);

        expect(
          result.progress
            .nextColumn
        ).toBe(1);
      }
    );

    it(
      "moves to the next pyramid row after revealing the last card of the current row",
      () => {
        const game =
          createTestGame();

        game.pyramid = [
          [
            createCard(
              "As",
              "♠"
            ),
          ],
          [
            createCard(
              "2",
              "♥"
            ),
            createCard(
              "3",
              "♦"
            ),
          ],
          [
            createCard(
              "4",
              "♣"
            ),
            createCard(
              "5",
              "♠"
            ),
            createCard(
              "6",
              "♥"
            ),
          ],
        ];

        game.progress = {
          revealedCards: 2,
          totalCards: 6,
          nextRow: 0,
          nextColumn: 2,
        };

        const result =
          revealCard(game);

        expect(
          result.current.card
            ?.valeur
        ).toBe("6");

        expect(
          result.current.row
        ).toBe(0);

        expect(
          result.current.column
        ).toBe(2);

        expect(
          result.progress.nextRow
        ).toBe(1);

        expect(
          result.progress
            .nextColumn
        ).toBe(0);

        expect(
          result.progress
            .revealedCards
        ).toBe(3);
      }
    );

    it(
      "reveals the next row after the largest row is completed",
      () => {
        const game =
          createTestGame();

        game.pyramid = [
          [
            createCard(
              "As",
              "♠"
            ),
          ],
          [
            createCard(
              "2",
              "♥"
            ),
            createCard(
              "3",
              "♦"
            ),
          ],
          [
            createCard(
              "4",
              "♣"
            ),
            createCard(
              "5",
              "♠"
            ),
            createCard(
              "6",
              "♥"
            ),
          ],
        ];

        game.progress = {
          revealedCards: 3,
          totalCards: 6,
          nextRow: 1,
          nextColumn: 0,
        };

        const result =
          revealCard(game);

        expect(
          result.current.card
            ?.valeur
        ).toBe("2");

        expect(
          result.current.row
        ).toBe(1);

        expect(
          result.current.column
        ).toBe(0);

        expect(
          result.progress.nextRow
        ).toBe(1);

        expect(
          result.progress
            .nextColumn
        ).toBe(1);
      }
    );

    it(
      "initializes every player for the revealed card",
      () => {
        const game =
          createTestGame();

        game.pyramid = [
          [
            createCard(
              "As",
              "♠"
            ),
          ],
        ];

        game.progress = {
          revealedCards: 0,
          totalCards: 1,
          nextRow: 0,
          nextColumn: 0,
        };

        game.turn.currentPlayer =
          2;

        game.turn.remainingPlayers = [
          2,
        ];

        game.turn.pendingAction = {
          giver: 2,
          target: 1,
          drinks: 1,
          claimedCard:
            createCard(
              "As",
              "♥"
            ),
        };

        const result =
          revealCard(game);

        expect(
          result.turn.currentPlayer
        ).toBe(0);

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
          result.turn.pendingAction
        ).toBeNull();
      }
    );

    it(
      "ends the game when every pyramid card has already been revealed",
      () => {
        const game =
          createTestGame();

        game.progress = {
          revealedCards: 15,
          totalCards: 15,
          nextRow: 5,
          nextColumn: 0,
        };

        const result =
          revealCard(game);

        expect(
          result.phase
        ).toBe("GAME_OVER");
      }
    );

    it(
      "ends the game when the next pyramid row does not exist",
      () => {
        const game =
          createTestGame();

        game.pyramid = [
          [
            createCard(
              "As",
              "♠"
            ),
          ],
        ];

        game.progress = {
          revealedCards: 0,
          totalCards: 10,
          nextRow: 2,
          nextColumn: 0,
        };

        const result =
          revealCard(game);

        expect(
          result.phase
        ).toBe("GAME_OVER");
      }
    );

    it(
      "ends the game when the next card does not exist",
      () => {
        const game =
          createTestGame();

        game.pyramid = [
          [
            createCard(
              "As",
              "♠"
            ),
          ],
        ];

        game.progress = {
          revealedCards: 0,
          totalCards: 10,
          nextRow: 0,
          nextColumn: 1,
        };

        const result =
          revealCard(game);

        expect(
          result.phase
        ).toBe("GAME_OVER");
      }
    );

    it(
      "does not mutate the original pyramid",
      () => {
        const game =
          createTestGame();

        game.pyramid = [
          [
            createCard(
              "As",
              "♠"
            ),
          ],
        ];

        game.progress = {
          revealedCards: 0,
          totalCards: 1,
          nextRow: 0,
          nextColumn: 0,
        };

        const originalCard =
          game.pyramid[0][0];

        const result =
          revealCard(game);

        expect(
          originalCard.revelee
        ).toBe(false);

        expect(
          result.pyramid[0][0]
            .revelee
        ).toBe(true);

        expect(
          result.pyramid
        ).not.toBe(
          game.pyramid
        );

        expect(
          result.pyramid[0]
        ).not.toBe(
          game.pyramid[0]
        );
      }
    );

    it(
      "stores the revealed card inside current",
      () => {
        const game =
          createTestGame();

        game.pyramid = [
          [
            createCard(
              "Roi",
              "♣"
            ),
          ],
        ];

        game.progress = {
          revealedCards: 0,
          totalCards: 1,
          nextRow: 0,
          nextColumn: 0,
        };

        const result =
          revealCard(game);

        expect(
          result.current.card
        ).not.toBeNull();

        expect(
          result.current.card
            ?.valeur
        ).toBe("Roi");

        expect(
          result.current.card
            ?.couleur
        ).toBe("♣");

        expect(
          result.current.card
            ?.revelee
        ).toBe(true);
      }
    );
  }
);