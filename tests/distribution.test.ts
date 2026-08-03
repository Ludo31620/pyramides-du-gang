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
  answerDistribution,
  continueDistribution,
  giveDistributionDrink,
} from "@/lib/gameEngine/core/distribution";

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
  "distribution",
  () => {
    it(
      "accepts a correct red or black answer",
      () => {
        const game =
          createTestGame();

        game.deck = [
          createCard(
            "As",
            "♥"
          ),
          ...game.deck.slice(1),
        ];

        const result =
          answerDistribution(
            game,
            "RED"
          );

        expect(
          result.distribution
            .lastResult?.correct
        ).toBe(true);

        expect(
          result.distribution
            .awaitingGive
        ).toBe(true);

        expect(
          result.distribution
            .awaitingContinue
        ).toBe(false);

        expect(
          result.players[0]
        ).toHaveLength(1);

        expect(
          result.deck
        ).toHaveLength(51);

        expect(
          result.distribution
            .currentPlayer
        ).toBe(0);

        expect(
          result.distribution
            .question
        ).toBe(0);
      }
    );

    it(
      "makes the player drink after an incorrect answer",
      () => {
        const game =
          createTestGame();

        game.deck = [
          createCard(
            "As",
            "♠"
          ),
          ...game.deck.slice(1),
        ];

        const answeredState =
          answerDistribution(
            game,
            "RED"
          );

        expect(
          answeredState
            .distribution
            .lastResult?.correct
        ).toBe(false);

        expect(
          answeredState.drinks[0]
        ).toBe(1);

        expect(
          answeredState
            .distribution
            .currentPlayer
        ).toBe(0);

        expect(
          answeredState
            .distribution
            .question
        ).toBe(0);

        expect(
          answeredState
            .distribution
            .awaitingGive
        ).toBe(false);

        expect(
          answeredState
            .distribution
            .awaitingContinue
        ).toBe(true);

        const result =
          continueDistribution(
            answeredState
          );

        expect(
          result.distribution
            .currentPlayer
        ).toBe(1);

        expect(
          result.distribution
            .question
        ).toBe(0);

        expect(
          result.distribution
            .awaitingContinue
        ).toBe(false);

        expect(
          result.distribution
            .lastResult
        ).toBeNull();
      }
    );

    it(
      "accepts a correct higher answer",
      () => {
        const game =
          createTestGame();

        game.players[0] = [
          createCard(
            "5",
            "♠"
          ),
        ];

        game.distribution.question =
          1;

        game.deck = [
          createCard(
            "10",
            "♥"
          ),
          ...game.deck.slice(1),
        ];

        const result =
          answerDistribution(
            game,
            "HIGHER"
          );

        expect(
          result.distribution
            .lastResult?.correct
        ).toBe(true);

        expect(
          result.distribution
            .awaitingGive
        ).toBe(true);

        expect(
          result.distribution
            .awaitingContinue
        ).toBe(false);

        expect(
          result.players[0]
        ).toHaveLength(2);

        expect(
          result.distribution
            .currentPlayer
        ).toBe(0);

        expect(
          result.distribution
            .question
        ).toBe(1);
      }
    );

    it(
      "treats an equal value as an incorrect higher or lower answer",
      () => {
        const game =
          createTestGame();

        game.players[0] = [
          createCard(
            "8",
            "♠"
          ),
        ];

        game.distribution.question =
          1;

        game.deck = [
          createCard(
            "8",
            "♦"
          ),
          ...game.deck.slice(1),
        ];

        const answeredState =
          answerDistribution(
            game,
            "HIGHER"
          );

        expect(
          answeredState
            .distribution
            .lastResult?.correct
        ).toBe(false);

        expect(
          answeredState.drinks[0]
        ).toBe(1);

        expect(
          answeredState
            .distribution
            .currentPlayer
        ).toBe(0);

        expect(
          answeredState
            .distribution
            .question
        ).toBe(1);

        expect(
          answeredState
            .distribution
            .awaitingContinue
        ).toBe(true);

        const result =
          continueDistribution(
            answeredState
          );

        expect(
          result.distribution
            .currentPlayer
        ).toBe(1);

        expect(
          result.distribution
            .question
        ).toBe(1);

        expect(
          result.distribution
            .awaitingContinue
        ).toBe(false);
      }
    );

    it(
      "accepts a card strictly inside the first two values",
      () => {
        const game =
          createTestGame();

        game.players[0] = [
          createCard(
            "3",
            "♠"
          ),
          createCard(
            "10",
            "♥"
          ),
        ];

        game.distribution.question =
          2;

        game.deck = [
          createCard(
            "7",
            "♣"
          ),
          ...game.deck.slice(1),
        ];

        const result =
          answerDistribution(
            game,
            "INSIDE"
          );

        expect(
          result.distribution
            .lastResult?.correct
        ).toBe(true);

        expect(
          result.distribution
            .awaitingGive
        ).toBe(true);

        expect(
          result.distribution
            .awaitingContinue
        ).toBe(false);

        expect(
          result.distribution
            .question
        ).toBe(2);
      }
    );

    it(
      "does not consider the boundary values as inside or outside",
      () => {
        const game =
          createTestGame();

        game.players[0] = [
          createCard(
            "3",
            "♠"
          ),
          createCard(
            "10",
            "♥"
          ),
        ];

        game.distribution.question =
          2;

        game.deck = [
          createCard(
            "3",
            "♦"
          ),
          ...game.deck.slice(1),
        ];

        const result =
          answerDistribution(
            game,
            "OUTSIDE"
          );

        expect(
          result.distribution
            .lastResult?.correct
        ).toBe(false);

        expect(
          result.drinks[0]
        ).toBe(1);

        expect(
          result.distribution
            .awaitingContinue
        ).toBe(true);

        expect(
          result.distribution
            .currentPlayer
        ).toBe(0);

        expect(
          result.distribution
            .question
        ).toBe(2);
      }
    );

    it(
      "accepts the correct suit on the fourth question",
      () => {
        const game =
          createTestGame();

        game.players[0] = [
          createCard(
            "2",
            "♠"
          ),
          createCard(
            "5",
            "♥"
          ),
          createCard(
            "9",
            "♦"
          ),
        ];

        game.distribution.question =
          3;

        game.deck = [
          createCard(
            "Roi",
            "♣"
          ),
          ...game.deck.slice(1),
        ];

        const result =
          answerDistribution(
            game,
            "CLUBS"
          );

        expect(
          result.distribution
            .lastResult?.correct
        ).toBe(true);

        expect(
          result.distribution
            .awaitingGive
        ).toBe(true);

        expect(
          result.distribution
            .awaitingContinue
        ).toBe(false);

        expect(
          result.players[0]
        ).toHaveLength(4);

        expect(
          result.distribution
            .currentPlayer
        ).toBe(0);

        expect(
          result.distribution
            .question
        ).toBe(3);
      }
    );

    it(
      "gives one drink after a correct answer and moves to the next player",
      () => {
        const game =
          createTestGame();

        game.deck = [
          createCard(
            "As",
            "♥"
          ),
          ...game.deck.slice(1),
        ];

        const answeredState =
          answerDistribution(
            game,
            "RED"
          );

        const result =
          giveDistributionDrink(
            answeredState,
            1
          );

        expect(
          result.drinks[1]
        ).toBe(1);

        expect(
          result.distribution
            .currentPlayer
        ).toBe(1);

        expect(
          result.distribution
            .question
        ).toBe(0);

        expect(
          result.distribution
            .awaitingGive
        ).toBe(false);

        expect(
          result.distribution
            .awaitingContinue
        ).toBe(false);

        expect(
          result.distribution
            .lastResult
        ).toBeNull();

        expect(
          result.distribution
            .lastDrink
        ).toEqual({
          giver: 0,
          target: 1,
        });
      }
    );

    it(
      "moves to the next player after the fourth question",
      () => {
        const game =
          createTestGame();

        game.players[0] = [
          createCard(
            "2",
            "♠"
          ),
          createCard(
            "5",
            "♥"
          ),
          createCard(
            "9",
            "♦"
          ),
        ];

        game.distribution.question =
          3;

        game.deck = [
          createCard(
            "Roi",
            "♣"
          ),
          ...game.deck.slice(1),
        ];

        const answeredState =
          answerDistribution(
            game,
            "SPADES"
          );

        expect(
          answeredState
            .distribution
            .lastResult?.correct
        ).toBe(false);

        expect(
          answeredState.drinks[0]
        ).toBe(1);

        expect(
          answeredState
            .distribution
            .currentPlayer
        ).toBe(0);

        expect(
          answeredState
            .distribution
            .question
        ).toBe(3);

        expect(
          answeredState
            .distribution
            .awaitingContinue
        ).toBe(true);

        const result =
          continueDistribution(
            answeredState
          );

        expect(
          result.distribution
            .currentPlayer
        ).toBe(1);

        expect(
          result.distribution
            .question
        ).toBe(3);

        expect(
          result.distribution
            .awaitingContinue
        ).toBe(false);
      }
    );

    it(
      "finishes distribution after the last player's fourth card",
      () => {
        const game =
          createTestGame();

        const completeHand = [
          createCard(
            "2",
            "♠"
          ),
          createCard(
            "5",
            "♥"
          ),
          createCard(
            "9",
            "♦"
          ),
          createCard(
            "Dame",
            "♣"
          ),
        ];

        game.players = [
          completeHand.map(
            (card) => ({
              ...card,
            })
          ),
          completeHand.map(
            (card) => ({
              ...card,
            })
          ),
          completeHand.map(
            (card) => ({
              ...card,
            })
          ),
          completeHand
            .slice(0, 3)
            .map(
              (card) => ({
                ...card,
              })
            ),
        ];

        game.distribution.currentPlayer =
          3;

        game.distribution.question =
          3;

        game.deck = Array.from(
          {
            length: 37,
          },
          () =>
            createCard(
              "Roi",
              "♣"
            )
        );

        const answeredState =
          answerDistribution(
            game,
            "CLUBS"
          );

        expect(
          answeredState.phase
        ).toBe(
          "DISTRIBUTION"
        );

        expect(
          answeredState
            .distribution
            .awaitingGive
        ).toBe(true);

        expect(
          answeredState
            .distribution
            .awaitingContinue
        ).toBe(false);

        const finishedState =
          giveDistributionDrink(
            answeredState,
            0
          );

        expect(
          finishedState.phase
        ).toBe(
          "MEMORY"
        );

        expect(
          finishedState.players[3]
        ).toHaveLength(4);

        expect(
          finishedState.deck
        ).toEqual([]);

        expect(
          finishedState.pyramid
            .length
        ).toBeGreaterThan(0);

        expect(
          finishedState.progress
            .totalCards
        ).toBeGreaterThan(0);

        expect(
          finishedState.turn
            .remainingPlayers
        ).toEqual([
          0,
          1,
          2,
          3,
        ]);

        expect(
          finishedState.memory
            .remainingSeconds
        ).toBe(15);
      }
    );

    it(
      "refuses an answer that does not match the current question",
      () => {
        const game =
          createTestGame();

        expect(() =>
          answerDistribution(
            game,
            "HIGHER"
          )
        ).toThrow(
          "Cette réponse ne correspond pas à la question actuelle."
        );
      }
    );

    it(
      "refuses another answer while a drink still has to be given",
      () => {
        const game =
          createTestGame();

        game.deck = [
          createCard(
            "As",
            "♥"
          ),
          ...game.deck.slice(1),
        ];

        const answeredState =
          answerDistribution(
            game,
            "RED"
          );

        expect(() =>
          answerDistribution(
            answeredState,
            "BLACK"
          )
        ).toThrow(
          "Le joueur doit d’abord donner sa gorgée."
        );
      }
    );

    it(
      "refuses another answer while an incorrect result awaits continuation",
      () => {
        const game =
          createTestGame();

        game.deck = [
          createCard(
            "As",
            "♠"
          ),
          ...game.deck.slice(1),
        ];

        const answeredState =
          answerDistribution(
            game,
            "RED"
          );

        expect(() =>
          answerDistribution(
            answeredState,
            "BLACK"
          )
        ).toThrow(
          "Le joueur doit d’abord continuer."
        );
      }
    );

    it(
      "refuses giving a drink to oneself",
      () => {
        const game =
          createTestGame();

        game.deck = [
          createCard(
            "As",
            "♥"
          ),
          ...game.deck.slice(1),
        ];

        const answeredState =
          answerDistribution(
            game,
            "RED"
          );

        expect(() =>
          giveDistributionDrink(
            answeredState,
            0
          )
        ).toThrow(
          "Un joueur ne peut pas se donner sa propre gorgée."
        );
      }
    );
  }
);