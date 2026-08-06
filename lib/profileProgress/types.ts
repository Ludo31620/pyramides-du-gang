export type AchievementId =
  | "FIRST_GAME"
  | "TEN_GAMES"
  | "HUNDRED_GAMES"
  | "FIRST_WIN"
  | "TEN_WINS"
  | "TWENTY_FIVE_WINS"
  | "FIRST_BLUFF"
  | "TEN_SUCCESSFUL_BLUFFS"
  | "FIFTY_SUCCESSFUL_BLUFFS"
  | "HUNDRED_SUCCESSFUL_BLUFFS"
  | "HUNDRED_DRINKS_GIVEN"
  | "FIVE_HUNDRED_DRINKS_GIVEN"
  | "THOUSAND_DRINKS_GIVEN"
  | "HUNDRED_DRINKS_TAKEN"
  | "FIVE_HUNDRED_DRINKS_TAKEN"
  | "FIRST_MEMORY_JOKER"
  | "TEN_MEMORY_JOKERS"
  | "FIFTY_MEMORY_JOKERS"
  | "FIRST_PERFECT_DISTRIBUTION"
  | "TEN_PERFECT_DISTRIBUTIONS"
  | "FIRST_MEMORY_MASTER"
  | "TEN_MEMORY_MASTERS";

export type PlayerTitleId =
  | "NEWCOMER"
  | "GANG_MEMBER"
  | "BLUFFER"
  | "MASTER_BLUFFER"
  | "PYRAMID_KING"
  | "MEMORY_MASTER"
  | "DRINK_DEALER"
  | "VETERAN";

export interface PlayerProgressStats {
  gamesPlayed: number;

  gamesWon: number;

  currentWinStreak: number;

  bestWinStreak: number;

  drinksGiven: number;

  drinksTaken: number;

  claimsMade: number;

  bluffsAttempted: number;

  successfulBluffs: number;

  caughtBluffs: number;

  distributionAnswers: number;

  correctDistributionAnswers: number;

  perfectDistributions: number;

  memoryJokersUsed: number;

  memoryRoundsCompletedWithoutJoker:
    number;

  cardsRevealed: number;

  totalPlayTimeMs: number;
}

export interface UnlockedAchievement {
  id: AchievementId;

  unlockedAt: number;
}

export interface PlayerProgress {
  version: number;

  totalXp: number;

  selectedTitle:
    | PlayerTitleId
    | null;

  unlockedTitles:
    PlayerTitleId[];

  unlockedAchievements:
    UnlockedAchievement[];

  stats:
    PlayerProgressStats;

  createdAt: number;

  updatedAt: number;
}

export interface LevelProgress {
  level: number;

  currentLevelXp: number;

  requiredXpForNextLevel:
    number;

  totalXp: number;

  progressRatio: number;

  isMaxLevel: boolean;
}

export interface LevelReward {
  level: number;

  type:
    | "TITLE"
    | "AVATAR"
    | "FRAME"
    | "THEME";

  rewardId: string;

  label: string;
}

export interface AchievementDefinition {
  id: AchievementId;

  title: string;

  description: string;

  icon: string;

  xpReward: number;

  hidden?: boolean;
}

export interface PlayerTitleDefinition {
  id: PlayerTitleId;

  title: string;

  description: string;

  minimumLevel?: number;
}

export interface CompletedGameProgressInput {
  won: boolean;

  drinksGiven: number;

  drinksTaken: number;

  claimsMade: number;

  bluffsAttempted: number;

  successfulBluffs: number;

  caughtBluffs: number;

  distributionAnswers: number;

  correctDistributionAnswers:
    number;

  usedMemoryJokers: number;

  completedMemoryWithoutJoker:
    boolean;

  cardsRevealed: number;

  playTimeMs: number;
}

export interface ProgressUpdateResult {
  progress:
    PlayerProgress;

  xpGained: number;

  unlockedAchievements:
    AchievementDefinition[];

  unlockedTitles:
    PlayerTitleDefinition[];

  unlockedRewards:
    LevelReward[];

  levelBefore: number;

  levelAfter: number;
}