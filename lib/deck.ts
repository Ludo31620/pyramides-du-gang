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

export function melangerPaquet(paquet: Carte[]): Carte[] {
  const melange = [...paquet];

  for (let i = melange.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [melange[i], melange[j]] = [melange[j], melange[i]];
  }

  return melange;
}

export function distribuerCartes(
  paquet: Carte[],
  nombreJoueurs: number
): {
  mains: Carte[][];
  paquetRestant: Carte[];
} {
  const paquetTravail = [...paquet];

  const mains: Carte[][] = [];

  for (let i = 0; i < nombreJoueurs; i++) {
    mains.push([]);
  }

  for (let tour = 0; tour < 4; tour++) {
    for (let joueur = 0; joueur < nombreJoueurs; joueur++) {
      const carte = paquetTravail.shift();

      if (carte) {
        mains[joueur].push(carte);
      }
    }
  }

  return {
    mains,
    paquetRestant: paquetTravail,
  };
}