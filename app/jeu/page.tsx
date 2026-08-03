"use client";

import {
  recordCompletedGame,
} from "@/lib/stats/storage";

import {
  checkAchievements,
} from "@/lib/achievements/engine";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  AnimatePresence,
} from "framer-motion";

import PyramidBoard from "@/components/board/PyramidBoard";
import GameAnnouncement from "@/components/game/GameAnnouncement";
import GameHomeButton from "@/components/game/GameHomeButton";
import GameOverModal from "@/components/game/GameOverModal";
import ActionPanel from "@/components/panels/ActionPanel";
import PlayerDrawer from "@/components/players/PlayerDrawer";
import AchievementToast from "@/components/achievements/AchievementToast";


import GameProvider, {
  useGame,
} from "@/components/providers/GameProvider";

import {
  useMemoryTimer,
} from "@/hooks/useMemoryTimer";

import {
  lireSessionPartie,
} from "@/lib/gameSession";

import type {
  Phase,
} from "@/lib/gameEngine/types";



import {
  getAchievement,
} from "@/lib/achievements/achievements";

import type {
  AchievementDefinition,
} from "@/lib/achievements/types";

interface StoredGameInfo {
  roomCode: string;
  playerNames: string[];
}

interface AnnouncementState {
  announcementKey: number;
  eyebrow?: string;
  title: string;
  icon?: string;
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
      return (
        state.distribution
          .currentPlayer
      );

    case "PLAYER_TURN":
      return (
        state.turn
          .currentPlayer
      );

    case "PLAYER_RESPONSE":
      return (
        state.turn
          .pendingAction
          ?.target ??
        null
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
        La partie continuera
        automatiquement dès que sa
        décision sera prise.
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
          Synchronisation de la
          partie...
        </p>
      </div>
    </main>
  );
}

