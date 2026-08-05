import type {
  Carte,
} from "@/lib/deck";

import type {
  GameState as ServerGameState,
} from "@/lib/gameEngine/types";

/**
 * Représentation publique d'une carte
 * présente dans la pyramide.
 *
 * Une carte cachée ne transmet jamais
 * sa valeur au client.
 */
export interface PublicPyramidCard {
  hidden: boolean;

  card:
    | Carte
    | null;
}

/**
 * État du jeu autorisé à être envoyé
 * à un joueur.
 *
 * Il reprend l'état interne du serveur,
 * mais remplace les informations privées
 * par leur représentation filtrée.
 */
export interface PlayerGameState
  extends Omit<
    ServerGameState,
    "players" | "pyramid"
  > {
  /**
   * Index du joueur auquel cet état
   * est destiné.
   */
  viewerPlayerIndex: number;

  /**
   * Indique quels joueurs sont
   * actuellement connectés au serveur.
   *
   * L'index correspond à celui du joueur
   * dans la liste du salon.
   *
   * Les bots sont toujours considérés
   * comme connectés.
   */
  connectedPlayers:
    boolean[];

  /**
   * La main du joueur connecté est visible.
   *
   * Les cartes des autres joueurs sont
   * remplacées par null.
   */
  players:
    Array<
      Array<
        Carte | null
      >
    >;

  /**
   * La structure de la pyramide reste visible,
   * mais la valeur des cartes cachées n'est
   * jamais envoyée.
   */
  pyramid:
    PublicPyramidCard[][];

  /**
   * Carte utilisée uniquement par l'hôte
   * pour lancer l'animation de révélation.
   *
   * Elle reste null pour les autres joueurs.
   */
  nextCardForReveal:
    | Carte
    | null;
}