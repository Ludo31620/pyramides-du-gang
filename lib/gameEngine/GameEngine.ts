import type {
  GameAction,
} from "./actions";

import type {
  GameState,
} from "./types";

import {
  createGame,
} from "./core/createGame";

import {
  answerDistribution,
  continueDistribution,
  giveDistributionDrink,
} from "./core/distribution";

import {
  hideMemoryJoker,
  startMemory,
  tickMemory,
  useMemoryJoker,
} from "./core/memory";

import {
  revealCard,
} from "./core/reveal";

import {
  passTurn,
} from "./core/pass";

import {
  giveDrinks,
} from "./core/give";

import {
  believe,
} from "./core/believe";

import {
  doubt,
} from "./core/doubt";

import {
  continueAfterBluff,
} from "./core/continueAfterBluff";

import {
  nextPlayer,
} from "./core/nextPlayer";

import {
  nextCard,
} from "./core/nextCard";

export class GameEngine {
  private state:
    | GameState
    | null = null;

  public getState(): GameState {
    return this.requireState();
  }

  public dispatch(
    action: GameAction
  ): GameState {
    switch (action.type) {
      case "START_GAME": {
        this.state = createGame(
          action.playerCount
        );

        break;
      }

      case "ANSWER_DISTRIBUTION": {
        this.state =
          answerDistribution(
            this.requireState(),
            action.answer
          );

        break;
      }

      case "GIVE_DISTRIBUTION_DRINK": {
        this.state =
          giveDistributionDrink(
            this.requireState(),
            action.target
          );

        break;
      }

      case "CONTINUE_DISTRIBUTION": {
        this.state =
          continueDistribution(
            this.requireState()
          );

        break;
      }

      case "START_MEMORY": {
        this.state =
          startMemory(
            this.requireState()
          );

        break;
      }

      case "TICK_MEMORY": {
        this.state =
          tickMemory(
            this.requireState()
          );

        break;
      }

      case "USE_MEMORY_JOKER": {
        this.state =
          useMemoryJoker(
            this.requireState(),
            action.player
          );

        break;
      }

      case "HIDE_MEMORY_JOKER": {
        this.state =
          hideMemoryJoker(
            this.requireState(),
            action.player
          );

        break;
      }

      case "REVEAL_CARD": {
        this.state =
          revealCard(
            this.requireState()
          );

        break;
      }

      case "PASS": {
        this.state =
          passTurn(
            this.requireState()
          );

        break;
      }

      case "GIVE": {
        this.state =
          giveDrinks(
            this.requireState(),
            action.target
          );

        break;
      }

      case "BELIEVE": {
        this.state =
          believe(
            this.requireState()
          );

        break;
      }

      case "DOUBT": {
        this.state =
          doubt(
            this.requireState()
          );

        break;
      }

      case "CONTINUE_AFTER_BLUFF": {
        this.state =
          continueAfterBluff(
            this.requireState()
          );

        break;
      }

      case "NEXT_PLAYER": {
        this.state =
          nextPlayer(
            this.requireState()
          );

        break;
      }

      case "NEXT_CARD": {
        this.state =
          nextCard(
            this.requireState()
          );

        break;
      }

      case "END_GAME": {
        throw new Error(
          `Action "${action.type}" is not implemented yet.`
        );
      }

      default: {
        const exhaustiveCheck: never =
          action;

        throw new Error(
          `Unhandled action: ${JSON.stringify(
            exhaustiveCheck
          )}`
        );
      }
    }

    return this.requireState();
  }

  private requireState(): GameState {
    if (!this.state) {
      throw new Error(
        "Game has not been started."
      );
    }

    return this.state;
  }
}
