"use client";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import ThemeCard from "@/components/ui/ThemeCard";

import {
  getAllAchievements,
} from "@/lib/achievements/achievements";

import {
  getAchievementProgress,
} from "@/lib/achievements/progress";

import {
  getUnlockedAchievements,
} from "@/lib/achievements/storage";

import type {
  UnlockedAchievement,
} from "@/lib/achievements/types";

import {
  getPlayerLifetimeStats,
} from "@/lib/stats/storage";

import type {
  PlayerLifetimeStats,
} from "@/lib/stats/types";

export default function SuccessPage() {
  const [
    stats,
    setStats,
  ] =
    useState<PlayerLifetimeStats | null>(
      null
    );

  const [
    unlockedAchievements,
    setUnlockedAchievements,
  ] =
    useState<UnlockedAchievement[]>(
      []
    );

  const [
    ready,
    setReady,
  ] = useState(false);

  const achievements =
    useMemo(
      () =>
        getAllAchievements(),
      []
    );

  useEffect(() => {
    setStats(
      getPlayerLifetimeStats()
    );

    setUnlockedAchievements(
      getUnlockedAchievements()
    );

    setReady(true);
  }, []);

  const unlockedIds =
    useMemo(
      () =>
        new Set(
          unlockedAchievements.map(
            (
              achievement
            ) =>
              achievement.id
          )
        ),
      [
        unlockedAchievements,
      ]
    );

  const unlockedCount =
    unlockedAchievements.length;

  const totalCount =
    achievements.length;

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
    !stats
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
            {achievements.map(
              (
                achievement
              ) => {
                const unlocked =
                  unlockedIds.has(
                    achievement.id
                  );

                const progress =
                  getAchievementProgress(
                    achievement,
                    stats
                  );

                return (
                  <ThemeCard
                    key={
                      achievement.id
                    }
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
                      >
                        {
                          achievement.icon
                        }
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2
                            className="
                              text-lg
                              font-black
                            "
                          >
                            {
                              achievement.title
                            }
                          </h2>

                          {achievement.premium && (
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
                              Premium
                            </span>
                          )}

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
                          {
                            achievement.description
                          }
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
                              {
                                progress.target
                              }
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
            Les succès sont enregistrés
            sur cet appareil à la fin de
            chaque partie.
          </p>
        </ThemeCard>
      </div>
    </main>
  );
}