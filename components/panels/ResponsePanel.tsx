"use client";

import type {
  GameAction,
} from "@/lib/gameEngine/actions";

import type {
  GameState,
} from "@/lib/gameEngine/types";

interface ResponsePanelProps {
  state: GameState;

  onDispatch?: (
    action: GameAction
  ) => void;
}

export default function ResponsePanel({
  state,
  onDispatch,
}: ResponsePanelProps) {
  const action =
    state.turn.pendingAction;

  if (!action) {
    return null;
  }

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
        Bluff
      </p>

      <h2 className="mt-2 text-2xl font-black text-white">
        Joueur {action.target + 1}
      </h2>

      <p className="mt-4 text-zinc-300 leading-7">
        Le joueur{" "}
        <span className="font-black">
          {action.giver + 1}
        </span>{" "}
        affirme posséder une carte de la même valeur que celle de la pyramide.
      </p>

      <div className="mt-6 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-6 text-center">

        <p className="text-sm text-zinc-400">
          Gorgées annoncées
        </p>

        <p className="mt-2 text-5xl font-black text-yellow-400">
          {action.drinks}
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
            disabled:opacity-40
          "
        >
          🍺 Je bois
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
            disabled:opacity-40
          "
        >
          ❗ Menteur !
        </button>

      </div>

    </section>
  );
}