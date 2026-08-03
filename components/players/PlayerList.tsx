"use client";

import {
  useEffect,
  useState,
} from "react";

import ProfileAvatar from "@/components/profile/ProfileAvatar";

import {
  lireSessionPartie,
  type StoredRoomPlayer,
} from "@/lib/gameSession";

import type {
  PlayerGameState,
} from "@/lib/gameEngine/publicTypes";

interface PlayerListProps {
  state: PlayerGameState;
}

export default function PlayerList({
  state,
}: PlayerListProps) {
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
  }, [
    state.players.length,
  ]);

  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-900 p-6 sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
            Membres du gang
          </p>

          <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
            Joueurs
          </h2>
        </div>

        <p className="text-sm text-zinc-500">
          {state.players.length} joueur
          {state.players.length > 1
            ? "s"
            : ""}
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {state.players.map(
          (
            hand,
            playerIndex
          ) => {
            const player =
              roomPlayers[
                playerIndex
              ];

            const pseudo =
              player?.pseudo ??
              `Joueur ${playerIndex + 1}`;

            const isCurrentPlayer =
              state.turn
                .currentPlayer ===
              playerIndex;

            const mustStillPlay =
              state.turn
                .remainingPlayers
                .includes(
                  playerIndex
                );

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
                  player?.id ??
                  playerIndex
                }
                className={[
                  "relative overflow-hidden rounded-2xl border p-5 transition",
                  isCurrentPlayer
                    ? "border-yellow-400/60 bg-yellow-400/10 shadow-[0_0_24px_rgba(250,204,21,0.12)]"
                    : "border-white/10 bg-zinc-950",
                ].join(" ")}
              >
                {isCurrentPlayer && (
                  <div className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.9)]" />
                )}

                <div className="flex items-center gap-4">
                  <ProfileAvatar
                    size="medium"
                    avatarType={
                      player?.avatarType ??
                      "DEFAULT"
                    }
                    avatarId={
                      player?.avatarId ??
                      "fox"
                    }
                    avatarPhoto={
                      player?.avatarPhoto ??
                      null
                    }
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-lg font-black text-white">
                        {pseudo}
                      </h3>

                      {player?.isHost && (
                        <span
                          title="Hôte de la partie"
                          aria-label="Hôte de la partie"
                          className="text-sm"
                        >
                          👑
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-zinc-500">
                      {hand.length} carte
                      {hand.length > 1
                        ? "s"
                        : ""}{" "}
                      en main
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-zinc-900 p-3">
                    <p className="text-xs uppercase tracking-wider text-zinc-500">
                      Gorgées
                    </p>

                    <p className="mt-1 text-xl font-black text-white">
                      {drinks}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-zinc-900 p-3">
                    <p className="text-xs uppercase tracking-wider text-zinc-500">
                      Jokers
                    </p>

                    <p className="mt-1 text-xl font-black text-white">
                      {jokers}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {isCurrentPlayer && (
                    <span className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-black uppercase text-zinc-950">
                      Tour actif
                    </span>
                  )}

                  {mustStillPlay && (
                    <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs font-bold text-blue-300">
                      Doit jouer
                    </span>
                  )}

                  {!mustStillPlay &&
                    state.phase ===
                      "PLAYER_TURN" && (
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-zinc-500">
                        Tour terminé
                      </span>
                    )}
                </div>
              </article>
            );
          }
        )}
      </div>
    </section>
  );
}