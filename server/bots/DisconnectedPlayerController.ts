import type {
  BotDifficulty,
} from "../types";

import {
  GameRoom,
} from "../GameRoom";

import {
  BotController,
} from "./BotController";

type StateChangedCallback =
  (
    gameRoom: GameRoom
  ) => void;

interface DisconnectedPlayerState {
  disconnectedAt: number;
}

const DISCONNECTED_TAKEOVER_DELAY_MS =
  30 * 1000;

const CONTINUATION_DELAY_MS =
  1200;

const TEMPORARY_BOT_DIFFICULTY:
  BotDifficulty =
  "NORMAL";

export class DisconnectedPlayerController {
  private readonly disconnectedPlayers =
    new Map<
      string,
      DisconnectedPlayerState
    >();

  private readonly pendingTimers =
    new Map<
      string,
      ReturnType<
        typeof setTimeout
      >
    >();

  constructor(
    private readonly botController:
      BotController
  ) {}

  public markDisconnected(
    gameRoom: GameRoom,
    playerId: string,
    onStateChanged:
      StateChangedCallback
  ): void {
    const key =
      this.createKey(
        gameRoom.code,
        playerId
      );

    this.disconnectedPlayers.set(
      key,
      {
        disconnectedAt:
          Date.now(),
      }
    );

    this.schedule(
      gameRoom,
      onStateChanged
    );
  }

  public markReconnected(
    roomCode: string,
    playerId: string
  ): void {
    const key =
      this.createKey(
        roomCode,
        playerId
      );

    this.disconnectedPlayers.delete(
      key
    );

    this.cancelTimer(
      key
    );
  }

  /**
   * Vérifie si le joueur qui doit agir
   * est un humain actuellement déconnecté.
   */
  public schedule(
    gameRoom: GameRoom,
    onStateChanged:
      StateChangedCallback
  ): void {
    const playerIndex =
      this.getExpectedPlayerIndex(
        gameRoom
      );

    if (
      playerIndex ===
      null
    ) {
      return;
    }

    const player =
      gameRoom.room.players[
        playerIndex
      ];

    if (
      !player ||
      player.isBot ||
      player.isConnected
    ) {
      return;
    }

    const key =
      this.createKey(
        gameRoom.code,
        player.id
      );

    const disconnectedState =
      this.disconnectedPlayers.get(
        key
      );

    if (
      !disconnectedState
    ) {
      this.disconnectedPlayers.set(
        key,
        {
          disconnectedAt:
            Date.now(),
        }
      );
    }

    if (
      this.pendingTimers.has(
        key
      )
    ) {
      return;
    }

    const startedAt =
      disconnectedState
        ?.disconnectedAt ??
      Date.now();

    const elapsed =
      Date.now() -
      startedAt;

    const delay =
      Math.max(
        0,
        DISCONNECTED_TAKEOVER_DELAY_MS -
          elapsed
      );

    this.createTimer(
      gameRoom,
      player.id,
      delay,
      onStateChanged
    );
  }

  private createTimer(
    gameRoom: GameRoom,
    playerId: string,
    delay: number,
    onStateChanged:
      StateChangedCallback
  ): void {
    const key =
      this.createKey(
        gameRoom.code,
        playerId
      );

    const timer =
      setTimeout(
        () => {
          this.pendingTimers.delete(
            key
          );

          const playerIndex =
            gameRoom.room
              .players
              .findIndex(
                (player) =>
                  player.id ===
                  playerId
              );

          if (
            playerIndex ===
            -1
          ) {
            this.disconnectedPlayers.delete(
              key
            );

            return;
          }

          const player =
            gameRoom.room.players[
              playerIndex
            ];

          if (
            !player ||
            player.isBot ||
            player.isConnected
          ) {
            this.markReconnected(
              gameRoom.code,
              playerId
            );

            return;
          }

          const played =
            this.botController
              .playForPlayer(
                gameRoom,
                playerIndex,
                TEMPORARY_BOT_DIFFICULTY,
                onStateChanged,
                `${player.pseudo} (relais)`
              );

          if (!played) {
            return;
          }

          /*
           * Certaines étapes gardent le même
           * joueur actif. Le relais continue
           * alors rapidement, sans réattendre
           * trente secondes.
           */
          this.createTimer(
            gameRoom,
            playerId,
            CONTINUATION_DELAY_MS,
            onStateChanged
          );
        },
        delay
      );

    this.pendingTimers.set(
      key,
      timer
    );
  }

  private getExpectedPlayerIndex(
    gameRoom: GameRoom
  ): number | null {
    const state =
      gameRoom.getState();

    switch (
      state.phase
    ) {
      case "DISTRIBUTION":
        return (
          state.distribution
            .currentPlayer
        );

      case "PLAYER_TURN":
        return (
          state.turn
            .currentPlayer
        );

      case "PLAYER_RESPONSE":
        return (
          state.turn
            .pendingAction
            ?.target ??
          null
        );

      default:
        return null;
    }
  }

  private cancelTimer(
    key: string
  ): void {
    const timer =
      this.pendingTimers.get(
        key
      );

    if (!timer) {
      return;
    }

    clearTimeout(
      timer
    );

    this.pendingTimers.delete(
      key
    );
  }

  private createKey(
    roomCode: string,
    playerId: string
  ): string {
    return `${roomCode}:${playerId}`;
  }
}