"use client";

import ProfileAvatar from "@/components/profile/ProfileAvatar";

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
  obtenirSocket,
} from "@/lib/socket";

import {
  enregistrerSessionPartie,
  lireSessionPartie,
  MIN_PLAYER_COUNT,
  supprimerSessionPartie,
  type StoredGameSession,
  type StoredRoomPlayer,
} from "@/lib/gameSession";

import type {
  PlayerAvatarType,
} from "@/lib/profile/types";

type BotDifficulty =
  | "EASY"
  | "NORMAL"
  | "HARD";

interface PublicRoomPlayer {
  id: string;

  pseudo: string;

  avatarType:
    PlayerAvatarType;

  avatarId:
    string | null;

  avatarPhoto:
    string | null;

  isHost: boolean;

  isBot: boolean;

  botDifficulty:
    BotDifficulty | null;

  isConnected: boolean;
}

interface PublicRoom {
  code: string;

  status:
    | "LOBBY"
    | "IN_GAME";

  maxPlayers: number;
  players: PublicRoomPlayer[];
}

type GetRoomResult =
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

type RoomMutationResult =
  | {
      success: true;
      room: PublicRoom;
    }
  | {
      success: false;
      error: string;
    };

interface GameStartedPayload {
  code: string;
}

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

function creerSalonInitial(
  storedGame:
    StoredGameSession
): PublicRoom {
  return {
    code:
      storedGame.code,

    status:
      "LOBBY",

    maxPlayers:
      storedGame.maxPlayers,

    players:
  storedGame.players.map(
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

      isBot:
        false,

      botDifficulty:
        null,

      isConnected:
        true,
    })
  ),
  };
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

