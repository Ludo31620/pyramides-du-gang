import type {
  PlayerLifetimeStats,
} from "@/lib/stats/types";

export type AchievementId =
  | "first-game"
  | "ten-games"
  | "first-bluff"
  | "ten-bluffs"
  | "first-successful-bluff"
  | "ten-successful-bluffs"
  | "hundred-drinks-given"
  | "hundred-drinks-received";

export type AchievementRarity =
  | "COMMON"
  | "RARE"
  | "EPIC"
  | "LEGENDARY";

export interface AchievementDefinition {
  id: AchievementId;

  title: string;

  description: string;

  icon: string;

  premium: boolean;

  hidden: boolean;

  rarity:
    AchievementRarity;

  getProgress: (
    stats: PlayerLifetimeStats
  ) => number;

  target: number;
}

export interface UnlockedAchievement {
  id: AchievementId;

  unlockedAt: number;
}