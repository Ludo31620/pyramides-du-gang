import type {
  PlayerLifetimeStats,
} from "@/lib/stats/types";

export type AchievementId =
  | "first-game"
  | "ten-games"
  | "twenty-five-games"
  | "fifty-games"
  | "hundred-games"
  | "two-hundred-fifty-games"
  | "five-hundred-games"
  | "first-claim"
  | "ten-claims"
  | "fifty-claims"
  | "hundred-claims"
  | "five-hundred-claims"
  | "first-bluff"
  | "ten-bluffs"
  | "twenty-five-bluffs"
  | "fifty-bluffs"
  | "hundred-bluffs"
  | "first-successful-bluff"
  | "ten-successful-bluffs"
  | "twenty-five-successful-bluffs"
  | "fifty-successful-bluffs"
  | "hundred-successful-bluffs"
  | "ten-caught-bluffs"
  | "fifty-caught-bluffs"
  | "hundred-drinks-given"
  | "five-hundred-drinks-given"
  | "thousand-drinks-given"
  | "hundred-drinks-received"
  | "five-hundred-drinks-received"
  | "thousand-drinks-received";

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