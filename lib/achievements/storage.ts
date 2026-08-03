import {
  getAllAchievements,
} from "./achievements";

import type {
  AchievementId,
  UnlockedAchievement,
} from "./types";

import type {
  PlayerLifetimeStats,
} from "@/lib/stats/types";

const STORAGE_KEY =
  "pyramides-du-gang-achievements";

export function getUnlockedAchievements():
  UnlockedAchievement[] {
  if (
    typeof window ===
    "undefined"
  ) {
    return [];
  }

  const value =
    localStorage.getItem(
      STORAGE_KEY
    );

  if (!value) {
    return [];
  }

  try {
    return JSON.parse(
      value
    ) as UnlockedAchievement[];
  } catch {
    return [];
  }
}

export function saveUnlockedAchievements(
  achievements: UnlockedAchievement[]
): void {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      achievements
    )
  );
}

export function unlockAchievements(
  stats: PlayerLifetimeStats
): UnlockedAchievement[] {
  const unlocked =
    getUnlockedAchievements();

  const unlockedIds =
    new Set(
      unlocked.map(
        (
          achievement
        ) =>
          achievement.id
      )
    );

  const newlyUnlocked:
    UnlockedAchievement[] =
    [];

  for (const achievement of getAllAchievements()) {
    if (
      unlockedIds.has(
        achievement.id
      )
    ) {
      continue;
    }

    if (
      achievement.getProgress(
        stats
      ) >=
      achievement.target
    ) {
      newlyUnlocked.push({
        id:
          achievement.id,

        unlockedAt:
          Date.now(),
      });
    }
  }

  if (
    newlyUnlocked.length >
    0
  ) {
    saveUnlockedAchievements([
      ...unlocked,
      ...newlyUnlocked,
    ]);
  }

  return newlyUnlocked;
}

export function hasAchievement(
  achievementId:
    AchievementId
): boolean {
  return getUnlockedAchievements().some(
    (
      achievement
    ) =>
      achievement.id ===
      achievementId
  );
}

export function resetAchievements():
  void {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  localStorage.removeItem(
    STORAGE_KEY
  );
}