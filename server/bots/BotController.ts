import type {
  GameAction,
} from "../../lib/gameEngine/actions";

import type {
  DistributionAnswer,
  GameState,
} from "../../lib/gameEngine/types";

import type {
  BotDifficulty,
  PublicRoomPlayer,
} from "../types";

import {
  GameRoom,
} from "../GameRoom";

type StateChangedCallback =
  (
    gameRoom: GameRoom
  ) => void;

const BOT_DELAY_BY_DIFFICULTY:
  Record<
    BotDifficulty,
    number
  > = {
    EASY: 1500,
    NORMAL: 1200,
    HARD: 900,
  };

export class BotController {
  private readonly pendingTimers =
    new Map<
      string,
      ReturnType<
        typeof setTimeout
      >
    >();

  public schedule(
    gameRoom: GameRoom,
    onStateChanged:
      StateChangedCallback
  ): void {
    this.cancel(
      gameRoom.code
    );

    const state =
      gameRoom.getState();

    const botTurn =
      this.getBotTurn(
        gameRoom,
        state
      );

    if (!botTurn) {
      return;
    }

    const {
      playerIndex,
      player,
    } =
      botTurn;

    const difficulty =
      player.botDifficulty ??
      "EASY";

    const baseDelay =
      BOT_DELAY_BY_DIFFICULTY[
        difficulty
      ];

    const randomDelay =
      Math.floor(
        Math.random() *
          350
      );

    const timer =
      setTimeout(
        () => {
          this.pendingTimers.delete(
            gameRoom.code
          );

          const played =
            this.playForPlayer(
              gameRoom,
              playerIndex,
              difficulty,
              onStateChanged,
              player.pseudo
            );

          if (!played) {
            return;
          }

          /*
           * Une action de bot peut laisser
           * le même bot actif, notamment
           * pendant la distribution.
           */
          this.schedule(
            gameRoom,
            onStateChanged
          );
        },
        baseDelay +
          randomDelay
      );

    this.pendingTimers.set(
      gameRoom.code,
      timer
    );
  }

  /**
   * Exécute une seule action automatique
   * pour l'index demandé.
   *
   * Cette méthode est également utilisée
   * lorsqu'un humain déconnecté doit être
   * remplacé temporairement.
   */
  public playForPlayer(
    gameRoom: GameRoom,
    playerIndex: number,
    difficulty:
      BotDifficulty,
    onStateChanged:
      StateChangedCallback,
    displayName?:
      string
  ): boolean {
    try {
      const state =
        gameRoom.getState();

      const expectedPlayerIndex =
        this.getExpectedPlayerIndex(
          state
        );

      if (
        expectedPlayerIndex !==
        playerIndex
      ) {
        return false;
      }

      const action =
        this.chooseAction(
          gameRoom,
          state,
          playerIndex,
          difficulty
        );

      if (!action) {
        return false;
      }

      gameRoom
        .dispatchForPlayer(
          playerIndex,
          action
        );

      const playerName =
        displayName ??
        gameRoom.room
          .players[
            playerIndex
          ]?.pseudo ??
        `Joueur ${playerIndex + 1}`;

      console.log(
        `🤖 ${playerName} exécute ${action.type} dans ${gameRoom.code}`
      );

      onStateChanged(
        gameRoom
      );

      return true;
    } catch (
      error: unknown
    ) {
      console.error(
        `Action automatique refusée dans ${gameRoom.code} :`,
        error
      );

      return false;
    }
  }

  public cancel(
    code: string
  ): void {
    const timer =
      this.pendingTimers.get(
        code
      );

    if (!timer) {
      return;
    }

    clearTimeout(
      timer
    );

    this.pendingTimers.delete(
      code
    );
  }

  private getBotTurn(
    gameRoom: GameRoom,
    state: GameState
  ):
    | {
        playerIndex: number;
        player:
          PublicRoomPlayer;
      }
    | null {
    const playerIndex =
      this.getExpectedPlayerIndex(
        state
      );

    if (
      playerIndex ===
      null
    ) {
      return null;
    }

    const player =
      gameRoom.room.players[
        playerIndex
      ];

    if (
      !player ||
      !player.isBot
    ) {
      return null;
    }

    return {
      playerIndex,
      player,
    };
  }

