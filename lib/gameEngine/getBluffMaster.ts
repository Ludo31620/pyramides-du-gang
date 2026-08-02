import type {
  GameStats,
  PlayerStats,
} from "@/lib/gameEngine/types";

export interface BluffRankingEntry {
  playerIndex: number;

  stats:
    PlayerStats;

  successRate: number;
}

export interface BluffMasterResult {
  winner:
    | number
    | null;

  ranking:
    BluffRankingEntry[];
}

function getSuccessRate(
  stats: PlayerStats
): number {
  if (
    stats.bluffsAttempted ===
    0
  ) {
    return 0;
  }

  return (
    stats.successfulBluffs /
    stats.bluffsAttempted
  );
}

function comparePlayers(
  first: BluffRankingEntry,
  second: BluffRankingEntry
): number {
  /*
   * 1. Plus grand nombre de bluffs réussis.
   */
  if (
    first.stats
      .successfulBluffs !==
    second.stats
      .successfulBluffs
  ) {
    return (
      second.stats
        .successfulBluffs -
      first.stats
        .successfulBluffs
    );
  }

  /*
   * 2. Moins de bluffs démasqués.
   */
  if (
    first.stats
      .caughtBluffs !==
    second.stats
      .caughtBluffs
  ) {
    return (
      first.stats
        .caughtBluffs -
      second.stats
        .caughtBluffs
    );
  }

  /*
   * 3. Meilleur taux de réussite.
   */
  if (
    first.successRate !==
    second.successRate
  ) {
    return (
      second.successRate -
      first.successRate
    );
  }

  /*
   * 4. Plus grand nombre de vrais bluffs tentés.
   */
  if (
    first.stats
      .bluffsAttempted !==
    second.stats
      .bluffsAttempted
  ) {
    return (
      second.stats
        .bluffsAttempted -
      first.stats
        .bluffsAttempted
    );
  }

  /*
   * 5. Ordre stable des joueurs.
   */
  return (
    first.playerIndex -
    second.playerIndex
  );
}

export function getBluffMaster(
  gameStats: GameStats
): BluffMasterResult {
  const ranking =
    gameStats.players
      .map(
        (
          stats,
          playerIndex
        ): BluffRankingEntry => ({
          playerIndex,

          stats,

          successRate:
            getSuccessRate(
              stats
            ),
        })
      )
      .sort(
        comparePlayers
      );

  const firstPlayer =
    ranking[0];

  if (!firstPlayer) {
    return {
      winner: null,
      ranking: [],
    };
  }

  /*
   * Aucun joueur n’a réussi de bluff.
   *
   * Dans ce cas, on ne désigne pas
   * artificiellement un Maître du Bluff.
   */
  if (
    firstPlayer.stats
      .successfulBluffs ===
    0
  ) {
    return {
      winner: null,
      ranking,
    };
  }

  return {
    winner:
      firstPlayer.playerIndex,

    ranking,
  };
}