function demanderEtatSalon(
  socket: Socket,
  code: string
): Promise<GetRoomResult> {
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
        "room:get",
        {
          code,
        },
        (
          result:
            GetRoomResult
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

function demanderDemarrage(
  socket: Socket,
  code: string
): Promise<StartRoomResult> {
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
        "room:start",
        {
          code,
        },
        (
          result:
            StartRoomResult
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

function demanderAjoutBot(
  socket: Socket,
  code: string,
  difficulty: BotDifficulty
): Promise<RoomMutationResult> {
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
        "room:add-bot",
        {
          code,
          difficulty,
        },
        (
          result:
            RoomMutationResult
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

function demanderSuppressionBot(
  socket: Socket,
  code: string,
  botId: string
): Promise<RoomMutationResult> {
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
        "room:remove-bot",
        {
          code,
          botId,
        },
        (
          result:
            RoomMutationResult
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

export default function LobbyPage() {
  const router =
    useRouter();

  const [
    storedGame,
    setStoredGame,
  ] =
    useState<
      StoredGameSession | null
    >(null);

  const [
    room,
    setRoom,
  ] =
    useState<PublicRoom | null>(
      null
    );

  const [
    chargement,
    setChargement,
  ] = useState(true);

  const [
    demarrageEnCours,
    setDemarrageEnCours,
  ] = useState(false);

  const [
    messageErreur,
    setMessageErreur,
  ] =
    useState<string | null>(
      null
    );

  const [
    codeCopie,
    setCodeCopie,
  ] = useState(false);

  const [
    botDifficulty,
    setBotDifficulty,
  ] =
    useState<BotDifficulty>(
      "EASY"
    );

  const [
    botActionPending,
    setBotActionPending,
  ] = useState(false);

  useEffect(() => {
    const partieStockee =
      lireSessionPartie();

    if (!partieStockee) {
      setChargement(false);
      return;
    }

    const partieInitiale:
      StoredGameSession =
        partieStockee;

    const salonInitial =
      creerSalonInitial(
        partieInitiale
      );

    const roomCode =
      salonInitial.code;

    setStoredGame(
      partieInitiale
    );

    setRoom(
      salonInitial
    );

    const socket =
      obtenirSocket();

    function enregistrerSalon(
      updatedRoom:
        PublicRoom,
      playerId:
        string =
          partieInitiale
            .playerId
    ): StoredGameSession {
      const joueurLocal =
        updatedRoom.players.find(
          (player) =>
            player.id ===
            playerId
        );

      const nouvellePartie:
        StoredGameSession = {
        code:
          updatedRoom.code,

        playerId,

        pseudo:
          joueurLocal
            ?.pseudo ??
          partieInitiale.pseudo,

        isHost:
          joueurLocal
            ?.isHost ??
          partieInitiale.isHost,

        maxPlayers:
          updatedRoom.maxPlayers,

        players:
          convertirJoueurs(
            updatedRoom.players
          ),

        playerCount:
          updatedRoom.players.length,
      };

      enregistrerSessionPartie(
        nouvellePartie
      );

      setRoom(
        updatedRoom
      );

      setStoredGame(
        nouvellePartie
      );

      return nouvellePartie;
    }

    function gererMiseAJourSalon(
      updatedRoom:
        PublicRoom
    ): void {
      if (
        updatedRoom.code !==
        roomCode
      ) {
        return;
      }

      enregistrerSalon(
        updatedRoom
      );

      if (
        updatedRoom.status ===
        "IN_GAME"
      ) {
        router.replace(
          "/jeu"
        );
      }
    }

    function gererDebutPartie(
      payload:
        GameStartedPayload
    ): void {
      if (
        payload.code !==
        roomCode
      ) {
        return;
      }

      router.replace(
        "/jeu"
      );
    }

    function gererDeconnexion():
      void {
      setMessageErreur(
        "Connexion au serveur interrompue. Reconnexion en cours..."
      );
    }

    function gererReconnexion():
      void {
      setMessageErreur(null);
    }

    socket.on(
      "room:updated",
      gererMiseAJourSalon
    );

    socket.on(
      "game:started",
      gererDebutPartie
    );

    socket.on(
      "disconnect",
      gererDeconnexion
    );

    socket.on(
      "connect",
      gererReconnexion
    );

    void connecterSocket(
      socket
    )
      .then(async () => {
        setMessageErreur(
          null
        );

        const result =
          await demanderEtatSalon(
            socket,
            roomCode
          );

        if (
          !result.success
        ) {
          setMessageErreur(
            result.error
          );

          return;
        }

        enregistrerSalon(
          result.room,
          result.playerId
        );

        if (
          result.room.status ===
          "IN_GAME"
        ) {
          router.replace(
            "/jeu"
          );
        }
      })
      .catch(
        (
          error: unknown
        ) => {
          console.error(
            "Connexion au lobby impossible :",
            error
          );

          setMessageErreur(
            error instanceof Error
              ? error.message
              : "Impossible de se connecter au serveur."
          );
        }
      )
      .finally(() => {
        setChargement(false);
      });

    return () => {
      socket.off(
        "room:updated",
        gererMiseAJourSalon
      );

      socket.off(
        "game:started",
        gererDebutPartie
      );

      socket.off(
        "disconnect",
        gererDeconnexion
      );

      socket.off(
        "connect",
        gererReconnexion
      );
    };
  }, [
    router,
  ]);

  async function copierCode():
    Promise<void> {
    if (!room) {
      return;
    }

    try {
      await navigator
        .clipboard
        .writeText(
          room.code
        );

      setCodeCopie(true);

      window.setTimeout(
        () => {
          setCodeCopie(false);
        },
        1500
      );
    } catch (
      error: unknown
    ) {
      console.error(
        "Impossible de copier le code :",
        error
      );

      setMessageErreur(
        "Impossible de copier le code."
      );
    }
  }

  async function ajouterBot():
    Promise<void> {
    if (
      !room ||
      !storedGame ||
      botActionPending
    ) {
      return;
    }

    const joueurLocal =
      room.players.find(
        (player) =>
          player.id ===
          storedGame.playerId
      );

    if (
      !joueurLocal
        ?.isHost
    ) {
      setMessageErreur(
        "Seul l'hôte peut ajouter un bot."
      );

      return;
    }

    if (
      room.players.length >=
      room.maxPlayers
    ) {
      setMessageErreur(
        "Le salon est déjà complet."
      );

      return;
    }

    setBotActionPending(
      true
    );

    setMessageErreur(
      null
    );

    try {
      const socket =
        obtenirSocket();

      await connecterSocket(
        socket
      );

      const result =
        await demanderAjoutBot(
          socket,
          room.code,
          botDifficulty
        );

      if (
        !result.success
      ) {
        setMessageErreur(
          result.error
        );

        return;
      }

      setRoom(
        result.room
      );
    } catch (
      error: unknown
    ) {
      console.error(
        "Impossible d'ajouter le bot :",
        error
      );

      setMessageErreur(
        error instanceof Error
          ? error.message
          : "Impossible d'ajouter le bot."
      );
    } finally {
      setBotActionPending(
        false
      );
    }
  }

  async function retirerBot(
    botId: string
  ): Promise<void> {
    if (
      !room ||
      !storedGame ||
      botActionPending
    ) {
      return;
    }

    const joueurLocal =
      room.players.find(
        (player) =>
          player.id ===
          storedGame.playerId
      );

    if (
      !joueurLocal
        ?.isHost
    ) {
      setMessageErreur(
        "Seul l'hôte peut retirer un bot."
      );

      return;
    }

    setBotActionPending(
      true
    );

    setMessageErreur(
      null
    );

    try {
      const socket =
        obtenirSocket();

      await connecterSocket(
        socket
      );

      const result =
        await demanderSuppressionBot(
          socket,
          room.code,
          botId
        );

      if (
        !result.success
      ) {
        setMessageErreur(
          result.error
        );

        return;
      }

      setRoom(
        result.room
      );
    } catch (
      error: unknown
    ) {
      console.error(
        "Impossible de retirer le bot :",
        error
      );

      setMessageErreur(
        error instanceof Error
          ? error.message
          : "Impossible de retirer le bot."
      );
    } finally {
      setBotActionPending(
        false
      );
    }
  }

  async function demarrerPartie():
    Promise<void> {
    if (
      !room ||
      !storedGame ||
      demarrageEnCours
    ) {
      return;
    }

    const joueurLocal =
      room.players.find(
        (player) =>
          player.id ===
          storedGame.playerId
      );

    if (
      !joueurLocal
        ?.isHost
    ) {
      setMessageErreur(
        "Seul l'hôte peut démarrer la partie."
      );

      return;
    }

    if (
      room.players.length <
      MIN_PLAYER_COUNT
    ) {
      setMessageErreur(
        "Il faut au moins 2 joueurs pour démarrer."
      );

      return;
    }

    setDemarrageEnCours(
      true
    );

    setMessageErreur(null);

    try {
      const socket =
        obtenirSocket();

      await connecterSocket(
        socket
      );

      const result =
        await demanderDemarrage(
          socket,
          room.code
        );

      if (
        !result.success
      ) {
        setMessageErreur(
          result.error
        );

        return;
      }

      const joueurApresDemarrage =
        result.room.players.find(
          (player) =>
            player.id ===
            storedGame.playerId
        );

      const nouvellePartie:
        StoredGameSession = {
        code:
          result.room.code,

        playerId:
          storedGame.playerId,

        pseudo:
          joueurApresDemarrage
            ?.pseudo ??
          storedGame.pseudo,

        isHost:
          joueurApresDemarrage
            ?.isHost ??
          storedGame.isHost,

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
        nouvellePartie
      );

      setStoredGame(
        nouvellePartie
      );

      setRoom(
        result.room
      );

      router.replace(
        "/jeu"
      );
    } catch (
      error: unknown
    ) {
      console.error(
        "Impossible de démarrer la partie :",
        error
      );

      setMessageErreur(
        error instanceof Error
          ? error.message
          : "Impossible de démarrer la partie."
      );
    } finally {
      setDemarrageEnCours(
        false
      );
    }
  }

  function quitterLobby():
    void {
    supprimerSessionPartie();

    router.replace(
      "/"
    );
  }

  if (chargement) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-5 text-white">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-yellow-400 border-r-transparent" />

          <p className="mt-4 text-sm font-semibold text-zinc-400">
            Connexion au lobby...
          </p>
        </div>
      </main>
    );
  }

  if (
    !room ||
    !storedGame
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-5 text-white">
        <section className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-900 p-7 text-center">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
            Lobby introuvable
          </p>

          <h1 className="mt-3 text-2xl font-black">
            Impossible de charger la partie
          </h1>

          <p className="mt-4 text-sm leading-6 text-zinc-400">
            Les informations du salon sont
            absentes ou invalides.
          </p>

          <button
            type="button"
            onClick={() =>
              router.replace(
                "/creer"
              )
            }
            className="mt-7 min-h-12 w-full rounded-2xl bg-yellow-400 px-5 py-3 font-black text-zinc-950 transition active:scale-[0.98]"
          >
            Créer une partie
          </button>
        </section>
      </main>
    );
  }

  const joueurLocal =
    room.players.find(
      (player) =>
        player.id ===
        storedGame.playerId
    );

  const estHote =
    joueurLocal
      ?.isHost === true;

  const peutDemarrer =
    estHote &&
    room.players.length >=
      MIN_PLAYER_COUNT &&
    room.status ===
      "LOBBY";

  return (
    <main className="min-h-screen bg-[#111111] px-5 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-lg flex-col">
        <header className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
            Pyramide du Gang
          </p>

          <h1 className="mt-3 text-4xl font-black">
            Lobby
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Partage le code avec tes amis
            pour qu&apos;ils rejoignent la
            partie.
          </p>
        </header>

        <section className="mt-8 rounded-3xl border border-yellow-400/20 bg-zinc-900 p-6 shadow-2xl shadow-black/30">
          <p className="text-center text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
            Code de la partie
          </p>

          <button
            type="button"
            onClick={() =>
              void copierCode()
            }
            className="mt-3 w-full rounded-2xl border border-yellow-400/20 bg-black/30 px-4 py-5 text-center transition active:scale-[0.98]"
          >
            <span className="block text-4xl font-black tracking-[0.12em] text-yellow-400">
              {room.code}
            </span>

            <span className="mt-2 block text-xs font-bold text-zinc-500">
              {codeCopie
                ? "Code copié !"
                : "Appuie pour copier"}
            </span>
          </button>

          <div className="mt-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold">
                Joueurs
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Minimum 2 joueurs
              </p>
            </div>

            <div className="rounded-full bg-yellow-400 px-4 py-2 text-sm font-black text-zinc-950">
              {room.players.length}
              {" / "}
              {room.maxPlayers}
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {room.players.map(
              (
                player,
                index
              ) => {
                const estJoueurLocal =
                  player.id ===
                  storedGame.playerId;

                const estConnecte =
                  player.isBot ||
                  player.isConnected;

                return (
                  <article
                    key={
                      player.id
                    }
                    className={[
                      "flex min-h-16 items-center gap-4 rounded-2xl border border-white/5 bg-black/25 px-4 py-3 transition",
                      estConnecte
                        ? ""
                        : "opacity-70",
                    ].join(" ")}
                  >
                    <div className="shrink-0">
  <ProfileAvatar
    size="small"
    avatarType={
      player.avatarType
    }
    avatarId={
      player.avatarId
    }
    avatarPhoto={
      player.avatarPhoto
    }
    className={
      estConnecte
        ? ""
        : "grayscale opacity-45"
    }
  />
</div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-black">
                        {player.pseudo}

                        {estJoueurLocal && (
                          <span className="ml-2 text-xs font-bold text-zinc-500">
                            Toi
                          </span>
                        )}
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                        {player.isHost && (
                          <span className="font-bold text-yellow-400">
                            👑 Hôte
                          </span>
                        )}

                        {player.isBot && (
                          <span className="font-bold text-blue-300">
                            🤖 Bot
                            {player.botDifficulty ===
                              "EASY"
                              ? " facile"
                              : player.botDifficulty ===
                                  "NORMAL"
                                ? " normal"
                                : " difficile"}
                          </span>
                        )}

                        {!estConnecte && (
                          <span className="font-bold text-zinc-500">
                            Déconnecté
                          </span>
                        )}

                        {estConnecte &&
                          !player.isHost &&
                          !player.isBot && (
                          <span className="text-zinc-500">
                            Joueur connecté
                          </span>
                        )}
                      </div>
                    </div>

                    {player.isHost && (
                      <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-black text-yellow-400">
                        HÔTE
                      </span>
                    )}

                    {estHote &&
                      player.isBot && (
                      <button
                        type="button"
                        aria-label={`Retirer ${player.pseudo}`}
                        disabled={
                          botActionPending
                        }
                        onClick={() =>
                          void retirerBot(
                            player.id
                          )
                        }
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-red-500/30
                          bg-red-500/10
                          text-sm
                          font-black
                          text-red-400
                          transition
                          hover:bg-red-500/20
                          active:scale-95
                          disabled:cursor-not-allowed
                          disabled:opacity-40
                        "
                      >
                        ✕
                      </button>
                    )}
                  </article>
                );
              }
            )}

            {Array.from(
              {
                length:
                  Math.max(
                    0,
                    room.maxPlayers -
                      room.players.length
                  ),
              },
              (
                _,
                index
              ) => (
                <div
                  key={
                    `empty-${index}`
                  }
                  className="flex min-h-14 items-center justify-center rounded-2xl border border-dashed border-white/10 px-4 text-sm font-semibold text-zinc-600"
                >
                  En attente d&apos;un joueur...
                </div>
              )
            )}
          </div>

          {estHote &&
            room.status ===
              "LOBBY" && (
            <section
              className="
                mt-6
                rounded-2xl
                border
                border-blue-400/20
                bg-blue-400/5
                p-4
              "
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-black text-white">
                    🤖 Ajouter un bot
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Tu peux en ajouter plusieurs,
                    jusqu’à remplir le salon.
                  </p>
                </div>

                <span className="rounded-full bg-blue-400/10 px-3 py-1 text-xs font-black text-blue-300">
                  {
                    room.players.filter(
                      (player) =>
                        player.isBot
                    ).length
                  } bot
                  {room.players.filter(
                    (player) =>
                      player.isBot
                  ).length > 1
                    ? "s"
                    : ""}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {(
                  [
                    [
                      "EASY",
                      "Facile",
                    ],
                    [
                      "NORMAL",
                      "Normal",
                    ],
                    [
                      "HARD",
                      "Difficile",
                    ],
                  ] as const
                ).map(
                  ([
                    value,
                    label,
                  ]) => (
                    <button
                      key={
                        value
                      }
                      type="button"
                      disabled={
                        botActionPending
                      }
                      onClick={() =>
                        setBotDifficulty(
                          value
                        )
                      }
                      className={[
                        "min-h-11 rounded-xl border px-3 py-2 text-xs font-black transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40",
                        botDifficulty ===
                          value
                          ? "border-blue-400 bg-blue-400 text-zinc-950"
                          : "border-white/10 bg-zinc-950 text-zinc-400 hover:border-blue-400/40",
                      ].join(" ")}
                    >
                      {label}
                    </button>
                  )
                )}
              </div>

              <button
                type="button"
                disabled={
                  botActionPending ||
                  room.players.length >=
                    room.maxPlayers
                }
                onClick={() =>
                  void ajouterBot()
                }
                className="
                  mt-3
                  flex
                  min-h-12
                  w-full
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-400
                  px-4
                  py-3
                  font-black
                  text-zinc-950
                  transition
                  hover:bg-blue-300
                  active:scale-[0.98]
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                {botActionPending
                  ? "Mise à jour..."
                  : room.players.length >=
                      room.maxPlayers
                    ? "Salon complet"
                    : "Ajouter un bot"}
              </button>
            </section>
          )}

          {messageErreur && (
            <div
              role="alert"
              className="mt-5 rounded-2xl border border-red-900 bg-red-950/60 p-4 text-sm font-semibold text-red-300"
            >
              {messageErreur}
            </div>
          )}

          {estHote ? (
            <button
              type="button"
              disabled={
                !peutDemarrer ||
                demarrageEnCours
              }
              onClick={() =>
                void demarrerPartie()
              }
              className="mt-6 flex min-h-14 w-full items-center justify-center rounded-2xl bg-yellow-400 px-5 py-4 font-black text-zinc-950 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {demarrageEnCours
                ? "Démarrage..."
                : room.players.length <
                    MIN_PLAYER_COUNT
                  ? "En attente d'un joueur"
                  : "Démarrer la partie"}
            </button>
          ) : (
            <div className="mt-6 rounded-2xl bg-zinc-800 px-5 py-4 text-center text-sm font-bold text-zinc-400">
              En attente du démarrage par
              l&apos;hôte...
            </div>
          )}
        </section>

        <button
          type="button"
          onClick={
            quitterLobby
          }
          className="mt-5 min-h-12 w-full rounded-2xl border border-white/10 px-5 py-3 text-sm font-bold text-zinc-400 transition hover:bg-white/5 active:scale-[0.98]"
        >
          Quitter le lobby
        </button>

        <footer className="mt-auto pt-8 text-center text-xs text-zinc-600">
          Pyramide du Gang · by Ludo B
        </footer>
      </div>
    </main>
  );
}