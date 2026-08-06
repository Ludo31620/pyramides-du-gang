"use client";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import ThemeCard from "@/components/ui/ThemeCard";

import {
  ACHIEVEMENTS,
  createPlayerProgress,
  loadProgress,
} from "@/lib/profileProgress";

import type {
  AchievementDefinition,
  AchievementId,
  PlayerProgress,
  PlayerProgressStats,
} from "@/lib/profileProgress/types";

interface AchievementProgress {
  current: number;
  target: number;
  percentage: number;
}

function getAchievementProgress(
  achievementId:
    AchievementId,
  stats:
    PlayerProgressStats
): AchievementProgress {
  let current =
    0;

  let target =
    1;

  switch (
    achievementId
  ) {
    case "FIRST_GAME":
      current =
        stats.gamesPlayed;
      target =
        1;
      break;

    case "TEN_GAMES":
      current =
        stats.gamesPlayed;
      target =
        10;
      break;

    case "HUNDRED_GAMES":
      current =
        stats.gamesPlayed;
      target =
        100;
      break;

    case "FIRST_WIN":
      current =
        stats.gamesWon;
      target =
        1;
      break;

    case "TEN_WINS":
      current =
        stats.gamesWon;
      target =
        10;
      break;

    case "TWENTY_FIVE_WINS":
      current =
        stats.gamesWon;
      target =
        25;
      break;

    case "FIRST_BLUFF":
      current =
        stats.successfulBluffs;
      target =
        1;
      break;

    case "TEN_SUCCESSFUL_BLUFFS":
      current =
        stats.successfulBluffs;
      target =
        10;
      break;

    case "FIFTY_SUCCESSFUL_BLUFFS":
      current =
        stats.successfulBluffs;
      target =
        50;
      break;

    case "HUNDRED_SUCCESSFUL_BLUFFS":
      current =
        stats.successfulBluffs;
      target =
        100;
      break;

    case "HUNDRED_DRINKS_GIVEN":
      current =
        stats.drinksGiven;
      target =
        100;
      break;

    case "FIVE_HUNDRED_DRINKS_GIVEN":
      current =
        stats.drinksGiven;
      target =
        500;
      break;

    case "THOUSAND_DRINKS_GIVEN":
      current =
        stats.drinksGiven;
      target =
        1000;
      break;

    case "HUNDRED_DRINKS_TAKEN":
      current =
        stats.drinksTaken;
      target =
        100;
      break;

    case "FIVE_HUNDRED_DRINKS_TAKEN":
      current =
        stats.drinksTaken;
      target =
        500;
      break;

    case "FIRST_MEMORY_JOKER":
      current =
        stats.memoryJokersUsed;
      target =
        1;
      break;

    case "TEN_MEMORY_JOKERS":
      current =
        stats.memoryJokersUsed;
      target =
        10;
      break;

    case "FIFTY_MEMORY_JOKERS":
      current =
        stats.memoryJokersUsed;
      target =
        50;
      break;

    case "FIRST_PERFECT_DISTRIBUTION":
      current =
        stats.perfectDistributions;
      target =
        1;
      break;

    case "TEN_PERFECT_DISTRIBUTIONS":
      current =
        stats.perfectDistributions;
      target =
        10;
      break;

    case "FIRST_MEMORY_MASTER":
      current =
        stats
          .memoryRoundsCompletedWithoutJoker;
      target =
        1;
      break;

    case "TEN_MEMORY_MASTERS":
      current =
        stats
          .memoryRoundsCompletedWithoutJoker;
      target =
        10;
      break;

    default: {
      const exhaustiveCheck:
        never =
        achievementId;

      return exhaustiveCheck;
    }
  }

  const percentage =
    target > 0
      ? Math.min(
          100,
          Math.round(
            (
              current /
              target
            ) * 100
          )
        )
      : 0;

  return {
    current,
    target,
    percentage,
  };
}

