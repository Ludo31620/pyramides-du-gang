"use client";

import Link from "next/link";

import ThemeCard from "@/components/ui/ThemeCard";

import type {
  AchievementDefinition,
  UnlockedAchievement,
} from "@/lib/profileProgress/types";

interface ProfileAchievementPreviewProps {
  achievements:
    AchievementDefinition[];

  unlockedAchievements:
    UnlockedAchievement[];

  maxItems?: number;
}

export default function ProfileAchievementPreview({
  achievements,
  unlockedAchievements,
  maxItems = 3,
}: ProfileAchievementPreviewProps) {
  const unlockedIds =
    new Set(
      unlockedAchievements.map(
        (
          achievement
        ) =>
          achievement.id
      )
    );

  const unlockedDefinitions =
    achievements.filter(
      (
        achievement
      ) =>
        unlockedIds.has(
          achievement.id
        )
    );

  const displayedAchievements =
    unlockedDefinitions
      .slice()
      .reverse()
      .slice(
        0,
        maxItems
      );

  const unlockedCount =
    unlockedDefinitions.length;

  const totalCount =
    achievements.length;

  return (
    <section>
      <div
        className="
          flex
          items-end
          justify-between
          gap-4
        "
      >
        <div>
          <p
            className="
              text-xs
              font-black
              uppercase
              tracking-[0.22em]
              text-[var(--color-primary)]
            "
          >
            Succès
          </p>

          <h2
            className="
              mt-1
              text-2xl
              font-black
              text-[var(--color-text)]
            "
          >
            Derniers débloqués
          </h2>
        </div>

        <span
          className="
            rounded-full
            border
            border-[var(--color-border)]
            bg-[var(--color-surface-elevated)]
            px-3
            py-1
            text-xs
            font-black
            text-[var(--color-text-muted)]
          "
        >
          {unlockedCount}
          {" / "}
          {totalCount}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {displayedAchievements.length >
        0 ? (
          displayedAchievements.map(
            (
              achievement
            ) => (
              <ThemeCard
                key={
                  achievement.id
                }
                as="article"
                variant="elevated"
                className="
                  rounded-2xl
                  p-4
                  shadow-none
                "
              >
                <div className="flex items-center gap-4">
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-[var(--color-primary)]
                      bg-[var(--color-primary)]
                      text-2xl
                      text-[var(--color-primary-text)]
                    "
                    aria-hidden="true"
                  >
                    {
                      achievement.icon
                    }
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3
                      className="
                        truncate
                        font-black
                        text-[var(--color-text)]
                      "
                    >
                      {
                        achievement.title
                      }
                    </h3>

                    <p
                      className="
                        mt-1
                        text-sm
                        leading-5
                        text-[var(--color-text-muted)]
                      "
                    >
                      {
                        achievement.description
                      }
                    </p>
                  </div>

                  <span
                    className="
                      shrink-0
                      text-xs
                      font-black
                      text-[var(--color-primary)]
                    "
                  >
                    +
                    {
                      achievement.xpReward
                    }
                    {" XP"}
                  </span>
                </div>
              </ThemeCard>
            )
          )
        ) : (
          <ThemeCard
            as="div"
            variant="elevated"
            className="
              rounded-2xl
              p-5
              text-center
              shadow-none
            "
          >
            <p
              className="
                text-3xl
              "
              aria-hidden="true"
            >
              🔒
            </p>

            <p
              className="
                mt-3
                font-black
                text-[var(--color-text)]
              "
            >
              Aucun succès débloqué
            </p>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-[var(--color-text-muted)]
              "
            >
              Termine une partie pour
              commencer ta collection.
            </p>
          </ThemeCard>
        )}
      </div>

      <Link
        href="/succes"
        className="
          mt-4
          flex
          min-h-12
          w-full
          items-center
          justify-between
          rounded-2xl
          border
          border-[var(--color-border)]
          bg-[var(--color-surface-elevated)]
          px-5
          py-3
          font-black
          text-[var(--color-text)]
          transition
          hover:border-[var(--color-primary)]
          active:scale-[0.98]
        "
      >
        <span>
          Voir tous les succès
        </span>

        <span
          aria-hidden="true"
          className="
            text-[var(--color-text-muted)]
          "
        >
          ›
        </span>
      </Link>
    </section>
  );
}