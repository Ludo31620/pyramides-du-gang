import type {
  PlayerAvatarType,
} from "@/lib/profile/types";

const GAME_SESSION_STORAGE_KEY =
  "pyramides-partie";

export const MIN_PLAYER_COUNT = 2;
export const MAX_PLAYER_COUNT = 9;

export interface StoredRoomPlayer {
  id: string;
  pseudo: string;

  avatarType:
    PlayerAvatarType;

  avatarId:
    string | null;

  avatarPhoto:
    string | null;

  isHost: boolean;
}

export interface StoredGameSession {
  code: string;
  playerId: string;
  pseudo: string;
  isHost: boolean;

  /**
   * Nombre maximal de joueurs accepté
   * dans le salon.
   */
  maxPlayers: number;

  /**
   * Liste publique des joueurs connue
   * lors de la dernière synchronisation.
   */
  players: StoredRoomPlayer[];

  /**
   * Nombre actuel de joueurs.
   *
   * Cette valeur est conservée pour
   * compatibilité avec les anciennes pages.
   */
  playerCount: number;
}

interface LegacyStoredGame {
  pseudo?: unknown;
  code?: unknown;
  roomCode?: unknown;
  salonCode?: unknown;

  playerId?: unknown;
  isHost?: unknown;
  hote?: unknown;

  joueurs?: unknown;
  maxPlayers?: unknown;
  playerCount?: unknown;
  nombreJoueurs?: unknown;

  players?: unknown;
}

function isBrowser(): boolean {
  return (
    typeof window !==
    "undefined"
  );
}

function normalizeText(
  value: unknown,
  maxLength: number
): string {
  if (
    typeof value !==
    "string"
  ) {
    return "";
  }

  return value
    .trim()
    .slice(
      0,
      maxLength
    );
}

function normalizeNullableText(
  value: unknown,
  maxLength: number
): string | null {
  const normalized =
    normalizeText(
      value,
      maxLength
    );

  return normalized ||
    null;
}

function normalizeAvatarType(
  value: unknown
): PlayerAvatarType {
  if (
    value ===
      "DEFAULT" ||
    value ===
      "PHOTO" ||
    value ===
      "NONE"
  ) {
    return value;
  }

  return "DEFAULT";
}

function normalizeRoomCode(
  value: unknown
): string {
  const rawCode =
    normalizeText(
      value,
      20
    )
      .toUpperCase()
      .replace(
        /\s+/g,
        ""
      );

  if (
    /^PG-\d{4}$/.test(
      rawCode
    )
  ) {
    return rawCode;
  }

  if (
    /^\d{4}$/.test(
      rawCode
    )
  ) {
    return `PG-${rawCode}`;
  }

  return "";
}

function normalizePlayerCount(
  value: unknown
): number | null {
  if (
    typeof value !==
      "number" ||
    !Number.isInteger(
      value
    ) ||
    value <
      MIN_PLAYER_COUNT ||
    value >
      MAX_PLAYER_COUNT
  ) {
    return null;
  }

  return value;
}

function normalizePlayers(
  value: unknown
): StoredRoomPlayer[] {
  if (
    !Array.isArray(
      value
    )
  ) {
    return [];
  }

  const normalizedPlayers:
    StoredRoomPlayer[] = [];

  for (
    const playerValue of
    value
  ) {
    if (
      typeof playerValue !==
        "object" ||
      playerValue === null
    ) {
      continue;
    }

    const player =
      playerValue as Record<
        string,
        unknown
      >;

    const id =
      normalizeText(
        player.id,
        200
      );

    const pseudo =
      normalizeText(
        player.pseudo,
        20
      );

    if (
      !id ||
      !pseudo
    ) {
      continue;
    }

    const avatarType =
      normalizeAvatarType(
        player.avatarType
      );

    const avatarId =
      normalizeNullableText(
        player.avatarId,
        100
      );

    const avatarPhoto =
      normalizeNullableText(
        player.avatarPhoto,
        1_000_000
      );

    normalizedPlayers.push({
      id,
      pseudo,

      avatarType,

      avatarId:
        avatarType ===
          "DEFAULT"
          ? avatarId ??
            "fox"
          : avatarId,

      avatarPhoto:
        avatarType ===
          "PHOTO"
          ? avatarPhoto
          : null,

      isHost:
        player.isHost ===
          true ||
        player.hote ===
          true,
    });
  }

  return normalizedPlayers.slice(
    0,
    MAX_PLAYER_COUNT
  );
}

