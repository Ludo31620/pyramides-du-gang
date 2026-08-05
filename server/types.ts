import type {
  PlayerAvatarType,
} from "@/lib/profile/types";

export type RoomStatus =
  | "LOBBY"
  | "IN_GAME";

export type BotDifficulty =
  | "EASY"
  | "NORMAL"
  | "HARD";

export type RoomPlayer = {
  id: string;

  /**
   * Identifiant temporaire de la connexion
   * Socket.IO actuelle.
   *
   * Il devient null lorsqu'un joueur est
   * momentanément déconnecté.
   *
   * Pour un bot, il reste toujours null.
   */
  socketId: string | null;

  /**
   * Identifiant persistant stocké dans
   * le navigateur du joueur.
   *
   * Pour un bot, il contient un identifiant
   * généré côté serveur.
   */
  playerToken: string;

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

  connectedAt: number;
};

export type Room = {
  code: string;

  status:
    RoomStatus;

  maxPlayers: number;

  players:
    RoomPlayer[];

  createdAt: number;
};

export type PublicRoomPlayer = {
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

  /**
   * Indique si le joueur est actuellement
   * connecté au serveur.
   *
   * Les bots sont toujours considérés
   * comme connectés.
   */
  isConnected: boolean;
};

export type PublicRoom = {
  code: string;

  status:
    RoomStatus;

  maxPlayers: number;

  players:
    PublicRoomPlayer[];
};

export type CreateRoomInput = {
  socketId: string;

  playerToken: string;

  pseudo: string;

  avatarType:
    PlayerAvatarType;

  avatarId:
    string | null;

  avatarPhoto:
    string | null;

  maxPlayers: number;
};

export type JoinRoomInput = {
  socketId: string;

  playerToken: string;

  pseudo: string;

  avatarType:
    PlayerAvatarType;

  avatarId:
    string | null;

  avatarPhoto:
    string | null;

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

export type AddBotRoomInput = {
  socketId: string;

  code: string;

  difficulty:
    BotDifficulty;
};

export type RemoveBotRoomInput = {
  socketId: string;

  code: string;

  botId: string;
};

export type RoomResult =
  | {
      success: true;

      room:
        PublicRoom;

      playerId:
        string;
    }
  | {
      success: false;

      error:
        string;
    };

export type RoomMutationResult =
  | {
      success: true;

      room:
        PublicRoom;
    }
  | {
      success: false;

      error:
        string;
    };

export type StartRoomResult =
  RoomMutationResult;

export type DisconnectedPlayer = {
  code: string;

  playerId: string;

  status:
    RoomStatus;

  room:
    PublicRoom;
};