export type RoomStatus =
  | "LOBBY"
  | "IN_GAME";

export type RoomPlayer = {
  id: string;
  socketId: string;
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
  pseudo: string;
  maxPlayers: number;
};

export type JoinRoomInput = {
  socketId: string;
  pseudo: string;
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