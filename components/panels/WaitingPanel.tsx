"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  AnimatePresence,
} from "framer-motion";

import {
  RevealAnimation,
} from "@/components/game/animations";

import {
  obtenirSocket,
} from "@/lib/socket";

import type {
  Carte,
} from "@/lib/deck";

import type {
  GameAction,
} from "@/lib/gameEngine/actions";

import type {
  PlayerGameState,
} from "@/lib/gameEngine/publicTypes";

interface WaitingPanelProps {
  state: PlayerGameState;

  onDispatch?: (
    action: GameAction
  ) => void;
}

interface PendingReveal {
  card: Carte;
  drinks: number;
  animationKey: number;
}

interface RevealAnimationPayload {
  card: Carte;
  drinks: number;
  animationKey: number;
}

type RevealRequestResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

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

  const [
    requestPending,
    setRequestPending,
  ] = useState(false);

  const [
    revealError,
    setRevealError,
  ] =
    useState<string | null>(
      null
    );

  const firstCard =
    state.progress.revealedCards ===
    0;

  const remainingCards =
    state.progress.totalCards -
    state.progress.revealedCards;

  useEffect(() => {
    const socket =
      obtenirSocket();

    function handleRevealAnimation(
      payload:
        RevealAnimationPayload
    ): void {
      if (
        !payload ||
        !payload.card ||
        !Number.isFinite(
          payload.drinks
        ) ||
        !Number.isFinite(
          payload.animationKey
        )
      ) {
        return;
      }

      setPendingReveal({
        card: {
          ...payload.card,
        },

        drinks:
          payload.drinks,

        animationKey:
          payload.animationKey,
      });

      setRequestPending(
        false
      );

      setRevealError(
        null
      );
    }

    socket.on(
      "game:reveal-animation",
      handleRevealAnimation
    );

    return () => {
      socket.off(
        "game:reveal-animation",
        handleRevealAnimation
      );
    };
  }, []);

  function handleReveal(): void {
    if (
      !onDispatch ||
      pendingReveal ||
      requestPending
    ) {
      return;
    }

    setRequestPending(
      true
    );

    setRevealError(
      null
    );

    const socket =
      obtenirSocket();

    if (!socket.connected) {
      setRequestPending(
        false
      );

      setRevealError(
        "La connexion au serveur est interrompue."
      );

      return;
    }

    socket.emit(
      "game:request-reveal-animation",
      (
        result:
          RevealRequestResult
      ) => {
        if (
          result.success
        ) {
          return;
        }

        setRequestPending(
          false
        );

        setRevealError(
          result.error
        );
      }
    );
  }

  const completeReveal =
    useCallback((): void => {
      /*
       * Seul l’hôte possède onDispatch
       * pendant la phase WAITING.
       *
       * Les autres joueurs ferment simplement
       * leur animation sans envoyer d’action.
       */
      if (onDispatch) {
        onDispatch({
          type: "REVEAL_CARD",
        });
      }

      setPendingReveal(
        null
      );

      setRequestPending(
        false
      );
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
            {
              state.progress
                .revealedCards
            }
            {" / "}
            {
              state.progress
                .totalCards
            }
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

        {revealError && (
          <div
            role="alert"
            className="mt-5 rounded-2xl border border-red-900 bg-red-950/60 p-4 text-sm font-semibold text-red-300"
          >
            {revealError}
          </div>
        )}

        <button
          type="button"
          onClick={
            handleReveal
          }
          disabled={
            !onDispatch ||
            pendingReveal !==
              null ||
            requestPending ||
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
            : requestPending
              ? "Synchronisation..."
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