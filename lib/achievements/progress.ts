import type {
  PlayerLifetimeStats,
} from "@/lib/stats/types";

import type {
  AchievementDefinition,
} from "./types";

export interface AchievementProgress {
  current: number;

  target: number;

  percentage: number;

  completed: boolean;
}

function normalizeProgressValue(
  value: number
): number {
  if (
    !Number.isFinite(value) ||
    value < 0
  ) {
    return 0;
  }

  return Math.floor(value);
}

export function getAchievementProgress(
  achievement:
    AchievementDefinition,
  stats:
    PlayerLifetimeStats
): AchievementProgress {
  const target =
    Math.max(
      1,
      normalizeProgressValue(
        achievement.target
      )
    );

  const current =
    normalizeProgressValue(
      achievement.getProgress(
        stats
      )
    );

  const percentage =
    Math.min(
      100,
      Math.round(
        (
          current /
          target
        ) * 100
      )
    );

  return {
    current,

    target,

    percentage,

    completed:
      current >= target,
  };
}