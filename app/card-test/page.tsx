"use client";

import { useState } from "react";

import {
  PlayingCard,
} from "@/components/game/cards";

import type {
  Carte,
} from "@/lib/deck";

const SPADE_CARD: Carte = {
  valeur: "As",
  couleur: "♠",
  revelee: true,
};

const SUIT_CARDS: Carte[] = [
  {
    valeur: "As",
    couleur: "♠",
    revelee: true,
  },
  {
    valeur: "As",
    couleur: "♥",
    revelee: true,
  },
  {
    valeur: "As",
    couleur: "♦",
    revelee: true,
  },
  {
    valeur: "As",
    couleur: "♣",
    revelee: true,
  },
];

function SectionTitle({
  number,
  children,
}: {
  number: number;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <h2 className="text-sm font-black uppercase tracking-wide text-[#FFD166] sm:text-base">
        {number}. {children}
      </h2>

      <div className="flex items-center">
        <div className="h-px w-8 bg-gradient-to-r from-[#FFD166] to-transparent" />

        <div className="h-2 w-2 rotate-45 bg-[#FFD166]" />

        <div className="h-px w-8 bg-gradient-to-r from-[#FFD166] to-transparent" />
      </div>
    </div>
  );
}

function LaboratoryPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={[
        "relative overflow-hidden rounded-3xl border border-white/10",
        "bg-gradient-to-br from-white/[0.035] to-transparent",
        "p-5 shadow-[0_24px_80px_rgba(0,0,0,0.3)]",
        "sm:p-7",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#FFD166]/30 to-transparent" />

      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}

export default function CardTestPage() {
  const [faceUp, setFaceUp] =
    useState(false);

  const [touchCount, setTouchCount] =
    useState(0);

  return (
    <main className="min-h-screen overflow-hidden bg-[#080B10] text-white">
      <div className="pointer-events-none fixed left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#FFD166]/[0.035] blur-[140px]" />

      <div className="relative mx-auto flex w-full max-w-[1500px] flex-col gap-5 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <header className="mb-3">
          <div className="flex items-center gap-3 text-[#FFD166]">
            <div className="flex h-7 w-7 rotate-45 items-center justify-center border border-[#FFD166]">
              <span className="-rotate-45 text-xs font-black">
                P
              </span>
            </div>

            <p className="text-sm font-black uppercase tracking-[0.24em]">
              Laboratoire
            </p>
          </div>

          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            PlayingCard
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-zinc-400 sm:text-base">
            Test de toutes les variantes,
            tailles et interactions des
            cartes du jeu.
          </p>
        </header>

        <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
          <LaboratoryPanel>
            <SectionTitle number={1}>
              Les tailles
            </SectionTitle>

            <div className="overflow-x-auto pb-2">
              <div className="flex min-w-max items-end justify-around gap-6 px-2">
                <div className="flex flex-col items-center">
                  <PlayingCard
                    card={SPADE_CARD}
                    faceUp
                    size="xs"
                  />

                  <span className="mt-4 text-sm font-medium text-zinc-500">
                    XS
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <PlayingCard
                    card={SPADE_CARD}
                    faceUp
                    size="sm"
                  />

                  <span className="mt-4 text-sm font-medium text-zinc-500">
                    SM
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <PlayingCard
                    card={SPADE_CARD}
                    faceUp
                    size="md"
                  />

                  <span className="mt-4 text-sm font-medium text-zinc-500">
                    MD
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <PlayingCard
                    card={SPADE_CARD}
                    faceUp
                    size="lg"
                  />

                  <span className="mt-4 text-sm font-medium text-zinc-500">
                    LG
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <PlayingCard
                    card={SPADE_CARD}
                    faceUp
                    size="xl"
                  />

                  <span className="mt-4 text-sm font-medium text-zinc-500">
                    XL
                  </span>
                </div>
              </div>
            </div>
          </LaboratoryPanel>

          <LaboratoryPanel>
            <SectionTitle number={2}>
              Flip
            </SectionTitle>

            <div className="flex flex-col items-center justify-center gap-7">
              <PlayingCard
                card={SPADE_CARD}
                faceUp={faceUp}
                size="xl"
                onClick={() =>
                  setFaceUp(
                    (previous) => !previous
                  )
                }
              />

              <button
                type="button"
                onClick={() =>
                  setFaceUp(
                    (previous) => !previous
                  )
                }
                className="min-h-12 w-full max-w-xs touch-manipulation rounded-2xl bg-gradient-to-r from-[#E7B84F] via-[#FFD985] to-[#E7B84F] px-6 py-3 text-sm font-black uppercase tracking-wide text-black shadow-[0_12px_30px_rgba(255,209,102,0.2)] transition active:scale-[0.97]"
              >
                Retourner la carte
              </button>
            </div>
          </LaboratoryPanel>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
          <LaboratoryPanel>
            <SectionTitle number={3}>
              États
            </SectionTitle>

            <div className="overflow-x-auto pb-3">
              <div className="flex min-w-max items-end justify-around gap-8 px-2">
                <div className="flex flex-col items-center">
                  <PlayingCard
                    card={SPADE_CARD}
                    faceUp
                    size="md"
                  />

                  <span className="mt-4 text-xs font-bold uppercase text-zinc-400">
                    Normal
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <PlayingCard
                    card={SPADE_CARD}
                    faceUp
                    size="md"
                    selected
                  />

                  <span className="mt-4 text-xs font-bold uppercase text-zinc-400">
                    Sélectionnée
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <PlayingCard
                    card={SPADE_CARD}
                    faceUp
                    size="md"
                    disabled
                  />

                  <span className="mt-4 text-xs font-bold uppercase text-zinc-400">
                    Désactivée
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <PlayingCard
                    card={SPADE_CARD}
                    faceUp
                    size="md"
                    onClick={() =>
                      setTouchCount(
                        (count) => count + 1
                      )
                    }
                  />

                  <span className="mt-4 text-xs font-bold uppercase text-zinc-400">
                    Cliquable
                  </span>
                </div>
              </div>
            </div>
          </LaboratoryPanel>

          <LaboratoryPanel>
            <SectionTitle number={4}>
              Toutes les couleurs
            </SectionTitle>

            <div className="grid grid-cols-2 justify-items-center gap-6 sm:grid-cols-4">
              {SUIT_CARDS.map((card) => (
                <PlayingCard
                  key={`${card.valeur}-${card.couleur}`}
                  card={card}
                  faceUp
                  size="md"
                />
              ))}
            </div>
          </LaboratoryPanel>
        </div>

        <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
          <LaboratoryPanel>
            <SectionTitle number={5}>
              Interaction tactile
            </SectionTitle>

            <div className="flex flex-col items-center gap-7 sm:flex-row sm:justify-around">
              <div className="max-w-xs text-center sm:text-left">
                <p className="text-sm leading-6 text-zinc-400">
                  Appuie sur la carte pour
                  vérifier l’effet de pression
                  mobile.
                </p>

                <p className="mt-3 text-sm font-bold text-[#FFD166]">
                  Pressions : {touchCount}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <PlayingCard
                  card={SPADE_CARD}
                  faceUp
                  size="lg"
                  selected={touchCount > 0}
                  onClick={() =>
                    setTouchCount(
                      (count) => count + 1
                    )
                  }
                />
              </div>
            </div>
          </LaboratoryPanel>

          <LaboratoryPanel>
            <div className="flex items-center gap-3 text-[#FFD166]">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#FFD166]/30 bg-[#FFD166]/10">
                <span className="text-lg">
                  💡
                </span>
              </div>

              <h2 className="font-black uppercase tracking-wide">
                Notes
              </h2>
            </div>

            <p className="mt-5 text-sm leading-7 text-zinc-400">
              Cette page est notre terrain de
              test. Toutes les cartes du jeu
              utiliseront progressivement le
              composant{" "}
              <strong className="text-[#FFD166]">
                PlayingCard
              </strong>
              .
            </p>
          </LaboratoryPanel>
        </div>
      </div>
    </main>
  );
}