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

type StartRoomPayload = {
  code: string;
};

type RoomCallback = (
  result: RoomResult
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
      gameRoom
        .getStateForPlayer(
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
                  result.room
                    .code,
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