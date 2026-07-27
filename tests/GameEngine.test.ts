import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type {
  GameAction,
} from "@/lib/gameEngine/actions";

import type {
  GameState,
} from "@/lib/gameEngine/types";

import {
  GameEngine,
} from "@/lib/gameEngine/GameEngine";

import {
  createGame,
} from "@/lib/gameEngine/core/createGame";

import {
  answerDistribution,
  giveDistributionDrink,
} from "@/lib/gameEngine/core/distribution";

import {
  hideMemoryJoker,
  startMemory,
  tickMemory,
  useMemoryJoker,
} from "@/lib/gameEngine/core/memory";

import {
  revealCard,
} from "@/lib/gameEngine/core/reveal";

import {
  passTurn,
} from "@/lib/gameEngine/core/pass";

import {
  giveDrinks,
} from "@/lib/gameEngine/core/give";

import {
  believe,
} from "@/lib/gameEngine/core/believe";

import {
  doubt,
} from "@/lib/gameEngine/core/doubt";

import {
  continueAfterBluff,
} from "@/lib/gameEngine/core/continueAfterBluff";

import {
  nextPlayer,
} from "@/lib/gameEngine/core/nextPlayer";

import {
  nextCard,
} from "@/lib/gameEngine/core/nextCard";

vi.mock(
  "@/lib/gameEngine/core/createGame",
  () => ({
    createGame: vi.fn(),
  })
);

vi.mock(
  "@/lib/gameEngine/core/distribution",
  () => ({
    answerDistribution:
      vi.fn(),

    giveDistributionDrink:
      vi.fn(),
  })
);

vi.mock(
  "@/lib/gameEngine/core/memory",
  () => ({
    startMemory: vi.fn(),
    tickMemory: vi.fn(),
    useMemoryJoker: vi.fn(),
    hideMemoryJoker: vi.fn(),
  })
);

vi.mock(
  "@/lib/gameEngine/core/reveal",
  () => ({
    revealCard: vi.fn(),
  })
);

vi.mock(
  "@/lib/gameEngine/core/pass",
  () => ({
    passTurn: vi.fn(),
  })
);

vi.mock(
  "@/lib/gameEngine/core/give",
  () => ({
    giveDrinks: vi.fn(),
  })
);

vi.mock(
  "@/lib/gameEngine/core/believe",
  () => ({
    believe: vi.fn(),
  })
);

vi.mock(
  "@/lib/gameEngine/core/doubt",
  () => ({
    doubt: vi.fn(),
  })
);

vi.mock(
  "@/lib/gameEngine/core/continueAfterBluff",
  () => ({
    continueAfterBluff:
      vi.fn(),
  })
);

vi.mock(
  "@/lib/gameEngine/core/nextPlayer",
  () => ({
    nextPlayer: vi.fn(),
  })
);

vi.mock(
  "@/lib/gameEngine/core/nextCard",
  () => ({
    nextCard: vi.fn(),
  })
);

/**
 * GameEngine ne lit pas directement
 * le contenu des états.
 *
 * Pour tester son rôle de routeur,
 * des objets minimaux suffisent.
 */
function createMockState(
  phase: GameState["phase"]
): GameState {
  return {
    phase,
  } as GameState;
}

