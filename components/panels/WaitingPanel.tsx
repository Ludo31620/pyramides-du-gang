"use client";

import type {
  GameAction,
} from "@/lib/gameEngine/actions";

import type {
  GameState,
} from "@/lib/gameEngine/types";

interface WaitingPanelProps {
  state: GameState;

  onDispatch?: (
    action: GameAction
  ) => void;
}

export default function WaitingPanel({
  state,
  onDispatch,
}: WaitingPanelProps) {
  const firstCard =
    state.progress.revealedCards === 0;

  const remainingCards =
    state.progress.totalCards -
    state.progress.revealedCards;

  function handleReveal(): void {
    if (!onDispatch) {
      return;
    }

    onDispatch({
      type: "REVEAL_CARD",
    });
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-900 p-6 sm:p-8">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
        Pyramide
      </p>

      <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
        {firstCard
          ? "La pyramide commence"
          : "Prêt pour la prochaine carte"}
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
        {firstCard
          ? "Les cartes ont été mémorisées. Révèle maintenant la première carte de la pyramide."
          : "Tous les joueurs ont terminé leur action. La prochaine carte peut maintenant être révélée."}
      </p>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
        <p className="text-sm text-zinc-400">
          Progression
        </p>

        <p className="mt-1 text-lg font-black text-white">
          {state.progress.revealedCards}
          {" / "}
          {state.progress.totalCards}
          {" cartes révélées"}
        </p>

        <p className="mt-1 text-sm text-zinc-500">
          {remainingCards}
          {" carte"}
          {remainingCards > 1
            ? "s"
            : ""}
          {" restante"}
          {remainingCards > 1
            ? "s"
            : ""}
        </p>
      </div>

      <button
        type="button"
        onClick={handleReveal}
        disabled={!onDispatch}
        className="
          mt-6
          w-full
          rounded-2xl
          bg-yellow-400
          px-6
          py-4
          text-base
          font-black
          uppercase
          tracking-wide
          text-black
          transition
          hover:bg-yellow-300
          active:scale-[0.98]
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        {firstCard
          ? "Révéler la première carte"
          : "Révéler la carte suivante"}
      </button>

      {!onDispatch && (
        <p className="mt-3 text-center text-xs text-zinc-600">
          Action désactivée sur cette page de test.
        </p>
      )}
    </section>
  );
}