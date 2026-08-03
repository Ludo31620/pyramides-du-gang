import {
  DEFAULT_PLAYER_LIFETIME_STATS,
  type PlayerLifetimeStats,
} from "./types";

const PLAYER_STATS_STORAGE_KEY =
  "pyramide-du-gang-player-stats";

export function getPlayerLifetimeStats():
  PlayerLifetimeStats {
  if (
    typeof window ===
    "undefined"
  ) {
    return {
      ...DEFAULT_PLAYER_LIFETIME_STATS,
    };
  }

  const storedValue =
    window.localStorage.getItem(
      PLAYER_STATS_STORAGE_KEY
    );

  if (!storedValue) {
    return {
      ...DEFAULT_PLAYER_LIFETIME_STATS,
    };
  }

  try {
    const parsedValue =
      JSON.parse(
        storedValue
      ) as Partial<PlayerLifetimeStats>;

    return {
      gamesPlayed:
        Number.isFinite(
          parsedValue.gamesPlayed
        )
          ? parsedValue.gamesPlayed ?? 0
          : 0,

      drinksGiven:
        Number.isFinite(
          parsedValue.drinksGiven
        )
          ? parsedValue.drinksGiven ?? 0
          : 0,

      drinksReceived:
        Number.isFinite(
          parsedValue.drinksReceived
        )
          ? parsedValue.drinksReceived ?? 0
          : 0,

      claimsMade:
        Number.isFinite(
          parsedValue.claimsMade
        )
          ? parsedValue.claimsMade ?? 0
          : 0,

      bluffsAttempted:
        Number.isFinite(
          parsedValue.bluffsAttempted
        )
          ? parsedValue.bluffsAttempted ?? 0
          : 0,

      successfulBluffs:
        Number.isFinite(
          parsedValue.successfulBluffs
        )
          ? parsedValue.successfulBluffs ?? 0
          : 0,

      caughtBluffs:
        Number.isFinite(
          parsedValue.caughtBluffs
        )
          ? parsedValue.caughtBluffs ?? 0
          : 0,
    };
  } catch {
    return {
      ...DEFAULT_PLAYER_LIFETIME_STATS,
    };
  }
}

export function savePlayerLifetimeStats(
  stats: PlayerLifetimeStats
): void {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  window.localStorage.setItem(
    PLAYER_STATS_STORAGE_KEY,
    JSON.stringify(
      stats
    )
  );
}

export function resetPlayerLifetimeStats():
  PlayerLifetimeStats {
  const stats = {
    ...DEFAULT_PLAYER_LIFETIME_STATS,
  };

  savePlayerLifetimeStats(
    stats
  );

  return stats;
}