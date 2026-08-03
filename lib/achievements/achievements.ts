import type {
  AchievementDefinition,
  AchievementId,
} from "./types";

export const ACHIEVEMENTS:
  Record<
    AchievementId,
    AchievementDefinition
  > = {
  "first-game": {
    id:
      "first-game",

    title:
      "Première partie",

    description:
      "Terminer une première partie.",

    icon:
      "🎮",

    premium:
      false,

    target:
      1,

    getProgress(stats) {
      return stats.gamesPlayed;
    },
  },

  "ten-games": {
    id:
      "ten-games",

    title:
      "Habitué du Gang",

    description:
      "Terminer 10 parties.",

    icon:
      "🔥",

    premium:
      true,

    target:
      10,

    getProgress(stats) {
      return stats.gamesPlayed;
    },
  },

  "first-bluff": {
    id:
      "first-bluff",

    title:
      "Premier bluff",

    description:
      "Tenter un premier bluff.",

    icon:
      "🎭",

    premium:
      false,

    target:
      1,

    getProgress(stats) {
      return stats.bluffsAttempted;
    },
  },

  "ten-bluffs": {
    id:
      "ten-bluffs",

    title:
      "Menteur confirmé",

    description:
      "Tenter 10 bluffs.",

    icon:
      "🤥",

    premium:
      true,

    target:
      10,

    getProgress(stats) {
      return stats.bluffsAttempted;
    },
  },

  "first-successful-bluff": {
    id:
      "first-successful-bluff",

    title:
      "Ils n’ont rien vu",

    description:
      "Réussir un premier bluff.",

    icon:
      "😈",

    premium:
      false,

    target:
      1,

    getProgress(stats) {
      return stats.successfulBluffs;
    },
  },

  "ten-successful-bluffs": {
    id:
      "ten-successful-bluffs",

    title:
      "Maître du bluff",

    description:
      "Réussir 10 bluffs.",

    icon:
      "👑",

    premium:
      true,

    target:
      10,

    getProgress(stats) {
      return stats.successfulBluffs;
    },
  },

  "hundred-drinks-given": {
    id:
      "hundred-drinks-given",

    title:
      "Barman du Gang",

    description:
      "Donner 100 gorgées.",

    icon:
      "🍻",

    premium:
      true,

    target:
      100,

    getProgress(stats) {
      return stats.drinksGiven;
    },
  },

  "hundred-drinks-received": {
    id:
      "hundred-drinks-received",

    title:
      "Éponge officielle",

    description:
      "Recevoir 100 gorgées.",

    icon:
      "🥴",

    premium:
      true,

    target:
      100,

    getProgress(stats) {
      return stats.drinksReceived;
    },
  },
};

export function getAchievement(
  achievementId:
    AchievementId
): AchievementDefinition {
  return ACHIEVEMENTS[
    achievementId
  ];
}

export function getAllAchievements():
  AchievementDefinition[] {
  return Object.values(
    ACHIEVEMENTS
  );
}