  private getExpectedPlayerIndex(
    state: GameState
  ): number | null {
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

  private chooseAction(
    gameRoom: GameRoom,
    state: GameState,
    playerIndex: number,
    difficulty:
      BotDifficulty
  ): GameAction | null {
    switch (
      state.phase
    ) {
      case "DISTRIBUTION":
        return (
          this.chooseDistributionAction(
            state,
            playerIndex
          )
        );

      case "PLAYER_TURN":
        return (
          this.choosePlayerTurnAction(
            gameRoom,
            state,
            playerIndex,
            difficulty
          )
        );

      case "PLAYER_RESPONSE":
        return (
          this.chooseResponseAction(
            difficulty
          )
        );

      default:
        return null;
    }
  }

  private chooseDistributionAction(
    state: GameState,
    playerIndex: number
  ): GameAction {
    if (
      state.distribution
        .awaitingGive
    ) {
      return {
        type:
          "GIVE_DISTRIBUTION_DRINK",

        target:
          this.chooseRandomTarget(
            state.players.length,
            playerIndex
          ),
      };
    }

    if (
      state.distribution
        .awaitingContinue
    ) {
      return {
        type:
          "CONTINUE_DISTRIBUTION",
      };
    }

    return {
      type:
        "ANSWER_DISTRIBUTION",

      answer:
        this.chooseDistributionAnswer(
          state.distribution
            .question
        ),
    };
  }

  private choosePlayerTurnAction(
    gameRoom: GameRoom,
    state: GameState,
    playerIndex: number,
    difficulty:
      BotDifficulty
  ): GameAction {
    const giveChance =
      difficulty ===
        "HARD"
        ? 0.7
        : difficulty ===
            "NORMAL"
          ? 0.55
          : 0.35;

    const shouldGive =
      Math.random() <
      giveChance;

    if (
      !shouldGive ||
      state.players.length <=
        1
    ) {
      return {
        type:
          "PASS",
      };
    }

    return {
      type:
        "GIVE",

      target:
        this.chooseRandomTarget(
          gameRoom.room
            .players.length,
          playerIndex
        ),
    };
  }

  private chooseResponseAction(
    difficulty:
      BotDifficulty
  ): GameAction {
    const doubtChance =
      difficulty ===
        "HARD"
        ? 0.6
        : difficulty ===
            "NORMAL"
          ? 0.5
          : 0.4;

    if (
      Math.random() <
      doubtChance
    ) {
      return {
        type:
          "DOUBT",
      };
    }

    return {
      type:
        "BELIEVE",
    };
  }

  private chooseDistributionAnswer(
    question: number
  ): DistributionAnswer {
    switch (
      question
    ) {
      case 0:
        return (
          Math.random() <
            0.5
            ? "RED"
            : "BLACK"
        );

      case 1:
        return (
          Math.random() <
            0.5
            ? "HIGHER"
            : "LOWER"
        );

      case 2:
        return (
          Math.random() <
            0.5
            ? "INSIDE"
            : "OUTSIDE"
        );

      case 3: {
        const suits:
          DistributionAnswer[] = [
          "SPADES",
          "HEARTS",
          "DIAMONDS",
          "CLUBS",
        ];

        return (
          suits[
            Math.floor(
              Math.random() *
                suits.length
            )
          ] ??
          "SPADES"
        );
      }

      default:
        return "RED";
    }
  }

  private chooseRandomTarget(
    playerCount: number,
    excludedPlayerIndex:
      number
  ): number {
    const targets =
      Array.from(
        {
          length:
            playerCount,
        },
        (
          _,
          playerIndex
        ) =>
          playerIndex
      ).filter(
        (playerIndex) =>
          playerIndex !==
          excludedPlayerIndex
      );

    if (
      targets.length ===
      0
    ) {
      throw new Error(
        "Aucune cible disponible pour l'action automatique."
      );
    }

    return (
      targets[
        Math.floor(
          Math.random() *
            targets.length
        )
      ] ??
      targets[0]
    );
  }
}