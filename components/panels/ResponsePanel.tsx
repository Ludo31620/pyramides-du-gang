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

import {
  getPlayerName,
} from "@/lib/gameEngine/getPlayerName";

import type {
  GameAction,
} from "@/lib/gameEngine/actions";

import type {
  PlayerGameState,
} from "@/lib/gameEngine/publicTypes";

interface ResponsePanelProps {
  state: PlayerGameState;

  playerNames: string[];

  onDispatch?: (
    action: GameAction
  ) => void;
}

export default function ResponsePanel({
  state,
  playerNames,
  onDispatch,
}: ResponsePanelProps) {
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

  const action =
    state.turn.pendingAction;

  if (!action) {
    return null;
  }

  const giverName =
    getPlayerName(
      playerNames,
      action.giver
    );

  const targetName =
    getPlayerName(
      playerNames,
      action.target
    );

  const giverPlayer =
    roomPlayers[
      action.giver
    ];

  const targetPlayer =
    roomPlayers[
      action.target
    ];

  function believe(): void {
    if (!onDispatch) {
      return;
    }

    onDispatch({
      type: "BELIEVE",
    });
  }

  function doubt(): void {
    if (!onDispatch) {
      return;
    }

    onDispatch({
      type: "DOUBT",
    });
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-900 p-6 sm:p-8">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
        Me crois-tu ?
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 text-center">
          <ProfileAvatar
            size="medium"
            avatarType={
              giverPlayer
                ?.avatarType ??
              "DEFAULT"
            }
            avatarId={
              giverPlayer
                ?.avatarId ??
              "fox"
            }
            avatarPhoto={
              giverPlayer
                ?.avatarPhoto ??
              null
            }
          />

          <p className="mt-3 truncate text-lg font-black text-white">
            {giverName}
          </p>

          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-zinc-500">
            Annonce
          </p>
        </div>

        <div
          aria-hidden="true"
          className="
            text-center
            text-2xl
            font-black
            text-yellow-400
            sm:text-3xl
          "
        >
          →
        </div>

        <div className="rounded-2xl border border-yellow-400/30 bg-yellow-400/5 p-4 text-center">
          <ProfileAvatar
            size="medium"
            avatarType={
              targetPlayer
                ?.avatarType ??
              "DEFAULT"
            }
            avatarId={
              targetPlayer
                ?.avatarId ??
              "fox"
            }
            avatarPhoto={
              targetPlayer
                ?.avatarPhoto ??
              null
            }
          />

          <p className="mt-3 truncate text-lg font-black text-white">
            {targetName}
          </p>

          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-yellow-400">
            Doit répondre
          </p>
        </div>
      </div>

      <p className="mt-6 text-center leading-7 text-zinc-300">
        <span className="font-black text-white">
          {giverName}
        </span>{" "}
        affirme posséder une carte de la
        même valeur que celle révélée dans
        la pyramide.
      </p>

      <p className="mt-4 text-center text-lg font-black text-yellow-400">
        {targetName}, le crois-tu ?
      </p>

      <div className="mt-6 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-6 text-center">
        <p className="text-sm text-zinc-400">
          Gorgées en jeu
        </p>

        <p className="mt-2 text-5xl font-black text-yellow-400">
          {action.drinks}
        </p>

        <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
          gorgée
          {action.drinks > 1
            ? "s"
            : ""}
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={believe}
          disabled={!onDispatch}
          className="
            rounded-2xl
            bg-green-600
            px-6
            py-4
            text-lg
            font-black
            text-white
            transition
            hover:bg-green-500
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          ✅ Je le crois
        </button>

        <button
          type="button"
          onClick={doubt}
          disabled={!onDispatch}
          className="
            rounded-2xl
            bg-red-600
            px-6
            py-4
            text-lg
            font-black
            text-white
            transition
            hover:bg-red-500
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          ❌ Menteur !
        </button>
      </div>

      {!onDispatch && (
        <p className="mt-4 text-center text-xs text-zinc-600">
          Seul le joueur ciblé peut répondre.
        </p>
      )}
    </section>
  );
}