function normalizeStoredGame(
  rawValue: unknown
): StoredGameSession | null {
  if (
    typeof rawValue !==
      "object" ||
    rawValue === null
  ) {
    return null;
  }

  const rawGame =
    rawValue as LegacyStoredGame;

  const code =
    normalizeRoomCode(
      rawGame.code ??
        rawGame.roomCode ??
        rawGame.salonCode
    );

  const playerId =
    normalizeText(
      rawGame.playerId,
      200
    );

  const pseudo =
    normalizeText(
      rawGame.pseudo,
      20
    );

  const players =
    normalizePlayers(
      rawGame.players
    );

  const possibleMaxPlayers =
    rawGame.maxPlayers ??
    rawGame.joueurs ??
    rawGame.playerCount ??
    rawGame.nombreJoueurs;

  const maxPlayers =
    normalizePlayerCount(
      possibleMaxPlayers
    );

  if (
    !code ||
    !playerId ||
    !pseudo ||
    maxPlayers === null
  ) {
    return null;
  }

  const storedPlayer =
    players.find(
      (player) =>
        player.id ===
        playerId
    );

  const isHost =
    storedPlayer
      ?.isHost ??
    (
      rawGame.isHost ===
        true ||
      rawGame.hote ===
        true
    );

const normalizedPlayers:
  StoredRoomPlayer[] =
  players.length > 0
    ? players
    : [
        {
          id:
            playerId,

          pseudo,

          avatarType:
            "DEFAULT",

          avatarId:
            "fox",

          avatarPhoto:
            null,

          isHost,
        },
      ];

  return {
    code,
    playerId,
    pseudo,
    isHost,
    maxPlayers,

    players:
      normalizedPlayers,

    playerCount:
      normalizedPlayers.length,
  };
}

function readJsonStorage(
  storage: Storage
): unknown {
  const storedValue =
    storage.getItem(
      GAME_SESSION_STORAGE_KEY
    );

  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(
      storedValue
    ) as unknown;
  } catch {
    return null;
  }
}

/**
 * Lit la session persistante du joueur.
 *
 * Une ancienne session stockée uniquement
 * dans sessionStorage est automatiquement
 * migrée vers localStorage.
 */
export function lireSessionPartie():
  | StoredGameSession
  | null {
  if (!isBrowser()) {
    return null;
  }

  const localGame =
    normalizeStoredGame(
      readJsonStorage(
        window.localStorage
      )
    );

  if (localGame) {
    return localGame;
  }

  const legacySession =
    normalizeStoredGame(
      readJsonStorage(
        window.sessionStorage
      )
    );

  if (!legacySession) {
    return null;
  }

  enregistrerSessionPartie(
    legacySession
  );

  window.sessionStorage.removeItem(
    GAME_SESSION_STORAGE_KEY
  );

  return legacySession;
}

/**
 * Enregistre les informations nécessaires
 * pour retrouver automatiquement la partie
 * après un rafraîchissement ou une fermeture
 * de l'onglet.
 */
export function enregistrerSessionPartie(
  session:
    StoredGameSession
): void {
  if (!isBrowser()) {
    return;
  }

  const normalizedSession =
    normalizeStoredGame(
      session
    );

  if (!normalizedSession) {
    throw new Error(
      "La session de partie est invalide."
    );
  }

  window.localStorage.setItem(
    GAME_SESSION_STORAGE_KEY,
    JSON.stringify(
      normalizedSession
    )
  );

  /*
   * On conserve temporairement une copie
   * pour les pages qui utilisent encore
   * sessionStorage pendant la migration.
   */
  window.sessionStorage.setItem(
    GAME_SESSION_STORAGE_KEY,
    JSON.stringify(
      normalizedSession
    )
  );
}

/**
 * Met à jour une session existante sans
 * perdre l'identité locale du joueur.
 */
export function mettreAJourSessionPartie(
  changes:
    Partial<
      StoredGameSession
    >
): StoredGameSession | null {
  const currentSession =
    lireSessionPartie();

  if (!currentSession) {
    return null;
  }

  const nextSession:
    StoredGameSession = {
    ...currentSession,
    ...changes,

    players:
      changes.players ??
      currentSession.players,
  };

  const normalizedSession =
    normalizeStoredGame(
      nextSession
    );

  if (!normalizedSession) {
    return null;
  }

  enregistrerSessionPartie(
    normalizedSession
  );

  return normalizedSession;
}

/**
 * Supprime uniquement la session de partie.
 *
 * Le playerToken reste volontairement dans
 * localStorage afin que le navigateur garde
 * son identité persistant.
 */
export function supprimerSessionPartie():
  void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(
    GAME_SESSION_STORAGE_KEY
  );

  window.sessionStorage.removeItem(
    GAME_SESSION_STORAGE_KEY
  );
}