function startEngine(
  engine: GameEngine,
  state: GameState
) {
  vi.mocked(
    createGame
  ).mockReturnValue(state);

  return engine.dispatch({
    type: "START_GAME",
    playerCount: 4,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe(
  "GameEngine",
  () => {
    it(
      "refuses to return the state before a game has started",
      () => {
        const engine =
          new GameEngine();

        expect(() =>
          engine.getState()
        ).toThrow(
          "Game has not been started."
        );
      }
    );

    it(
      "refuses an action requiring a state before the game has started",
      () => {
        const engine =
          new GameEngine();

        expect(() =>
          engine.dispatch({
            type: "REVEAL_CARD",
          })
        ).toThrow(
          "Game has not been started."
        );

        expect(
          revealCard
        ).not.toHaveBeenCalled();
      }
    );

    it(
      "creates a game with START_GAME",
      () => {
        const engine =
          new GameEngine();

        const startedState =
          createMockState(
            "DISTRIBUTION"
          );

        vi.mocked(
          createGame
        ).mockReturnValue(
          startedState
        );

        const result =
          engine.dispatch({
            type: "START_GAME",
            playerCount: 4,
          });

        expect(
          createGame
        ).toHaveBeenCalledTimes(
          1
        );

        expect(
          createGame
        ).toHaveBeenCalledWith(
          4
        );

        expect(result).toBe(
          startedState
        );
      }
    );

    it(
      "returns the current state with getState",
      () => {
        const engine =
          new GameEngine();

        const startedState =
          createMockState(
            "DISTRIBUTION"
          );

        startEngine(
          engine,
          startedState
        );

        expect(
          engine.getState()
        ).toBe(startedState);
      }
    );

    it(
      "replaces an existing game when START_GAME is dispatched again",
      () => {
        const engine =
          new GameEngine();

        const firstState =
          createMockState(
            "DISTRIBUTION"
          );

        const secondState =
          createMockState(
            "DISTRIBUTION"
          );

        vi.mocked(
          createGame
        )
          .mockReturnValueOnce(
            firstState
          )
          .mockReturnValueOnce(
            secondState
          );

        engine.dispatch({
          type: "START_GAME",
          playerCount: 4,
        });

        const result =
          engine.dispatch({
            type: "START_GAME",
            playerCount: 6,
          });

        expect(
          createGame
        ).toHaveBeenNthCalledWith(
          1,
          4
        );

        expect(
          createGame
        ).toHaveBeenNthCalledWith(
          2,
          6
        );

        expect(result).toBe(
          secondState
        );

        expect(
          engine.getState()
        ).toBe(secondState);
      }
    );

    it(
      "routes ANSWER_DISTRIBUTION with the current state and answer",
      () => {
        const engine =
          new GameEngine();

        const currentState =
          createMockState(
            "DISTRIBUTION"
          );

        const nextState =
          createMockState(
            "DISTRIBUTION"
          );

        startEngine(
          engine,
          currentState
        );

        vi.mocked(
          answerDistribution
        ).mockReturnValue(
          nextState
        );

        const result =
          engine.dispatch({
            type:
              "ANSWER_DISTRIBUTION",

            answer: "RED",
          });

        expect(
          answerDistribution
        ).toHaveBeenCalledWith(
          currentState,
          "RED"
        );

        expect(result).toBe(
          nextState
        );

        expect(
          engine.getState()
        ).toBe(nextState);
      }
    );

    it(
      "routes GIVE_DISTRIBUTION_DRINK with the selected target",
      () => {
        const engine =
          new GameEngine();

        const currentState =
          createMockState(
            "DISTRIBUTION"
          );

        const nextState =
          createMockState(
            "DISTRIBUTION"
          );

        startEngine(
          engine,
          currentState
        );

        vi.mocked(
          giveDistributionDrink
        ).mockReturnValue(
          nextState
        );

        const result =
          engine.dispatch({
            type:
              "GIVE_DISTRIBUTION_DRINK",

            target: 2,
          });

        expect(
          giveDistributionDrink
        ).toHaveBeenCalledWith(
          currentState,
          2
        );

        expect(result).toBe(
          nextState
        );
      }
    );

    it(
      "routes START_MEMORY",
      () => {
        const engine =
          new GameEngine();

        const currentState =
          createMockState(
            "DISTRIBUTION"
          );

        const nextState =
          createMockState(
            "MEMORY"
          );

        startEngine(
          engine,
          currentState
        );

        vi.mocked(
          startMemory
        ).mockReturnValue(
          nextState
        );

        const result =
          engine.dispatch({
            type: "START_MEMORY",
          });

        expect(
          startMemory
        ).toHaveBeenCalledWith(
          currentState
        );

        expect(result).toBe(
          nextState
        );
      }
    );

    it(
      "routes TICK_MEMORY",
      () => {
        const engine =
          new GameEngine();

        const currentState =
          createMockState(
            "MEMORY"
          );

        const nextState =
          createMockState(
            "MEMORY"
          );

        startEngine(
          engine,
          currentState
        );

        vi.mocked(
          tickMemory
        ).mockReturnValue(
          nextState
        );

        const result =
          engine.dispatch({
            type: "TICK_MEMORY",
          });

        expect(
          tickMemory
        ).toHaveBeenCalledWith(
          currentState
        );

        expect(result).toBe(
          nextState
        );
      }
    );

    it(
      "routes USE_MEMORY_JOKER with the selected player",
      () => {
        const engine =
          new GameEngine();

        const currentState =
          createMockState(
            "MEMORY"
          );

        const nextState =
          createMockState(
            "MEMORY"
          );

        startEngine(
          engine,
          currentState
        );

        vi.mocked(
          useMemoryJoker
        ).mockReturnValue(
          nextState
        );

        const result =
          engine.dispatch({
            type:
              "USE_MEMORY_JOKER",

            player: 3,
          });

        expect(
          useMemoryJoker
        ).toHaveBeenCalledWith(
          currentState,
          3
        );

        expect(result).toBe(
          nextState
        );
      }
    );

    it(
      "routes HIDE_MEMORY_JOKER with the selected player",
      () => {
        const engine =
          new GameEngine();

        const currentState =
          createMockState(
            "MEMORY"
          );

        const nextState =
          createMockState(
            "MEMORY"
          );

        startEngine(
          engine,
          currentState
        );

        vi.mocked(
          hideMemoryJoker
        ).mockReturnValue(
          nextState
        );

        const result =
          engine.dispatch({
            type:
              "HIDE_MEMORY_JOKER",

            player: 3,
          });

        expect(
          hideMemoryJoker
        ).toHaveBeenCalledWith(
          currentState,
          3
        );

        expect(result).toBe(
          nextState
        );
      }
    );

    it(
      "routes REVEAL_CARD",
      () => {
        const engine =
          new GameEngine();

        const currentState =
          createMockState(
            "WAITING"
          );

        const nextState =
          createMockState(
            "PLAYER_TURN"
          );

        startEngine(
          engine,
          currentState
        );

        vi.mocked(
          revealCard
        ).mockReturnValue(
          nextState
        );

        const result =
          engine.dispatch({
            type: "REVEAL_CARD",
          });

        expect(
          revealCard
        ).toHaveBeenCalledWith(
          currentState
        );

        expect(result).toBe(
          nextState
        );
      }
    );

    it(
      "routes PASS",
      () => {
        const engine =
          new GameEngine();

        const currentState =
          createMockState(
            "PLAYER_TURN"
          );

        const nextState =
          createMockState(
            "PLAYER_TURN"
          );

        startEngine(
          engine,
          currentState
        );

        vi.mocked(
          passTurn
        ).mockReturnValue(
          nextState
        );

        const result =
          engine.dispatch({
            type: "PASS",
          });

        expect(
          passTurn
        ).toHaveBeenCalledWith(
          currentState
        );

        expect(result).toBe(
          nextState
        );
      }
    );

    it(
      "routes GIVE with the selected target",
      () => {
        const engine =
          new GameEngine();

        const currentState =
          createMockState(
            "PLAYER_TURN"
          );

        const nextState =
          createMockState(
            "PLAYER_RESPONSE"
          );

        startEngine(
          engine,
          currentState
        );

        vi.mocked(
          giveDrinks
        ).mockReturnValue(
          nextState
        );

        const result =
          engine.dispatch({
            type: "GIVE",
            target: 2,
          });

        expect(
          giveDrinks
        ).toHaveBeenCalledWith(
          currentState,
          2
        );

        expect(result).toBe(
          nextState
        );
      }
    );

    it(
      "routes BELIEVE",
      () => {
        const engine =
          new GameEngine();

        const currentState =
          createMockState(
            "PLAYER_RESPONSE"
          );

        const nextState =
          createMockState(
            "BLUFF_RESULT"
          );

        startEngine(
          engine,
          currentState
        );

        vi.mocked(
          believe
        ).mockReturnValue(
          nextState
        );

        const result =
          engine.dispatch({
            type: "BELIEVE",
          });

        expect(
          believe
        ).toHaveBeenCalledWith(
          currentState
        );

        expect(result).toBe(
          nextState
        );
      }
    );

    it(
      "routes DOUBT",
      () => {
        const engine =
          new GameEngine();

        const currentState =
          createMockState(
            "PLAYER_RESPONSE"
          );

        const nextState =
          createMockState(
            "BLUFF_RESULT"
          );

        startEngine(
          engine,
          currentState
        );

        vi.mocked(
          doubt
        ).mockReturnValue(
          nextState
        );

        const result =
          engine.dispatch({
            type: "DOUBT",
          });

        expect(
          doubt
        ).toHaveBeenCalledWith(
          currentState
        );

        expect(result).toBe(
          nextState
        );
      }
    );

    it(
      "routes CONTINUE_AFTER_BLUFF",
      () => {
        const engine =
          new GameEngine();

        const currentState =
          createMockState(
            "BLUFF_RESULT"
          );

        const nextState =
          createMockState(
            "PLAYER_TURN"
          );

        startEngine(
          engine,
          currentState
        );

        vi.mocked(
          continueAfterBluff
        ).mockReturnValue(
          nextState
        );

        const result =
          engine.dispatch({
            type:
              "CONTINUE_AFTER_BLUFF",
          });

        expect(
          continueAfterBluff
        ).toHaveBeenCalledWith(
          currentState
        );

        expect(result).toBe(
          nextState
        );
      }
    );

    it(
      "routes NEXT_PLAYER",
      () => {
        const engine =
          new GameEngine();

        const currentState =
          createMockState(
            "DISTRIBUTION"
          );

        const nextState =
          createMockState(
            "DISTRIBUTION"
          );

        startEngine(
          engine,
          currentState
        );

        vi.mocked(
          nextPlayer
        ).mockReturnValue(
          nextState
        );

        const result =
          engine.dispatch({
            type: "NEXT_PLAYER",
          });

        expect(
          nextPlayer
        ).toHaveBeenCalledWith(
          currentState
        );

        expect(result).toBe(
          nextState
        );
      }
    );

    it(
      "routes NEXT_CARD",
      () => {
        const engine =
          new GameEngine();

        const currentState =
          createMockState(
            "WAITING"
          );

        const nextState =
          createMockState(
            "PLAYER_TURN"
          );

        startEngine(
          engine,
          currentState
        );

        vi.mocked(
          nextCard
        ).mockReturnValue(
          nextState
        );

        const result =
          engine.dispatch({
            type: "NEXT_CARD",
          });

        expect(
          nextCard
        ).toHaveBeenCalledWith(
          currentState
        );

        expect(result).toBe(
          nextState
        );
      }
    );

    it(
      "uses the latest state when several actions are dispatched",
      () => {
        const engine =
          new GameEngine();

        const startedState =
          createMockState(
            "WAITING"
          );

        const revealedState =
          createMockState(
            "PLAYER_TURN"
          );

        const passedState =
          createMockState(
            "PLAYER_TURN"
          );

        startEngine(
          engine,
          startedState
        );

        vi.mocked(
          revealCard
        ).mockReturnValue(
          revealedState
        );

        vi.mocked(
          passTurn
        ).mockReturnValue(
          passedState
        );

        engine.dispatch({
          type: "REVEAL_CARD",
        });

        const result =
          engine.dispatch({
            type: "PASS",
          });

        expect(
          revealCard
        ).toHaveBeenCalledWith(
          startedState
        );

        expect(
          passTurn
        ).toHaveBeenCalledWith(
          revealedState
        );

        expect(result).toBe(
          passedState
        );

        expect(
          engine.getState()
        ).toBe(passedState);
      }
    );

    it(
      "does not replace the current state when a core action throws",
      () => {
        const engine =
          new GameEngine();

        const currentState =
          createMockState(
            "PLAYER_TURN"
          );

        startEngine(
          engine,
          currentState
        );

        vi.mocked(
          passTurn
        ).mockImplementation(
          () => {
            throw new Error(
              "Pass refused."
            );
          }
        );

        expect(() =>
          engine.dispatch({
            type: "PASS",
          })
        ).toThrow(
          "Pass refused."
        );

        expect(
          engine.getState()
        ).toBe(currentState);
      }
    );

    it(
      "reports END_GAME as not implemented",
      () => {
        const engine =
          new GameEngine();

        const currentState =
          createMockState(
            "PLAYER_TURN"
          );

        startEngine(
          engine,
          currentState
        );

        expect(() =>
          engine.dispatch({
            type: "END_GAME",
          })
        ).toThrow(
          'Action "END_GAME" is not implemented yet.'
        );

        expect(
          engine.getState()
        ).toBe(currentState);
      }
    );

    it(
      "refuses an unknown action",
      () => {
        const engine =
          new GameEngine();

        const currentState =
          createMockState(
            "PLAYER_TURN"
          );

        startEngine(
          engine,
          currentState
        );

        const unknownAction = {
          type:
            "UNKNOWN_ACTION",
        } as unknown as GameAction;

        expect(() =>
          engine.dispatch(
            unknownAction
          )
        ).toThrow(
          'Unhandled action: {"type":"UNKNOWN_ACTION"}'
        );
      }
    );
  }
);