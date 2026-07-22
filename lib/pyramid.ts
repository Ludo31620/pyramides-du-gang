import { Carte } from "@/lib/deck";

export function creerPyramide(paquet: Carte[]): Carte[][] {
  const pyramide: Carte[][] = [];

  let index = 0;

  for (let ligne = 1; ligne <= 5; ligne++) {
    const rangee: Carte[] = [];

    for (let i = 0; i < ligne; i++) {
      rangee.push(paquet[index]);
      index++;
    }

    pyramide.push(rangee);
  }

  return pyramide;
}