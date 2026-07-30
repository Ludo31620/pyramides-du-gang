"use client";

import {
  useCallback,
  useState,
} from "react";

import {
  AnimatePresence,
} from "framer-motion";

import {
  BluffAnnouncementAnimation,
} from "@/components/game/animations";

import type {
  GameAction,
} from "@/lib/gameEngine/actions";

import type {
  GameState,
} from "@/lib/gameEngine/types";

interface PlayerTurnPanelProps {
  state: GameState;

  onDispatch?: (
    action: GameAction
  ) => void;
}

interface PendingAnnouncement {
  target: number;
  animationKey: number;
}

export default function PlayerTurnPanel({
  state,
  onDispatch,
}: PlayerTurnPanelProps) {
  const [
    pendingAnnouncement,
    setPendingAnnouncement,
  ] =
    useState<PendingAnnouncement | null>(
      null
    );

  const currentPlayer =
    state.turn.currentPlayer;

  const currentCard =
    state.current.card;

  const drinks =
    state.current.row + 1;

  const possibleTargets =
    state.players
      .map((_, player) => player)
      .filter(
        (player) =>
          player !== currentPlayer
      );

  function handleGive(
    target: number
  ): void {
    if (
      !onDispatch ||
      !currentCard ||
      pendingAnnouncement
    ) {
      return;
    }

    /*
     * Le moteur ne reçoit pas encore GIVE.
     *
     * On garde donc le jeu en PLAYER_TURN
     * pendant toute la cinématique.
     */
    setPendingAnnouncement({
      target,
      animationKey:
        Date.now(),
    });
  }

  const completeAnnouncement =
    useCallback((): void => {
      if (
        !pendingAnnouncement
      ) {
        return;
      }

      const target =
        pendingAnnouncement.target;

      /*
       * L’animation est terminée.
       * On crée maintenant la pendingAction
       * dans le moteur.
       */
      onDispatch?.({
        type: "GIVE",
        target,
      });

      setPendingAnnouncement(
        null
      );
    }, [
      onDispatch,
      pendingAnnouncement,
    ]);

  function handlePass(): void {
    if (
      !onDispatch ||
      pendingAnnouncement
    ) {
      return;
    }

    onDispatch({
      type: "PASS",
    });
  }

  return (
    <>
      <AnimatePresence>
        {pendingAnnouncement && (
          <BluffAnnouncementAnimation
            giver={
              currentPlayer
            }
            target={
              pendingAnnouncement.target
            }
            drinks={drinks}
            animationKey={
              pendingAnnouncement.animationKey
            }
            onComplete={
              completeAnnouncement
            }
          />
        )}
      </AnimatePresence>

      <section className="rounded-3xl border border-white/10 bg-zinc-900 p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
          Tour actif
        </p>

        <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
          Joueur {currentPlayer + 1}
        </h2>

        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Tu peux annoncer que tu
          possèdes une carte de même
          valeur ou passer ton tour.
        </p>

        <div className="mt-6 flex flex-col items-center">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
            Carte révélée
          </p>

          <div className="flex h-36 w-28 flex-col items-center justify-center rounded-2xl border-2 border-zinc-300 bg-white shadow-xl">
            {currentCard ? (
              <span
                className={
                  currentCard.couleur ===
                    "♥" ||
                  currentCard.couleur ===
                    "♦"
                    ? "text-3xl font-black text-red-600"
                    : "text-3xl font-black text-black"
                }
              >
                {currentCard.valeur}
                {currentCard.couleur}
              </span>
            ) : (
              <span className="px-2 text-center text-sm font-bold text-zinc-500">
                Aucune carte
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-4 text-center">
          <p className="text-sm text-zinc-400">
            Valeur de cette ligne
          </p>

          <p className="mt-1 text-2xl font-black text-yellow-400">
            {drinks} gorgée
            {drinks > 1
              ? "s"
              : ""}
          </p>
        </div>

        <div className="mt-8">
          <p className="text-sm font-black uppercase tracking-wide text-white">
            Je bluffe
          </p>

          <p className="mt-1 text-sm text-zinc-500">
            Choisis le joueur qui
            recevra l’annonce.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {possibleTargets.map(
              (target) => (
                <button
                  key={target}
                  type="button"
                  onClick={() =>
                    handleGive(
                      target
                    )
                  }
                  disabled={
                    !onDispatch ||
                    !currentCard ||
                    pendingAnnouncement !==
                      null
                  }
                  className="
                    rounded-2xl
                    border
                    border-yellow-400/30
                    bg-yellow-400/10
                    px-5
                    py-4
                    text-base
                    font-black
                    text-yellow-400
                    transition
                    hover:border-yellow-300
                    hover:bg-yellow-400
                    hover:text-black
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  Donner à Joueur{" "}
                  {target + 1}
                </button>
              )
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handlePass}
          disabled={
            !onDispatch ||
            pendingAnnouncement !==
              null
          }
          className="
            mt-6
            w-full
            rounded-2xl
            border
            border-white/10
            bg-zinc-800
            px-6
            py-4
            text-base
            font-black
            uppercase
            tracking-wide
            text-white
            transition
            hover:bg-zinc-700
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          Passer mon tour
        </button>

        {!onDispatch && (
          <p className="mt-3 text-center text-xs text-zinc-600">
            Actions désactivées sur
            cette page de test.
          </p>
        )}
      </section>
    </>
  );
}