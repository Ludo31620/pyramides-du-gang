"use client";

import AnimatedXpCounter from "./AnimatedXpCounter";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

import {
  getLevelProgress,
  loadProgress,
} from "@/lib/profileProgress";

import type {
  GameOverSummary,
} from "@/lib/profileProgress";

interface GameOverProgressProps {
  summary:
    GameOverSummary | null;
}

export default function GameOverProgress({
  summary,
}: GameOverProgressProps) {
  const [
    animationStarted,
    setAnimationStarted,
  ] = useState(false);

  useEffect(() => {
    if (!summary) {
      return;
    }

    const timeoutId =
      window.setTimeout(
        () => {
          setAnimationStarted(
            true
          );
        },
        350
      );

    return () => {
      window.clearTimeout(
        timeoutId
      );
    };
  }, [
    summary,
  ]);

  const progressData =
    useMemo(
      () => {
        if (!summary) {
          return null;
        }

        const storedProgress =
          loadProgress();

        const totalXpAfter =
          storedProgress?.totalXp ??
          summary.xpGained;

        const totalXpBefore =
          Math.max(
            0,
            totalXpAfter -
              summary.xpGained
          );

        const before =
          getLevelProgress(
            totalXpBefore
          );

        const after =
          getLevelProgress(
            totalXpAfter
          );

        return {
          before,
          after,
          totalXpBefore,
          totalXpAfter,
        };
      },
      [
        summary,
      ]
    );

  if (
    !summary ||
    !progressData
  ) {
    return null;
  }

  const {
    before,
    after,
  } =
    progressData;

  const levelUp =
    summary.levelAfter >
    summary.levelBefore;

  const startPercentage =
    Math.min(
      100,
      Math.max(
        0,
        before.progressRatio *
          100
      )
    );

  const endPercentage =
    Math.min(
      100,
      Math.max(
        0,
        after.progressRatio *
          100
      )
    );

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 0.2,
        duration: 0.4,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className="
        relative
        mt-7
        overflow-hidden
        rounded-3xl
        border
        border-yellow-400/25
        bg-zinc-900
        p-5
        sm:p-7
      "
    >
      {levelUp && (
        <motion.div
          aria-hidden="true"
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: [
              0,
              0.35,
              0,
            ],

            scale: [
              0.8,
              1.25,
              1.5,
            ],
          }}
          transition={{
            delay: 0.5,
            duration: 1.5,
          }}
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-72
            w-72
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-yellow-400
            blur-3xl
          "
        />
      )}

      <div className="relative">
        <div
          className="
            flex
            items-start
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
                tracking-[0.25em]
                text-yellow-400
              "
            >
              Progression
            </p>

            <h3
              className="
                mt-2
                text-2xl
                font-black
                text-white
              "
            >
              Expérience gagnée
            </h3>
          </div>

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.75,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              delay: 0.35,
              duration: 0.35,
              type: "spring",
              stiffness: 220,
              damping: 16,
            }}
            className="
              shrink-0
              rounded-2xl
              border
              border-yellow-400/30
              bg-yellow-400/10
              px-4
              py-3
              text-center
            "
          >
<p
  className="
    text-2xl
    font-black
    tabular-nums
    text-yellow-400
  "
>
  <AnimatedXpCounter
    value={
      summary.xpGained
    }
  />
