"use client";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import ThemeButton from "@/components/ui/ThemeButton";
import ThemeCard from "@/components/ui/ThemeCard";

import {
  getUserEntitlements,
} from "@/lib/premium/storage";

import {
  createPlayerProgress,
  loadProgress,
  recordCompletedGame,
  saveProgress,
} from "@/lib/profileProgress";

import type {
  PlayerProgress,
} from "@/lib/profileProgress/types";

interface StatItemProps {
  icon: string;
  label: string;
  value: number | string;
}

function StatItem({
  icon,
  label,
  value,
}: StatItemProps) {
  return (
    <ThemeCard
      as="div"
      variant="elevated"
      className="
        rounded-2xl
        p-4
        shadow-none
        sm:p-4
      "
    >
      <div className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="text-2xl"
        >
          {icon}
        </span>

        <div className="min-w-0 flex-1">
          <p
            className="
              text-sm
              font-bold
              text-[var(--color-text-muted)]
            "
          >
            {label}
          </p>

          <p
            className="
              mt-1
              text-2xl
              font-black
              text-[var(--color-text)]
            "
          >
            {value}
          </p>
        </div>
      </div>
    </ThemeCard>
  );
}

export default function StatisticsPage() {
  const [
    progress,
    setProgress,
  ] =
    useState<PlayerProgress | null>(
      null
    );

  const [
    premium,
    setPremium,
  ] = useState(false);

  const [
    ready,
    setReady,
  ] = useState(false);

  useEffect(() => {
    const entitlements =
      getUserEntitlements();

    setPremium(
      entitlements.premium
    );

    setProgress(
      loadProgress() ??
        createPlayerProgress()
    );

    setReady(true);
  }, []);

  const bluffSuccessRate =
    useMemo(
      () => {
        const stats =
          progress?.stats;

        if (
          !stats ||
          stats.bluffsAttempted <= 0
        ) {
          return "0 %";
        }

        const percentage =
          Math.round(
            (
              stats.successfulBluffs /
              stats.bluffsAttempted
            ) * 100
          );

        return `${percentage} %`;
      },
      [
        progress,
      ]
    );

  const winRate =
    useMemo(
      () => {
        const stats =
          progress?.stats;

        if (
          !stats ||
          stats.gamesPlayed <= 0
        ) {
          return "0 %";
        }

        const percentage =
          Math.round(
            (
              stats.gamesWon /
              stats.gamesPlayed
            ) * 100
          );

        return `${percentage} %`;
      },
      [
        progress,
      ]
    );

  function handleAddTestGame():
    void {
    const result =
      recordCompletedGame({
        won: true,

        drinksGiven: 8,

        drinksTaken: 5,

        claimsMade: 4,

        bluffsAttempted: 2,

        successfulBluffs: 1,

        caughtBluffs: 1,

        distributionAnswers: 4,

        correctDistributionAnswers: 3,

        usedMemoryJokers: 1,

        completedMemoryWithoutJoker:
          false,

        cardsRevealed: 15,

        playTimeMs:
          12 * 60 * 1000,
      });

    setProgress(
      result.progress
    );
  }

  function handleResetStats():
    void {
    const resetProgress =
      createPlayerProgress();

    saveProgress(
      resetProgress
    );

    setProgress(
      resetProgress
    );
  }

  if (
    !ready ||
    !progress
  ) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[var(--color-background)]
          px-5
          text-[var(--color-text)]
        "
      >
        <p
          className="
            text-sm
            font-bold
            text-[var(--color-text-muted)]
          "
        >
          Chargement des statistiques…
        </p>
      </main>
    );
  }

  const stats =
    progress.stats;

  const totalPlayMinutes =
    Math.floor(
      stats.totalPlayTimeMs /
      60_000
    );

  return (
    <main
      className="
        min-h-screen
        bg-[var(--color-background)]
        px-5
        py-6
        text-[var(--color-text)]
        transition-colors
        duration-200
      "
    >
      <div className="mx-auto w-full max-w-md">
        <Link
          href="/"
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            font-bold
            text-[var(--color-text-muted)]
            transition
            hover:text-[var(--color-text)]
          "
        >
          ← Retour
        </Link>

        <ThemeCard
          variant="highlighted"
          className="mt-8"
        >
          <p
            className="
              text-xs
              font-black
              uppercase
              tracking-[0.25em]
              text-[var(--color-primary)]
            "
          >
            Pyramide du Gang
          </p>

          <h1
            className="
              mt-3
              text-4xl
              font-black
              uppercase
              leading-tight
            "
          >
            Statistiques
          </h1>

          {!premium ? (
            <>
              <p
                className="
                  mt-4
                  text-sm
                  leading-7
                  text-[var(--color-text-muted)]
                "
              >
                Les statistiques
                personnelles sont
                réservées aux joueurs
                Premium.
              </p>

              <ThemeCard
                as="div"
                variant="elevated"
                className="
                  mt-7
                  rounded-2xl
                  p-5
                  text-center
                  shadow-none
                  sm:p-5
                "
              >
                <p className="text-4xl">
                  🔒
                </p>

                <p
                  className="
                    mt-4
                    text-xl
                    font-black
                  "
                >
                  Fonctionnalité Premium
                </p>

                <p
                  className="
                    mt-2
                    text-sm
                    leading-6
                    text-[var(--color-text-muted)]
                  "
                >
                  Active Premium pour
                  suivre tes parties,
                  tes victoires, tes
                  bluffs et tes gorgées.
                </p>
              </ThemeCard>

              <Link
                href="/premium"
                className="
                  mt-7
                  flex
                  min-h-16
                  w-full
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-[var(--color-primary)]
                  bg-[var(--color-primary)]
                  px-6
                  py-4
                  text-center
                  text-lg
                  font-black
                  text-[var(--color-primary-text)]
                  transition
                  hover:bg-[var(--color-primary-hover)]
                  active:scale-[0.98]
                "
              >
                Découvrir Premium
              </Link>
            </>
          ) : (
            <>
              <p
                className="
                  mt-4
                  text-sm
                  leading-7
                  text-[var(--color-text-muted)]
                "
              >
                Retrouve ici tes
                performances cumulées
                sur cet appareil.
              </p>

              <div
                className="
                  mt-7
                  grid
                  grid-cols-2
                  gap-3
                "
              >
                <StatItem
                  icon="🎮"
                  label="Parties jouées"
                  value={
                    stats.gamesPlayed
                  }
                />

                <StatItem
                  icon="🏆"
                  label="Victoires"
                  value={
                    stats.gamesWon
                  }
                />

                <StatItem
                  icon="📈"
                  label="Taux de victoire"
                  value={
                    winRate
                  }
                />

                <StatItem
                  icon="🍻"
                  label="Gorgées données"
                  value={
                    stats.drinksGiven
                  }
                />

                <StatItem
                  icon="🥴"
                  label="Gorgées reçues"
                  value={
                    stats.drinksTaken
                  }
                />

                <StatItem
                  icon="🗣️"
                  label="Annonces"
                  value={
                    stats.claimsMade
                  }
                />

                <StatItem
                  icon="🎭"
                  label="Bluffs tentés"
                  value={
                    stats.bluffsAttempted
                  }
                />

                <StatItem
                  icon="✅"
                  label="Bluffs réussis"
                  value={
                    stats.successfulBluffs
                  }
                />

                <StatItem
                  icon="🚨"
                  label="Bluffs démasqués"
                  value={
                    stats.caughtBluffs
                  }
                />

                <StatItem
                  icon="🎯"
                  label="Réussite bluff"
                  value={
                    bluffSuccessRate
                  }
                />

                <StatItem
                  icon="🔥"
                  label="Meilleure série"
                  value={
                    stats.bestWinStreak
                  }
                />

                <StatItem
                  icon="⏱️"
                  label="Temps joué"
                  value={
                    `${totalPlayMinutes} min`
                  }
                />

                <StatItem
                  icon="🧠"
                  label="Jokers mémoire"
                  value={
                    stats.memoryJokersUsed
                  }
                />

                <StatItem
                  icon="🃏"
                  label="Cartes révélées"
                  value={
                    stats.cardsRevealed
                  }
                />
              </div>

              <div className="mt-8">
                <ThemeButton
                  type="button"
                  variant="primary"
                  onClick={
                    handleAddTestGame
                  }
                >
                  Ajouter une partie test
                </ThemeButton>

                <ThemeButton
                  type="button"
                  variant="secondary"
                  onClick={
                    handleResetStats
                  }
                  className="mt-3"
                >
                  Réinitialiser les statistiques
                </ThemeButton>

                <p
                  className="
                    mt-3
                    text-center
                    text-xs
                    leading-5
                    text-[var(--color-text-muted)]
                  "
                >
                  Le bouton d’ajout est
                  temporaire et réservé
                  aux tests de développement.
                </p>
              </div>
            </>
          )}
        </ThemeCard>
      </div>
    </main>
  );
}