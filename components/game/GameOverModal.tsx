"use client";


import GameOverProgress from "./GameOverProgress";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

import ProfileAvatar from "@/components/profile/ProfileAvatar";

import {
  lireSessionPartie,
  type StoredRoomPlayer,
} from "@/lib/gameSession";

import {
  getBluffMaster,
} from "@/lib/gameEngine/getBluffMaster";

import {
  getPlayerName,
} from "@/lib/gameEngine/getPlayerName";

import type {
  PlayerGameState,
} from "@/lib/gameEngine/publicTypes";

import type {
  GameOverSummary,
} from "@/lib/profileProgress";

interface GameOverModalProps {
  state: PlayerGameState;

  playerNames: string[];

  summary:
    GameOverSummary | null;

  onReturnToLobby: () => void;
}

interface Award {
  icon: string;
  title: string;
  playerIndex: number;
  value: number;
  valueLabel: string;
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

function getRankingTitle(
  rankIndex: number,
  successfulBluffs: number
): string {
  if (
    rankIndex === 0 &&
    successfulBluffs > 0
  ) {
    return "Maître du Bluff";
  }

  if (
    rankIndex === 1 &&
    successfulBluffs > 0
  ) {
    return "Bluffeur confirmé";
  }

  if (
    rankIndex === 2 &&
    successfulBluffs > 0
  ) {
    return "Escroc prometteur";
  }

  if (
    successfulBluffs > 0
  ) {
    return "Membre rusé";
  }

  return "Honnête malgré lui";
}

function findMaxPlayerIndex(
  values: number[]
): number | null {
  if (
    values.length === 0
  ) {
    return null;
  }

  let bestIndex = 0;

  for (
    let index = 1;
    index < values.length;
    index += 1
  ) {
    if (
      values[index] >
      values[bestIndex]
    ) {
      bestIndex =
        index;
    }
  }

  return bestIndex;
}

export default function GameOverModal({
  state,
  playerNames,
  summary,
  onReturnToLobby,
}: GameOverModalProps) {


  const [
    roomPlayers,
    setRoomPlayers,
  ] =
    useState<StoredRoomPlayer[]>(
      []
    );

  useEffect(() => {
    const session =
      lireSessionPartie();

    setRoomPlayers(
      session?.players ??
        []
    );
  }, []);

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

  const winnerPlayer =
    winner !== null
      ? roomPlayers[
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

  const awards =
    useMemo(() => {
      const playerStats =
        state.gameStats.players;

      const drinksGiven =
        playerStats.map(
          (
            stats
          ) =>
            stats.drinksGiven
        );

      const drinksReceived =
        state.drinks.map(
          (
            drinks
          ) =>
            drinks ?? 0
        );

      const bluffsAttempted =
        playerStats.map(
          (
            stats
          ) =>
            stats.bluffsAttempted
        );

      const caughtBluffs =
        playerStats.map(
          (
            stats
          ) =>
            stats.caughtBluffs
        );

      const entries:
        Award[] = [];

      const barmanIndex =
        findMaxPlayerIndex(
          drinksGiven
        );

      const spongeIndex =
        findMaxPlayerIndex(
          drinksReceived
        );

      const blufferIndex =
        findMaxPlayerIndex(
          bluffsAttempted
        );

      const inspectorIndex =
        findMaxPlayerIndex(
          caughtBluffs
        );

      if (
        barmanIndex !==
        null
      ) {
        entries.push({
          icon:
            "🍺",

          title:
            "Barman du Gang",

          playerIndex:
            barmanIndex,

          value:
            drinksGiven[
              barmanIndex
            ] ?? 0,

          valueLabel:
            "gorgées données",
        });
      }

      if (
        spongeIndex !==
        null
      ) {
        entries.push({
          icon:
            "🥴",

          title:
            "Éponge officielle",

          playerIndex:
            spongeIndex,

          value:
            drinksReceived[
              spongeIndex
            ] ?? 0,

          valueLabel:
            "gorgées reçues",
        });
      }

      if (
        blufferIndex !==
        null
      ) {
        entries.push({
          icon:
            "🎭",

          title:
            "Menteur compulsif",

          playerIndex:
            blufferIndex,

          value:
            bluffsAttempted[
              blufferIndex
            ] ?? 0,

          valueLabel:
            "bluffs tentés",
        });
      }

      if (
        inspectorIndex !==
        null
      ) {
        entries.push({
          icon:
            "🚨",

          title:
            "Inspecteur du Gang",

          playerIndex:
            inspectorIndex,

          value:
            caughtBluffs[
              inspectorIndex
            ] ?? 0,

          valueLabel:
            "bluffs démasqués",
        });
      }

      return entries;
    }, [
      state.drinks,
      state.gameStats.players,
    ]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Fin de partie"
      className="
        fixed
        inset-0
        z-[9500]
        overflow-y-auto
        bg-black/80
        px-4
        py-6
        backdrop-blur-sm
      "
    >
      <motion.section
        initial={{
          opacity: 0,
          scale: 0.94,
          y: 28,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          duration: 0.38,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
        className="
          relative
          mx-auto
          w-full
          max-w-3xl
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

        <header className="relative text-center">
          <div className="text-5xl">
            🏆
          </div>

          <p className="mt-4 text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
            Fin de partie
          </p>

          <h1 className="mt-2 text-3xl font-black sm:text-5xl">
            La pyramide est terminée
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400">
            Le Gang a parlé. Il reste
            maintenant à distribuer les
            titres officiels, parce que
            l’humiliation mérite un peu
            de cérémonie.
          </p>
        </header>

        <motion.section
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.12,
            duration: 0.35,
          }}
          className="
            relative
            mt-7
            rounded-3xl
            border
            border-yellow-400/25
            bg-yellow-400/5
            p-5
            text-center
            sm:p-7
          "
        >
          {winnerName &&
          winnerStats ? (
            <>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
                👑 Maître du Bluff
              </p>

              <div className="mt-5">
                <ProfileAvatar
                  size="large"
                  avatarType={
                    winnerPlayer
                      ?.avatarType ??
                    "DEFAULT"
                  }
                  avatarId={
                    winnerPlayer
                      ?.avatarId ??
                    "fox"
                  }
                  avatarPhoto={
                    winnerPlayer
                      ?.avatarPhoto ??
                    null
                  }
                />
              </div>

              <h2 className="mt-4 text-3xl font-black text-white sm:text-5xl">
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
                👑 Maître du Bluff
              </p>

              <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                Aucun gagnant
              </h2>

              <p className="mt-3 text-sm text-zinc-400">
                Aucun bluff n’a été
                réussi pendant cette
                partie. Une honnêteté
                presque inquiétante.
              </p>
            </>
          )}
        </motion.section>

        <section className="relative mt-7">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
                Podium
              </p>

              <h3 className="mt-2 text-2xl font-black">
                Classement du Gang
              </h3>
            </div>

            <p className="text-xs text-zinc-500">
              Basé sur les bluffs réussis
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {ranking.map(
              (
                entry,
                rankIndex
              ) => {
                const player =
                  roomPlayers[
                    entry.playerIndex
                  ];

                const playerName =
                  getPlayerName(
                    playerNames,
                    entry.playerIndex
                  );

                const rankingTitle =
                  getRankingTitle(
                    rankIndex,
                    entry.stats
                      .successfulBluffs
                  );

                return (
                  <motion.article
                    key={
                      entry.playerIndex
                    }
                    initial={{
                      opacity: 0,
                      x: -20,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay:
                        0.18 +
                        rankIndex *
                          0.06,

                      duration: 0.3,
                    }}
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

                    <ProfileAvatar
                      size="small"
                      avatarType={
                        player
                          ?.avatarType ??
                        "DEFAULT"
                      }
                      avatarId={
                        player
                          ?.avatarId ??
                        "fox"
                      }
                      avatarPhoto={
                        player
                          ?.avatarPhoto ??
                        null
                      }
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-black text-white">
                        {playerName}
                      </p>

                      <p className="mt-0.5 truncate text-xs font-bold text-zinc-500">
                        {rankingTitle}
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
                  </motion.article>
                );
              }
            )}
          </div>
        </section>

        <section className="relative mt-7">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
            Récompenses
          </p>

          <h3 className="mt-2 text-2xl font-black">
            Les titres de la soirée
          </h3>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {awards.map(
              (
                award,
                awardIndex
              ) => {
                const player =
                  roomPlayers[
                    award.playerIndex
                  ];

                const playerName =
                  getPlayerName(
                    playerNames,
                    award.playerIndex
                  );

                return (
                  <motion.article
                    key={
                      award.title
                    }
                    initial={{
                      opacity: 0,
                      y: 14,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        0.28 +
                        awardIndex *
                          0.06,

                      duration: 0.28,
                    }}
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-2xl
                      border
                      border-white/10
                      bg-zinc-900
                      p-4
                    "
                  >
                    <div
                      aria-hidden="true"
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-black/25
                        text-2xl
                      "
                    >
                      {award.icon}
                    </div>

                    <ProfileAvatar
                      size="small"
                      avatarType={
                        player
                          ?.avatarType ??
                        "DEFAULT"
                      }
                      avatarId={
                        player
                          ?.avatarId ??
                        "fox"
                      }
                      avatarPhoto={
                        player
                          ?.avatarPhoto ??
                        null
                      }
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black text-white">
                        {award.title}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-zinc-500">
                        {playerName}
                      </p>

                      <p className="mt-1 text-xs font-bold text-yellow-400">
                        {award.value}{" "}
                        {award.valueLabel}
                      </p>
                    </div>
                  </motion.article>
                );
              }
            )}
          </div>
        </section>

        <section className="relative mt-7">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
            Totaux
          </p>

          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
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
        </section>

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
