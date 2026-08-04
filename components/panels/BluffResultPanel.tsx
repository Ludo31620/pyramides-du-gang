"use client";

import {
  useEffect,
  useRef,
} from "react";

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
  panelClasses: string;
  accentTextClasses: string;
}

const AUTO_CONTINUE_DELAY_MS =
  3000;

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
          `${targetName} accepte de boire ${drinks} ${drinkLabel}.`,

        icon:
          "🤝",

        panelClasses:
          "border-yellow-400/40 bg-zinc-950/95 shadow-[0_0_45px_rgba(250,204,21,0.16)]",

        accentTextClasses:
          "text-yellow-400",
      };

    case "TRUTH":
      return {
        eyebrow:
          "Annonce vérifiée",

        title:
          `${giverName} disait vrai`,

        description:
          `${punishedPlayerName} doit boire ${drinks} ${drinkLabel}.`,

        icon:
          "✅",

        panelClasses:
          "border-emerald-400/40 bg-zinc-950/95 shadow-[0_0_45px_rgba(52,211,153,0.16)]",

        accentTextClasses:
          "text-emerald-400",
      };

    case "BLUFF":
      return {
        eyebrow:
          "Bluff découvert",

        title:
          `${giverName} bluffait`,

        description:
          `${punishedPlayerName} doit boire ${drinks} ${drinkLabel}.`,

        icon:
          "🚨",

        panelClasses:
          "border-red-500/45 bg-zinc-950/95 shadow-[0_0_45px_rgba(239,68,68,0.18)]",

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
  const onDispatchRef =
    useRef(onDispatch);

  useEffect(() => {
    onDispatchRef.current =
      onDispatch;
  }, [
    onDispatch,
  ]);

  const result =
    state.bluffResult;

  useEffect(() => {
    if (
      !result ||
      !onDispatch
    ) {
      return;
    }

    const timeoutId =
      window.setTimeout(
        () => {
          onDispatchRef.current?.({
            type:
              "CONTINUE_AFTER_BLUFF",
          });
        },
        AUTO_CONTINUE_DELAY_MS
      );

    return () => {
      window.clearTimeout(
        timeoutId
      );
    };
  }, [
    result,
    onDispatch,
  ]);

  if (!result) {
    return (
      <section
        className="
          mx-auto
          w-full
          max-w-md
          rounded-3xl
          border
          border-red-500/30
          bg-zinc-950/95
          p-5
          text-center
        "
      >
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

  return (
    <section
      aria-live="assertive"
      className={`
        mx-auto
        w-full
        max-w-md
        overflow-hidden
        rounded-[2rem]
        border
        px-5
        py-7
        text-center
        text-white
        backdrop-blur-md
        sm:px-7
        sm:py-8
        ${content.panelClasses}
      `}
    >
      <div
        aria-hidden="true"
        className="text-4xl sm:text-5xl"
      >
        {content.icon}
      </div>

      <p
        className={`
          mt-4
          text-[11px]
          font-black
          uppercase
          tracking-[0.28em]
          sm:text-xs
          ${content.accentTextClasses}
        `}
      >
        {content.eyebrow}
      </p>

      <h2
        className={`
          mt-3
          text-2xl
          font-black
          uppercase
          leading-tight
          tracking-tight
          sm:text-4xl
          ${content.accentTextClasses}
        `}
      >
        {content.title}
      </h2>

      <p
        className="
          mx-auto
          mt-4
          max-w-sm
          text-sm
          font-bold
          leading-6
          text-zinc-200
          sm:text-base
        "
      >
        {content.description}
      </p>

      {!onDispatch && (
        <p
          className="
            mt-4
            text-[11px]
            font-semibold
            text-zinc-600
          "
        >
          Résultat affiché sur cette page.
        </p>
      )}
    </section>
  );
}