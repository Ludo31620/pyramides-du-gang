"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import ActionPanel from "@/components/panels/ActionPanel";
import CurrentCard from "@/components/board/CurrentCard";
import GameHeader from "@/components/layout/GameHeader";
import PlayerList from "@/components/players/PlayerList";
import PyramidBoard from "@/components/board/PyramidBoard";

import GameProvider, {
  useGame,
} from "@/components/providers/GameProvider";

import {
  useMemoryTimer,
} from "@/hooks/useMemoryTimer";

import type {
  Phase,
} from "@/lib/gameEngine/types";

const MIN_PLAYER_COUNT = 2;
const MAX_PLAYER_COUNT = 9;

interface StoredPlayer {
  id?: string;
  pseudo?: string;
  hote?: boolean;
  isHost?: boolean;
}

interface StoredGame {
  code?: string;
  roomCode?: string;
  salonCode?: string;

  joueurs?: StoredPlayer[];
  players?: StoredPlayer[];

  playerCount?: number;
  nombreJoueurs?: number;
}

interface StoredGameInfo {
  roomCode: string;
  playerCount: number;
  playerNames: string[];
}

function getStoredGameInfo():
  | StoredGameInfo
  | null {
  const storedGame =
    sessionStorage.getItem(
      "pyramides-partie"
    );

  if (!storedGame) {
    return null;
  }

  try {
    const parsedGame =
      JSON.parse(
        storedGame
      ) as StoredGame;

    const players =
      Array.isArray(
        parsedGame.joueurs
      )
        ? parsedGame.joueurs
        : Array.isArray(
              parsedGame.players
            )
          ? parsedGame.players
          : [];

    let playerCount:
      | number
      | null =
      players.length > 0
        ? players.length
        : null;

    if (
      playerCount === null &&
      typeof parsedGame
        .playerCount ===
        "number"
    ) {
      playerCount =
        parsedGame.playerCount;
    }

    if (
      playerCount === null &&
      typeof parsedGame
        .nombreJoueurs ===
        "number"
    ) {
      playerCount =
        parsedGame
          .nombreJoueurs;
    }

    const roomCode =
      parsedGame.code ??
      parsedGame.roomCode ??
      parsedGame.salonCode ??
      "";

    const normalizedRoomCode =
      roomCode
        .trim()
        .toUpperCase();

    if (
      !/^PG-\d{4}$/.test(
        normalizedRoomCode
      )
    ) {
      return null;
    }

    if (
      playerCount === null ||
      !Number.isInteger(
        playerCount
      ) ||
      playerCount <
        MIN_PLAYER_COUNT ||
      playerCount >
        MAX_PLAYER_COUNT
    ) {
      return null;
    }

    const playerNames =
      Array.from(
        {
          length:
            playerCount,
        },
        (
          _,
          playerIndex
        ) => {
          const pseudo =
            players[
              playerIndex
            ]?.pseudo?.trim();

          return (
            pseudo ||
            `Joueur ${
              playerIndex + 1
            }`
          );
        }
      );

    return {
      roomCode:
        normalizedRoomCode,

      playerCount,

      playerNames,
    };
  } catch {
    return null;
  }
}

function getActivePlayerIndex(
  phase: Phase,
  state: NonNullable<
    ReturnType<
      typeof useGame
    >["state"]
  >
): number | null {
  switch (phase) {
    case "DISTRIBUTION":
      return state
        .distribution
        .currentPlayer;

    case "PLAYER_TURN":
      return state.turn
        .currentPlayer;

    case "PLAYER_RESPONSE":
      return (
        state.turn
          .pendingAction
          ?.target ?? null
      );

    default:
      return null;
  }
}

function WaitingForPlayer({
  playerName,
}: {
  playerName: string;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-900 p-7 text-center sm:p-9">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-yellow-400/20 bg-yellow-400/10">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-yellow-400 border-r-transparent" />
      </div>

      <p className="mt-6 text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
        En attente
      </p>

      <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
        {playerName} joue
      </h2>

      <p className="mt-3 text-sm leading-6 text-zinc-400">
        La partie continuera automatiquement dès que sa décision sera prise.
      </p>
    </section>
  );
}

function GameLoadingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-5 text-white">
      <div className="text-center">
        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-yellow-400 border-r-transparent" />

        <p className="mt-4 text-sm font-semibold text-zinc-400">
          Synchronisation de la partie...
        </p>
      </div>
    </main>
  );
}