function AchievementCard({
  achievement,
  progress,
  unlocked,
}: {
  achievement:
    AchievementDefinition;

  progress:
    AchievementProgress;

  unlocked:
    boolean;
}) {
  const hidden =
    achievement.hidden ===
      true &&
    !unlocked;

  const title =
    hidden
      ? "???"
      : achievement.title;

  const description =
    hidden
      ? "Succès secret"
      : achievement.description;

  const icon =
    hidden
      ? "❔"
      : achievement.icon;

  return (
    <ThemeCard
      as="article"
      variant={
        unlocked
          ? "highlighted"
          : "elevated"
      }
      className="
        rounded-2xl
        p-5
        shadow-none
        sm:p-5
      "
    >
      <div className="flex items-start gap-4">
        <div
          className={`
            flex
            h-14
            w-14
            shrink-0
            items-center
            justify-center
            rounded-2xl
            border
            text-2xl
            ${
              unlocked
                ? `
                    border-[var(--color-primary)]
                    bg-[var(--color-primary)]
                    text-[var(--color-primary-text)]
                  `
                : `
                    border-[var(--color-border)]
                    bg-[var(--color-surface)]
                    opacity-60
                  `
            }
          `}
          aria-hidden="true"
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2
              className="
                text-lg
                font-black
              "
            >
              {title}
            </h2>

            <span
              className="
                rounded-full
                bg-[var(--color-primary)]
                px-2
                py-1
                text-[10px]
                font-black
                uppercase
                tracking-wider
                text-[var(--color-primary-text)]
              "
            >
              +{achievement.xpReward} XP
            </span>

            <span
              className={`
                ml-auto
                text-sm
                font-black
                ${
                  unlocked
                    ? "text-[var(--color-success)]"
                    : "text-[var(--color-text-muted)]"
                }
              `}
            >
              {unlocked
                ? "Débloqué"
                : "Verrouillé"}
            </span>
          </div>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-[var(--color-text-muted)]
            "
          >
            {description}
          </p>

          <div className="mt-4">
            <div className="flex items-center justify-between gap-3">
              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-[var(--color-text-muted)]
                "
              >
                Progression
              </p>

              <p
                className="
                  text-sm
                  font-black
                "
              >
                {Math.min(
                  progress.current,
                  progress.target
                )}
                {" / "}
                {progress.target}
              </p>
            </div>

            <div
              className="
                mt-2
                h-2.5
                overflow-hidden
                rounded-full
                bg-black/30
              "
            >
              <div
                className={`
                  h-full
                  rounded-full
                  transition-[width]
                  duration-300
                  ${
                    unlocked
                      ? "bg-[var(--color-success)]"
                      : "bg-[var(--color-primary)]"
                  }
                `}
                style={{
                  width:
                    `${progress.percentage}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </ThemeCard>
  );
}

export default function SuccessPage() {
  const [
    progress,
    setProgress,
  ] =
    useState<PlayerProgress | null>(
      null
    );

  const [
    ready,
    setReady,
  ] = useState(false);

  useEffect(() => {
    setProgress(
      loadProgress() ??
        createPlayerProgress()
    );

    setReady(true);
  }, []);

  const unlockedIds =
    useMemo(
      () =>
        new Set(
          progress
            ?.unlockedAchievements
            .map(
              (
                achievement
              ) =>
                achievement.id
            ) ??
            []
        ),
      [
        progress,
      ]
    );

  const unlockedCount =
    progress
      ?.unlockedAchievements
      .length ??
    0;

  const totalCount =
    ACHIEVEMENTS.length;

  const globalPercentage =
    totalCount > 0
      ? Math.round(
          (
            unlockedCount /
            totalCount
          ) * 100
        )
      : 0;

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
          Chargement des succès…
        </p>
      </main>
    );
  }

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
            "
          >
            Succès
          </h1>

          <p
            className="
              mt-4
              text-sm
              leading-7
              text-[var(--color-text-muted)]
            "
          >
            Débloque des succès en
            jouant des parties et en
            réalisant différents défis.
          </p>

          <ThemeCard
            as="div"
            variant="elevated"
            className="
              mt-7
              rounded-2xl
              p-5
              shadow-none
              sm:p-5
            "
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <p
                  className="
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.2em]
                    text-[var(--color-text-muted)]
                  "
                >
                  Progression globale
                </p>

                <p
                  className="
                    mt-2
                    text-3xl
                    font-black
                  "
                >
                  {unlockedCount}
                  {" / "}
                  {totalCount}
                </p>
              </div>

              <p
                className="
                  text-2xl
                  font-black
                  text-[var(--color-primary)]
                "
              >
                {globalPercentage} %
              </p>
            </div>

            <div
              className="
                mt-4
                h-3
                overflow-hidden
                rounded-full
                bg-black/30
              "
              role="progressbar"
              aria-label="Progression globale des succès"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={
                globalPercentage
              }
            >
              <div
                className="
                  h-full
                  rounded-full
                  bg-[var(--color-primary)]
                  transition-[width]
                  duration-300
                "
                style={{
                  width:
                    `${globalPercentage}%`,
                }}
              />
            </div>
          </ThemeCard>

          <div className="mt-6 space-y-4">
            {ACHIEVEMENTS.map(
              (
                achievement
              ) => (
                <AchievementCard
                  key={
                    achievement.id
                  }
                  achievement={
                    achievement
                  }
                  unlocked={
                    unlockedIds.has(
                      achievement.id
                    )
                  }
                  progress={
                    getAchievementProgress(
                      achievement.id,
                      progress.stats
                    )
                  }
                />
              )
            )}
          </div>

          <p
            className="
              mt-6
              text-center
              text-xs
              leading-5
              text-[var(--color-text-muted)]
            "
          >
            Les succès et leur progression
            sont enregistrés localement sur
            cet appareil.
          </p>
        </ThemeCard>
      </div>
    </main>
  );
}