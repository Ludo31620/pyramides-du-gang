"use client";

import {
  useEffect,
  useRef,
} from "react";

import type {
  BluffResult,
} from "@/lib/gameEngine/types";

type BluffResultOverlayProps = {
  result: BluffResult | null;
  visible: boolean;
  onComplete: () => void;
};

const DUREE_AFFICHAGE = 3000;

export default function BluffResultOverlay({
  result,
  visible,
  onComplete,
}: BluffResultOverlayProps) {
  const onCompleteRef =
    useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current =
      onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!visible || !result) {
      return;
    }

    const timer =
      window.setTimeout(() => {
        onCompleteRef.current();
      }, DUREE_AFFICHAGE);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    visible,
    result,
  ]);

  if (!visible || !result) {
    return null;
  }

  const giverName =
    `Joueur ${result.giver + 1}`;

  const targetName =
    `Joueur ${result.target + 1}`;

  const punishedPlayerName =
    `Joueur ${
      result.punishedPlayer + 1
    }`;

  const drinksLabel =
    result.drinks > 1
      ? "gorgées"
      : "gorgée";

  const isBelieved =
    result.outcome ===
    "BELIEVED";

  const isTruth =
    result.outcome ===
    "TRUTH";

  const isBluff =
    result.outcome ===
    "BLUFF";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black/90 px-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Résultat du bluff"
    >
      <div className="bluff-result-glow absolute h-72 w-72 rounded-full bg-[#FFD166]/20 blur-3xl" />

      <div className="bluff-result-card relative w-full max-w-md overflow-hidden rounded-[2rem] border border-[#FFD166]/30 bg-[#111318] p-6 text-center shadow-[0_0_80px_rgba(255,209,102,0.18)] sm:p-8">
        <div className="absolute inset-x-0 top-0 h-1 bg-[#FFD166]" />

        {isBelieved && (
          <>
            <div className="bluff-result-icon text-7xl">
              🍺
            </div>

            <p className="mt-5 text-xs font-black uppercase tracking-[0.3em] text-[#FFD166]">
              Bluff accepté
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              {targetName} boit
            </h2>

            <p className="mt-3 text-lg font-bold text-zinc-300">
              {result.drinks}{" "}
              {drinksLabel}
            </p>

            <p className="mt-5 text-sm leading-6 text-zinc-500">
              {targetName} a choisi de
              croire {giverName}.
            </p>
          </>
        )}

        {isTruth && (
          <>
            <div className="bluff-result-icon text-6xl">
              ✅
            </div>

            <p className="mt-5 text-xs font-black uppercase tracking-[0.3em] text-emerald-400">
              Vérité
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              {giverName} disait vrai
            </h2>

            {result.revealedCard && (
              <div className="mx-auto mt-6 flex h-40 w-28 items-center justify-center rounded-2xl border-2 border-white/20 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                <div
                  className={[
                    "text-center",
                    result.revealedCard
                      .couleur ===
                      "♥" ||
                    result.revealedCard
                      .couleur ===
                      "♦"
                      ? "text-red-600"
                      : "text-zinc-950",
                  ].join(" ")}
                >
                  <p className="text-4xl font-black">
                    {
                      result
                        .revealedCard
                        .valeur
                    }
                  </p>

                  <p className="mt-1 text-5xl leading-none">
                    {
                      result
                        .revealedCard
                        .couleur
                    }
                  </p>
                </div>
              </div>
            )}

            <p className="mt-6 text-lg font-black text-white">
              {punishedPlayerName} boit{" "}
              {result.drinks}{" "}
              {drinksLabel}
            </p>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              {targetName} a contesté à
              tort.
            </p>
          </>
        )}

        {isBluff && (
          <>
            <div className="bluff-result-icon text-7xl">
              ❌
            </div>

            <p className="mt-5 text-xs font-black uppercase tracking-[0.3em] text-red-500">
              Bluff détecté
            </p>

            <h2 className="mt-3 text-4xl font-black text-white">
              Menteur !
            </h2>

            <p className="mt-5 text-lg font-black text-white">
              {punishedPlayerName} boit{" "}
              {result.drinks}{" "}
              {drinksLabel}
            </p>

            <p className="mt-4 text-sm leading-6 text-zinc-500">
              {giverName} ne possédait
              aucune carte de cette
              valeur.
            </p>
          </>
        )}

        <div className="mt-8 h-1 overflow-hidden rounded-full bg-zinc-800">
          <div className="bluff-result-progress h-full rounded-full bg-[#FFD166]" />
        </div>
      </div>

      <style>{`
        @keyframes bluff-result-enter {
          0% {
            opacity: 0;
            transform:
              translateY(30px)
              scale(0.88);
          }

          65% {
            opacity: 1;
            transform:
              translateY(-4px)
              scale(1.03);
          }

          100% {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        @keyframes bluff-result-icon {
          0% {
            opacity: 0;
            transform:
              rotate(-15deg)
              scale(0.25);
          }

          70% {
            opacity: 1;
            transform:
              rotate(5deg)
              scale(1.15);
          }

          100% {
            opacity: 1;
            transform:
              rotate(0)
              scale(1);
          }
        }

        @keyframes bluff-result-glow {
          0%,
          100% {
            opacity: 0.35;
            transform: scale(0.85);
          }

          50% {
            opacity: 0.8;
            transform: scale(1.2);
          }
        }

        @keyframes bluff-result-progress {
          from {
            width: 100%;
          }

          to {
            width: 0%;
          }
        }

        .bluff-result-card {
          animation:
            bluff-result-enter
            450ms
            cubic-bezier(
              0.22,
              1,
              0.36,
              1
            )
            both;
        }

        .bluff-result-icon {
          animation:
            bluff-result-icon
            650ms
            cubic-bezier(
              0.34,
              1.56,
              0.64,
              1
            )
            both;
        }

        .bluff-result-glow {
          animation:
            bluff-result-glow
            1800ms
            ease-in-out
            infinite;
        }

        .bluff-result-progress {
          animation:
            bluff-result-progress
            ${DUREE_AFFICHAGE}ms
            linear
            forwards;
        }

        @media (
          prefers-reduced-motion:
          reduce
        ) {
          .bluff-result-card,
          .bluff-result-icon,
          .bluff-result-glow,
          .bluff-result-progress {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}