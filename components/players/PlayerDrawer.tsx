"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import ProfileAvatar from "@/components/profile/ProfileAvatar";

import {
  lireSessionPartie,
  type StoredRoomPlayer,
} from "@/lib/gameSession";

import {
  getPlayerName,
} from "@/lib/gameEngine/getPlayerName";

import type {
  PlayerGameState,
} from "@/lib/gameEngine/publicTypes";

interface PlayerDrawerProps {
  state: PlayerGameState;
  playerNames: string[];
}

function getActivePlayerIndex(
  state: PlayerGameState
): number | null {
  switch (state.phase) {
    case "DISTRIBUTION":
      return state.distribution
        .currentPlayer;

    case "PLAYER_TURN":
      return state.turn
        .currentPlayer;

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

export default function PlayerDrawer({
  state,
  playerNames,
}: PlayerDrawerProps) {
  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    roomPlayers,
    setRoomPlayers,
  ] =
    useState<StoredRoomPlayer[]>(
      []
    );

  const activePlayerIndex =
    getActivePlayerIndex(
      state
    );

  useEffect(() => {
    const session =
      lireSessionPartie();

    setRoomPlayers(
      session?.players ??
        []
    );
  }, []);

  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent
    ): void {
      if (
        event.key ===
        "Escape"
      ) {
        setOpen(false);
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  return (
    <>
      <button
        type="button"
        aria-label="Afficher les joueurs"
        aria-expanded={open}
        onClick={() =>
          setOpen(true)
        }
        className="
          fixed
          right-0
          top-1/2
          z-[150]
          flex
          -translate-y-1/2
          items-center
          justify-center
          rounded-l-2xl
          border
          border-r-0
          border-yellow-400/30
          bg-zinc-900/95
          px-3
          py-4
          text-xl
          shadow-xl
          backdrop-blur-md
          transition
          hover:bg-zinc-800
          active:scale-95
        "
      >
        👥
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Fermer la liste des joueurs"
              className="
                fixed
                inset-0
                z-[200]
                cursor-default
                bg-black/65
                backdrop-blur-sm
              "
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
              }}
              onClick={() =>
                setOpen(false)
              }
            />

            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Liste des joueurs"
              className="
                fixed
                bottom-0
                right-0
                top-0
                z-[201]
                flex
                w-[88vw]
                max-w-sm
                flex-col
                border-l
                border-white/10
                bg-zinc-950
                text-white
                shadow-2xl
              "
              initial={{
                x: "100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "100%",
              }}
              transition={{
                duration: 0.28,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
                    Partie
                  </p>

                  <h2 className="mt-1 text-2xl font-black">
                    Joueurs
                  </h2>
                </div>

                <button
                  type="button"
                  aria-label="Fermer"
                  onClick={() =>
                    setOpen(false)
                  }
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/10
                    bg-zinc-900
                    text-lg
                    text-zinc-300
                    transition
                    hover:bg-zinc-800
                    active:scale-95
                  "
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-5">
                {state.players.map(
                  (
                    hand,
                    playerIndex
                  ) => {
                    const playerName =
                      getPlayerName(
                        playerNames,
                        playerIndex
                      );

                    const roomPlayer =
                      roomPlayers[
                        playerIndex
                      ];

                    const isHost =
                      roomPlayer
                        ?.isHost ??
                      playerIndex === 0;

                    const isConnected =
                      state
                        .connectedPlayers[
                          playerIndex
                        ] ??
                      true;

                    const isActive =
                      activePlayerIndex ===
                      playerIndex;

                    const mustRespond =
                      state.phase ===
                        "PLAYER_RESPONSE" &&
                      state.turn
                        .pendingAction
                        ?.target ===
                        playerIndex;

                    const drinks =
                      state.drinks[
                        playerIndex
                      ] ?? 0;

                    const jokers =
                      state.memory
                        .jokers[
                          playerIndex
                        ] ?? 0;

                    return (
                      <article
                        key={
                          playerIndex
                        }
                        className={[
                          "rounded-2xl border p-4 transition",
                          isActive
                            ? "border-yellow-400/50 bg-yellow-400/10 shadow-[0_0_24px_rgba(250,204,21,0.1)]"
                            : "border-white/10 bg-zinc-900",
                          isConnected
                            ? ""
                            : "opacity-70",
                        ].join(" ")}
                      >
                        <div className="flex items-center gap-3">
                          <div className="shrink-0">
                            <ProfileAvatar
                              size="small"
                              avatarType={
                                roomPlayer
                                  ?.avatarType ??
                                "DEFAULT"
                              }
                              avatarId={
                                roomPlayer
                                  ?.avatarId ??
                                "fox"
                              }
                              avatarPhoto={
                                roomPlayer
                                  ?.avatarPhoto ??
                                null
                              }
                              className={
                                isConnected
                                  ? ""
                                  : "grayscale opacity-45"
                              }
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              {isHost && (
                                <span
                                  aria-label="Hôte"
                                  title="Hôte"
                                >
                                  👑
                                </span>
                              )}

                              <h3
                                className={[
                                  "truncate text-base font-black",
                                  isConnected
                                    ? "text-white"
                                    : "text-zinc-500",
                                ].join(" ")}
                              >
                                {
                                  playerName
                                }
                              </h3>
                            </div>

                            <p className="mt-0.5 text-xs text-zinc-500">
                              {hand.length} carte
                              {hand.length > 1
                                ? "s"
                                : ""}{" "}
                              en main
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                              Gorgées
                            </p>

                            <p className="mt-0.5 text-xl font-black text-yellow-400">
                              🍺 {drinks}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {!isConnected && (
                            <span className="rounded-full border border-zinc-500/30 bg-zinc-500/10 px-3 py-1 text-xs font-black uppercase text-zinc-400">
                              Déconnecté
                            </span>
                          )}

                          {isActive && (
                            <span className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-black uppercase text-zinc-950">
                              {mustRespond
                                ? "Doit répondre"
                                : "Tour actif"}
                            </span>
                          )}

                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-zinc-400">
                            Jokers :{" "}
                            {jokers}
                          </span>
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}