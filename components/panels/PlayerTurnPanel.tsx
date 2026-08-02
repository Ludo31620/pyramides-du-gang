"use client";

import {
  useState,
} from "react";

import PyramidCard from "@/components/board/PyramidCard";

import {
  getPlayerName,
} from "@/lib/gameEngine/getPlayerName";

import {
  obtenirSocket,
} from "@/lib/socket";

import type {
  GameAction,
} from "@/lib/gameEngine/actions";

import type {
  PlayerGameState,
} from "@/lib/gameEngine/publicTypes";

interface PlayerTurnPanelProps {
  state: PlayerGameState;

  playerNames: string[];

  onDispatch?: (
    action: GameAction
  ) => void;
}

type BluffAnimationRequestResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

export default function PlayerTurnPanel({
  state,
  playerNames,
  onDispatch,
}: PlayerTurnPanelProps) {
  const [
    requestPending,
    setRequestPending,
  ] = useState(false);

  const [
    requestError,
    setRequestError,
  ] =
    useState<string | null>(
      null
    );

  const currentPlayer =
    state.turn.currentPlayer;

  const currentPlayerName =
    getPlayerName(
      playerNames,
      currentPlayer
    );

  const currentCard =
    state.current.card;

  const drinks =
    state.current.row + 1;

  const possibleTargets =
    state.players
      .map(
        (
          _,
          playerIndex
        ) => playerIndex
      )
      .filter(
        (playerIndex) =>
          playerIndex !==
          currentPlayer
      );

  function handleGive(
    target: number
  ): void {
    if (
      !onDispatch ||
      !currentCard ||
      requestPending
    ) {
      return;
    }

    const socket =
      obtenirSocket();

    if (!socket.connected) {
      setRequestError(
        "La connexion au serveur est interrompue."
      );

      return;
    }

    setRequestPending(
      true
    );

    setRequestError(
      null
    );

    socket.emit(
      "game:request-bluff-animation",
      {
        target,
      },
      (
        result:
          BluffAnimationRequestResult
      ) => {
        if (result.success) {
          return;
        }

        setRequestPending(
          false
        );

        setRequestError(
          result.error
        );
      }
    );
  }

  function handlePass(): void {
    if (
      !onDispatch ||
      requestPending
    ) {
      return;
    }

    onDispatch({
      type: "PASS",
    });
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-900 p-6 sm:p-8">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
        Tour actif
      </p>

      <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
        {currentPlayerName}
      </h2>

      <p className="mt-3 text-sm leading-6 text-zinc-400">
        Tu peux annoncer que tu
        possèdes une carte de la même
        valeur que celle révélée, ou
        passer ton tour.
      </p>

      <div className="mt-6 flex flex-col items-center">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
          Carte révélée
        </p>

        {currentCard ? (
          <PyramidCard
            card={currentCard}
            hidden={false}
            size="large"
            active
          />
        ) : (
          <div className="flex h-40 w-28 items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 px-3 text-center text-sm font-bold text-zinc-500">
            Aucune carte
          </div>
        )}
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

      {requestError && (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-red-900 bg-red-950/60 p-4 text-sm font-semibold text-red-300"
        >
          {requestError}
        </div>
      )}

      <div className="mt-8">
        <p className="text-sm font-black uppercase tracking-wide text-white">
          J&apos;annonce avoir la même
          valeur
        </p>

        <p className="mt-1 text-sm text-zinc-500">
          Choisis la personne à qui tu
          fais cette annonce.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {possibleTargets.map(
            (target) => {
              const targetName =
                getPlayerName(
                  playerNames,
                  target
                );

              return (
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
                    requestPending
                  }
                  className="
                    rounded-2xl
                    border
                    border-yellow-400/30
                    bg-yellow-400/10
                    px-5
                    py-4
                    text-left
                    transition
                    hover:border-yellow-300
                    hover:bg-yellow-400
                    hover:text-black
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  <span className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Donner à
                  </span>

                  <span className="mt-1 block text-lg font-black text-yellow-400">
                    {requestPending
                      ? "Synchronisation..."
                      : targetName}
                  </span>
                </button>
              );
            }
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={
          handlePass
        }
        disabled={
          !onDispatch ||
          requestPending
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
  );
}