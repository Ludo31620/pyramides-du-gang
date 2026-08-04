import {
  createServer,
} from "node:http";

import next from "next";

import {
  Server,
  type Socket,
} from "socket.io";

import {
  RoomManager,
} from "./server/RoomManager";

import type {
  GameAction,
} from "./lib/gameEngine/actions";

import type {
  Carte,
} from "./lib/deck";

import type {
  BotDifficulty,
  PublicRoom,
  RoomMutationResult,
  RoomResult,
  StartRoomResult,
} from "./server/types";

import type {
  PlayerAvatarType,
} from "./lib/profile/types";

type CreateRoomPayload = {
  pseudo: string;

  avatarType:
    PlayerAvatarType;

  avatarId:
    string | null;

  avatarPhoto:
    string | null;

  maxPlayers: number;
};

type JoinRoomPayload = {
  pseudo: string;

  avatarType:
    PlayerAvatarType;

  avatarId:
    string | null;

  avatarPhoto:
    string | null;

  code: string;
};

type GetRoomPayload = {
  code: string;
};

type StartRoomPayload = {
  code: string;
};

type AddBotPayload = {
  code: string;

  difficulty:
    BotDifficulty;
};

type RemoveBotPayload = {
  code: string;

  botId: string;
};

type ReturnToLobbyPayload = {
  code: string;
};

type GetGamePayload = {
  code: string;
};

type GameActionPayload = {
  code: string;
  action: GameAction;
};

type RoomCallback = (
  result: RoomResult
) => void;

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

type GetRoomCallback = (
  result: GetRoomResult
) => void;

type GameResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

type GameCallback = (
  result: GameResult
) => void;

type StartRoomCallback = (
  result: StartRoomResult
) => void;

type RoomMutationCallback = (
  result:
    RoomMutationResult
) => void;

type RevealAnimationResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

type RevealAnimationCallback = (
  result:
    RevealAnimationResult
) => void;

interface RevealAnimationPayload {
  card: Carte;
  drinks: number;
  animationKey: number;
}

type BluffAnimationRequestPayload = {
  target: number;
};

type BluffAnimationResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

type BluffAnimationCallback = (
  result:
    BluffAnimationResult
) => void;

interface BluffAnimationPayload {
  giver: number;
  target: number;
  drinks: number;
  animationKey: number;
}

const LOBBY_DISCONNECT_GRACE_MS =
  2 * 60 * 1000;

const dev =
  process.env.NODE_ENV !==
  "production";

const hostname =
  "0.0.0.0";

const port =
  Number(
    process.env.PORT
  ) || 3000;



const app = next({
  dev,
  hostname,
  port,
});

const handle =
  app.getRequestHandler();

const roomManager =
  new RoomManager();

const pendingLobbyRemovals =
  new Map<
    string,
    ReturnType<
      typeof setTimeout
    >
  >();

function obtenirPlayerToken(
  socket: Socket
): string {
  const rawToken =
    socket.handshake.auth
      ?.playerToken;

  if (
    typeof rawToken !==
    "string"
  ) {
    return "";
  }

  return rawToken
    .trim()
    .slice(0, 200);
}

function annulerSuppressionJoueur(
  playerId: string
): void {
  const timeout =
    pendingLobbyRemovals.get(
      playerId
    );

  if (!timeout) {
    return;
  }

  clearTimeout(
    timeout
  );

  pendingLobbyRemovals.delete(
    playerId
  );
}

function rejoindreSalonSocket(
  socket: Socket,
  roomCode: string
): void {
  for (
    const joinedRoom of
    socket.rooms
  ) {
    if (
      joinedRoom !==
        socket.id &&
      joinedRoom !==
        roomCode
    ) {
      void socket.leave(
        joinedRoom
      );
    }
  }

  void socket.join(
    roomCode
  );
}

function diffuserSalon(
  io: Server,
  room: PublicRoom
): void {
  io.to(
    room.code
  ).emit(
    "room:updated",
    room
  );
}

function reconnecterJoueur(
  socket: Socket,
  code: string
): RoomResult {
  const playerToken =
    obtenirPlayerToken(
      socket
    );

  const result =
    roomManager
      .reconnectPlayer({
        socketId:
          socket.id,

        playerToken,

        code,
      });

  if (
    result.success
  ) {
    annulerSuppressionJoueur(
      result.playerId
    );

    rejoindreSalonSocket(
      socket,
      result.room.code
    );
  }

  return result;
}

