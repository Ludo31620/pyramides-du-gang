export type RoomStatus =
  | "LOBBY"
  | "IN_GAME";

export type RoomPlayer = {
  id: string;

  /**
   * Identifiant temporaire de la connexion
   * Socket.IO actuelle.
   *
   * Il devient null lorsqu'un joueur est
   * momentanément déconnecté.
   */
  socketId: string | null;

  /**
   * Identifiant persistant stocké dans
   * le navigateur du joueur.
   *
   * Contrairement au socketId, il ne change
   * pas après une reconnexion.
   */
  playerToken: string;

  pseudo: string;
  isHost: boolean;
  connectedAt: number;
};

export type Room = {
  code: string;
  status: RoomStatus;
  maxPlayers: number;
  players: RoomPlayer[];
  createdAt: number;
};

export type PublicRoomPlayer = {
  id: string;
  pseudo: string;
  isHost: boolean;
};

export type PublicRoom = {
  code: string;
  status: RoomStatus;
  maxPlayers: number;
  players: PublicRoomPlayer[];
};

export type CreateRoomInput = {
  socketId: string;
  playerToken: string;
  pseudo: string;
  maxPlayers: number;
};

export type JoinRoomInput = {
  socketId: string;
  playerToken: string;
  pseudo: string;
  code: string;
};

export type ReconnectRoomInput = {
  socketId: string;
  playerToken: string;
  code: string;
};

export type StartRoomInput = {
  socketId: string;
  code: string;
};

export type RoomResult =
  | {
      success: true;
      room: PublicRoom;
      playerId: string;
    }
  | {
      success: false;
      error: string;
    };

export type StartRoomResult =
  | {
      success: true;
      room: PublicRoom;
    }
  | {
      success: false;
      error: string;
    };

export type DisconnectedPlayer = {
  code: string;
  playerId: string;
  status: RoomStatus;
  room: PublicRoom;
};