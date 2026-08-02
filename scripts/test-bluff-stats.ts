import {
  createGame,
} from "../lib/gameEngine/core/createGame";

import {
  giveDrinks,
} from "../lib/gameEngine/core/give";

import {
  believe,
} from "../lib/gameEngine/core/believe";

import {
  doubt,
} from "../lib/gameEngine/core/doubt";

import type {
  Carte,
} from "../lib/deck";

import type {
  GameState,
} from "../lib/gameEngine/types";

const ACE_OF_SPADES: Carte = {
  valeur: "As",
  couleur: "♠",
  revelee: false,
};

const TEN_OF_SPADES: Carte = {
  valeur: "10",
  couleur: "♠",
  revelee: false,
};

const TEN_OF_HEARTS: Carte = {
  valeur: "10",
  couleur: "♥",
  revelee: true,
};

function createTestState(
  giverCards: Carte[]
): GameState {
  const state =
    createGame(2);

  return {
    ...state,

    players: [
      giverCards,
      [
        ACE_OF_SPADES,
      ],
    ],

    phase:
      "PLAYER_TURN",

    current: {
      row: 0,
      column: 0,
      card:
        TEN_OF_HEARTS,
    },

    progress: {
      revealedCards: 1,
      totalCards: 15,
      nextRow: 0,
      nextColumn: 1,
    },

    turn: {
      currentPlayer: 0,
      remainingPlayers: [
        0,
        1,
      ],
      pendingAction: null,
    },
  };
}

function printStats(
  title: string,
  state: GameState
): void {
  const playerStats =
    state.gameStats
      .players[0];

  console.log(
    `\n${title}`
  );

  console.log(
    "Statistiques globales :",
    state.gameStats
  );

  console.log(
    "Statistiques joueur 1 :",
    playerStats
  );
}

/*
 * TEST 1
 *
 * Le joueur possède seulement un As.
 * La carte active est un 10.
 *
 * Il ment et la cible le croit.
 *
 * Résultat attendu :
 * claimsMade = 1
 * bluffsAttempted = 1
 * successfulBluffs = 1
 * caughtBluffs = 0
 */
const lieBelievedStart =
  createTestState([
    ACE_OF_SPADES,
  ]);

const lieBelievedPending =
  giveDrinks(
    lieBelievedStart,
    1
  );

const lieBelievedResult =
  believe(
    lieBelievedPending
  );

printStats(
  "TEST 1 — Mensonge accepté",
  lieBelievedResult
);

/*
 * TEST 2
 *
 * Le joueur possède seulement un As.
 * La carte active est un 10.
 *
 * Il ment et la cible le démasque.
 *
 * Résultat attendu :
 * claimsMade = 1
 * bluffsAttempted = 1
 * successfulBluffs = 0
 * caughtBluffs = 1
 */
const lieCaughtStart =
  createTestState([
    ACE_OF_SPADES,
  ]);

const lieCaughtPending =
  giveDrinks(
    lieCaughtStart,
    1
  );

const lieCaughtResult =
  doubt(
    lieCaughtPending
  );

printStats(
  "TEST 2 — Mensonge démasqué",
  lieCaughtResult
);

/*
 * TEST 3
 *
 * Le joueur possède un 10 de pique.
 * La carte active est un 10 de cœur.
 *
 * Il dit vrai et la cible conteste.
 *
 * Résultat attendu :
 * claimsMade = 1
 * bluffsAttempted = 0
 * successfulBluffs = 0
 * caughtBluffs = 0
 */
const truthDoubtedStart =
  createTestState([
    TEN_OF_SPADES,
  ]);

const truthDoubtedPending =
  giveDrinks(
    truthDoubtedStart,
    1
  );

const truthDoubtedResult =
  doubt(
    truthDoubtedPending
  );

printStats(
  "TEST 3 — Annonce vraie contestée",
  truthDoubtedResult
);

console.log(
  "\n✅ Tests terminés."
);