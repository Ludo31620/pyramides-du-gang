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

const MIN_PLAYER_COUNT = 2;
const MAX_PLAYER_COUNT = 9;

interface StoredPlayer {
  id?: string;
  pseudo?: string;
  hote?: boolean;
}

interface StoredGame {
  joueurs?: StoredPlayer[];
  players?: StoredPlayer[];

  playerCount?: number;
  nombreJoueurs?: number;
}

function getStoredPlayerCount(): number | null {
  const storedGame =
    sessionStorage.getItem(
      "pyramides-partie",
    );

  if (!storedGame) {
    return null;
  }

  try {
    const parsedGame =
      JSON.parse(storedGame) as StoredGame;

    let playerCount: number | null =
      null;

    if (
      Array.isArray(parsedGame.joueurs)
    ) {
      playerCount =
        parsedGame.joueurs.length;
    } else if (
      Array.isArray(parsedGame.players)
    ) {
      playerCount =
        parsedGame.players.length;
    } else if (
      typeof parsedGame.playerCount ===
      "number"
    ) {
      playerCount =
        parsedGame.playerCount;
    } else if (
      typeof parsedGame.nombreJoueurs ===
      "number"
    ) {
      playerCount =
        parsedGame.nombreJoueurs;
    }

    if (
      playerCount === null ||
      !Number.isInteger(playerCount) ||
      playerCount < MIN_PLAYER_COUNT ||
      playerCount > MAX_PLAYER_COUNT
    ) {
      return null;
    }

    return playerCount;
  } catch {
    return null;
  }
}

function GameScreen() {
  const {
    state,
    dispatch,
  } = useGame();

  /*
   * Le hook doit être exécuté dans un composant
   * situé à l'intérieur du GameProvider.
   */
  useMemoryTimer();

  const isPreparationPhase =
    state.phase === "DISTRIBUTION" ||
    state.phase === "MEMORY";

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 sm:py-8">
        <GameHeader />

        {isPreparationPhase ? (
          <div className="mx-auto w-full max-w-3xl">
            <ActionPanel
              state={state}
              onDispatch={dispatch}
            />
          </div>
        ) : (
          <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
            <aside className="order-1 flex flex-col gap-6 lg:order-2">
              <ActionPanel
                state={state}
                onDispatch={dispatch}
              />

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
  const router = useRouter();

  const [
    playerCount,
    setPlayerCount,
  ] = useState<number | null>(null);

  const [
    storageChecked,
    setStorageChecked,
  ] = useState(false);

  useEffect(() => {
    const storedPlayerCount =
      getStoredPlayerCount();

    if (storedPlayerCount === null) {
      setStorageChecked(true);
      return;
    }

    setPlayerCount(storedPlayerCount);
    setStorageChecked(true);
  }, []);

  function returnToLobby() {
    router.replace("/lobby");
  }

  if (!storageChecked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-5 text-white">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-yellow-400 border-r-transparent" />

          <p className="mt-4 text-sm font-semibold text-zinc-400">
            Préparation de la partie...
          </p>
        </div>
      </main>
    );
  }

  if (playerCount === null) {
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
            Le nombre de joueurs du lobby est
            absent ou invalide. Retourne dans le
            lobby avant de lancer la partie.
          </p>

          <button
            type="button"
            onClick={returnToLobby}
            className="mt-7 min-h-12 w-full rounded-2xl bg-yellow-400 px-5 py-3 font-black text-zinc-950 transition hover:bg-yellow-300"
          >
            Retourner au lobby
          </button>
        </section>
      </main>
    );
  }

  return (
    <GameProvider
      playerCount={playerCount}
    >
      <GameScreen />
    </GameProvider>
  );
}