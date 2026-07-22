import {
  creerPaquet,
  melangerPaquet,
  distribuerCartes,
} from "@/lib/deck";

import { creerPyramide } from "@/lib/pyramid";

import { GameState } from "@/types/gameState";

export function generateGameCode() {
  const letters = "PG";
  const numbers = Math.floor(1000 + Math.random() * 9000);

  return `${letters}-${numbers}`;
}

export function creerPartie(
  nombreJoueurs: number
): GameState {
  const paquet = melangerPaquet(
    creerPaquet()
  );

  const {
    mains,
    paquetRestant,
  } = distribuerCartes(
    paquet,
    nombreJoueurs
  );

  const pyramide =
    creerPyramide(paquetRestant);

  const cartesRestantes =
    paquetRestant.slice(15);

  return {
    paquet,
    mains,
    pyramide,
    cartesRestantes,
  };
}