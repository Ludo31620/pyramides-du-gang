"use client";

import {
  useMemo,
} from "react";

import {
  motion,
} from "framer-motion";

import {
  getBluffMaster,
} from "@/lib/gameEngine/getBluffMaster";

import {
  getPlayerName,
} from "@/lib/gameEngine/getPlayerName";

import type {
  PlayerGameState,
} from "@/lib/gameEngine/publicTypes";

interface GameOverModalProps {
  state: PlayerGameState;
  playerNames: string[];

  onReturnToLobby: () => void;
}

const WINNER_MESSAGES = [
  "Ils t’ont tous cru.",
  "Impossible de savoir quand tu mentais.",
  "Tes mensonges sont passés crème.",
  "Personne ne t’a vu venir.",
  "Tu as joué avec leurs nerfs.",
] as const;

function getRankIcon(
  rankIndex: number
): string {
  switch (rankIndex) {
    case 0:
      return "🥇";

    case 1:
      return "🥈";

    case 2:
      return "🥉";

    default:
      return `${rankIndex + 1}.`;
  }
}

export default function GameOverModal({
  state,
  playerNames,
  onReturnToLobby,
}: GameOverModalProps) {
  const {
    winner,
    ranking,
  } =
    getBluffMaster(
      state.gameStats
    );

  const winnerName =
    winner !== null
      ? getPlayerName(
          playerNames,
          winner
        )
      : null;

  const winnerStats =
    winner !== null
      ? state.gameStats
          .players[
            winner
          ]
      : null;

  const winnerMessage =
    useMemo(() => {
      const index =
        Math.floor(
          Math.random() *
            WINNER_MESSAGES.length
        );

      return (
        WINNER_MESSAGES[
          index
        ] ??
        WINNER_MESSAGES[0]
      );
    }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Fin de partie"
      className="
        fixed
        inset-0
        z-[9500]
        flex
        items-center
        justify-center
        overflow-y-auto
        bg-black/75
        px-4
        py-6
        backdrop-blur-sm
      "
    >
      <motion.section
        initial={{
          opacity: 0,
          scale: 0.92,
          y: 30,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          duration: 0.35,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
        className="
          relative
          w-full
          max-w-2xl
          overflow-hidden
          rounded-[2rem]
          border
          border-yellow-400/30
          bg-zinc-950
          p-5
          text-white
          shadow-[0_0_80px_rgba(250,204,21,0.15)]
          sm:p-8
        "
      >
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-x-10
            top-[-5rem]
            h-40
            rounded-full
            bg-yellow-400/15
            blur-3xl
          "
        />

        <div className="relative text-center">
          <div className="text-5xl">
            🏆
          </div>

          <p className="mt-4 text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
            Fin de partie
          </p>

          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            Partie terminée !
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Toutes les cartes de la
            pyramide ont été révélées.
          </p>
        </div>

        <div className="relative mt-7 rounded-3xl border border-yellow-400/20 bg-yellow-400/5 p-5 text-center sm:p-7">
          {winnerName &&
          winnerStats ? (
            <>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
                Maître du Bluff
              </p>

              <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">
                {winnerName}
              </h2>

              <p className="mt-3 text-lg font-black text-yellow-400">
                {
                  winnerStats
                    .successfulBluffs
                }{" "}
                bluff
                {winnerStats
                  .successfulBluffs >
                1
                  ? "s"
                  : ""}{" "}
                réussi
                {winnerStats
                  .successfulBluffs >
                1
                  ? "s"
                  : ""}
              </p>

              <p className="mt-4 text-sm italic text-zinc-400">
                “{winnerMessage}”
              </p>
            </>
          ) : (
            <>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
                Maître du Bluff
              </p>

              <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                Aucun gagnant
              </h2>

              <p className="mt-3 text-sm text-zinc-400">
                Aucun bluff n’a été
                réussi pendant cette
                partie.
              </p>
            </>
          )}
        </div>

        <div className="relative mt-6">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400">
            Classement
          </h3>

          <div className="mt-3 space-y-3">
            {ranking.map(
              (
                entry,
                rankIndex
              ) => {
                const playerName =
                  getPlayerName(
                    playerNames,
                    entry.playerIndex
                  );

                return (
                  <div
                    key={
                      entry.playerIndex
                    }
                    className={[
                      "flex items-center gap-3 rounded-2xl border px-4 py-3",
                      rankIndex === 0 &&
                      winner !== null
                        ? "border-yellow-400/30 bg-yellow-400/10"
                        : "border-white/10 bg-zinc-900",
                    ].join(" ")}
                  >
                    <div className="w-8 text-center text-lg font-black">
                      {getRankIcon(
                        rankIndex
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-black text-white">
                        {
                          playerName
                        }
                      </p>

                      <p className="mt-0.5 text-xs text-zinc-500">
                        {
                          entry.stats
                            .bluffsAttempted
                        }{" "}
                        bluff
                        {entry.stats
                          .bluffsAttempted >
                        1
                          ? "s"
                          : ""}{" "}
                        tenté
                        {entry.stats
                          .bluffsAttempted >
                        1
                          ? "s"
                          : ""}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-black text-yellow-400">
                        {
                          entry.stats
                            .successfulBluffs
                        }
                      </p>

                      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        réussis
                      </p>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        <div className="relative mt-6 grid gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-zinc-900 p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Annonces
            </p>

            <p className="mt-2 text-2xl font-black">
              {
                state.gameStats
                  .claimsMade
              }
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-900 p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Bluffs
            </p>

            <p className="mt-2 text-2xl font-black">
              {
                state.gameStats
                  .bluffsAttempted
              }
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-900 p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Réussis
            </p>

            <p className="mt-2 text-2xl font-black text-green-400">
              {
                state.gameStats
                  .successfulBluffs
              }
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-900 p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Démasqués
            </p>

            <p className="mt-2 text-2xl font-black text-red-400">
              {
                state.gameStats
                  .caughtBluffs
              }
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={
            onReturnToLobby
          }
          className="
            relative
            mt-7
            min-h-14
            w-full
            rounded-2xl
            bg-yellow-400
            px-6
            py-4
            font-black
            uppercase
            tracking-wide
            text-zinc-950
            transition
            hover:bg-yellow-300
            active:scale-[0.98]
          "
        >
          Retour au lobby
        </button>

        <p className="relative mt-3 text-center text-xs text-zinc-600">
          Tous les joueurs retourneront
          ensemble dans le salon.
        </p>
      </motion.section>
    </div>
  );
}