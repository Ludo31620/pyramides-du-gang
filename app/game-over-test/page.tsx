"use client";

import GameOverModal from "@/components/game/GameOverModal";

import type {
  PlayerGameState,
} from "@/lib/gameEngine/publicTypes";

const PLAYER_NAMES = [
  "Ludo",
  "Stefanie",
  "Lucas",
  "Cindy",
];

const TEST_STATE: PlayerGameState = {

  gameId:
    "game-over-test",
  viewerPlayerIndex: 0,

connectedPlayers: [
  true,
  true,
  true,
],

  players: [
    [],
    [],
    [],
    [],
  ],

  pyramid: [],

  deck: [],

distribution: {
  currentPlayer: 0,
  question: 3,
  awaitingGive: false,
  awaitingContinue: false,
  lastResult: null,
  lastDrink: null,
},

  memory: {
    remainingSeconds: 0,
    jokers: [
      0,
      0,
      0,
      0,
    ],
    revealedPlayers: [],
  },

  current: {
    row: 4,
    column: 0,
    card: null,
  },

  progress: {
    revealedCards: 44,
    totalCards: 44,
    nextRow: 5,
    nextColumn: 0,
  },

  turn: {
    currentPlayer: 0,
    remainingPlayers: [],
    pendingAction: null,
  },

  bluffResult: null,

  gameStats: {
    claimsMade: 18,
    drinksGiven: 0,
    bluffsAttempted: 12,
    successfulBluffs: 8,
    caughtBluffs: 4,

    players: [
      {
        claimsMade: 6,
        drinksGiven: 0,
        bluffsAttempted: 5,
        successfulBluffs: 4,
        caughtBluffs: 1,
      },
      {
        claimsMade: 5,
        drinksGiven: 0,
        bluffsAttempted: 3,
        successfulBluffs: 2,
        caughtBluffs: 1,
      },
      {
        claimsMade: 4,
        drinksGiven: 0,
        bluffsAttempted: 3,
        successfulBluffs: 2,
        caughtBluffs: 1,
      },
      {
        claimsMade: 3,
        drinksGiven: 0,
        bluffsAttempted: 1,
        successfulBluffs: 0,
        caughtBluffs: 1,
      },
    ],
  },

  phase: "GAME_OVER",

  drinks: [
    12,
    8,
    17,
    5,
  ],

  history: [],

  nextCardForReveal: null,
};

export default function GameOverTestPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-5xl p-6">
        <h1 className="text-2xl font-black">
          Test écran de fin
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Cette page simule une partie terminée.
        </p>
      </div>

      <GameOverModal
        state={TEST_STATE}
        playerNames={
          PLAYER_NAMES
        }
        onReturnToLobby={() => {
          console.log(
            "Retour au lobby demandé."
          );
        }}
      />
    </main>
  );
}