import {
  creerPaquet,
  melangerPaquet,
} from "@/lib/deck";

import type {
  Carte,
} from "@/lib/deck";

import type {
  GameState,
} from "../types";

const MIN_PLAYER_COUNT = 2;
const MAX_PLAYER_COUNT = 9;

const MEMORY_DURATION_SECONDS =
  15;

const MEMORY_JOKERS_PER_PLAYER =
  2;

function createGameId(): string {
  if (
    typeof globalThis.crypto
      ?.randomUUID ===
    "function"
  ) {
    return globalThis.crypto.randomUUID();
  }

  return [
    Date.now().toString(36),
    Math.random()
      .toString(36)
      .slice(2),
    Math.random()
      .toString(36)
      .slice(2),
  ].join("-");
}

export function createGame(
  playerCount: number
): GameState {
  if (
    !Number.isInteger(
      playerCount
    ) ||
    playerCount <
      MIN_PLAYER_COUNT ||
    playerCount >
      MAX_PLAYER_COUNT
  ) {
    throw new Error(
      `Le nombre de joueurs doit être compris entre ` +
        `${MIN_PLAYER_COUNT} et ${MAX_PLAYER_COUNT}.`
    );
  }

  const deck =
    melangerPaquet(
      creerPaquet()
    );

  const players: Carte[][] =
    Array.from(
      {
        length:
          playerCount,
      },
      () => []
    );

  const emptyPlayerStats =
    Array.from(
      {
        length:
          playerCount,
      },
      () => ({
        claimsMade: 0,

        drinksGiven: 0,

        bluffsAttempted: 0,

        successfulBluffs: 0,

        caughtBluffs: 0,
      })
    );

  return {
    gameId:
      createGameId(),

    players,

    pyramid: [],

    deck,

    distribution: {
      currentPlayer: 0,
      question: 0,
      awaitingGive: false,
      awaitingContinue: false,
      lastResult: null,
      lastDrink: null,
    },

    memory: {
      remainingSeconds:
        MEMORY_DURATION_SECONDS,

      jokers: Array(
        playerCount
      ).fill(
        MEMORY_JOKERS_PER_PLAYER
      ),

      revealedPlayers: [],
    },

    current: {
      row: 0,
      column: 0,
      card: null,
    },

    progress: {
      revealedCards: 0,
      totalCards: 0,
      nextRow: 0,
      nextColumn: 0,
    },

    turn: {
      currentPlayer: 0,

      remainingPlayers: [
        ...Array(
          playerCount
        ).keys(),
      ],

      pendingAction: null,
    },

    bluffResult: null,

    gameStats: {
      claimsMade: 0,

      drinksGiven: 0,

      bluffsAttempted: 0,

      successfulBluffs: 0,

      caughtBluffs: 0,

      players:
        emptyPlayerStats,
    },

    phase:
      "DISTRIBUTION",

    drinks: Array(
      playerCount
    ).fill(0),

    history: [],
  };
}