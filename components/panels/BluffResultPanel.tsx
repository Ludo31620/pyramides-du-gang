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

import type {
  BluffOutcome,
} from "@/lib/gameEngine/types";

interface BluffResultPanelProps {
  state: PlayerGameState;

  playerNames: string[];

  onDispatch?: (
    action: GameAction
  ) => void;
}

interface ResultContent {
  eyebrow: string;
  title: string;
  description: string;
}

function getResultContent(
  outcome: BluffOutcome,
  giverName: string,
  targetName: string,
  punishedPlayerName: string,
  drinks: number
): ResultContent {
  const drinkLabel =
    drinks > 1
      ? "gorgées"
      : "gorgée";

  switch (outcome) {
    case "BELIEVED":
      return {
        eyebrow:
          "Annonce acceptée",

        title:
          `${targetName} boit`,

        description:
          `${targetName} a cru ${giverName} et reçoit ` +
          `${drinks} ${drinkLabel}.`,
      };

    case "TRUTH":
      return {
        eyebrow:
          "Annonce vérifiée",

        title:
          "Il disait vrai",

        description:
          `${giverName} possédait bien une carte de la bonne valeur. ` +
          `${punishedPlayerName} reçoit ${drinks} ${drinkLabel}.`,
      };

    case "BLUFF":
      return {
        eyebrow:
          "Bluff découvert",

        title:
          "Menteur !",

        description:
          `${giverName} ne possédait aucune carte de la bonne valeur. ` +
          `${punishedPlayerName} reçoit ${drinks} ${drinkLabel}.`,
      };

    default: {
      const exhaustiveCheck:
        never =
        outcome;

      throw new Error(
        `Résultat de bluff inconnu : ${exhaustiveCheck}`
      );
    }
  }
}

export default function BluffResultPanel({
  state,
  playerNames,
  onDispatch,
}: BluffResultPanelProps) {
  const result =
    state.bluffResult;

  if (!result) {
    return (
      <section className="rounded-3xl border border-red-500/30 bg-zinc-900 p-6 sm:p-8">
        <p className="text-sm font-bold text-red-400">
          Aucun résultat de bluff
          n’est disponible.
        </p>
      </section>
    );
  }

  const giverName =
    getPlayerName(
      playerNames,
      result.giver
    );

  const targetName =
    getPlayerName(
      playerNames,
      result.target
    );

  const punishedPlayerName =
    getPlayerName(
      playerNames,
      result.punishedPlayer
    );

  const content =
    getResultContent(
      result.outcome,
      giverName,
      targetName,
      punishedPlayerName,
      result.drinks
    );

  const revealedCard =
    result.revealedCard;

  function handleContinue():
    void {
    if (!onDispatch) {
      return;
    }

    onDispatch({
      type:
        "CONTINUE_AFTER_BLUFF",
    });
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-900 p-6 sm:p-8">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
        {content.eyebrow}
      </p>

      <h2 className="mt-2 text-3xl font-black text-white">
        {content.title}
      </h2>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300">
        {content.description}
      </p>

      {revealedCard && (
        <div className="mt-6">
          <p className="text-center text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
            Carte révélée
          </p>

          <div className="mt-4 flex justify-center">
            <div className="flex h-36 w-28 items-center justify-center rounded-2xl border-2 border-zinc-300 bg-white shadow-xl">
              <span
                className={
                  revealedCard.couleur ===
                    "♥" ||
                  revealedCard.couleur ===
                    "♦"
                    ? "text-3xl font-black text-red-600"
                    : "text-3xl font-black text-black"
                }
              >
                {revealedCard.valeur}
                {
                  revealedCard.couleur
                }
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-6 text-center">
        <p className="text-sm text-zinc-400">
          Joueur sanctionné
        </p>

        <p className="mt-1 text-xl font-black text-white">
          {punishedPlayerName}
        </p>

        <p className="mt-4 text-sm text-zinc-400">
          Gorgées
        </p>

        <p className="mt-1 text-5xl font-black text-yellow-400">
          {result.drinks}
        </p>
      </div>

      <button
        type="button"
        onClick={
          handleContinue
        }
        disabled={
          !onDispatch
        }
        className="
          mt-8
          w-full
          rounded-2xl
          bg-yellow-400
          px-6
          py-4
          text-lg
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
        Continuer
      </button>

      {!onDispatch && (
        <p className="mt-3 text-center text-xs text-zinc-600">
          Action désactivée sur
          cette page de test.
        </p>
      )}
    </section>
  );
}