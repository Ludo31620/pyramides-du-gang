import type {
  Carte,
} from "@/lib/deck";

export type Phase =
  | "DISTRIBUTION"
  | "MEMORY"
  | "WAITING"
  | "PLAYER_TURN"
  | "PLAYER_RESPONSE"
  | "BLUFF_RESULT"
  | "GAME_OVER";

export type DistributionQuestion =
  | 0
  | 1
  | 2
  | 3;

export type DistributionAnswer =
  | "RED"
  | "BLACK"
  | "HIGHER"
  | "LOWER"
  | "INSIDE"
  | "OUTSIDE"
  | "SPADES"
  | "HEARTS"
  | "DIAMONDS"
  | "CLUBS";

export interface DistributionResult {
  player: number;
  question: DistributionQuestion;
  answer: DistributionAnswer;
  card: Carte;
  correct: boolean;
}

export interface DistributionDrink {
  giver: number;
  target: number;
}

export interface DistributionState {
  currentPlayer: number;
  question: DistributionQuestion;

  /**
   * Devient true après une bonne réponse.
   * Le joueur doit alors désigner quelqu’un
   * à qui donner une gorgée.
   */
  awaitingGive: boolean;

  /**
   * Résultat de la dernière question.
   */
  lastResult: DistributionResult | null;

  /**
   * Dernière gorgée donnée pendant
   * la distribution.
   */
  lastDrink?: DistributionDrink | null;
}

export interface MemoryState {
  /**
   * Durée restante de la phase
   * de mémorisation.
   */
  remainingSeconds: number;

  /**
   * Nombre de jokers mémoire
   * disponibles pour chaque joueur.
   */
  jokers: number[];

  /**
   * Joueurs dont les cartes sont
   * temporairement visibles grâce
   * à un joker mémoire.
   */
  revealedPlayers: number[];
}

export interface PendingAction {
  giver: number;
  target: number;
  drinks: number;
  claimedCard: Carte;
}

export type BluffOutcome =
  | "BELIEVED"
  | "TRUTH"
  | "BLUFF";

/**
 * Résultat d’une réponse à une annonce.
 *
 * Il reste stocké pendant BLUFF_RESULT
 * afin que l’interface affiche le verdict
 * avant de poursuivre la partie.
 */
export interface BluffResult {
  giver: number;
  target: number;
  drinks: number;

  /**
   * BELIEVED :
   * la cible accepte de boire sans contester.
   *
   * TRUTH :
   * la cible conteste, mais le donneur
   * possède bien une carte de la bonne valeur.
   *
   * BLUFF :
   * la cible conteste et le donneur
   * ne possède aucune carte correspondante.
   */
  outcome: BluffOutcome;

  /**
   * Carte montrée pour prouver l’annonce.
   *
   * Elle reste null lorsque la cible
   * accepte simplement de boire ou
   * lorsqu’aucune carte valide n’existe.
   */
  revealedCard: Carte | null;

  /**
   * Joueur qui reçoit les gorgées.
   */
  punishedPlayer: number;
}

export interface TurnState {
  currentPlayer: number;
  remainingPlayers: number[];
  pendingAction: PendingAction | null;
}

export interface CurrentCardState {
  row: number;
  column: number;
  card: Carte | null;
}

export interface ProgressState {
  revealedCards: number;
  totalCards: number;
  nextRow: number;
  nextColumn: number;
}

export interface HistoryEvent {
  player: number;
  message: string;
  timestamp: number;
}

export interface GameState {
  players: Carte[][];
  pyramid: Carte[][];
  deck: Carte[];

  distribution: DistributionState;
  memory: MemoryState;

  current: CurrentCardState;
  progress: ProgressState;
  turn: TurnState;

  bluffResult: BluffResult | null;

  phase: Phase;
  drinks: number[];
  history: HistoryEvent[];
}