function diffuserEtatJeu(
  io: Server,
  roomManagerInstance:
    RoomManager,
  roomCode: string
): void {
  const gameRoom =
    roomManagerInstance
      .getGameRoom(
        roomCode
      );

  if (!gameRoom) {
    throw new Error(
      `GameRoom introuvable pour ${roomCode}.`
    );
  }

  let sentStateCount =
    0;

  for (
    const playerSocket of
    io.sockets.sockets
      .values()
  ) {
    if (
      !playerSocket.rooms.has(
        roomCode
      )
    ) {
      continue;
    }

    const playerIndex =
      roomManagerInstance
        .getPlayerIndexBySocket(
          roomCode,
          playerSocket.id
        );

    if (
      playerIndex ===
      null
    ) {
      continue;
    }

    const playerState =
      gameRoom
        .getStateForPlayer(
          playerIndex
        );

    playerSocket.emit(
      "game:state",
      playerState
    );

    sentStateCount +=
      1;
  }

  console.log(
    `🔒 État privé envoyé à ${sentStateCount} joueurs`
  );
}

function creerPayloadAnimationRevelation(
  roomCode: string,
  socketId: string
): RevealAnimationPayload {
  const gameRoom =
    roomManager
      .getGameRoom(
        roomCode
      );

  if (!gameRoom) {
    throw new Error(
      "La partie n'est pas démarrée ou n'existe plus."
    );
  }

  const room =
    roomManager.getRoom(
      roomCode
    );

  if (!room) {
    throw new Error(
      "Le salon n'existe plus."
    );
  }

  const playerIndex =
    roomManager
      .getPlayerIndexBySocket(
        roomCode,
        socketId
      );

  if (
    playerIndex ===
    null
  ) {
    throw new Error(
      "Le serveur n'a pas pu identifier ton joueur."
    );
  }

  const player =
    room.players[
      playerIndex
    ];

  if (
    !player ||
    !player.isHost
  ) {
    throw new Error(
      "Seul l'hôte peut révéler une carte."
    );
  }

  const state =
    gameRoom.getState();

  if (
    state.phase !==
    "WAITING"
  ) {
    throw new Error(
      "La prochaine carte ne peut pas encore être révélée."
    );
  }

  const realNextRow =
    state.pyramid.length -
    1 -
    state.progress
      .nextRow;

  const nextCard =
    state.pyramid[
      realNextRow
    ]?.[
      state.progress
        .nextColumn
    ];

  if (!nextCard) {
    throw new Error(
      "La prochaine carte de la pyramide est introuvable."
    );
  }

  return {
    card: {
      ...nextCard,
    },

    drinks:
      state.progress
        .nextRow +
      1,

    animationKey:
      Date.now(),
  };
}

function creerPayloadAnimationBluff(
  roomCode: string,
  socketId: string,
  target: number
): BluffAnimationPayload {
  const gameRoom =
    roomManager
      .getGameRoom(
        roomCode
      );

  if (!gameRoom) {
    throw new Error(
      "La partie n'est pas démarrée ou n'existe plus."
    );
  }

  const playerIndex =
    roomManager
      .getPlayerIndexBySocket(
        roomCode,
        socketId
      );

  if (
    playerIndex ===
    null
  ) {
    throw new Error(
      "Le serveur n'a pas pu identifier ton joueur."
    );
  }

  const state =
    gameRoom.getState();

  if (
    state.phase !==
    "PLAYER_TURN"
  ) {
    throw new Error(
      "Une annonce de bluff n'est pas possible maintenant."
    );
  }

  if (
    state.turn
      .currentPlayer !==
    playerIndex
  ) {
    throw new Error(
      "Ce n'est pas ton tour."
    );
  }

  if (
    !Number.isInteger(
      target
    ) ||
    target < 0 ||
    target >=
      state.players.length
  ) {
    throw new Error(
      "La cible est invalide."
    );
  }

  if (
    target ===
    playerIndex
  ) {
    throw new Error(
      "Tu ne peux pas te cibler toi-même."
    );
  }

  if (
    !state.current.card
  ) {
    throw new Error(
      "Aucune carte de pyramide n'est active."
    );
  }

  return {
    giver:
      playerIndex,

    target,

    drinks:
      state.current.row +
      1,

    animationKey:
      Date.now(),
  };
}