function GameScreen({
  roomCode,
  playerNames,
}: {
  roomCode: string;
  playerNames: string[];
}) {
  const {
    state,
    dispatch,
    loading,
    error,
    connected,
    refreshState,
    returnToLobby,
  } = useGame();

  const [
    announcement,
    setAnnouncement,
  ] =
    useState<AnnouncementState | null>(
      null
    );

const [
  achievementToast,
  setAchievementToast,
] =
  useState<AchievementDefinition | null>(
    null
  );

  const initializedRef =
    useRef(false);

    const recordedGameRef =
  useRef<string | null>(
    null
  );

  const previousPhaseRef =
    useRef<Phase | null>(
      null
    );

  const previousActivePlayerRef =
    useRef<number | null>(
      null
    );

  const previousDrinkRef =
    useRef<string | null>(
      null
    );

  useMemoryTimer();

  useEffect(() => {
    if (!state) {
      return;
    }

    const currentPhase =
      state.phase;

    const currentActivePlayer =
      getActivePlayerIndex(
        currentPhase,
        state
      );

    const lastDrink =
      state.distribution
        .lastDrink;

    const currentDrinkId =
      lastDrink
        ? `${lastDrink.giver}-${lastDrink.target}-${state.history.length}`
        : null;

    /*
     * Premier état reçu après l’ouverture
     * de la page ou une reconnexion.
     *
     * Les valeurs sont mémorisées sans
     * déclencher d’annonce artificielle.
     */
    if (
      !initializedRef
        .current
    ) {
      initializedRef.current =
        true;

      previousPhaseRef.current =
        currentPhase;

      previousActivePlayerRef.current =
        currentActivePlayer;

      previousDrinkRef.current =
        currentDrinkId;

      return;
    }

    const previousPhase =
      previousPhaseRef
        .current;

    const previousActivePlayer =
      previousActivePlayerRef
        .current;

    const phaseChanged =
      previousPhase !==
      currentPhase;

    const viewerPlayerIndex =
      state.viewerPlayerIndex;

    const newDrinkNotification =
      currentDrinkId !==
        null &&
      currentDrinkId !==
        previousDrinkRef
          .current &&
      lastDrink?.target ===
        viewerPlayerIndex;

    const viewerBecameActive =
      currentActivePlayer ===
        viewerPlayerIndex &&
      (
        previousActivePlayer !==
          viewerPlayerIndex ||
        phaseChanged
      );

    if (
      newDrinkNotification
    ) {
      setAnnouncement({
        announcementKey:
          Date.now(),

        eyebrow:
          "Distribution",

        title:
          "Tu bois 1 gorgée !",

        icon:
          "🍺",
      });
    } else if (
      phaseChanged &&
      currentPhase ===
        "MEMORY"
    ) {
      setAnnouncement({
        announcementKey:
          Date.now(),

        eyebrow:
          "Préparation",

        title:
          "Mémorise tes cartes",

        icon:
          "🧠",
      });
    } else if (
      viewerBecameActive &&
      currentPhase ===
        "PLAYER_RESPONSE"
    ) {
      setAnnouncement({
        announcementKey:
          Date.now(),

        eyebrow:
          "Tu es la cible",

        title:
          "À toi de répondre",

        icon:
          "❗",
      });
    } else if (
      viewerBecameActive &&
      currentPhase ===
        "PLAYER_TURN"
    ) {
      setAnnouncement({
        announcementKey:
          Date.now(),

        eyebrow:
          "Tour actif",

        title:
          "À toi de jouer",

        icon:
          "🟡",
      });
    }

    previousDrinkRef.current =
      currentDrinkId;

    previousPhaseRef.current =
      currentPhase;

    previousActivePlayerRef.current =
      currentActivePlayer;
  }, [
    state,
  ]);

useEffect(() => {
  if (
    !state ||
    state.phase !==
      "GAME_OVER"
  ) {
    return;
  }

  const playerStats =
    state.gameStats.players[
      state.viewerPlayerIndex
    ];

  if (!playerStats) {
    return;
  }

const gameId =
  state.gameId;

  if (
    recordedGameRef.current ===
    gameId
  ) {
    return;
  }

  const updatedStats =
  recordCompletedGame({
    gameId,

    drinksGiven:
      playerStats.drinksGiven,

    drinksReceived:
      state.drinks[
        state.viewerPlayerIndex
      ],

    claimsMade:
      playerStats.claimsMade,

    bluffsAttempted:
      playerStats.bluffsAttempted,

    successfulBluffs:
      playerStats.successfulBluffs,

    caughtBluffs:
      playerStats.caughtBluffs,
  });

const achievementResult =
  checkAchievements(
    updatedStats
  );

const firstUnlockedAchievement =
  achievementResult
    .unlocked[0];

if (
  firstUnlockedAchievement
) {
  setAchievementToast(
    getAchievement(
      firstUnlockedAchievement.id
    )
  );
}

recordedGameRef.current =
  gameId;
  
}, [
  state,
  roomCode,
]);

useEffect(() => {
  if (!achievementToast) {
    return;
  }

  const timeoutId =
    window.setTimeout(
      () => {
        setAchievementToast(
          null
        );
      },
      4000
    );

  return () => {
    window.clearTimeout(
      timeoutId
    );
  };
}, [
  achievementToast,
]);

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
    activePlayerIndex ===
      null ||
    activePlayerIndex ===
      viewerPlayerIndex;

  const viewerIsHost =
    viewerPlayerIndex ===
    0;

  const canUseActionPanel =
    (() => {
      switch (
        state.phase
      ) {
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
    activePlayerIndex !==
      null &&
    !viewerIsActive;

  const activePlayerName =
    activePlayerIndex !==
      null
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
        playerNames={
          playerNames
        }
        onDispatch={
          canUseActionPanel
            ? dispatch
            : undefined
        }
      />
    );

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <AchievementToast
  achievement={
    achievementToast
  }
  visible={
    achievementToast !==
    null
  }
/>
      <GameHomeButton />

      <PlayerDrawer
        state={state}
        playerNames={
          playerNames
        }
      />

      <AnimatePresence>
        {state.phase ===
          "GAME_OVER" && (
          <GameOverModal
            state={state}
            playerNames={
              playerNames
            }
            onReturnToLobby={
              returnToLobby
            }
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {announcement && (
          <GameAnnouncement
            announcementKey={
              announcement
                .announcementKey
            }
            eyebrow={
              announcement
                .eyebrow
            }
            title={
              announcement
                .title
            }
            icon={
              announcement
                .icon
            }
            onComplete={() => {
              setAnnouncement(
                null
              );
            }}
          />
        )}
      </AnimatePresence>

      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 px-3 py-3 sm:px-5 sm:py-5">
        {!connected && (
          <section className="rounded-2xl border border-orange-400/20 bg-orange-400/10 px-5 py-4">
            <p className="text-sm font-bold text-orange-300">
              Connexion au serveur
              interrompue. Reconnexion
              en cours...
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
          <div className="flex flex-1 flex-col gap-4">
            {actionContent}

            <section className="flex min-w-0 flex-1 flex-col">
              <PyramidBoard
                state={state}
              />
            </section>
          </div>
        )}
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
    useState<
      StoredGameInfo | null
    >(null);

  const [
    storageChecked,
    setStorageChecked,
  ] =
    useState(false);

  useEffect(() => {
    const session =
      lireSessionPartie();

    if (!session) {
      setGameInfo(
        null
      );

      setStorageChecked(
        true
      );

      return;
    }

    const playerNames =
      Array.from(
        {
          length:
            session.playerCount,
        },
        (
          _,
          playerIndex
        ) => {
          const pseudo =
            session.players[
              playerIndex
            ]?.pseudo
              ?.trim();

          return (
            pseudo ||
            `Joueur ${
              playerIndex +
              1
            }`
          );
        }
      );

    setGameInfo({
      roomCode:
        session.code,

      playerNames,
    });

    setStorageChecked(
      true
    );
  }, []);

  function returnToLobby():
    void {
    router.replace(
      "/lobby"
    );
  }

  if (
    !storageChecked
  ) {
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
            Le code ou les
            informations de la partie
            sont absents ou invalides.
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
      playerNames={
        gameInfo.playerNames
      }
    >
<GameScreen
  roomCode={
    gameInfo.roomCode
  }
  playerNames={
    gameInfo.playerNames
  }
/>
    </GameProvider>
  );
}