"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import type {
  Socket,
} from "socket.io-client";

import {
  enregistrerSessionPartie,
  MAX_PLAYER_COUNT,
  MIN_PLAYER_COUNT,
  supprimerSessionPartie,
  type StoredGameSession,
  type StoredRoomPlayer,
} from "@/lib/gameSession";

import {
  getPlayerProfile,
} from "@/lib/profile/storage";

import type {
  PlayerProfile,
} from "@/lib/profile/types";

import {
  obtenirSocket,
} from "@/lib/socket";

interface PublicRoomPlayer {
  id: string;
  pseudo: string;

  avatarType:
    PlayerProfile["avatarType"];

  avatarId:
    string | null;

  avatarPhoto:
    string | null;

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

function convertirJoueurs(
  players: PublicRoomPlayer[]
): StoredRoomPlayer[] {
  return players.map(
    (player) => ({
      id:
        player.id,

      pseudo:
        player.pseudo,

      avatarType:
        player.avatarType,

      avatarId:
        player.avatarId,

      avatarPhoto:
        player.avatarPhoto,

      isHost:
        player.isHost,
    })
  );
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
  maxPlayers: number,
  profile: PlayerProfile
): Promise<CreateRoomResult> {
  return new Promise(
    (resolve) => {
      let reponseRecue =
        false;

      const timeoutId =
        window.setTimeout(
          () => {
            if (
              reponseRecue
            ) {
              return;
            }

            reponseRecue =
              true;

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

          avatarType:
            profile.avatarType,

          avatarId:
            profile.avatarId,

          avatarPhoto:
            profile.avatarPhoto,

          maxPlayers,
        },
        (
          result:
            CreateRoomResult
        ) => {
          if (
            reponseRecue
          ) {
            return;
          }

          reponseRecue =
            true;

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
  ] =
    useState<string | null>(
      null
    );

  useEffect(() => {
    const profile =
      getPlayerProfile();

    if (
      profile.pseudo &&
      profile.pseudo !==
        "Joueur"
    ) {
      setPseudo(
        profile.pseudo
      );
    }
  }, []);

  async function creerPartie():
    Promise<void> {
    if (
      creationEnCours
    ) {
      return;
    }

    const pseudoNettoye =
      pseudo
        .trim()
        .replace(
          /\s+/g,
          " "
        )
        .slice(
          0,
          20
        );

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

    setCreationEnCours(
      true
    );

    setMessageErreur(
      null
    );

    try {
      supprimerSessionPartie();

      const profile =
        getPlayerProfile();

      const socket =
        obtenirSocket();

      await connecterSocket(
        socket
      );

      const result =
        await demanderCreationPartie(
          socket,
          pseudoNettoye,
          joueurs,
          profile
        );

      if (
        !result.success
      ) {
        setMessageErreur(
          result.error
        );

        return;
      }

      const joueurLocal =
        result.room.players.find(
          (player) =>
            player.id ===
            result.playerId
        );

      const session:
        StoredGameSession = {
        code:
          result.room.code,

        playerId:
          result.playerId,

        pseudo:
          joueurLocal
            ?.pseudo ??
          pseudoNettoye,

        isHost:
          joueurLocal
            ?.isHost ??
          true,

        maxPlayers:
          result.room.maxPlayers,

        players:
          convertirJoueurs(
            result.room.players
          ),

        playerCount:
          result.room.players.length,
      };

      enregistrerSessionPartie(
        session
      );

      router.replace(
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
                  event.target.value
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
                    event.target.value
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
              De {MIN_PLAYER_COUNT} à{" "}
              {MAX_PLAYER_COUNT} joueurs
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