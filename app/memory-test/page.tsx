"use client";

import {
  useEffect,
  useState,
} from "react";

import MemoryScreen from "@/components/game/MemoryScreen";

import type { Carte } from "@/lib/deck";

const cartesTest: Carte[] = [
  {
    valeur: "As",
    couleur: "♠",
    revelee: true,
  },
  {
    valeur: "Roi",
    couleur: "♥",
    revelee: true,
  },
  {
    valeur: "10",
    couleur: "♦",
    revelee: true,
  },
  {
    valeur: "4",
    couleur: "♣",
    revelee: true,
  },
];

const DUREE_MEMORISATION =
  60;

export default function MemoryTestPage() {
  const [seconds, setSeconds] =
    useState(
      DUREE_MEMORISATION
    );

  const [hidden, setHidden] =
    useState(false);

  useEffect(() => {
    if (
      hidden ||
      seconds <= 0
    ) {
      return;
    }

    const timer =
      window.setInterval(
        () => {
          setSeconds(
            (currentSeconds) => {
              if (
                currentSeconds <= 1
              ) {
                window.clearInterval(
                  timer
                );

                setHidden(true);

                return 0;
              }

              return (
                currentSeconds - 1
              );
            }
          );
        },
        1000
      );

    return () => {
      window.clearInterval(
        timer
      );
    };
  }, [hidden, seconds]);

  function recommencer(): void {
    setSeconds(
      DUREE_MEMORISATION
    );

    setHidden(false);
  }

  function masquerMaintenant(): void {
    setSeconds(0);
    setHidden(true);
  }

  return (
    <>
      <MemoryScreen
        cards={cartesTest}
        seconds={seconds}
        hidden={hidden}
        playerName="Ludo"
      />

      <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 gap-2 rounded-2xl border border-[#2B2E36] bg-[#111318]/95 p-2 shadow-2xl backdrop-blur">
        <button
          type="button"
          onClick={
            masquerMaintenant
          }
          disabled={hidden}
          className="rounded-xl border border-[#FFD166] px-4 py-2 text-sm font-black text-[#FFD166] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Masquer
        </button>

        <button
          type="button"
          onClick={recommencer}
          className="rounded-xl bg-[#FFD166] px-4 py-2 text-sm font-black text-[#111318]"
        >
          Recommencer
        </button>
      </div>
    </>
  );
}