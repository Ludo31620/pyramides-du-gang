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

    hidden:
      false,

    rarity:
      "COMMON",

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

    hidden:
      false,

    rarity:
      "RARE",

    target:
      10,

    getProgress(stats) {
      return stats.gamesPlayed;
    },
  },

  "twenty-five-games": {
    id:
      "twenty-five-games",

    title:
      "Membre régulier",

    description:
      "Terminer 25 parties.",

    icon:
      "🎲",

    premium:
      true,

    hidden:
      false,

    rarity:
      "RARE",

    target:
      25,

    getProgress(stats) {
      return stats.gamesPlayed;
    },
  },

  "fifty-games": {
    id:
      "fifty-games",

    title:
      "Pilier du Gang",

    description:
      "Terminer 50 parties.",

    icon:
      "🛋️",

    premium:
      true,

    hidden:
      false,

    rarity:
      "EPIC",

    target:
      50,

    getProgress(stats) {
      return stats.gamesPlayed;
    },
  },

  "hundred-games": {
    id:
      "hundred-games",

    title:
      "Vétéran",

    description:
      "Terminer 100 parties.",

    icon:
      "🎖️",

    premium:
      true,

    hidden:
      false,

    rarity:
      "EPIC",

    target:
      100,

    getProgress(stats) {
      return stats.gamesPlayed;
    },
  },

  "two-hundred-fifty-games": {
    id:
      "two-hundred-fifty-games",

    title:
      "Ancien du quartier",

    description:
      "Terminer 250 parties.",

    icon:
      "🧓",

    premium:
      true,

    hidden:
      true,

    rarity:
      "LEGENDARY",

    target:
      250,

    getProgress(stats) {
      return stats.gamesPlayed;
    },
  },

  "five-hundred-games": {
    id:
      "five-hundred-games",

    title:
      "Éternel membre du Gang",

    description:
      "Terminer 500 parties.",

    icon:
      "♾️",

    premium:
      true,

    hidden:
      true,

    rarity:
      "LEGENDARY",

    target:
      500,

    getProgress(stats) {
      return stats.gamesPlayed;
    },
  },

  "first-claim": {
    id:
      "first-claim",

    title:
      "Première annonce",

    description:
      "Faire une première annonce.",

    icon:
      "🗣️",

    premium:
      false,

    hidden:
      false,

    rarity:
      "COMMON",

    target:
      1,

    getProgress(stats) {
      return stats.claimsMade;
    },
  },

  "ten-claims": {
    id:
      "ten-claims",

    title:
      "Grande bouche",

    description:
      "Faire 10 annonces.",

    icon:
      "📣",

    premium:
      false,

    hidden:
      false,

    rarity:
      "COMMON",

    target:
      10,

    getProgress(stats) {
      return stats.claimsMade;
    },
  },

  "fifty-claims": {
    id:
      "fifty-claims",

    title:
      "Toujours quelque chose à dire",

    description:
      "Faire 50 annonces.",

    icon:
      "🎙️",

    premium:
      true,

    hidden:
      false,

    rarity:
      "RARE",

    target:
      50,

    getProgress(stats) {
      return stats.claimsMade;
    },
  },

  "hundred-claims": {
    id:
      "hundred-claims",

    title:
      "Orateur du Gang",

    description:
      "Faire 100 annonces.",

    icon:
      "📢",

    premium:
      true,

    hidden:
      false,

    rarity:
      "EPIC",

    target:
      100,

    getProgress(stats) {
      return stats.claimsMade;
    },
  },

  "five-hundred-claims": {
    id:
      "five-hundred-claims",

    title:
      "Micro permanent",

    description:
      "Faire 500 annonces.",

    icon:
      "🎤",

    premium:
      true,

    hidden:
      true,

    rarity:
      "LEGENDARY",

    target:
      500,

    getProgress(stats) {
      return stats.claimsMade;
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

    hidden:
      false,

    rarity:
      "COMMON",

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

    hidden:
      false,

    rarity:
      "RARE",

    target:
      10,

    getProgress(stats) {
      return stats.bluffsAttempted;
    },
  },

  "twenty-five-bluffs": {
    id:
      "twenty-five-bluffs",

    title:
      "Double visage",

    description:
      "Tenter 25 bluffs.",

    icon:
      "🎭",

    premium:
      true,

    hidden:
      false,

    rarity:
      "RARE",

    target:
      25,

    getProgress(stats) {
      return stats.bluffsAttempted;
    },
  },

  "fifty-bluffs": {
    id:
      "fifty-bluffs",

    title:
      "Professionnel du mensonge",

    description:
      "Tenter 50 bluffs.",

    icon:
      "🕶️",

    premium:
      true,

    hidden:
      false,

    rarity:
      "EPIC",

    target:
      50,

    getProgress(stats) {
      return stats.bluffsAttempted;
    },
  },

  "hundred-bluffs": {
    id:
      "hundred-bluffs",

    title:
      "On ne te croit plus",

    description:
      "Tenter 100 bluffs.",

    icon:
      "🐍",

    premium:
      true,

    hidden:
      true,

    rarity:
      "LEGENDARY",

    target:
      100,

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

    hidden:
      false,

    rarity:
      "COMMON",

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

    hidden:
      true,

    rarity:
      "EPIC",

    target:
      10,

    getProgress(stats) {
      return stats.successfulBluffs;
    },
  },

  "twenty-five-successful-bluffs": {
    id:
      "twenty-five-successful-bluffs",

    title:
      "Visage impassible",

    description:
      "Réussir 25 bluffs.",

    icon:
      "😐",

    premium:
      true,

    hidden:
      false,

    rarity:
      "EPIC",

    target:
      25,

    getProgress(stats) {
      return stats.successfulBluffs;
    },
  },

  "fifty-successful-bluffs": {
    id:
      "fifty-successful-bluffs",

    title:
      "Le Parrain",

    description:
      "Réussir 50 bluffs.",

    icon:
      "🤵",

    premium:
      true,

    hidden:
      true,

    rarity:
      "LEGENDARY",

    target:
      50,

    getProgress(stats) {
      return stats.successfulBluffs;
    },
  },

  "hundred-successful-bluffs": {
    id:
      "hundred-successful-bluffs",

    title:
      "Mensonge parfait",

    description:
      "Réussir 100 bluffs.",

    icon:
      "💎",

    premium:
      true,

    hidden:
      true,

    rarity:
      "LEGENDARY",

    target:
      100,

    getProgress(stats) {
      return stats.successfulBluffs;
    },
  },

  "ten-caught-bluffs": {
    id:
      "ten-caught-bluffs",

    title:
      "Pris la main dans le sac",

    description:
      "Se faire démasquer 10 fois.",

    icon:
      "🚨",

    premium:
      false,

    hidden:
      false,

    rarity:
      "RARE",

    target:
      10,

    getProgress(stats) {
      return stats.caughtBluffs;
    },
  },

  "fifty-caught-bluffs": {
    id:
      "fifty-caught-bluffs",

    title:
      "Aussi discret qu’une sirène",

    description:
      "Se faire démasquer 50 fois.",

    icon:
      "🚓",

    premium:
      true,

    hidden:
      true,

    rarity:
      "EPIC",

    target:
      50,

    getProgress(stats) {
      return stats.caughtBluffs;
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

    hidden:
      false,

    rarity:
      "RARE",

    target:
      100,

    getProgress(stats) {
      return stats.drinksGiven;
    },
  },

  "five-hundred-drinks-given": {
    id:
      "five-hundred-drinks-given",

    title:
      "Service continu",

    description:
      "Donner 500 gorgées.",

    icon:
      "🍺",

    premium:
      true,

    hidden:
      false,

    rarity:
      "EPIC",

    target:
      500,

    getProgress(stats) {
      return stats.drinksGiven;
    },
  },

  "thousand-drinks-given": {
    id:
      "thousand-drinks-given",

    title:
      "Patron du bar",

    description:
      "Donner 1 000 gorgées.",

    icon:
      "🏪",

    premium:
      true,

    hidden:
      true,

    rarity:
      "LEGENDARY",

    target:
      1000,

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

    hidden:
      true,

    rarity:
      "EPIC",

    target:
      100,

    getProgress(stats) {
      return stats.drinksReceived;
    },
  },

  "five-hundred-drinks-received": {
    id:
      "five-hundred-drinks-received",

    title:
      "Insubmersible",

    description:
      "Recevoir 500 gorgées.",

    icon:
      "🛟",

    premium:
      true,

    hidden:
      false,

    rarity:
      "EPIC",

    target:
      500,

    getProgress(stats) {
      return stats.drinksReceived;
    },
  },

  "thousand-drinks-received": {
    id:
      "thousand-drinks-received",

    title:
      "La légende raconte qu’il tient encore debout",

    description:
      "Recevoir 1 000 gorgées.",

    icon:
      "🧟",

    premium:
      true,

    hidden:
      true,

    rarity:
      "LEGENDARY",

    target:
      1000,

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