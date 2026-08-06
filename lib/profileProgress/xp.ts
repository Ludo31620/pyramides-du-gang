import type {
  LevelProgress,
} from "./types";

/**
 * XP nécessaire pour atteindre
 * chaque niveau.
 *
 * Niveau 1 = 0 XP.
 */
export function getRequiredXpForLevel(
  level: number
): number {
  if (level <= 1) {
    return 0;
  }

  return Math.round(
    100 *
      Math.pow(
        level - 1,
        1.5
      )
  );
}

export function getLevelFromXp(
  totalXp: number
): number {
  let level = 1;

  while (
    totalXp >=
    getRequiredXpForLevel(
      level + 1
    )
  ) {
    level++;
  }

  return level;
}

export function getLevelProgress(
  totalXp: number
): LevelProgress {
  const level =
    getLevelFromXp(
      totalXp
    );

  const currentLevelXp =
    getRequiredXpForLevel(
      level
    );

  const nextLevelXp =
    getRequiredXpForLevel(
      level + 1
    );

  const requiredXp =
    nextLevelXp -
    currentLevelXp;

  const currentXp =
    totalXp -
    currentLevelXp;

  return {
    level,

    totalXp,

    currentLevelXp:
      currentXp,

    requiredXpForNextLevel:
      requiredXp,

    progressRatio:
      requiredXp === 0
        ? 1
        : currentXp /
          requiredXp,

    isMaxLevel:
      false,
  };
}

export function addXp(
  currentXp: number,
  gainedXp: number
): number {
  return Math.max(
    0,
    currentXp +
      gainedXp
  );
}