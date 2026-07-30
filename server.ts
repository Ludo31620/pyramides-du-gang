import { createServer } from "node:http";

import next from "next";
import {
  Server,
  type Socket,
} from "socket.io";

import { RoomManager } from "./server/RoomManager";

import type {
  PublicRoom,
  RoomResult,
  StartRoomResult,
} from "./server/types";

type CreateRoomPayload = {
  pseudo: string;
  maxPlayers: number;
};

type JoinRoomPayload = {
  pseudo: string;
  code: string;
};

type GetRoomPayload = {
  code: string;
};

type StartRoomPayload = {
  code: string;
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

type GetGamePayload = {
  code: string;
};

type GameActionPayload = {
  code: string;
  action: GameAction;
};

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

const dev =
  process.env.NODE_ENV !==
  "production";

const hostname =
  process.env.HOSTNAME ??
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
  io.to(room.code).emit(
    "room:updated",
    room
  );
}

function diffuserEtatJeu(
  io: Server,
  roomManagerInstance:
    RoomManager,
  roomCode: string
): void {
  const gameRoom =
    roomManagerInstance.getGameRoom(
      roomCode
    );

  if (!gameRoom) {
    throw new Error(
      `GameRoom introuvable pour ${roomCode}.`
    );
  }

  let sentStateCount = 0;

  for (
    const playerSocket of
    io.sockets.sockets.values()
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
      playerIndex === null
    ) {
      continue;
    }

    const playerState =
      gameRoom.getStateForPlayer(
        playerIndex
      );

    playerSocket.emit(
      "game:state",
      playerState
    );

    sentStateCount += 1;
  }

  console.log(
    `🔒 État privé envoyé à ${sentStateCount} joueurs`
  );
}

async function demarrerServeur(): Promise<void> {
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

                  pseudo:
                    payload
                      ?.pseudo ??
                    "",

                  maxPlayers:
                    payload
                      ?.maxPlayers,
                });

            if (
              !result.success
            ) {
              callback(result);
              return;
            }

            rejoindreSalonSocket(
              socket,
              result.room.code
            );

            callback(result);

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

                  pseudo:
                    payload
                      ?.pseudo ??
                    "",

                  code:
                    payload
                      ?.code ??
                    "",
                });

            if (
              !result.success
            ) {
              callback(result);
              return;
            }

            rejoindreSalonSocket(
              socket,
              result.room.code
            );

            callback(result);

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
            const code =
              payload?.code ?? "";

            const room =
              roomManager.getRoom(
                code
              );

            if (!room) {
              callback({
                success: false,
                error:
                  "Cette partie n'existe pas.",
              });

              return;
            }

            const playerIndex =
              roomManager
                .getPlayerIndexBySocket(
                  room.code,
                  socket.id
                );

            if (
              playerIndex === null
            ) {
              callback({
                success: false,
                error:
                  "Le serveur n'a pas pu identifier ton joueur.",
              });

              return;
            }

            const player =
              room.players[
                playerIndex
              ];

            if (!player) {
              callback({
                success: false,
                error:
                  "Le joueur est introuvable dans cette partie.",
              });

              return;
            }

            rejoindreSalonSocket(
              socket,
              room.code
            );

            callback({
              success: true,
              room,
              playerId:
                player.id,
            });

            console.log(
              `🔄 Salon synchronisé : ${room.code} pour ${player.pseudo}`
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
        "room:start",
        (
          payload:
            StartRoomPayload,
          callback:
            StartRoomCallback
        ) => {
          try {
            const result =
              roomManager
                .startRoom({
                  socketId:
                    socket.id,

                  code:
                    payload
                      ?.code ??
                    "",
                });

            if (
              !result.success
            ) {
              callback(result);
              return;
            }

            callback(result);

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
        payload?.code ?? "";

      const gameRoom =
        roomManager.getGameRoom(
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
        playerIndex === null
      ) {
        callback({
          success: false,
          error:
            "Le serveur n'a pas pu identifier ton joueur.",
        });

        return;
      }

      rejoindreSalonSocket(
        socket,
        gameRoom.code
      );

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
  "game:action",
  (
    payload:
      GameActionPayload,
    callback:
      GameCallback
  ) => {
    try {
      const code =
        payload?.code ?? "";

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

      const gameRoom =
        roomManager.getGameRoom(
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
        playerIndex === null
      ) {
        callback({
          success: false,
          error:
            "Le serveur n'a pas pu identifier ton joueur.",
        });

        return;
      }

      gameRoom.dispatchForPlayer(
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
          const roomCode =
            roomManager
              .getRoomCodeBySocket(
                socket.id
              );

          const roomUpdated =
            roomManager
              .removePlayerBySocket(
                socket.id
              );

          console.log(
            `🔴 Joueur déconnecté : ${socket.id}`,
            raison
          );

          if (
            roomUpdated
          ) {
            diffuserSalon(
              io,
              roomUpdated
            );
          } else if (
            roomCode
          ) {
            console.log(
              `🗑️ Partie supprimée : ${roomCode}`
            );
          }

          console.log(
            `🏠 Salons actifs : ${roomManager.getRoomCount()}`
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

      console.log(
        `📱 Accès réseau sur http://192.168.1.53:${port}`
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
  (error: unknown) => {
    console.error(
      "Impossible de démarrer le serveur :",
      error
    );

    process.exit(1);
  }
);