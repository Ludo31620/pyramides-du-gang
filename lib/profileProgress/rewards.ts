import type {
  LevelReward,
} from "./types";

export const LEVEL_REWARDS:
  LevelReward[] = [
  {
    level: 2,

    type:
      "TITLE",

    rewardId:
      "NEWCOMER",

    label:
      "Titre : Nouvelle recrue",
  },

  {
    level: 5,

    type:
      "TITLE",

    rewardId:
      "GANG_MEMBER",

    label:
      "Titre : Membre du Gang",
  },

  {
    level: 8,

    type:
      "AVATAR",

    rewardId:
      "wolf",

    label:
      "Avatar : Loup",
  },

  {
    level: 10,

    type:
      "FRAME",

    rewardId:
      "bronze",

    label:
      "Cadre : Bronze",
  },

  {
    level: 12,

    type:
      "TITLE",

    rewardId:
      "BLUFFER",

    label:
      "Titre : Bluffeur",
  },

  {
    level: 15,

    type:
      "AVATAR",

    rewardId:
      "dragon",

    label:
      "Avatar : Dragon",
  },

  {
    level: 20,

    type:
      "FRAME",

    rewardId:
      "gold",

    label:
      "Cadre : Or",
  },

  {
    level: 25,

    type:
      "TITLE",

    rewardId:
      "MASTER_BLUFFER",

    label:
      "Titre : Maître du Bluff",
  },

  {
    level: 30,

    type:
      "THEME",

    rewardId:
      "royal",

    label:
      "Thème : Royal",
  },

  {
    level: 40,

    type:
      "TITLE",

    rewardId:
      "PYRAMID_KING",

    label:
      "Titre : Roi de la Pyramide",
  },

  {
    level: 50,

    type:
      "FRAME",

    rewardId:
      "legendary",

    label:
      "Cadre : Légendaire",
  },
];

export function getRewardsUnlockedBetweenLevels(
  levelBefore: number,
  levelAfter: number
): LevelReward[] {
  if (
    levelAfter <=
    levelBefore
  ) {
    return [];
  }

  return LEVEL_REWARDS.filter(
    (
      reward
    ) =>
      reward.level >
        levelBefore &&
      reward.level <=
        levelAfter
  );
}