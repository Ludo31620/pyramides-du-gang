import type {
  AchievementDefinition,
  PlayerProgress,
} from "./types";

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "FIRST_GAME",
    title: "Première partie",
    description:
      "Jouer une première partie.",
    icon: "🎉",
    xpReward: 50,
  },

  {
    id: "TEN_GAMES",
    title: "Habitué",
    description:
      "Jouer 10 parties.",
    icon: "🎮",
    xpReward: 100,
  },

  {
    id: "HUNDRED_GAMES",
    title: "Vétéran",
    description:
      "Jouer 100 parties.",
    icon: "🏆",
    xpReward: 300,
  },

  {
    id: "FIRST_WIN",
    title: "Première victoire",
    description:
      "Remporter une partie.",
    icon: "🥇",
    xpReward: 50,
  },

  {
    id: "TEN_WINS",
    title: "Champion",
    description:
      "Remporter 10 parties.",
    icon: "👑",
    xpReward: 150,
  },

  {
    id: "FIRST_BLUFF",
    title: "Petit menteur",
    description:
      "Réussir un bluff.",
    icon: "🎭",
    xpReward: 50,
  },

  {
    id: "TEN_SUCCESSFUL_BLUFFS",
    title: "Maître du bluff",
    description:
      "Réussir 10 bluffs.",
    icon: "😈",
    xpReward: 150,
  },

  {
    id: "HUNDRED_DRINKS_GIVEN",
    title: "Barman",
    description:
      "Distribuer 100 gorgées.",
    icon: "🍺",
    xpReward: 100,
  },

  {
    id: "HUNDRED_DRINKS_TAKEN",
    title: "Cobaye",
    description:
      "Boire 100 gorgées.",
    icon: "🥴",
    xpReward: 100,
  },

  {
    id: "FIRST_MEMORY_MASTER",
    title: "Mémoire parfaite",
    description:
      "Finir une mémoire sans joker.",
    icon: "🧠",
    xpReward: 120,
  },
];

export function getUnlockedAchievements(
  progress: PlayerProgress
): AchievementDefinition[] {
  const unlocked =
    new Set(
      progress.unlockedAchievements.map(
        (
          achievement
        ) =>
          achievement.id
      )
    );

  return ACHIEVEMENTS.filter(
    (
      achievement
    ) => {
      if (
        unlocked.has(
          achievement.id
        )
      ) {
        return false;
      }

      const stats =
        progress.stats;

      switch (
        achievement.id
      ) {
        case "FIRST_GAME":
          return (
            stats.gamesPlayed >=
            1
          );

        case "TEN_GAMES":
          return (
            stats.gamesPlayed >=
            10
          );

        case "HUNDRED_GAMES":
          return (
            stats.gamesPlayed >=
            100
          );

        case "FIRST_WIN":
          return (
            stats.gamesWon >=
            1
          );

        case "TEN_WINS":
          return (
            stats.gamesWon >=
            10
          );

        case "FIRST_BLUFF":
          return (
            stats.successfulBluffs >=
            1
          );

        case "TEN_SUCCESSFUL_BLUFFS":
          return (
            stats.successfulBluffs >=
            10
          );

        case "HUNDRED_DRINKS_GIVEN":
          return (
            stats.drinksGiven >=
            100
          );

        case "HUNDRED_DRINKS_TAKEN":
          return (
            stats.drinksTaken >=
            100
          );

        case "FIRST_MEMORY_MASTER":
          return (
            stats.memoryRoundsCompletedWithoutJoker >=
            1
          );

        default:
          return false;
      }
    }
  );
}