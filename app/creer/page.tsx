"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import type {
  Socket,
} from "socket.io-client";

import {
  obtenirSocket,
} from "@/lib/socket";

const MIN_PLAYER_COUNT = 2;
const MAX_PLAYER_COUNT = 9;

const STORAGE_PARTIE_KEY =
  "pyramides-partie";

interface PublicRoomPlayer {
  id: string;
  pseudo: string;
  isHost: boolean;
}

interface PublicRoom {
  code: string;
  status:
    | "LOBBY"
    | "IN_GAME";
  maxPlayers: number;
  players: PublicRoomPlayer[];
}

type CreateRoomResult =
  | {
      success: true;
      room: PublicRoom;
      playerId: string;
    }
  | {
      success: false;
      error: string;
    };

interface StoredGame {
  pseudo: string;
  joueurs: number;
  code: string;
  playerId: string;
  isHost: boolean;
}

function connecterSocket(
  socket: Socket
): Promise<void> {
  if (socket.connected) {
    return Promise.resolve();
  }

  return new Promise(
    (
      resolve,
      reject
    ) => {
      const timeoutId =
        window.setTimeout(
          () => {
            nettoyer();

            reject(
              new Error(
                "Le serveur ne répond pas."
              )
            );
          },
          8000
        );

      function nettoyer(): void {
        window.clearTimeout(
          timeoutId
        );

        socket.off(
          "connect",
          gererConnexion
        );

        socket.off(
          "connect_error",
          gererErreur
        );
      }

      function gererConnexion(): void {
        nettoyer();
        resolve();
      }

      function gererErreur(
        error: Error
      ): void {
        nettoyer();
        reject(error);
      }

      socket.once(
        "connect",
        gererConnexion
      );

      socket.once(
        "connect_error",
        gererErreur
      );

      socket.connect();
    }
  );
}

function demanderCreationPartie(
  socket: Socket,
  pseudo: string,
  maxPlayers: number
): Promise<CreateRoomResult> {
  return new Promise(
    (
      resolve
    ) => {
      let reponseRecue = false;

      const timeoutId =
        window.setTimeout(
          () => {
            if (reponseRecue) {
              return;
            }

            reponseRecue = true;

            resolve({
              success: false,
              error:
                "Le serveur n'a pas répondu à temps.",
            });
          },
          8000
        );

      socket.emit(
        "room:create",
        {
          pseudo,
          maxPlayers,
        },
        (
          result:
            CreateRoomResult
        ) => {
          if (reponseRecue) {
            return;
          }

          reponseRecue = true;

          window.clearTimeout(
            timeoutId
          );

          resolve(result);
        }
      );
    }
  );
}

export default function CreerPartie() {
  const router =
    useRouter();

  const [
    pseudo,
    setPseudo,
  ] = useState("");

  const [
    joueurs,
    setJoueurs,
  ] = useState(4);

  const [
    creationEnCours,
    setCreationEnCours,
  ] = useState(false);

  const [
    messageErreur,
    setMessageErreur,
  ] = useState<
    string | null
  >(null);

  async function creerPartie():
    Promise<void> {
    if (creationEnCours) {
      return;
    }

    const pseudoNettoye =
      pseudo
        .trim()
        .replace(
          /\s+/g,
          " "
        )
        .slice(0, 20);

    if (!pseudoNettoye) {
      setMessageErreur(
        "Entre un pseudo avant de créer la partie."
      );

      return;
    }

    if (
      !Number.isInteger(
        joueurs
      ) ||
      joueurs <
        MIN_PLAYER_COUNT ||
      joueurs >
        MAX_PLAYER_COUNT
    ) {
      setMessageErreur(
        `Le nombre de joueurs doit être compris entre ${MIN_PLAYER_COUNT} et ${MAX_PLAYER_COUNT}.`
      );

      return;
    }

    setCreationEnCours(true);
    setMessageErreur(null);

    try {
      const socket =
        obtenirSocket();

      await connecterSocket(
        socket
      );

      const result =
        await demanderCreationPartie(
          socket,
          pseudoNettoye,
          joueurs
        );

      if (!result.success) {
        setMessageErreur(
          result.error
        );

        return;
      }

      const storedGame:
        StoredGame = {
          pseudo:
            pseudoNettoye,

          joueurs:
            result.room
              .maxPlayers,

          code:
            result.room.code,

          playerId:
            result.playerId,

          isHost: true,
        };

      sessionStorage.setItem(
        STORAGE_PARTIE_KEY,
        JSON.stringify(
          storedGame
        )
      );

      router.push(
        "/lobby"
      );
    } catch (
      error: unknown
    ) {
      console.error(
        "Impossible de créer la partie :",
        error
      );

      setMessageErreur(
        error instanceof Error
          ? error.message
          : "Impossible de se connecter au serveur."
      );
    } finally {
      setCreationEnCours(
        false
      );
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#111111] px-6 py-10 text-white">
      <div className="w-full max-w-md">
        <h1 className="text-center text-4xl font-bold text-yellow-500">
          Créer une partie
        </h1>

        <p className="mt-3 text-center text-sm leading-6 text-zinc-400">
          Crée un salon puis partage
          son code avec tes amis.
        </p>

        <div className="mt-10 space-y-6">
          <div>
            <label
              htmlFor="pseudo"
              className="mb-2 block font-semibold"
            >
              Ton pseudo
            </label>

            <input
              id="pseudo"
              type="text"
              value={pseudo}
              maxLength={20}
              disabled={
                creationEnCours
              }
              onChange={(
                event
              ) =>
                setPseudo(
                  event.target
                    .value
                )
              }
              onKeyDown={(
                event
              ) => {
                if (
                  event.key ===
                  "Enter"
                ) {
                  void creerPartie();
                }
              }}
              placeholder="Ex : Ludo"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 outline-none transition focus:border-yellow-500 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="joueurs"
              className="mb-2 block font-semibold"
            >
              Nombre maximum
              de joueurs
            </label>

            <select
              id="joueurs"
              value={joueurs}
              disabled={
                creationEnCours
              }
              onChange={(
                event
              ) =>
                setJoueurs(
                  Number(
                    event.target
                      .value
                  )
                )
              }
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 outline-none transition focus:border-yellow-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {Array.from(
                {
                  length:
                    MAX_PLAYER_COUNT -
                    MIN_PLAYER_COUNT +
                    1,
                },
                (
                  _,
                  index
                ) =>
                  index +
                  MIN_PLAYER_COUNT
              ).map(
                (
                  nombre
                ) => (
                  <option
                    key={
                      nombre
                    }
                    value={
                      nombre
                    }
                  >
                    {nombre} joueurs
                  </option>
                )
              )}
            </select>

            <p className="mt-2 text-sm text-zinc-400">
              De 2 à 9 joueurs
              maximum
            </p>
          </div>

          {messageErreur && (
            <div
              role="alert"
              className="rounded-xl border border-red-900 bg-red-950/70 p-4 text-sm font-semibold text-red-300"
            >
              {messageErreur}
            </div>
          )}

          <button
            type="button"
            disabled={
              creationEnCours
            }
            onClick={() =>
              void creerPartie()
            }
            className="flex min-h-14 w-full items-center justify-center rounded-xl bg-yellow-500 px-5 py-4 font-bold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creationEnCours
              ? "Création en cours..."
              : "Créer la partie"}
          </button>
        </div>
      </div>
    </main>
  );
}