"use client";

import {
  useEffect,
  useState,
} from "react";

import PyramidCard from "@/components/board/PyramidCard";

import PlayerHand from "@/components/players/PlayerHand";

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

const JOKER_DISPLAY_SECONDS =
  15;

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

  const [
    jokerConfirmationOpen,
    setJokerConfirmationOpen,
  ] = useState(false);

  const [
    jokerSecondsLeft,
    setJokerSecondsLeft,
  ] = useState(
    JOKER_DISPLAY_SECONDS
  );

  const currentPlayer =
    state.turn.currentPlayer;

  const viewerPlayerIndex =
    state.viewerPlayerIndex;

  const viewerIsCurrentPlayer =
    viewerPlayerIndex ===
    currentPlayer;

  const currentPlayerName =
    getPlayerName(
      playerNames,
      currentPlayer
    );

  const currentCard =
    state.current.card;

  const drinks =
    state.current.row + 1;

  const remainingJokers =
    state.memory.jokers[
      viewerPlayerIndex
    ] ?? 0;

  const jokerIsActive =
    state.memory.revealedPlayers.includes(
      viewerPlayerIndex
    );

  const viewerCards =
    state.players[
      viewerPlayerIndex
    ] ?? [];

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

  useEffect(() => {
    if (!jokerIsActive) {
      setJokerSecondsLeft(
        JOKER_DISPLAY_SECONDS
      );

      return;
    }

    const timeoutId =
      window.setTimeout(
        () => {
          if (!onDispatch) {
            return;
          }

          onDispatch({
            type:
              "HIDE_MEMORY_JOKER",

            player:
              viewerPlayerIndex,
          });
        },
        JOKER_DISPLAY_SECONDS *
          1000
      );

    const intervalId =
      window.setInterval(
        () => {
          setJokerSecondsLeft(
            (
              currentSeconds
            ) =>
              Math.max(
                0,
                currentSeconds - 1
              )
          );
        },
        1000
      );

    return () => {
      window.clearTimeout(
        timeoutId
      );

      window.clearInterval(
        intervalId
      );
    };
  }, [
    jokerIsActive,
    onDispatch,
    viewerPlayerIndex,
  ]);

  function handleGive(
    target: number
  ): void {
    if (
      !onDispatch ||
      !currentCard ||
      requestPending ||
      jokerIsActive
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
      requestPending ||
      jokerIsActive
    ) {
      return;
    }

    onDispatch({
      type: "PASS",
    });
  }

  function openJokerConfirmation():
    void {
    if (
      !onDispatch ||
      !viewerIsCurrentPlayer ||
      remainingJokers <= 0 ||
      jokerIsActive
    ) {
      return;
    }

    setJokerConfirmationOpen(
      true
    );
  }

  function cancelJoker(): void {
    setJokerConfirmationOpen(
      false
    );
  }

  function confirmJoker(): void {
    if (
      !onDispatch ||
      !viewerIsCurrentPlayer ||
      remainingJokers <= 0 ||
      jokerIsActive
    ) {
      return;
    }

    setJokerConfirmationOpen(
      false
    );

    setJokerSecondsLeft(
      JOKER_DISPLAY_SECONDS
    );

    onDispatch({
      type:
        "USE_MEMORY_JOKER",

      player:
        viewerPlayerIndex,
    });
  }

  return (
    <>
      <section className="relative rounded-3xl border border-white/10 bg-zinc-900 p-6 sm:p-8">
       {viewerIsCurrentPlayer && (
  <button
    type="button"
    onClick={
      openJokerConfirmation
    }
    disabled={
      !onDispatch ||
      remainingJokers <= 0 ||
      requestPending ||
      jokerIsActive
    }
    aria-label={
      remainingJokers > 0
        ? `Utiliser un joker mémoire, ${remainingJokers} restant`
        : "Aucun joker mémoire restant"
    }
    className="
      absolute
      right-4
      top-4
      z-20
      flex
      h-14
      min-w-14
      items-center
      justify-center
      gap-1
      rounded-full
      border
      border-yellow-400/40
      bg-black/70
      px-3
      text-yellow-400
      shadow-lg
      backdrop-blur-sm
      transition
      hover:border-yellow-300
      hover:bg-yellow-400/10
      active:scale-95
      disabled:cursor-not-allowed
      disabled:opacity-40
    "
  >
    <span
      aria-hidden="true"
      className="text-2xl"
    >
      🃏
    </span>

    <span className="text-sm font-black tabular-nums">
      {jokerIsActive
        ? jokerSecondsLeft
        : remainingJokers}
    </span>
  </button>
)}
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

        

        {jokerIsActive && (
          <div className="mt-6 rounded-2xl border border-yellow-400/30 bg-black/30 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-black text-yellow-400">
                Tes cartes
              </p>

              <div className="rounded-full bg-yellow-400 px-3 py-1 text-sm font-black text-black">
                {jokerSecondsLeft}s
              </div>
            </div>

            <div className="mt-4">
              <PlayerHand
                cards={
                  viewerCards
                }
              />
            </div>
          </div>
        )}

        {requestError && (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-red-900 bg-red-950/60 p-4 text-sm font-semibold text-red-300"
          >
            {requestError}
          </div>
        )}

        {!jokerIsActive && (
          <>
            <div className="mt-8">
              <p className="text-sm font-black uppercase tracking-wide text-white">
                J&apos;annonce avoir la
                même valeur
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                Choisis la personne à
                qui tu fais cette
                annonce.
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
          </>
        )}

        {!onDispatch && (
          <p className="mt-3 text-center text-xs text-zinc-600">
            Actions désactivées sur
            cette page de test.
          </p>
        )}
      </section>

      {jokerConfirmationOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-yellow-400/30 bg-zinc-900 p-6 shadow-2xl">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
              Joker mémoire
            </p>

            <h3 className="mt-3 text-2xl font-black text-white">
              Tu veux revoir tes
              cartes ?
            </h3>

            <p className="mt-4 leading-7 text-zinc-300">
              Si tu utilises ce joker,
              tu devras boire
              <strong className="text-yellow-400">
                {" "}1 gorgée
              </strong>
              .
            </p>

            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={
                  confirmJoker
                }
                className="min-h-14 rounded-2xl bg-yellow-400 px-5 py-4 font-black text-black transition hover:bg-yellow-300 active:scale-[0.98]"
              >
                OK, je bois
              </button>

              <button
                type="button"
                onClick={
                  cancelJoker
                }
                className="min-h-14 rounded-2xl border border-white/10 bg-zinc-800 px-5 py-4 font-black text-white transition hover:bg-zinc-700 active:scale-[0.98]"
              >
                Non, c&apos;est bon,
                ma mémoire est revenue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}