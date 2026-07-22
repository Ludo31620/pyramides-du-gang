export type Regle = {
  titre: string;
  description: string;
  gorgees: number;
};

export const REGLES = {
  As: {
    titre: "Tout le monde boit",
    description: "Tous les joueurs boivent.",
    gorgees: 2,
  },

  Roi: {
    titre: "Choisis un joueur",
    description: "Choisis quelqu'un qui boit.",
    gorgees: 3,
  },

  Dame: {
    titre: "Les filles boivent",
    description: "Toutes les filles boivent.",
    gorgees: 2,
  },

  Valet: {
    titre: "Les garçons boivent",
    description: "Tous les garçons boivent.",
    gorgees: 2,
  },

  "10": {
    titre: "Distribue",
    description: "Distribue les gorgées.",
    gorgees: 10,
  },

  "9": {
    titre: "Bois",
    description: "Tu bois.",
    gorgees: 9,
  },

  "8": {
    titre: "À gauche",
    description: "Ton voisin de gauche boit.",
    gorgees: 8,
  },

  "7": {
    titre: "À droite",
    description: "Ton voisin de droite boit.",
    gorgees: 7,
  },

  "6": {
    titre: "Les garçons",
    description: "Tous les garçons boivent.",
    gorgees: 6,
  },

  "5": {
    titre: "Les filles",
    description: "Toutes les filles boivent.",
    gorgees: 5,
  },

  "4": {
    titre: "Question",
    description: "Pose une question.",
    gorgees: 4,
  },

  "3": {
    titre: "Jeu",
    description: "Mini-jeu.",
    gorgees: 3,
  },

  "2": {
    titre: "Donne",
    description: "Donne des gorgées.",
    gorgees: 2,
  },
} satisfies Record<string, Regle>;