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

const MEMORY_DURATION_SECONDS = 60;
const MEMORY_JOKERS_PER_PLAYER = 2;

export function createGame(
  playerCount: number
): GameState {
  if (
    !Number.isInteger(playerCount) ||
    playerCount < MIN_PLAYER_COUNT ||
    playerCount > MAX_PLAYER_COUNT
  ) {
    throw new Error(
      `Le nombre de joueurs doit être compris entre ` +
        `${MIN_PLAYER_COUNT} et ${MAX_PLAYER_COUNT}.`
    );
  }

  const deck = melangerPaquet(
    creerPaquet()
  );

  const players: Carte[][] =
    Array.from(
      {
        length: playerCount,
      },
      () => []
    );

  return {
    players,

    /**
     * La pyramide sera créée seulement
     * après la distribution des quatre cartes
     * à tous les joueurs.
     */
    pyramid: [],

    /**
     * Le paquet complet est conservé ici.
     * Chaque réponse de distribution retirera
     * la première carte.
     */
    deck,

    distribution: {
      currentPlayer: 0,
      question: 0,
      awaitingGive: false,
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

    phase: "DISTRIBUTION",

    drinks: Array(
      playerCount
    ).fill(0),

    history: [],
  };
}