async function demarrerServeur():
  Promise<void> {
  await app.prepare();

  const httpServer =
    createServer(
      (
        requete,
        reponse
      ) => {
        void handle(
          requete,
          reponse
        );
      }
    );

  const io =
    new Server(
      httpServer
    );

  io.on(
    "connection",
    (socket) => {
      console.log(
        `🟢 Joueur connecté : ${socket.id}`
      );

      socket.on(
        "room:create",
        (
          payload:
            CreateRoomPayload,

          callback:
            RoomCallback
        ) => {
          try {
const result =
  roomManager
    .createRoom({
      socketId:
        socket.id,

      playerToken:
        obtenirPlayerToken(
          socket
        ),

      pseudo:
        payload?.pseudo ??
        "",

      avatarType:
        payload?.avatarType ??
        "DEFAULT",

      avatarId:
        payload?.avatarId ??
        "fox",

      avatarPhoto:
        payload?.avatarPhoto ??
        null,

      maxPlayers:
        payload
          ?.maxPlayers,
    });

            if (
              !result.success
            ) {
              callback(
                result
              );

              return;
            }

            annulerSuppressionJoueur(
              result.playerId
            );

            rejoindreSalonSocket(
              socket,
              result.room.code
            );

            callback(
              result
            );

            diffuserSalon(
              io,
              result.room
            );

            console.log(
              `🏠 Partie créée : ${result.room.code} par ${payload.pseudo}`
            );
          } catch (
            error: unknown
          ) {
            console.error(
              "Erreur pendant la création du salon :",
              error
            );

            callback({
              success: false,
              error:
                "Impossible de créer la partie.",
            });
          }
        }
      );

      socket.on(
        "room:join",
        (
          payload:
            JoinRoomPayload,

          callback:
            RoomCallback
        ) => {
          try {
const result =
  roomManager
    .joinRoom({
      socketId:
        socket.id,

      playerToken:
        obtenirPlayerToken(
          socket
        ),

      pseudo:
        payload?.pseudo ??
        "",

      avatarType:
        payload?.avatarType ??
        "DEFAULT",

      avatarId:
        payload?.avatarId ??
        "fox",

      avatarPhoto:
        payload?.avatarPhoto ??
        null,

      code:
        payload?.code ??
        "",
    });

            if (
              !result.success
            ) {
              callback(
                result
              );

              return;
            }

            annulerSuppressionJoueur(
              result.playerId
            );

            rejoindreSalonSocket(
              socket,
              result.room.code
            );

            callback(
              result
            );

            diffuserSalon(
              io,
              result.room
            );

            console.log(
              `👤 ${payload.pseudo} rejoint ${result.room.code}`
            );
          } catch (
            error: unknown
          ) {
            console.error(
              "Erreur pendant la connexion au salon :",
              error
            );

            callback({
              success: false,
              error:
                "Impossible de rejoindre la partie.",
            });
          }
        }
      );

      socket.on(
        "room:get",
        (
          payload:
            GetRoomPayload,

          callback:
            GetRoomCallback
        ) => {
          try {
            const result =
              reconnecterJoueur(
                socket,
                payload?.code ??
                  ""
              );

            if (
              !result.success
            ) {
              callback(
                result
              );

              return;
            }

            callback({
              success: true,

              room:
                result.room,

              playerId:
                result.playerId,
            });

            diffuserSalon(
              io,
              result.room
            );

            console.log(
              `🔄 Salon synchronisé : ${result.room.code}`
            );
          } catch (
            error: unknown
          ) {
            console.error(
              "Erreur pendant la récupération du salon :",
              error
            );

            callback({
              success: false,
              error:
                "Impossible de synchroniser la partie.",
            });
          }
        }
      );

      socket.on(
        "room:add-bot",
        (
          payload:
            AddBotPayload,

          callback:
            RoomMutationCallback
        ) => {
          try {
            const reconnectResult =
              reconnecterJoueur(
                socket,
                payload?.code ??
                  ""
              );

            if (
              !reconnectResult
                .success
            ) {
              callback(
                reconnectResult
              );

              return;
            }

            const result =
              roomManager
                .addBot({
                  socketId:
                    socket.id,

                  code:
                    payload?.code ??
                    "",

                  difficulty:
                    payload
                      ?.difficulty ??
                    "EASY",
                });

            if (
              !result.success
            ) {
              callback(
                result
              );

              return;
            }

            callback(
              result
            );

            diffuserSalon(
              io,
              result.room
            );

            console.log(
              `🤖 Bot ajouté dans ${result.room.code}`
            );
          } catch (
            error: unknown
          ) {
            console.error(
              "Erreur pendant l'ajout du bot :",
              error
            );

            callback({
              success: false,

              error:
                "Impossible d'ajouter le bot.",
            });
          }
        }
      );

      socket.on(
        "room:remove-bot",
        (
          payload:
            RemoveBotPayload,

          callback:
            RoomMutationCallback
        ) => {
          try {
            const reconnectResult =
              reconnecterJoueur(
                socket,
                payload?.code ??
                  ""
              );

            if (
              !reconnectResult
                .success
            ) {
              callback(
                reconnectResult
              );

              return;
            }

            const result =
              roomManager
                .removeBot({
                  socketId:
                    socket.id,

                  code:
                    payload?.code ??
                    "",

                  botId:
                    payload?.botId ??
                    "",
                });

            if (
              !result.success
            ) {
              callback(
                result
              );

              return;
            }

            callback(
              result
            );

            diffuserSalon(
              io,
              result.room
            );

            console.log(
              `🗑️ Bot retiré de ${result.room.code}`
            );
          } catch (
            error: unknown
          ) {
            console.error(
              "Erreur pendant la suppression du bot :",
              error
            );

            callback({
              success: false,

              error:
                "Impossible de retirer le bot.",
            });
          }
        }
      );

      socket.on(
        "room:start",
        (
          payload:
            StartRoomPayload,

          callback:
            StartRoomCallback
        ) => {
          try {
            const reconnectResult =
              reconnecterJoueur(
                socket,
                payload?.code ??
                  ""
              );

            if (
              !reconnectResult
                .success
            ) {
              callback(
                reconnectResult
              );

              return;
            }

            const result =
              roomManager
                .startRoom({
                  socketId:
                    socket.id,

                  code:
                    payload?.code ??
                    "",
                });

            if (
              !result.success
            ) {
              callback(
                result
              );

              return;
            }

            callback(
              result
            );

            diffuserSalon(
              io,
              result.room
            );

            io.to(
              result.room.code
            ).emit(
              "game:started",
              {
                code:
                  result.room.code,
              }
            );

            diffuserEtatJeu(
              io,
              roomManager,
              result.room.code
            );

            console.log(
              `🎮 Partie démarrée : ${result.room.code}`
            );
          } catch (
            error: unknown
          ) {
            console.error(
              "Erreur pendant le démarrage de la partie :",
              error
            );

            callback({
              success: false,
              error:
                "Impossible de démarrer la partie.",
            });
          }
        }
      );

      /*
       * Après GAME_OVER, n'importe quel joueur
       * du salon peut demander le retour collectif
       * au lobby.
       *
       * Le serveur vérifie lui-même que la partie
       * est réellement terminée.
       */
      socket.on(
        "game:return-to-lobby",
        (
          payload:
            ReturnToLobbyPayload,

          callback:
            StartRoomCallback
        ) => {
          try {
            const code =
              payload?.code ??
              "";

            const reconnectResult =
              reconnecterJoueur(
                socket,
                code
              );

            if (
              !reconnectResult
                .success
            ) {
              callback(
                reconnectResult
              );

              return;
            }

            const result =
              roomManager
                .returnRoomToLobby({
                  socketId:
                    socket.id,

                  code,
                });

            if (
              !result.success
            ) {
              callback(
                result
              );

              return;
            }

            diffuserSalon(
              io,
              result.room
            );

            /*
             * Tous les téléphones présents dans
             * le salon recevront cet événement
             * et seront redirigés vers /lobby.
             */
            io.to(
              result.room.code
            ).emit(
              "game:returned-to-lobby",
              {
                code:
                  result.room.code,
              }
            );

            callback({
              success: true,
              room:
                result.room,
            });

            console.log(
              `🏠 Retour collectif au lobby : ${result.room.code}`
            );
          } catch (
            error: unknown
          ) {
            const message =
              error instanceof Error
                ? error.message
                : "Impossible de retourner au lobby.";

            console.error(
              "Erreur pendant le retour au lobby :",
              error
            );

            callback({
              success: false,
              error:
                message,
            });
          }
        }
      );

      socket.on(
        "game:get",
        (
          payload:
            GetGamePayload,

          callback:
            GameCallback
        ) => {
          try {
            const code =
              payload?.code ??
              "";

            const reconnectResult =
              reconnecterJoueur(
                socket,
                code
              );

            if (
              !reconnectResult
                .success
            ) {
              callback({
                success: false,

                error:
                  reconnectResult
                    .error,
              });

              return;
            }

            const gameRoom =
              roomManager
                .getGameRoom(
                  code
                );

            if (!gameRoom) {
              callback({
                success: false,
                error:
                  "La partie n'est pas démarrée ou n'existe plus.",
              });

              return;
            }

            const playerIndex =
              roomManager
                .getPlayerIndexBySocket(
                  code,
                  socket.id
                );

            if (
              playerIndex ===
              null
            ) {
              callback({
                success: false,
                error:
                  "Le serveur n'a pas pu identifier ton joueur.",
              });

              return;
            }

            const playerState =
              gameRoom
                .getStateForPlayer(
                  playerIndex
                );

            socket.emit(
              "game:state",
              playerState
            );

            callback({
              success: true,
            });

            console.log(
              `🎯 État du jeu synchronisé pour le joueur ${playerIndex + 1} dans ${gameRoom.code}`
            );
          } catch (
            error: unknown
          ) {
            console.error(
              "Erreur pendant la récupération de l'état du jeu :",
              error
            );

            callback({
              success: false,

              error:
                error instanceof Error
                  ? error.message
                  : "Impossible de synchroniser le jeu.",
            });
          }
        }
      );

      socket.on(
        "game:request-reveal-animation",
        (
          callback:
            RevealAnimationCallback
        ) => {
          try {
            const roomCode =
              roomManager
                .getRoomCodeBySocket(
                  socket.id
                );

            if (!roomCode) {
              callback({
                success: false,
                error:
                  "Le serveur n'a pas pu retrouver ta partie.",
              });

              return;
            }

            const payload =
              creerPayloadAnimationRevelation(
                roomCode,
                socket.id
              );

            io.to(
              roomCode
            ).emit(
              "game:reveal-animation",
              payload
            );

            callback({
              success: true,
            });

            console.log(
              `🎬 Animation de révélation diffusée dans ${roomCode}`
            );
          } catch (
            error: unknown
          ) {
            const message =
              error instanceof Error
                ? error.message
                : "Impossible de lancer l'animation de révélation.";

            console.error(
              "Animation de révélation refusée :",
              error
            );

            callback({
              success: false,
              error:
                message,
            });
          }
        }
      );

      socket.on(
        "game:request-bluff-animation",
        (
          payload:
            BluffAnimationRequestPayload,

          callback:
            BluffAnimationCallback
        ) => {
          try {
            const roomCode =
              roomManager
                .getRoomCodeBySocket(
                  socket.id
                );

            if (!roomCode) {
              callback({
                success: false,

                error:
                  "Le serveur n'a pas pu retrouver ta partie.",
              });

              return;
            }

            const animationPayload =
              creerPayloadAnimationBluff(
                roomCode,
                socket.id,
                payload?.target
              );

            io.to(
              roomCode
            ).emit(
              "game:bluff-animation",
              animationPayload
            );

            callback({
              success: true,
            });

            console.log(
              `🎬 Animation de bluff diffusée dans ${roomCode} : joueur ${animationPayload.giver + 1} vers joueur ${animationPayload.target + 1}`
            );
          } catch (
            error: unknown
          ) {
            const message =
              error instanceof Error
                ? error.message
                : "Impossible de lancer l'animation de bluff.";

            console.error(
              "Animation de bluff refusée :",
              error
            );

            callback({
              success: false,

              error:
                message,
            });
          }
        }
      );

      socket.on(
        "game:action",
        (
          payload:
            GameActionPayload,

          callback:
            GameCallback
        ) => {
          try {
            const code =
              payload?.code ??
              "";

            const action =
              payload?.action;

            if (!action) {
              callback({
                success: false,
                error:
                  "L'action reçue est invalide.",
              });

              return;
            }

            const reconnectResult =
              reconnecterJoueur(
                socket,
                code
              );

            if (
              !reconnectResult
                .success
            ) {
              callback({
                success: false,

                error:
                  reconnectResult
                    .error,
              });

              return;
            }

            const gameRoom =
              roomManager
                .getGameRoom(
                  code
                );

            if (!gameRoom) {
              callback({
                success: false,
                error:
                  "La partie n'est pas démarrée ou n'existe plus.",
              });

              return;
            }

            const playerIndex =
              roomManager
                .getPlayerIndexBySocket(
                  code,
                  socket.id
                );

            if (
              playerIndex ===
              null
            ) {
              callback({
                success: false,
                error:
                  "Le serveur n'a pas pu identifier ton joueur.",
              });

              return;
            }

            gameRoom
              .dispatchForPlayer(
                playerIndex,
                action
              );

            diffuserEtatJeu(
              io,
              roomManager,
              gameRoom.code
            );

            callback({
              success: true,
            });

            console.log(
              `🎮 ${action.type} exécutée par le joueur ${playerIndex + 1} dans ${gameRoom.code}`
            );
          } catch (
            error: unknown
          ) {
            const message =
              error instanceof Error
                ? error.message
                : "Cette action est impossible.";

            console.error(
              "Action de jeu refusée :",
              error
            );

            socket.emit(
              "game:error",
              {
                error:
                  message,
              }
            );

            callback({
              success: false,
              error:
                message,
            });
          }
        }
      );

      socket.on(
        "disconnect",
        (raison) => {
          const disconnectedPlayer =
            roomManager
              .disconnectPlayerBySocket(
                socket.id
              );

          console.log(
            `🔴 Joueur déconnecté : ${socket.id}`,
            raison
          );

          if (
            !disconnectedPlayer
          ) {
            return;
          }

          if (
            disconnectedPlayer
              .status ===
            "IN_GAME"
          ) {
            console.log(
              `💾 Joueur ${disconnectedPlayer.playerId} conservé dans ${disconnectedPlayer.code}`
            );

            return;
          }

          annulerSuppressionJoueur(
            disconnectedPlayer
              .playerId
          );

          const timeout =
            setTimeout(
              () => {
                pendingLobbyRemovals.delete(
                  disconnectedPlayer
                    .playerId
                );

                const updatedRoom =
                  roomManager
                    .removePlayerById(
                      disconnectedPlayer
                        .code,

                      disconnectedPlayer
                        .playerId
                    );

                if (
                  updatedRoom
                ) {
                  diffuserSalon(
                    io,
                    updatedRoom
                  );
                }

                console.log(
                  `🧹 Joueur déconnecté supprimé du lobby ${disconnectedPlayer.code}`
                );
              },
              LOBBY_DISCONNECT_GRACE_MS
            );

          pendingLobbyRemovals.set(
            disconnectedPlayer
              .playerId,
            timeout
          );
        }
      );
    }
  );

  httpServer.listen(
    port,
    hostname,
    () => {
      console.log(
        `🚀 Serveur disponible sur http://localhost:${port}`
      );

      /*
       * Ton serveur affichait auparavant
       * 192.168.1.97 en dur.
       *
       * On retire cette fausse adresse plutôt
       * que de continuer à mentir aux humains.
       */
      console.log(
        "📱 Utilise l'adresse IP Wi-Fi actuelle du Mac avec le port 3000"
      );

      console.log(
        "🔌 Serveur Socket.IO démarré"
      );

      console.log(
        "🏠 Gestionnaire de salons initialisé"
      );
    }
  );
}

demarrerServeur().catch(
  (
    error: unknown
  ) => {
    console.error(
      "Impossible de démarrer le serveur :",
      error
    );

    process.exit(1);
  }
);