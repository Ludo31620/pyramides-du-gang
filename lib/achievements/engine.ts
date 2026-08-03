import {
  unlockAchievements,
} from "./storage";

import type {
  UnlockedAchievement,
} from "./types";

import type {
  PlayerLifetimeStats,
} from "@/lib/stats/types";

export interface AchievementEngineResult {
  unlocked:
    UnlockedAchievement[];
}

export function checkAchievements(
  stats: PlayerLifetimeStats
): AchievementEngineResult {
  const unlocked =
    unlockAchievements(
      stats
    );

  return {
    unlocked,
  };
}