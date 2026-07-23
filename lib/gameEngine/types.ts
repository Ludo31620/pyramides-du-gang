import { Carte } from "@/lib/deck";

export type Phase =
  | "WAITING"
  | "PLAYER_TURN"
  | "PLAYER_RESPONSE"
  | "GAME_OVER";

export interface PendingAction {
  giver: number;
  target: number;
  drinks: number;
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

export interface HistoryEvent {
  player: number;

  message: string;

  timestamp: number;
}

export interface GameState {
  players: Carte[][];

  pyramid: Carte[][];

  deck: Carte[];

  current: CurrentCardState;

  turn: TurnState;

  phase: Phase;

  drinks: number[];

  history: HistoryEvent[];
}