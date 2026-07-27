"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type { Socket } from "socket.io-client";

import { obtenirSocket } from "@/lib/socket";

import type { GameState } from "@/lib/gameEngine/types";

type PublicRoomPlayer = {
  id: string;
  pseudo: string;
  isHost: boolean;
};

type PublicRoom = {
  code: string;
  status: "LOBBY" | "IN_GAME";
  maxPlayers: number;
  players: PublicRoomPlayer[];
};

type RoomResult =
  | {
      success: true;
      room: PublicRoom;
      playerId: string;
    }
  | {
      success: false;
      error: string;
    };

type StartRoomResult =
  | {
      success: true;
      room: PublicRoom;
    }
  | {
      success: false;
      error: string;
    };

export default function LobbyTestPage() {
  const [socket, setSocket] =
    useState<Socket | null>(null);

  const [connecte, setConnecte] =
    useState(false);

  const [pseudo, setPseudo] =
    useState("");

  const [code, setCode] =
    useState("");

  const [maxPlayers, setMaxPlayers] =
    useState(8);

  const [room, setRoom] =
    useState<PublicRoom | null>(null);

  const [playerId, setPlayerId] =
    useState<string | null>(null);

  const [gameState, setGameState] =
    useState<GameState | null>(null);

  const [erreur, setErreur] =
    useState<string | null>(null);

  const [chargement, setChargement] =
    useState(false);

  const [partieDemarree, setPartieDemarree] =
    useState(false);

  const joueurLocal =
    useMemo(() => {
      if (!room || !playerId) {
        return null;
      }

      return (
        room.players.find(
          (player) =>
            player.id === playerId
        ) ?? null
      );
    }, [room, playerId]);

  const estHote =
    joueurLocal?.isHost ?? false;

  useEffect(() => {
    const currentSocket =
      obtenirSocket();

    function gererConnexion(): void {
      setConnecte(true);
    }

    function gererDeconnexion(): void {
      setConnecte(false);
    }

    function gererMiseAJour(
      nouvelleRoom: PublicRoom
    ): void {
      setRoom(nouvelleRoom);
      setCode(nouvelleRoom.code);

      if (
        nouvelleRoom.status ===
        "IN_GAME"
      ) {
        setPartieDemarree(true);
      }
    }

    function gererDemarrage(): void {
      setPartieDemarree(true);
    }

    function gererEtatJeu(
      nouvelEtat: GameState
    ): void {
      setGameState(nouvelEtat);
      setPartieDemarree(true);

      console.log(
        "🎮 État reçu depuis le serveur :",
        nouvelEtat
      );
    }

    currentSocket.on(
      "connect",
      gererConnexion
    );

    currentSocket.on(
      "disconnect",
      gererDeconnexion
    );

    currentSocket.on(
      "room:updated",
      gererMiseAJour
    );

    currentSocket.on(
      "game:started",
      gererDemarrage
    );

    currentSocket.on(
      "game:state",
      gererEtatJeu
    );

    if (!currentSocket.connected) {
      currentSocket.connect();
    } else {
      gererConnexion();
    }

    setSocket(currentSocket);

    return () => {
      currentSocket.off(
        "connect",
        gererConnexion
      );

      currentSocket.off(
        "disconnect",
        gererDeconnexion
      );

      currentSocket.off(
        "room:updated",
        gererMiseAJour
      );

      currentSocket.off(
        "game:started",
        gererDemarrage
      );

      currentSocket.off(
        "game:state",
        gererEtatJeu
      );
    };
  }, []);

  function creerPartie(): void {
    if (!socket || !connecte) {
      setErreur(
        "Le serveur n'est pas connecté."
      );
      return;
    }

    setChargement(true);
    setErreur(null);
    setGameState(null);
    setPartieDemarree(false);

    socket.emit(
      "room:create",
      {
        pseudo,
        maxPlayers,
      },
      (result: RoomResult) => {
        setChargement(false);

        if (!result.success) {
          setErreur(result.error);
          return;
        }

        setRoom(result.room);
        setCode(result.room.code);
        setPlayerId(result.playerId);
      }
    );
  }

  function rejoindrePartie(): void {
    if (!socket || !connecte) {
      setErreur(
        "Le serveur n'est pas connecté."
      );
      return;
    }

    setChargement(true);
    setErreur(null);
    setGameState(null);
    setPartieDemarree(false);

    socket.emit(
      "room:join",
      {
        pseudo,
        code,
      },
      (result: RoomResult) => {
        setChargement(false);

        if (!result.success) {
          setErreur(result.error);
          return;
        }

        setRoom(result.room);
        setCode(result.room.code);
        setPlayerId(result.playerId);
      }
    );
  }

  function demarrerPartie(): void {
    if (
      !socket ||
      !connecte ||
      !room
    ) {
      setErreur(
        "Impossible de démarrer la partie."
      );
      return;
    }

    setChargement(true);
    setErreur(null);

    socket.emit(
      "room:start",
      {
        code: room.code,
      },
      (result: StartRoomResult) => {
        setChargement(false);

        if (!result.success) {
          setErreur(result.error);
          return;
        }

        setRoom(result.room);
        setPartieDemarree(true);
      }
    );
  }

  if (
    room &&
    partieDemarree &&
    gameState
  ) {
    return (
      <main className="min-h-screen bg-[#111111] px-5 py-8 text-white">
        <section className="mx-auto w-full max-w-2xl">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-yellow-500">
              Pyramides du Gang
            </p>

            <h1 className="mt-2 text-3xl font-black">
              Partie en cours
            </h1>

            <p className="mt-3 font-mono text-xl font-black text-yellow-500">
              {room.code}
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-green-700 bg-green-950 p-5 text-center">
            <p className="text-4xl">
              ✅
            </p>

            <p className="mt-3 text-xl font-black text-green-300">
              GameState reçu
            </p>

            <p className="mt-2 text-sm text-green-400">
              Le véritable moteur du jeu fonctionne
              maintenant côté serveur.
            </p>
          </div>

          <div className="mt-6 rounded-2xl bg-zinc-900 p-5">
            <p className="text-sm font-black uppercase tracking-wider text-yellow-500">
              Joueur local
            </p>

            <p className="mt-2 text-lg font-bold">
              {joueurLocal?.pseudo ??
                "Joueur inconnu"}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Identifiant joueur :{" "}
              {playerId ?? "Non disponible"}
            </p>
          </div>

          <div className="mt-6 rounded-2xl bg-zinc-900 p-5">
            <p className="text-sm font-black uppercase tracking-wider text-yellow-500">
              État reçu depuis le serveur
            </p>

            <pre className="mt-4 max-h-[500px] overflow-auto rounded-xl bg-zinc-950 p-4 text-xs leading-relaxed text-green-300">
              {JSON.stringify(
                gameState,
                null,
                2
              )}
            </pre>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#111111] px-5 py-8 text-white">
      <section className="mx-auto w-full max-w-md">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-yellow-500">
            Pyramides du Gang
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Test du lobby
          </h1>

          <p className="mt-3 text-sm text-zinc-400">
            {connecte
              ? "🟢 Serveur connecté"
              : "🟠 Connexion au serveur..."}
          </p>
        </div>

        {!room && (
          <div className="mt-8 space-y-5 rounded-2xl bg-zinc-900 p-5">
            <div>
              <label
                htmlFor="pseudo"
                className="mb-2 block text-sm font-bold"
              >
                Ton pseudo
              </label>

              <input
                id="pseudo"
                type="text"
                value={pseudo}
                maxLength={20}
                onChange={(event) =>
                  setPseudo(
                    event.target.value
                  )
                }
                placeholder="Ludo"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-yellow-500"
              />
            </div>

            <div>
              <label
                htmlFor="maxPlayers"
                className="mb-2 block text-sm font-bold"
              >
                Nombre maximum de joueurs
              </label>

              <select
                id="maxPlayers"
                value={maxPlayers}
                onChange={(event) =>
                  setMaxPlayers(
                    Number(
                      event.target.value
                    )
                  )
                }
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-yellow-500"
              >
                {Array.from(
                  { length: 9 },
                  (_, index) =>
                    index + 2
                ).map((nombre) => (
                  <option
                    key={nombre}
                    value={nombre}
                  >
                    {nombre} joueurs
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              disabled={
                chargement ||
                !connecte
              }
              onClick={creerPartie}
              className="w-full rounded-xl bg-yellow-500 px-4 py-3 font-black text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              Créer une partie
            </button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-zinc-700" />

              <span className="text-sm text-zinc-500">
                OU
              </span>

              <div className="h-px flex-1 bg-zinc-700" />
            </div>

            <div>
              <label
                htmlFor="code"
                className="mb-2 block text-sm font-bold"
              >
                Code de la partie
              </label>

              <input
                id="code"
                type="text"
                value={code}
                maxLength={7}
                onChange={(event) =>
                  setCode(
                    event.target.value.toUpperCase()
                  )
                }
                placeholder="PG-1234"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-center font-mono text-xl font-black uppercase tracking-widest outline-none focus:border-yellow-500"
              />
            </div>

            <button
              type="button"
              disabled={
                chargement ||
                !connecte
              }
              onClick={rejoindrePartie}
              className="w-full rounded-xl border-2 border-yellow-500 px-4 py-3 font-black text-yellow-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Rejoindre la partie
            </button>

            {erreur && (
              <p className="rounded-xl bg-red-950 p-4 text-center text-sm text-red-300">
                {erreur}
              </p>
            )}
          </div>
        )}

        {room && (
          <div className="mt-8 rounded-2xl bg-zinc-900 p-5">
            <p className="text-center text-sm font-bold uppercase tracking-wider text-zinc-500">
              Code de la partie
            </p>

            <p className="mt-2 text-center font-mono text-4xl font-black text-yellow-500">
              {room.code}
            </p>

            <p className="mt-3 text-center text-zinc-400">
              {room.players.length}
              {" / "}
              {room.maxPlayers} joueurs
            </p>

            <div className="mt-6 space-y-3">
              {room.players.map(
                (player) => {
                  const estMoi =
                    player.id ===
                    playerId;

                  return (
                    <div
                      key={player.id}
                      className="flex items-center justify-between rounded-xl bg-zinc-950 px-4 py-3"
                    >
                      <p className="font-bold">
                        {player.pseudo}

                        {estMoi && (
                          <span className="ml-2 text-xs text-yellow-500">
                            TOI
                          </span>
                        )}
                      </p>

                      {player.isHost && (
                        <span className="rounded-full bg-yellow-500 px-3 py-1 text-xs font-black text-black">
                          HÔTE
                        </span>
                      )}
                    </div>
                  );
                }
              )}
            </div>

            {room.status === "LOBBY" && (
              <>
                {estHote ? (
                  <button
                    type="button"
                    disabled={
                      chargement ||
                      room.players.length < 2
                    }
                    onClick={demarrerPartie}
                    className="mt-6 w-full rounded-xl bg-yellow-500 px-4 py-4 text-lg font-black text-black disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Démarrer la partie
                  </button>
                ) : (
                  <p className="mt-6 text-center text-sm text-zinc-500">
                    En attente du lancement par
                    l&apos;hôte…
                  </p>
                )}

                {erreur && (
                  <p className="mt-4 rounded-xl bg-red-950 p-4 text-center text-sm text-red-300">
                    {erreur}
                  </p>
                )}
              </>
            )}

            {partieDemarree &&
              room.status === "IN_GAME" &&
              !gameState && (
                <div className="mt-6 rounded-xl border border-yellow-700 bg-yellow-950 p-5 text-center">
                  <p className="text-4xl">
                    ⏳
                  </p>

                  <p className="mt-3 text-xl font-black text-yellow-300">
                    Partie démarrée
                  </p>

                  <p className="mt-2 text-sm text-yellow-400">
                    Réception de l&apos;état du
                    jeu…
                  </p>
                </div>
              )}
          </div>
        )}
      </section>
    </main>
  );
}