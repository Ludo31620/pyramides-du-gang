import {
  DEFAULT_PLAYER_LIFETIME_STATS,
  type PlayerLifetimeStats,
} from "./types";

const PLAYER_STATS_STORAGE_KEY =
  "pyramide-du-gang-player-stats";

const RECORDED_GAMES_STORAGE_KEY =
  "pyramide-du-gang-recorded-games";

export interface CompletedGameStats {
  gameId: string;

  drinksGiven: number;

  drinksReceived: number;

  claimsMade: number;

  bluffsAttempted: number;

  successfulBluffs: number;

  caughtBluffs: number;
}

function normalizeStat(
  value: unknown
): number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0
  ) {
    return 0;
  }

  return Math.floor(value);
}

function getRecordedGameIds():
  string[] {
  if (
    typeof window ===
    "undefined"
  ) {
    return [];
  }

  const storedValue =
    window.localStorage.getItem(
      RECORDED_GAMES_STORAGE_KEY
    );

  if (!storedValue) {
    return [];
  }

  try {
    const parsedValue =
      JSON.parse(
        storedValue
      ) as unknown;

    if (
      !Array.isArray(
        parsedValue
      )
    ) {
      return [];
    }

    return parsedValue.filter(
      (
        value
      ): value is string =>
        typeof value ===
          "string" &&
        value.trim().length > 0
    );
  } catch {
    return [];
  }
}

function saveRecordedGameIds(
  gameIds: string[]
): void {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  /*
   * On conserve uniquement les
   * 100 dernières parties afin
   * d'éviter une croissance infinie
   * du localStorage.
   */
  const recentGameIds =
    gameIds.slice(-100);

  window.localStorage.setItem(
    RECORDED_GAMES_STORAGE_KEY,
    JSON.stringify(
      recentGameIds
    )
  );
}

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
        normalizeStat(
          parsedValue.gamesPlayed
        ),

      drinksGiven:
        normalizeStat(
          parsedValue.drinksGiven
        ),

      drinksReceived:
        normalizeStat(
          parsedValue.drinksReceived
        ),

      claimsMade:
        normalizeStat(
          parsedValue.claimsMade
        ),

      bluffsAttempted:
        normalizeStat(
          parsedValue.bluffsAttempted
        ),

      successfulBluffs:
        normalizeStat(
          parsedValue.successfulBluffs
        ),

      caughtBluffs:
        normalizeStat(
          parsedValue.caughtBluffs
        ),
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

export function recordCompletedGame(
  completedGame:
    CompletedGameStats
): PlayerLifetimeStats {
  if (
    typeof window ===
    "undefined"
  ) {
    return {
      ...DEFAULT_PLAYER_LIFETIME_STATS,
    };
  }

  const normalizedGameId =
    completedGame.gameId
      .trim()
      .slice(0, 200);

  if (!normalizedGameId) {
    throw new Error(
      "L’identifiant de la partie est invalide."
    );
  }

  const recordedGameIds =
    getRecordedGameIds();

  /*
   * La partie a déjà été enregistrée
   * sur cet appareil.
   */
  if (
    recordedGameIds.includes(
      normalizedGameId
    )
  ) {
    return (
      getPlayerLifetimeStats()
    );
  }

  const currentStats =
    getPlayerLifetimeStats();

  const updatedStats:
    PlayerLifetimeStats = {
    gamesPlayed:
      currentStats.gamesPlayed +
      1,

    drinksGiven:
      currentStats.drinksGiven +
      normalizeStat(
        completedGame.drinksGiven
      ),

    drinksReceived:
      currentStats.drinksReceived +
      normalizeStat(
        completedGame.drinksReceived
      ),

    claimsMade:
      currentStats.claimsMade +
      normalizeStat(
        completedGame.claimsMade
      ),

    bluffsAttempted:
      currentStats.bluffsAttempted +
      normalizeStat(
        completedGame.bluffsAttempted
      ),

    successfulBluffs:
      currentStats.successfulBluffs +
      normalizeStat(
        completedGame.successfulBluffs
      ),

    caughtBluffs:
      currentStats.caughtBluffs +
      normalizeStat(
        completedGame.caughtBluffs
      ),
  };

  savePlayerLifetimeStats(
    updatedStats
  );

  saveRecordedGameIds([
    ...recordedGameIds,
    normalizedGameId,
  ]);

  return updatedStats;
}

export function resetPlayerLifetimeStats():
  PlayerLifetimeStats {
  const stats = {
    ...DEFAULT_PLAYER_LIFETIME_STATS,
  };

  savePlayerLifetimeStats(
    stats
  );

  if (
    typeof window !==
    "undefined"
  ) {
    window.localStorage.removeItem(
      RECORDED_GAMES_STORAGE_KEY
    );
  }

  return stats;
}