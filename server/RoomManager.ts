import { GameRoom } from "./GameRoom";

import type {
  CreateRoomInput,
  JoinRoomInput,
  PublicRoom,
  Room,
  RoomPlayer,
  RoomResult,
  StartRoomInput,
  StartRoomResult,
} from "./types";

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 9;

export class RoomManager {
  private readonly rooms =
    new Map<string, Room>();

  private readonly gameRooms =
    new Map<string, GameRoom>();

  createRoom(
    input: CreateRoomInput
  ): RoomResult {
    const pseudo =
      this.normalizePseudo(
        input.pseudo
      );

    if (!pseudo) {
      return {
        success: false,
        error:
          "Le pseudo est obligatoire.",
      };
    }

    if (
      !Number.isInteger(
        input.maxPlayers
      ) ||
      input.maxPlayers <
        MIN_PLAYERS ||
      input.maxPlayers >
        MAX_PLAYERS
    ) {
      return {
        success: false,
        error:
          "Le nombre de joueurs doit être compris entre 2 et 9.",
      };
    }

    this.removePlayerBySocket(
      input.socketId
    );

    const code =
      this.generateUniqueCode();

    const host =
      this.createPlayer({
        socketId:
          input.socketId,
        pseudo,
        isHost: true,
      });

    const room: Room = {
      code,
      status: "LOBBY",
      maxPlayers:
        input.maxPlayers,
      players: [host],
      createdAt: Date.now(),
    };

    this.rooms.set(
      code,
      room
    );

    return {
      success: true,
      room:
        this.toPublicRoom(
          room
        ),
      playerId: host.id,
    };
  }

  joinRoom(
    input: JoinRoomInput
  ): RoomResult {
    const code =
      this.normalizeCode(
        input.code
      );

    const pseudo =
      this.normalizePseudo(
        input.pseudo
      );

    if (!pseudo) {
      return {
        success: false,
        error:
          "Le pseudo est obligatoire.",
      };
    }

    const room =
      this.rooms.get(code);

    if (!room) {
      return {
        success: false,
        error:
          "Cette partie n'existe pas.",
      };
    }

    if (
      room.status !== "LOBBY"
    ) {
      return {
        success: false,
        error:
          "Cette partie a déjà commencé.",
      };
    }

    const existingSocketPlayer =
      room.players.find(
        (player) =>
          player.socketId ===
          input.socketId
      );

    if (
      existingSocketPlayer
    ) {
      return {
        success: true,
        room:
          this.toPublicRoom(
            room
          ),
        playerId:
          existingSocketPlayer.id,
      };
    }

    if (
      room.players.length >=
      room.maxPlayers
    ) {
      return {
        success: false,
        error:
          "Cette partie est complète.",
      };
    }

    const pseudoAlreadyUsed =
      room.players.some(
        (player) =>
          player.pseudo
            .toLowerCase() ===
          pseudo.toLowerCase()
      );

    if (
      pseudoAlreadyUsed
    ) {
      return {
        success: false,
        error:
          "Ce pseudo est déjà utilisé dans cette partie.",
      };
    }

    this.removePlayerBySocket(
      input.socketId
    );

    const player =
      this.createPlayer({
        socketId:
          input.socketId,
        pseudo,
        isHost: false,
      });

    room.players.push(
      player
    );

    return {
      success: true,
      room:
        this.toPublicRoom(
          room
        ),
      playerId: player.id,
    };
  }

  startRoom(
    input: StartRoomInput
  ): StartRoomResult {
    const code =
      this.normalizeCode(
        input.code
      );

    const room =
      this.rooms.get(code);

    if (!room) {
      return {
        success: false,
        error:
          "Cette partie n'existe pas.",
      };
    }

    if (
      room.status !== "LOBBY"
    ) {
      return {
        success: false,
        error:
          "Cette partie a déjà commencé.",
      };
    }

    const player =
      room.players.find(
        (roomPlayer) =>
          roomPlayer.socketId ===
          input.socketId
      );

    if (!player) {
      return {
        success: false,
        error:
          "Tu ne fais pas partie de cette partie.",
      };
    }

    if (!player.isHost) {
      return {
        success: false,
        error:
          "Seul l'hôte peut démarrer la partie.",
      };
    }

    if (
      room.players.length <
      MIN_PLAYERS
    ) {
      return {
        success: false,
        error:
          "Il faut au moins 2 joueurs pour démarrer.",
      };
    }

    room.status =
      "IN_GAME";

    const publicRoom =
      this.toPublicRoom(
        room
      );

    const gameRoom =
      new GameRoom(
        publicRoom
      );

    this.gameRooms.set(
      room.code,
      gameRoom
    );

    return {
      success: true,
      room: publicRoom,
    };
  }

