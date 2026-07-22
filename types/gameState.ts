import { Carte } from "@/lib/deck";

export type GameState = {
  paquet: Carte[];

  mains: Carte[][];

  pyramide: Carte[][];

  cartesRestantes: Carte[];
};