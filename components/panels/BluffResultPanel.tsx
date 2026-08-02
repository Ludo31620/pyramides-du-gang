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
  icon: string;
  resultLabel: string;
  panelClasses: string;
  bannerClasses: string;
  accentTextClasses: string;
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
          `${targetName} a cru ${giverName}`,

        description:
          `${targetName} accepte l’annonce et doit boire ` +
          `${drinks} ${drinkLabel}.`,

        icon:
          "🤝",

        resultLabel:
          `${targetName} doit boire`,

        panelClasses:
          "border-yellow-400/35 bg-zinc-900",

        bannerClasses:
          "border-yellow-400/30 bg-yellow-400/10",

        accentTextClasses:
          "text-yellow-400",
      };

    case "TRUTH":
      return {
        eyebrow:
          "Annonce vérifiée",

        title:
          `${giverName} disait vrai !`,

        description:
          `${giverName} possédait bien une carte de la bonne valeur. ` +
          `${punishedPlayerName} doit boire ${drinks} ${drinkLabel}.`,

        icon:
          "✅",

        resultLabel:
          `${punishedPlayerName} doit boire`,

        panelClasses:
          "border-emerald-500/35 bg-zinc-900",

        bannerClasses:
          "border-emerald-500/30 bg-emerald-500/10",

        accentTextClasses:
          "text-emerald-400",
      };

    case "BLUFF":
      return {
        eyebrow:
          "Bluff découvert",

        title:
          `${giverName} bluffait !`,

        description:
          `${giverName} a été démasqué : il ne possédait aucune carte ` +
          `de la bonne valeur.`,

        icon:
          "🚨",

        resultLabel:
          `${punishedPlayerName} doit boire`,

        panelClasses:
          "border-red-500/60 bg-[#211315]",

        bannerClasses:
          "border-red-500/50 bg-red-600/15",

        accentTextClasses:
          "text-red-400",
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

  const drinkLabel =
    result.drinks > 1
      ? "gorgées"
      : "gorgée";

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
    <section
      className={`
        overflow-hidden
        rounded-3xl
        border-2
        p-5
        text-white
        sm:p-8
        ${content.panelClasses}
      `}
    >
      <header className="text-center">
        <div
          aria-hidden="true"
          className="text-5xl"
        >
          {content.icon}
        </div>

        <p
          className={`
            mt-4
            text-xs
            font-black
            uppercase
            tracking-[0.25em]
            ${content.accentTextClasses}
          `}
        >
          {content.eyebrow}
        </p>

        <h2
          className={`
            mt-3
            text-4xl
            font-black
            uppercase
            leading-tight
            tracking-tight
            sm:text-5xl
            ${content.accentTextClasses}
          `}
        >
          {content.title}
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-base font-bold leading-7 text-zinc-200">
          {content.description}
        </p>
      </header>

      {revealedCard && (
        <div className="mt-7">
          <p className="text-center text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
            Carte révélée
          </p>

          <div className="mt-4 flex justify-center">
            <div className="flex h-36 w-28 flex-col items-center justify-center rounded-2xl border-2 border-zinc-300 bg-white text-center shadow-md">
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
                {
                  revealedCard.valeur
                }
              </span>

              <span
                className={
                  revealedCard.couleur ===
                    "♥" ||
                  revealedCard.couleur ===
                    "♦"
                    ? "mt-2 text-4xl text-red-600"
                    : "mt-2 text-4xl text-black"
                }
              >
                {
                  revealedCard.couleur
                }
              </span>
            </div>
          </div>
        </div>
      )}

      <div
        className={`
          mt-7
          rounded-3xl
          border-2
          px-5
          py-7
          text-center
          ${content.bannerClasses}
        `}
      >
        <p className="text-lg font-black uppercase text-white">
          {content.resultLabel}
        </p>

        <p
          className={`
            mt-3
            text-7xl
            font-black
            leading-none
            ${content.accentTextClasses}
          `}
        >
          {result.drinks}
        </p>

        <p
          className={`
            mt-2
            text-xl
            font-black
            uppercase
            ${content.accentTextClasses}
          `}
        >
          {drinkLabel}
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
          min-h-16
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