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

      <section
        className="
          relative
          rounded-3xl
          border
          border-white/10
          bg-zinc-900
          p-4
          sm:p-5
        "
      >
        <div
          className="
            absolute
            right-4
            top-4
            z-20
            rounded-full
            border
            border-yellow-400/40
            bg-black/70
            px-4
            py-2
            text-sm
            font-black
            tabular-nums
            text-white
            shadow-lg
            backdrop-blur-sm
          "
        >
          🃏{" "}
          {
            state.progress
              .revealedCards
          }
          {" / "}
          {
            state.progress
              .totalCards
          }
        </div>

        {revealError && (
          <div
            role="alert"
            className="mt-16 rounded-2xl border border-red-900 bg-red-950/60 p-4 text-sm font-semibold text-red-300"
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
            mt-16
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