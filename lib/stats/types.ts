export interface PlayerLifetimeStats {
  gamesPlayed: number;
  drinksGiven: number;
  drinksReceived: number;
  claimsMade: number;
  bluffsAttempted: number;
  successfulBluffs: number;
  caughtBluffs: number;
}

export const DEFAULT_PLAYER_LIFETIME_STATS:
  PlayerLifetimeStats = {
  gamesPlayed: 0,
  drinksGiven: 0,
  drinksReceived: 0,
  claimsMade: 0,
  bluffsAttempted: 0,
  successfulBluffs: 0,
  caughtBluffs: 0,
};