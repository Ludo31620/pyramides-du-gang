"use client";

import {
  useCallback,
  useState,
} from "react";

import {
  AnimatePresence,
} from "framer-motion";

import {
  RevealAnimation,
} from "@/components/game/animations";

import type {
  Carte,
} from "@/lib/deck";

import type {
  GameAction,
} from "@/lib/gameEngine/actions";

import type {
  GameState,
} from "@/lib/gameEngine/types";

type WaitingGameState =
  GameState & {
    nextCardForReveal?:
      | Carte
      | null;
  };

interface WaitingPanelProps {
  state: WaitingGameState;

  onDispatch?: (
    action: GameAction
  ) => void;
}

interface PendingReveal {
  card: Carte;
  drinks: number;
  animationKey: number;
}

export default function WaitingPanel({
  state,
  onDispatch,
}: WaitingPanelProps) {
  const [
    pendingReveal,
    setPendingReveal,
  ] =
    useState<PendingReveal | null>(
      null
    );

  const firstCard =
    state.progress.revealedCards === 0;

  const remainingCards =
    state.progress.totalCards -
    state.progress.revealedCards;

  function handleReveal(): void {
    if (
      !onDispatch ||
      pendingReveal
    ) {
      return;
    }

    const nextCard =
      state.nextCardForReveal;

    if (!nextCard) {
      console.error(
        "La prochaine carte de la pyramide est introuvable.",
        {
          nextRow:
            state.progress.nextRow,

          nextColumn:
            state.progress.nextColumn,

          progress:
            state.progress,
        }
      );

      return;
    }

    setPendingReveal({
      card: nextCard,

      drinks:
        state.progress.nextRow +
        1,

      animationKey:
        Date.now(),
    });
  }

  const completeReveal =
    useCallback((): void => {
      onDispatch?.({
        type: "REVEAL_CARD",
      });

      setPendingReveal(null);
    }, [
      onDispatch,
    ]);

  return (
    <>
      <AnimatePresence>
        {pendingReveal && (
          <RevealAnimation
            card={
              pendingReveal.card
            }
            drinks={
              pendingReveal.drinks
            }
            animationKey={
              pendingReveal.animationKey
            }
            onComplete={
              completeReveal
            }
          />
        )}
      </AnimatePresence>

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
          disabled={
            !onDispatch ||
            pendingReveal !== null ||
            !state.nextCardForReveal
          }
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
          {pendingReveal
            ? "Révélation..."
            : firstCard
              ? "Révéler la première carte"
              : "Révéler la carte suivante"}
        </button>

        {!onDispatch && (
          <p className="mt-3 text-center text-xs text-zinc-600">
            En attente de l’hôte.
          </p>
        )}
      </section>
    </>
  );
}