</p>
            <p
              className="
                text-[10px]
                font-black
                uppercase
                tracking-wider
                text-zinc-500
              "
            >
              XP
            </p>
          </motion.div>
        </div>

        <div className="mt-6">
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
                  font-bold
                  uppercase
                  tracking-wider
                  text-zinc-500
                "
              >
                Niveau actuel
              </p>

              <p
                className="
                  mt-1
                  text-2xl
                  font-black
                  text-white
                "
              >
                Niveau{" "}
                {summary.levelAfter}
              </p>
            </div>

            <p
              className="
                text-right
                text-sm
                font-black
                text-yellow-400
              "
            >
              {after.currentLevelXp}
              {" / "}
              {
                after
                  .requiredXpForNextLevel
              }
              {" XP"}
            </p>
          </div>

          <div
            className="
              relative
              mt-4
              h-4
              overflow-hidden
              rounded-full
              border
              border-white/5
              bg-black/40
            "
            role="progressbar"
            aria-label="Progression du niveau"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={
              Math.round(
                endPercentage
              )
            }
          >



            <motion.div
              className="
                h-full
                rounded-full
                bg-yellow-400
                shadow-[0_0_18px_rgba(250,204,21,0.45)]
              "
              initial={{
                width:
                  `${startPercentage}%`,
              }}
              animate={{
                width:
                  animationStarted
                    ? `${endPercentage}%`
                    : `${startPercentage}%`,
              }}
              transition={{
                duration: 1.4,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
            />
          </div>

{summary
  .unlockedRewards
  .length > 0 && (
  <div className="mt-6">
    <p
      className="
        text-xs
        font-black
        uppercase
        tracking-[0.2em]
        text-yellow-400
      "
    >
      Récompenses débloquées
    </p>

    <div className="mt-3 space-y-3">
      {summary
        .unlockedRewards
        .map(
          (
            reward,
            rewardIndex
          ) => {
            const icon =
              reward.type ===
              "TITLE"
                ? "👑"
                : reward.type ===
                    "AVATAR"
                  ? "👤"
                  : reward.type ===
                      "FRAME"
                    ? "🖼️"
                    : "🎨";

            return (
              <motion.article
                key={
                  `${reward.type}-${reward.rewardId}`
                }
                initial={{
                  opacity: 0,
                  y: 16,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                transition={{
                  delay:
                    1.7 +
                    rewardIndex *
                      0.12,

                  duration: 0.35,

                  type:
                    "spring",

                  stiffness: 180,

                  damping: 16,
                }}
                className="
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-yellow-400/25
                  bg-yellow-400/5
                  p-4
                "
              >
                <div
                  aria-hidden="true"
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-yellow-400
                    text-xl
                  "
                >
                  {icon}
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className="
                      font-black
                      text-white
                    "
                  >
                    {reward.label}
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-xs
                      uppercase
                      tracking-wider
                      text-zinc-500
                    "
                  >
                    Débloqué au niveau{" "}
                    {reward.level}
                  </p>
                </div>
              </motion.article>
            );
          }
        )}
    </div>
  </div>
)}

          <div
            className="
              mt-2
              flex
              items-center
              justify-between
              text-xs
              font-bold
              text-zinc-500
            "
          >
            <span>
              Niveau{" "}
              {summary.levelAfter}
            </span>

            <span>
              {Math.round(
                endPercentage
              )}
              %
            </span>
          </div>
        </div>

        {levelUp && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.85,
              y: 12,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              delay: 1.1,
              duration: 0.45,
              type: "spring",
              stiffness: 180,
              damping: 15,
            }}
            className="
              mt-5
              rounded-2xl
              border
              border-yellow-400/35
              bg-yellow-400/10
              px-5
              py-4
              text-center
            "
          >
            <p
              className="
                text-3xl
              "
              aria-hidden="true"
            >
              🎉
            </p>

            <p
              className="
                mt-2
                text-xs
                font-black
                uppercase
                tracking-[0.2em]
                text-yellow-400
              "
            >
              Niveau supérieur
            </p>

            <p
              className="
                mt-1
                text-xl
                font-black
                text-white
              "
            >
              Niveau{" "}
              {summary.levelBefore}
              {" → "}
              Niveau{" "}
              {summary.levelAfter}
            </p>
          </motion.div>
        )}

        {summary
          .unlockedAchievements
          .length > 0 && (
          <div className="mt-6">
            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.2em]
                text-yellow-400
              "
            >
              Succès débloqués
            </p>

            <div className="mt-3 space-y-3">
              {summary
                .unlockedAchievements
                .map(
                  (
                    achievement,
                    achievementIndex
                  ) => (
                    <motion.article
                      key={
                        achievement.id
                      }
                      initial={{
                        opacity: 0,
                        x: -18,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay:
                          1.3 +
                          achievementIndex *
                            0.12,

                        duration: 0.35,
                      }}
                      className="
                        flex
                        items-center
                        gap-3
                        rounded-2xl
                        border
                        border-white/10
                        bg-black/25
                        p-4
                      "
                    >
                      <div
                        aria-hidden="true"
                        className="
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-yellow-400
                          text-2xl
                        "
                      >
                        {
                          achievement.icon
                        }
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className="
                            truncate
                            font-black
                            text-white
                          "
                        >
                          {
                            achievement.title
                          }
                        </p>

                        <p
                          className="
                            mt-0.5
                            text-xs
                            text-zinc-500
                          "
                        >
                          {
                            achievement.description
                          }
                        </p>
                      </div>

                      <p
                        className="
                          shrink-0
                          text-xs
                          font-black
                          text-yellow-400
                        "
                      >
                        +
                        {
                          achievement
                            .xpReward
                        }
                        {" XP"}
                      </p>
                    </motion.article>
                  )
                )}
            </div>
          </div>
        )}

        {summary
          .unlockedTitles
          .length > 0 && (
          <div className="mt-6">
            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.2em]
                text-yellow-400
              "
            >
              Titres débloqués
            </p>

            <div className="mt-3 space-y-3">
              {summary
                .unlockedTitles
                .map(
                  (
                    title,
                    titleIndex
                  ) => (
                    <motion.article
                      key={
                        title.id
                      }
                      initial={{
                        opacity: 0,
                        y: 14,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay:
                          1.5 +
                          titleIndex *
                            0.12,

                        duration: 0.35,
                      }}
                      className="
                        flex
                        items-center
                        gap-3
                        rounded-2xl
                        border
                        border-yellow-400/25
                        bg-yellow-400/5
                        p-4
                      "
                    >
                      <div
                        aria-hidden="true"
                        className="
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-yellow-400
                          text-xl
                        "
                      >
                        👑
                      </div>

                      <div className="min-w-0">
                        <p
                          className="
                            font-black
                            text-white
                          "
                        >
                          {title.title}
                        </p>

                        <p
                          className="
                            mt-0.5
                            text-xs
                            text-zinc-500
                          "
                        >
                          {
                            title.description
                          }
                        </p>
                      </div>
                    </motion.article>
                  )
                )}
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}