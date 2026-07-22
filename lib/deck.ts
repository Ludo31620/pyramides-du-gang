export type Couleur = "♠" | "♥" | "♦" | "♣";

export type Valeur =
  | "As"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "Valet"
  | "Dame"
  | "Roi";


export type Carte = {
  valeur: Valeur;
  couleur: Couleur;
};


const couleurs: Couleur[] = [
  "♠",
  "♥",
  "♦",
  "♣",
];


const valeurs: Valeur[] = [
  "As",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "Valet",
  "Dame",
  "Roi",
];


export function creerPaquet(): Carte[] {
  const paquet: Carte[] = [];

  for (const couleur of couleurs) {
    for (const valeur of valeurs) {
      paquet.push({
        valeur,
        couleur,
      });
    }
  }

  return paquet;
}