import type { GameState } from "@/lib/gameEngine/types";

type PartieLocale = {
  pseudo: string;
  joueurs: number;
  code: string;
};

export function useGameUI(
  partie: GameState | null,
  configuration: PartieLocale | null,
  localPlayer: number
) {
  if (!partie || !configuration) {
    return null;
  }

  const joueurLocal =
    localPlayer < partie.players.length
      ? localPlayer
      : 0;

  const mainJoueur =
    partie.players[joueurLocal] ?? [];

  const nomJoueur =
    joueurLocal === 0
      ? configuration.pseudo
      : `Joueur ${joueurLocal + 1}`;

  const estMonTour =
    partie.turn.currentPlayer ===
    joueurLocal;

  const joueurActif =
    partie.turn.currentPlayer;

  const numeroJoueurActif =
    joueurActif + 1;

  const numeroCarte =
    partie.progress.revealedCards;

  const totalCartes =
    partie.progress.totalCards;

  const actionEnAttente =
    partie.turn.pendingAction;

  const estMaReponse =
    actionEnAttente?.target ===
    joueurLocal;

  const ciblesPossibles =
    partie.players
      .map((_, index) => index)
      .filter(
        (index) =>
          index !== joueurActif
      );

  const nombreGorgees =
    partie.current.row + 1;

  const dernierEvenement =
    partie.history[
      partie.history.length - 1
    ];

  return {
    joueurLocal,
    mainJoueur,
    nomJoueur,
    estMonTour,
    joueurActif,
    numeroJoueurActif,
    numeroCarte,
    totalCartes,
    actionEnAttente,
    estMaReponse,
    ciblesPossibles,
    nombreGorgees,
    dernierEvenement,
  };
}