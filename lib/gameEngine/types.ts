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
   * Une bonne réponse attend le choix
   * du joueur qui recevra la gorgée.
   */
  awaitingGive: boolean;

  /**
   * Une mauvaise réponse attend que
   * le joueur lise le résultat et appuie
   * sur Continuer.
   */
  awaitingContinue: boolean;

  lastResult:
    | DistributionResult
    | null;

  lastDrink?:
    | DistributionDrink
    | null;
}

export interface MemoryState {
  remainingSeconds: number;
  jokers: number[];
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

export interface BluffResult {
  giver: number;
  target: number;
  drinks: number;
  outcome: BluffOutcome;
  revealedCard: Carte | null;
  punishedPlayer: number;
}

export interface TurnState {
  currentPlayer: number;
  remainingPlayers: number[];

  pendingAction:
    | PendingAction
    | null;
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

export interface PlayerStats {
  claimsMade: number;

  drinksGiven: number;

  bluffsAttempted: number;

  successfulBluffs: number;

  caughtBluffs: number;
}

export interface GameStats {
  claimsMade: number;

  drinksGiven: number;

  bluffsAttempted: number;

  successfulBluffs: number;

  caughtBluffs: number;

  players: PlayerStats[];
}

export interface GameState {
  /**
   * Identifiant unique de cette partie.
   *
   * Il est utilisé pour éviter
   * d'enregistrer plusieurs fois
   * les statistiques de la même partie.
   */
  gameId: string;

  players: Carte[][];
  pyramid: Carte[][];
  deck: Carte[];

  distribution:
    DistributionState;

  memory:
    MemoryState;

  current:
    CurrentCardState;

  progress:
    ProgressState;

  turn:
    TurnState;

  bluffResult:
    | BluffResult
    | null;

  gameStats:
    GameStats;

  phase:
    Phase;

  drinks:
    number[];

  history:
    HistoryEvent[];
}