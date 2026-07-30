import {
  io,
  type Socket,
} from "socket.io-client";

function createFallbackUuid(): string {
  const bytes =
    new Uint8Array(16);

  if (
    typeof globalThis.crypto
      ?.getRandomValues === "function"
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

function installRandomUuidFallback(): void {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  if (
    typeof globalThis.crypto
      ?.randomUUID === "function"
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
     * Le jeu peut néanmoins continuer,
     * car notre propre code n'utilise pas
     * directement randomUUID.
     */
  }
}

installRandomUuidFallback();

let socket: Socket | null =
  null;

export function obtenirSocket(): Socket {
  if (!socket) {
    socket = io({
      autoConnect: false,
    });
  }

  return socket;
}