function GameScreen({
  playerNames,
}: {
  playerNames: string[];
}) {
  const {
    state,
    dispatch,
    loading,
    error,
    connected,
    refreshState,
  } = useGame();

  useMemoryTimer();

  if (
    loading ||
    !state
  ) {
    return (
      <GameLoadingScreen />
    );
  }

  const viewerPlayerIndex =
    state.viewerPlayerIndex;

  const activePlayerIndex =
    getActivePlayerIndex(
      state.phase,
      state
    );

  const viewerIsActive =
    activePlayerIndex === null ||
    activePlayerIndex ===
      viewerPlayerIndex;

  const hostIndex =
    0;

  const viewerIsHost =
    viewerPlayerIndex ===
    hostIndex;

  const canUseActionPanel =
    (() => {
      switch (state.phase) {
        case "DISTRIBUTION":
        case "PLAYER_TURN":
        case "PLAYER_RESPONSE":
          return viewerIsActive;

        case "WAITING":
        case "BLUFF_RESULT":
          return viewerIsHost;

        case "MEMORY":
          return true;

        case "GAME_OVER":
          return false;

        default: {
          const exhaustiveCheck:
            never =
            state.phase;

          return exhaustiveCheck;
        }
      }
    })();

  const isWaitingForAnotherPlayer =
    activePlayerIndex !== null &&
    !viewerIsActive;

  const activePlayerName =
    activePlayerIndex !== null
      ? (
          playerNames[
            activePlayerIndex
          ] ??
          `Joueur ${
            activePlayerIndex +
            1
          }`
        )
      : "";

  const isPreparationPhase =
    state.phase ===
      "DISTRIBUTION" ||
    state.phase ===
      "MEMORY";

  const actionContent =
    isWaitingForAnotherPlayer ? (
      <WaitingForPlayer
        playerName={
          activePlayerName
        }
      />
    ) : (
      <ActionPanel
        state={state}
        onDispatch={
          canUseActionPanel
            ? dispatch
            : undefined
        }
      />
    );

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 sm:py-8">
        <GameHeader />

        {!connected && (
          <section className="rounded-2xl border border-orange-400/20 bg-orange-400/10 px-5 py-4">
            <p className="text-sm font-bold text-orange-300">
              Connexion au serveur interrompue. Reconnexion en cours...
            </p>
          </section>
        )}

        {error && (
          <section className="rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4">
            <p className="text-sm font-bold text-red-300">
              {error}
            </p>

            <button
              type="button"
              onClick={
                refreshState
              }
              className="mt-3 rounded-xl border border-red-300/20 bg-red-300/10 px-4 py-2 text-xs font-black uppercase tracking-wide text-red-200"
            >
              Resynchroniser
            </button>
          </section>
        )}

        {isPreparationPhase ? (
          <div className="mx-auto w-full max-w-3xl">
            {actionContent}
          </div>
        ) : (
          <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
            <aside className="order-1 flex flex-col gap-6 lg:order-2">
              {actionContent}

              <PlayerList
                state={state}
              />
            </aside>

            <section className="order-2 flex min-w-0 flex-col gap-6 lg:order-1">
              <CurrentCard
                state={state}
              />

              <PyramidBoard
                state={state}
              />
            </section>
          </div>
        )}

        <footer className="pb-3 text-center text-xs text-zinc-600">
          Pyramides du Gang · by Ludo B
        </footer>
      </div>
    </main>
  );
}

export default function JeuPage() {
  const router =
    useRouter();

  const [
    gameInfo,
    setGameInfo,
  ] =
    useState<StoredGameInfo | null>(
      null
    );

  const [
    storageChecked,
    setStorageChecked,
  ] = useState(false);

  useEffect(() => {
    setGameInfo(
      getStoredGameInfo()
    );

    setStorageChecked(true);
  }, []);

  function returnToLobby(): void {
    router.replace(
      "/lobby"
    );
  }

  if (!storageChecked) {
    return (
      <GameLoadingScreen />
    );
  }

  if (!gameInfo) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-5 text-white">
        <section className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-900 p-7 text-center">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
            Partie introuvable
          </p>

          <h1 className="mt-3 text-2xl font-black">
            Impossible de démarrer
          </h1>

          <p className="mt-4 text-sm leading-6 text-zinc-400">
            Le code ou les informations de la partie sont absents ou invalides.
          </p>

          <button
            type="button"
            onClick={
              returnToLobby
            }
            className="mt-7 min-h-12 w-full rounded-2xl bg-yellow-400 px-5 py-3 font-black text-zinc-950 transition active:scale-[0.98]"
          >
            Retourner au lobby
          </button>
        </section>
      </main>
    );
  }

  return (
    <GameProvider
      roomCode={
        gameInfo.roomCode
      }
    >
      <GameScreen
        playerNames={
          gameInfo.playerNames
        }
      />
    </GameProvider>
  );
}