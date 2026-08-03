import {
  describe,
  expect,
  it,
} from "vitest";

import {
  GameEngine,
} from "@/lib/gameEngine/GameEngine";

import type {
  DistributionAnswer,
  DistributionQuestion,
} from "@/lib/gameEngine/types";

const ANSWER_BY_QUESTION: Record<
  DistributionQuestion,
  DistributionAnswer
> = {
  0: "RED",
  1: "HIGHER",
  2: "INSIDE",
  3: "SPADES",
};

describe(
  "GameEngine - intégration distribution",
  () => {
    it(
      "joue toute la distribution puis passe à la mémoire",
      () => {
        const playerCount =
          4;

        const engine =
          new GameEngine();

        let state =
          engine.dispatch({
            type:
              "START_GAME",

            playerCount,
          });

        expect(
          state.phase
        ).toBe(
          "DISTRIBUTION"
        );

        expect(
          state.players
        ).toHaveLength(
          playerCount
        );

        /*
         * Au lancement de la partie,
         * les cartes n'ont pas encore
         * été distribuées.
         */
        state.players.forEach(
          (hand) => {
            expect(
              hand
            ).toHaveLength(0);
          }
        );

        let answeredQuestions =
          0;

        let safetyCounter =
          0;

        while (
          state.phase ===
          "DISTRIBUTION"
        ) {
          safetyCounter += 1;

          /*
           * Il doit y avoir exactement
           * quatre réponses par joueur.
           *
           * Cette sécurité empêche une
           * boucle infinie en cas de
           * régression du moteur.
           */
          expect(
            safetyCounter
          ).toBeLessThanOrEqual(
            playerCount * 4
          );

          const question =
            state.distribution
              .question;

          const answer =
            ANSWER_BY_QUESTION[
              question
            ];

          state =
            engine.dispatch({
              type:
                "ANSWER_DISTRIBUTION",

              answer,
            });

          answeredQuestions +=
            1;

          /*
           * Après une bonne réponse,
           * le joueur donne une gorgée.
           */
          if (
            state.phase ===
              "DISTRIBUTION" &&
            state.distribution
              .awaitingGive
          ) {
            const giver =
              state.distribution
                .currentPlayer;

            const target =
              getNextPlayer(
                giver,
                playerCount
              );

            expect(
              target
            ).not.toBe(
              giver
            );

            state =
              engine.dispatch({
                type:
                  "GIVE_DISTRIBUTION_DRINK",

                target,
              });

            continue;
          }

          /*
           * Après une mauvaise réponse,
           * le résultat reste affiché
           * jusqu'à la continuation.
           */
          if (
            state.phase ===
              "DISTRIBUTION" &&
            state.distribution
              .awaitingContinue
          ) {
            state =
              engine.dispatch({
                type:
                  "CONTINUE_DISTRIBUTION",
              });
          }
        }

        /*
         * Chaque joueur répond aux
         * quatre questions.
         */
        expect(
          answeredQuestions
        ).toBe(
          playerCount * 4
        );

        /*
         * Chaque joueur possède alors
         * quatre cartes.
         */
        state.players.forEach(
          (hand) => {
            expect(
              hand
            ).toHaveLength(4);
          }
        );

        /*
         * Chaque réponse provoque
         * exactement une gorgée :
         *
         * - mauvaise réponse :
         *   le joueur boit ;
         *
         * - bonne réponse :
         *   le joueur donne.
         */
        const totalDrinks =
          state.drinks.reduce(
            (
              total,
              drinks
            ) =>
              total +
              drinks,
            0
          );

        expect(
          totalDrinks
        ).toBe(
          playerCount * 4
        );

        expect(
          state.phase
        ).toBe(
          "MEMORY"
        );

        expect(
          state.memory
            .remainingSeconds
        ).toBe(15);

        expect(
          state.memory.jokers
        ).toHaveLength(
          playerCount
        );

        expect(
          state.memory
            .revealedPlayers
        ).toEqual([]);

        expect(
          state.distribution
            .awaitingGive
        ).toBe(false);

        expect(
          state.distribution
            .awaitingContinue
        ).toBe(false);
      }
    );
  }
);

function getNextPlayer(
  currentPlayer: number,
  playerCount: number
): number {
  return (
    (currentPlayer + 1) %
    playerCount
  );
}