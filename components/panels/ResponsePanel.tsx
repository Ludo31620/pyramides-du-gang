"use client";

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

      <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
        {targetName}
      </h2>

      <p className="mt-4 leading-7 text-zinc-300">
        <span className="font-black text-white">
          {giverName}
        </span>{" "}
        affirme posséder une carte de la
        même valeur que celle révélée dans
        la pyramide.
      </p>

      <p className="mt-4 text-lg font-black text-yellow-400">
        Le crois-tu ?
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