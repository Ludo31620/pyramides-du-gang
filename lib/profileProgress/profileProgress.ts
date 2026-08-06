import {
  getUnlockedAchievements,
} from "./achievements";

import {
  addXp,
  getLevelFromXp,
} from "./xp";

import type {
  AchievementDefinition,
  CompletedGameProgressInput,
  PlayerProgress,
  PlayerProgressStats,
  ProgressUpdateResult,
} from "./types";

const PROFILE_VERSION =
  1;

function createEmptyStats():
  PlayerProgressStats {
  return {
    gamesPlayed:
      0,

    gamesWon:
      0,

    currentWinStreak:
      0,

    bestWinStreak:
      0,

    drinksGiven:
      0,

    drinksTaken:
      0,

    claimsMade:
      0,

    bluffsAttempted:
      0,

    successfulBluffs:
      0,

    caughtBluffs:
      0,

    distributionAnswers:
      0,

    correctDistributionAnswers:
      0,

    perfectDistributions:
      0,

    memoryJokersUsed:
      0,

    memoryRoundsCompletedWithoutJoker:
      0,

    cardsRevealed:
      0,

    totalPlayTimeMs:
      0,
  };
}

export function createPlayerProgress():
  PlayerProgress {
  const now =
    Date.now();

  return {
    version:
      PROFILE_VERSION,

    totalXp:
      0,

    selectedTitle:
      null,

    unlockedTitles:
      [],

    unlockedAchievements:
      [],

    stats:
      createEmptyStats(),

    createdAt:
      now,

    updatedAt:
      now,
  };
}

function calculateGameXp(
  input:
    CompletedGameProgressInput
): number {
  let xp =
    20;

  if (
    input.won
  ) {
    xp +=
      40;
  }

  xp +=
    input.successfulBluffs *
    8;

  if (
    input.completedMemoryWithoutJoker
  ) {
    xp +=
      20;
  }

  const perfectDistribution =
    input.distributionAnswers >
      0 &&
    input.correctDistributionAnswers ===
      input.distributionAnswers;

  if (
    perfectDistribution
  ) {
    xp +=
      15;
  }

  return xp;
}

function updateStats(
  stats:
    PlayerProgressStats,

  input:
    CompletedGameProgressInput
): PlayerProgressStats {
  const perfectDistribution =
    input.distributionAnswers >
      0 &&
    input.correctDistributionAnswers ===
      input.distributionAnswers;

  const nextWinStreak =
    input.won
      ? stats.currentWinStreak +
        1
      : 0;

  return {
    ...stats,

    gamesPlayed:
      stats.gamesPlayed +
      1,

    gamesWon:
      stats.gamesWon +
      (
        input.won
          ? 1
          : 0
      ),

    currentWinStreak:
      nextWinStreak,

    bestWinStreak:
      Math.max(
        stats.bestWinStreak,
        nextWinStreak
      ),

    drinksGiven:
      stats.drinksGiven +
      input.drinksGiven,

    drinksTaken:
      stats.drinksTaken +
      input.drinksTaken,

    claimsMade:
      stats.claimsMade +
      input.claimsMade,

    bluffsAttempted:
      stats.bluffsAttempted +
      input.bluffsAttempted,

    successfulBluffs:
      stats.successfulBluffs +
      input.successfulBluffs,

    caughtBluffs:
      stats.caughtBluffs +
      input.caughtBluffs,

    distributionAnswers:
      stats.distributionAnswers +
      input.distributionAnswers,

    correctDistributionAnswers:
      stats.correctDistributionAnswers +
      input.correctDistributionAnswers,

    perfectDistributions:
      stats.perfectDistributions +
      (
        perfectDistribution
          ? 1
          : 0
      ),

    memoryJokersUsed:
      stats.memoryJokersUsed +
      input.usedMemoryJokers,

    memoryRoundsCompletedWithoutJoker:
      stats
        .memoryRoundsCompletedWithoutJoker +
      (
        input.completedMemoryWithoutJoker
          ? 1
          : 0
      ),

    cardsRevealed:
      stats.cardsRevealed +
      input.cardsRevealed,

    totalPlayTimeMs:
      stats.totalPlayTimeMs +
      input.playTimeMs,
  };
}

function unlockAchievements(
  progress:
    PlayerProgress
): AchievementDefinition[] {
  const achievements =
    getUnlockedAchievements(
      progress
    );

  if (
    achievements.length ===
    0
  ) {
    return [];
  }

  const unlockedAt =
    Date.now();

  progress.unlockedAchievements = [
    ...progress.unlockedAchievements,

    ...achievements.map(
      (
        achievement
      ) => ({
        id:
          achievement.id,

        unlockedAt,
      })
    ),
  ];

  return achievements;
}

export function applyCompletedGame(
  currentProgress:
    PlayerProgress,

  input:
    CompletedGameProgressInput
): ProgressUpdateResult {
  const levelBefore =
    getLevelFromXp(
      currentProgress.totalXp
    );

  const progress:
    PlayerProgress = {
    ...currentProgress,

    stats:
      updateStats(
        currentProgress.stats,
        input
      ),

    unlockedTitles: [
      ...currentProgress
        .unlockedTitles,
    ],

    unlockedAchievements: [
      ...currentProgress
        .unlockedAchievements,
    ],

    updatedAt:
      Date.now(),
  };

  const gameXp =
    calculateGameXp(
      input
    );

  progress.totalXp =
    addXp(
      progress.totalXp,
      gameXp
    );

  const unlockedAchievements =
    unlockAchievements(
      progress
    );

  const achievementXp =
    unlockedAchievements.reduce(
      (
        total,
        achievement
      ) =>
        total +
        achievement.xpReward,
      0
    );

  progress.totalXp =
    addXp(
      progress.totalXp,
      achievementXp
    );

  progress.updatedAt =
    Date.now();

  const levelAfter =
    getLevelFromXp(
      progress.totalXp
    );

  return {
    progress,

    xpGained:
      gameXp +
      achievementXp,

    unlockedAchievements,

    unlockedTitles:
      [],

    levelBefore,

    levelAfter,
  };
}