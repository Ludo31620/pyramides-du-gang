import type {
  AchievementDefinition,
  LevelReward,
  PlayerTitleDefinition,
  ProgressUpdateResult,
} from "./types";

export interface GameOverSummary {
  /**
   * Total d’XP gagné pendant cette partie,
   * succès compris.
   */
  xpGained: number;

  /**
   * Niveau du joueur avant l’enregistrement
   * de la partie.
   */
  levelBefore: number;

  /**
   * Niveau du joueur après l’enregistrement
   * de la partie.
   */
  levelAfter: number;

  /**
   * Succès débloqués grâce à cette partie.
   */
  unlockedAchievements:
    AchievementDefinition[];

  /**
   * Titres débloqués grâce à cette partie.
   */
  unlockedTitles:
    PlayerTitleDefinition[];

  /**
   * Récompenses de niveau débloquées
   * grâce à cette partie.
   */
  unlockedRewards:
    LevelReward[];
}

export function createGameOverSummary(
  result:
    ProgressUpdateResult
): GameOverSummary {
  return {
    xpGained:
      result.xpGained,

    levelBefore:
      result.levelBefore,

    levelAfter:
      result.levelAfter,

    unlockedAchievements: [
      ...result
        .unlockedAchievements,
    ],

    unlockedTitles: [
      ...result
        .unlockedTitles,
    ],

    unlockedRewards: [
      ...result
        .unlockedRewards,
    ],
  };
}