  getRoom(
    code: string
  ): PublicRoom | null {
    const room =
      this.rooms.get(
        this.normalizeCode(
          code
        )
      );

    if (!room) {
      return null;
    }

    return this.toPublicRoom(
      room
    );
  }

  getRoomCodeBySocket(
    socketId: string
  ): string | null {
    for (
      const room of
      this.rooms.values()
    ) {
      const playerExists =
        room.players.some(
          (player) =>
            player.socketId ===
            socketId
        );

      if (playerExists) {
        return room.code;
      }
    }

    return null;
  }

  getPlayerIndexBySocket(
    code: string,
    socketId: string
  ): number | null {
    const room =
      this.rooms.get(
        this.normalizeCode(
          code
        )
      );

    if (!room) {
      return null;
    }

    const playerIndex =
      room.players.findIndex(
        (player) =>
          player.socketId ===
          socketId
      );

    if (
      playerIndex === -1
    ) {
      return null;
    }

    return playerIndex;
  }

  getGameRoom(
    code: string
  ): GameRoom | null {
    return (
      this.gameRooms.get(
        this.normalizeCode(
          code
        )
      ) ?? null
    );
  }

  removePlayerBySocket(
    socketId: string
  ): PublicRoom | null {
    for (const [
      code,
      room,
    ] of this.rooms.entries()) {
      const playerIndex =
        room.players.findIndex(
          (player) =>
            player.socketId ===
            socketId
        );

      if (
        playerIndex === -1
      ) {
        continue;
      }

      const removedPlayer =
        room.players[
          playerIndex
        ];

      room.players.splice(
        playerIndex,
        1
      );

      if (
        room.players.length ===
        0
      ) {
        this.rooms.delete(
          code
        );

        this.gameRooms.delete(
          code
        );

        return null;
      }

      if (
        removedPlayer.isHost
      ) {
        room.players.forEach(
          (
            player,
            index
          ) => {
            player.isHost =
              index === 0;
          }
        );
      }

      return this.toPublicRoom(
        room
      );
    }

    return null;
  }

  getRoomCount(): number {
    return this.rooms.size;
  }

  private createPlayer(
    input: {
      socketId: string;
      pseudo: string;
      isHost: boolean;
    }
  ): RoomPlayer {
    return {
      id:
        this.generatePlayerId(),
      socketId:
        input.socketId,
      pseudo:
        input.pseudo,
      isHost:
        input.isHost,
      connectedAt:
        Date.now(),
    };
  }

  private generatePlayerId(): string {
    const timestamp =
      Date.now().toString(36);

    const randomPart =
      Math.random()
        .toString(36)
        .slice(2, 12);

    const secondRandomPart =
      Math.random()
        .toString(36)
        .slice(2, 12);

    return [
      "player",
      timestamp,
      randomPart,
      secondRandomPart,
    ].join("-");
  }

  private generateUniqueCode(): string {
    for (
      let attempt = 0;
      attempt < 100;
      attempt += 1
    ) {
      const number =
        Math.floor(
          Math.random() *
            9000
        ) + 1000;

      const code =
        `PG-${number}`;

      if (
        !this.rooms.has(
          code
        )
      ) {
        return code;
      }
    }

    throw new Error(
      "Impossible de générer un code de partie unique."
    );
  }

  private normalizePseudo(
    pseudo: string
  ): string {
    return pseudo
      .trim()
      .replace(
        /\s+/g,
        " "
      )
      .slice(0, 20);
  }

  private normalizeCode(
    code: string
  ): string {
    const normalized =
      code
        .trim()
        .toUpperCase()
        .replace(
          /\s+/g,
          ""
        );

    if (
      normalized.startsWith(
        "PG-"
      )
    ) {
      return normalized;
    }

    if (
      /^\d{4}$/.test(
        normalized
      )
    ) {
      return `PG-${normalized}`;
    }

    return normalized;
  }

  private toPublicRoom(
    room: Room
  ): PublicRoom {
    return {
      code:
        room.code,
      status:
        room.status,
      maxPlayers:
        room.maxPlayers,

      players:
        room.players.map(
          (player) => ({
            id:
              player.id,
            pseudo:
              player.pseudo,
            isHost:
              player.isHost,
          })
        ),
    };
  }
}