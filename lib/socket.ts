import {
  io,
  type Socket,
} from "socket.io-client";

const PLAYER_TOKEN_STORAGE_KEY =
  "pyramides-player-token";

function createFallbackUuid(): string {
  const bytes =
    new Uint8Array(16);

  if (
    typeof globalThis.crypto
      ?.getRandomValues ===
    "function"
  ) {
    globalThis.crypto.getRandomValues(
      bytes
    );
  } else {
    for (
      let index = 0;
      index < bytes.length;
      index += 1
    ) {
      bytes[index] =
        Math.floor(
          Math.random() * 256
        );
    }
  }

  bytes[6] =
    (bytes[6] & 0x0f) | 0x40;

  bytes[8] =
    (bytes[8] & 0x3f) | 0x80;

  const hexadecimal =
    Array.from(
      bytes,
      (byte) =>
        byte
          .toString(16)
          .padStart(2, "0")
    );

  return [
    hexadecimal
      .slice(0, 4)
      .join(""),

    hexadecimal
      .slice(4, 6)
      .join(""),

    hexadecimal
      .slice(6, 8)
      .join(""),

    hexadecimal
      .slice(8, 10)
      .join(""),

    hexadecimal
      .slice(10, 16)
      .join(""),
  ].join("-");
}

function createUuid(): string {
  if (
    typeof globalThis.crypto
      ?.randomUUID ===
    "function"
  ) {
    return globalThis.crypto.randomUUID();
  }

  return createFallbackUuid();
}

function installRandomUuidFallback(): void {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  if (
    typeof globalThis.crypto
      ?.randomUUID ===
    "function"
  ) {
    return;
  }

  try {
    Object.defineProperty(
      globalThis.crypto,
      "randomUUID",
      {
        configurable: true,
        value:
          createFallbackUuid,
      }
    );
  } catch {
    /*
     * Certains anciens Safari empêchent
     * de modifier l'objet crypto.
     *
     * Le jeu utilise également son propre
     * générateur de secours.
     */
  }
}

function normalizePlayerToken(
  token: string | null
): string {
  if (!token) {
    return "";
  }

  return token
    .trim()
    .slice(0, 200);
}

export function obtenirPlayerToken():
  string {
  if (
    typeof window ===
    "undefined"
  ) {
    throw new Error(
      "Le playerToken ne peut être récupéré que dans le navigateur."
    );
  }

  const storedToken =
    normalizePlayerToken(
      window.localStorage.getItem(
        PLAYER_TOKEN_STORAGE_KEY
      )
    );

  if (storedToken) {
    return storedToken;
  }

  const newToken =
    createUuid();

  window.localStorage.setItem(
    PLAYER_TOKEN_STORAGE_KEY,
    newToken
  );

  return newToken;
}

function createSocket(): Socket {
  const playerToken =
    obtenirPlayerToken();

  return io({
    autoConnect: false,

    auth: {
      playerToken,
    },
  });
}

let socket: Socket | null =
  null;

export function obtenirSocket(): Socket {
  if (
    typeof window ===
    "undefined"
  ) {
    throw new Error(
      "Le socket ne peut être créé que dans le navigateur."
    );
  }

  const playerToken =
    obtenirPlayerToken();

  if (!socket) {
    socket =
      createSocket();

    return socket;
  }

  /*
   * L'objet Socket.IO peut survivre entre
   * plusieurs navigations côté client.
   *
   * On remet donc systématiquement le token
   * courant avant une éventuelle reconnexion.
   */
  socket.auth = {
    playerToken,
  };

  return socket;
}

export function reconnecterSocket():
  void {
  const currentSocket =
    obtenirSocket();

  currentSocket.auth = {
    playerToken:
      obtenirPlayerToken(),
  };

  if (
    currentSocket.connected
  ) {
    return;
  }

  currentSocket.connect();
}

export function deconnecterSocket():
  void {
  if (!socket) {
    return;
  }

  socket.disconnect();
}

installRandomUuidFallback();