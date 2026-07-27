"use client";

import type {
  GameAction,
} from "@/lib/gameEngine/actions";

import type {
  BluffOutcome,
  GameState,
} from "@/lib/gameEngine/types";

interface BluffResultPanelProps {
  state: GameState;

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
  giver: number,
  target: number,
  punishedPlayer: number,
  drinks: number
): ResultContent {
  switch (outcome) {
    case "BELIEVED":
      return {
        eyebrow: "Annonce acceptée",
        title: `Joueur ${target + 1} boit`,
        description:
          `Le joueur ${target + 1} a cru le joueur ` +
          `${giver + 1} et reçoit ${drinks} gorgée` +
          `${drinks > 1 ? "s" : ""}.`,
      };

    case "TRUTH":
      return {
        eyebrow: "Annonce vérifiée",
        title: "Ce n’était pas un bluff",
        description:
          `Le joueur ${giver + 1} possédait bien une carte ` +
          `de la bonne valeur. Le joueur ${punishedPlayer + 1} ` +
          `reçoit ${drinks} gorgée${drinks > 1 ? "s" : ""}.`,
      };

    case "BLUFF":
      return {
        eyebrow: "Bluff découvert",
        title: "Menteur !",
        description:
          `Le joueur ${giver + 1} ne possédait aucune carte ` +
          `de la bonne valeur. Le joueur ${punishedPlayer + 1} ` +
          `reçoit ${drinks} gorgée${drinks > 1 ? "s" : ""}.`,
      };

    default: {
      const exhaustiveCheck: never =
        outcome;

      throw new Error(
        `Résultat de bluff inconnu : ${exhaustiveCheck}`
      );
    }
  }
}

export default function BluffResultPanel({
  state,
  onDispatch,
}: BluffResultPanelProps) {
  const result =
    state.bluffResult;

  if (!result) {
    return (
      <section className="rounded-3xl border border-red-500/30 bg-zinc-900 p-6 sm:p-8">
        <p className="text-sm font-bold text-red-400">
          Aucun résultat de bluff n’est disponible.
        </p>
      </section>
    );
  }

  const content =
    getResultContent(
      result.outcome,
      result.giver,
      result.target,
      result.punishedPlayer,
      result.drinks
    );

  const revealedCard =
    result.revealedCard;

  function handleContinue(): void {
    if (!onDispatch) {
      return;
    }

    onDispatch({
      type: "CONTINUE_AFTER_BLUFF",
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
                {revealedCard.couleur}
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
          Joueur {result.punishedPlayer + 1}
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
        onClick={handleContinue}
        disabled={!onDispatch}
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
          Action désactivée sur cette page de test.
        </p>
      )}
    </section>
  );
}