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

  awaitingGive: boolean;

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

/**
 * Statistiques individuelles d’un joueur.
 *
 * claimsMade :
 * toutes les annonces effectuées,
 * vraies ou fausses.
 *
 * bluffsAttempted :
 * annonces mensongères effectuées.
 *
 * successfulBluffs :
 * mensonges acceptés par la cible.
 *
 * caughtBluffs :
 * mensonges découverts après contestation.
 */
export interface PlayerStats {
  claimsMade: number;
  bluffsAttempted: number;
  successfulBluffs: number;
  caughtBluffs: number;
}

/**
 * Statistiques générales de la partie.
 */
export interface GameStats {
  claimsMade: number;
  bluffsAttempted: number;
  successfulBluffs: number;
  caughtBluffs: number;

  players: PlayerStats[];
}

export interface GameState {
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