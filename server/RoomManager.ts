import {
  GameRoom,
} from "./GameRoom";

import type {
  CreateRoomInput,
  DisconnectedPlayer,
  JoinRoomInput,
  PublicRoom,
  ReconnectRoomInput,
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

    const playerToken =
      this.normalizePlayerToken(
        input.playerToken
      );

    if (!pseudo) {
      return {
        success: false,
        error:
          "Le pseudo est obligatoire.",
      };
    }

    if (!playerToken) {
      return {
        success: false,
        error:
          "L'identifiant du joueur est invalide.",
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

    /*
     * Un même navigateur ne peut appartenir
     * qu'à un seul salon à la fois.
     */
    this.removePlayerByToken(
      playerToken
    );

    const code =
      this.generateUniqueCode();

const host =
  this.createPlayer({
    socketId:
      input.socketId,

    playerToken,

    pseudo,

    avatarType:
      input.avatarType,

    avatarId:
      input.avatarId,

    avatarPhoto:
      input.avatarPhoto,

    isHost: true,
  });

    const room: Room = {
      code,

      status:
        "LOBBY",

      maxPlayers:
        input.maxPlayers,

      players: [
        host,
      ],

      createdAt:
        Date.now(),
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

      playerId:
        host.id,
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

    const playerToken =
      this.normalizePlayerToken(
        input.playerToken
      );

    if (!pseudo) {
      return {
        success: false,
        error:
          "Le pseudo est obligatoire.",
      };
    }

    if (!playerToken) {
      return {
        success: false,
        error:
          "L'identifiant du joueur est invalide.",
      };
    }

    const room =
      this.rooms.get(
        code
      );

    if (!room) {
      return {
        success: false,
        error:
          "Cette partie n'existe pas.",
      };
    }

    /*
     * Le joueur appartient déjà à ce salon.
     * Il s'agit donc d'une reconnexion.
     */
    const existingTokenPlayer =
      room.players.find(
        (player) =>
          player.playerToken ===
          playerToken
      );

    if (
      existingTokenPlayer
    ) {
      existingTokenPlayer.socketId =
        input.socketId;

      existingTokenPlayer.connectedAt =
        Date.now();

      return {
        success: true,

        room:
          this.toPublicRoom(
            room
          ),

        playerId:
          existingTokenPlayer.id,
      };
    }

    if (
      room.status !==
      "LOBBY"
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

    this.removePlayerByToken(
      playerToken
    );

const player =
  this.createPlayer({
    socketId:
      input.socketId,

    playerToken,

    pseudo,

    avatarType:
      input.avatarType,

    avatarId:
      input.avatarId,

    avatarPhoto:
      input.avatarPhoto,

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

      playerId:
        player.id,
    };
  }

  reconnectPlayer(
    input: ReconnectRoomInput
  ): RoomResult {
    const code =
      this.normalizeCode(
        input.code
      );

    const playerToken =
      this.normalizePlayerToken(
        input.playerToken
      );

    if (!playerToken) {
      return {
        success: false,
        error:
          "L'identifiant du joueur est invalide.",
      };
    }

    const room =
      this.rooms.get(
        code
      );

    if (!room) {
      return {
        success: false,
        error:
          "Cette partie n'existe pas.",
      };
    }

    const player =
      room.players.find(
        (roomPlayer) =>
          roomPlayer.playerToken ===
          playerToken
      );

    if (!player) {
      return {
        success: false,
        error:
          "Ce téléphone n'est pas reconnu dans cette partie.",
      };
    }

    /*
     * L'ancien socket.id est remplacé
     * par celui de la nouvelle connexion.
     */
    player.socketId =
      input.socketId;

    player.connectedAt =
      Date.now();

    return {
      success: true,

      room:
        this.toPublicRoom(
          room
        ),

      playerId:
        player.id,
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
      this.rooms.get(
        code
      );

    if (!room) {
      return {
        success: false,
        error:
          "Cette partie n'existe pas.",
      };
    }

    if (
      room.status !==
      "LOBBY"
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

  /**
   * Replace le salon dans l'état LOBBY
   * après la fin complète d'une partie.
   *
   * Le code du salon, les joueurs,
   * les pseudos et l'hôte sont conservés.
   * Seul l'ancien moteur de jeu est supprimé.
   */
  returnRoomToLobby(
    input: StartRoomInput
  ): StartRoomResult {
    const code =
      this.normalizeCode(
        input.code
      );

    const room =
      this.rooms.get(
        code
      );

    if (!room) {
      return {
        success: false,
        error:
          "Cette partie n'existe pas.",
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

    if (
      room.status !==
      "IN_GAME"
    ) {
      return {
        success: false,
        error:
          "Le salon est déjà dans le lobby.",
      };
    }

    const gameRoom =
      this.gameRooms.get(
        code
      );

    if (!gameRoom) {
      return {
        success: false,
        error:
          "La partie en cours est introuvable.",
      };
    }

    const gameState =
      gameRoom.getState();

    /*
     * Ce retour collectif est uniquement
     * autorisé après la fin de la partie.
     *
     * Le bouton Home permet déjà à un joueur
     * de quitter individuellement en cours
     * de partie.
     */
    if (
      gameState.phase !==
      "GAME_OVER"
    ) {
      return {
        success: false,
        error:
          "La partie n'est pas encore terminée.",
      };
    }

    room.status =
      "LOBBY";

    /*
     * Le prochain clic sur « Lancer la partie »
     * créera un GameRoom entièrement neuf.
     */
    this.gameRooms.delete(
      code
    );

    return {
      success: true,

      room:
        this.toPublicRoom(
          room
        ),
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

    return playerIndex === -1
      ? null
      : playerIndex;
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

  disconnectPlayerBySocket(
    socketId: string
  ): DisconnectedPlayer | null {
    for (
      const room of
      this.rooms.values()
    ) {
      const player =
        room.players.find(
          (roomPlayer) =>
            roomPlayer.socketId ===
            socketId
        );

      if (!player) {
        continue;
      }

      /*
       * Le joueur reste dans la partie.
       * Seule sa connexion temporaire
       * disparaît.
       */
      player.socketId =
        null;

      return {
        code:
          room.code,

        playerId:
          player.id,

        status:
          room.status,

        room:
          this.toPublicRoom(
            room
          ),
      };
    }

    return null;
  }

  removePlayerById(
    code: string,
    playerId: string
  ): PublicRoom | null {
    const normalizedCode =
      this.normalizeCode(
        code
      );

    const room =
      this.rooms.get(
        normalizedCode
      );

    if (!room) {
      return null;
    }

    const playerIndex =
      room.players.findIndex(
        (player) =>
          player.id ===
          playerId
      );

    if (
      playerIndex === -1
    ) {
      return this.toPublicRoom(
        room
      );
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
        normalizedCode
      );

      this.gameRooms.delete(
        normalizedCode
      );

      return null;
    }

    if (
      removedPlayer?.isHost
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

  removePlayerByToken(
    playerToken: string
  ): PublicRoom | null {
    const normalizedToken =
      this.normalizePlayerToken(
        playerToken
      );

    if (!normalizedToken) {
      return null;
    }

    for (
      const room of
      this.rooms.values()
    ) {
      const player =
        room.players.find(
          (roomPlayer) =>
            roomPlayer.playerToken ===
            normalizedToken
        );

      if (!player) {
        continue;
      }

      return this.removePlayerById(
        room.code,
        player.id
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
    playerToken: string;
    pseudo: string;

    avatarType:
      RoomPlayer["avatarType"];

    avatarId:
      string | null;

    avatarPhoto:
      string | null;

    isHost: boolean;
  }
): RoomPlayer {
  return {
    id:
      this.generatePlayerId(),

    socketId:
      input.socketId,

    playerToken:
      input.playerToken,

    pseudo:
      input.pseudo,

    avatarType:
      input.avatarType,

    avatarId:
      input.avatarId,

    avatarPhoto:
      input.avatarPhoto,

    isHost:
      input.isHost,

    connectedAt:
      Date.now(),
  };
}

  private generatePlayerId():
    string {
    const timestamp =
      Date.now().toString(
        36
      );

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

  private generateUniqueCode():
    string {
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

  private normalizePlayerToken(
    playerToken: string
  ): string {
    return playerToken
      .trim()
      .slice(0, 200);
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

      avatarType:
        player.avatarType,

      avatarId:
        player.avatarId,

      avatarPhoto:
        player.avatarPhoto,

      isHost:
        player.isHost,
    })
  ),
    };
  }
}