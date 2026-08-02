import type {
  GameState,
} from "../types";

const MEMORY_DURATION_SECONDS =
  15;

export function startMemory(
  state: GameState
): GameState {
  return {
    ...state,

    phase: "MEMORY",

    memory: {
      ...state.memory,

      remainingSeconds:
        MEMORY_DURATION_SECONDS,

      revealedPlayers: [],
    },
  };
}

export function tickMemory(
  state: GameState
): GameState {
  if (
    state.phase !== "MEMORY"
  ) {
    return state;
  }

  if (
    state.memory
      .remainingSeconds <= 1
  ) {
    return {
      ...state,

      phase: "WAITING",

      memory: {
        ...state.memory,

        remainingSeconds: 0,

        revealedPlayers: [],
      },
    };
  }

  return {
    ...state,

    memory: {
      ...state.memory,

      remainingSeconds:
        state.memory
          .remainingSeconds - 1,
    },
  };
}

export function useMemoryJoker(
  state: GameState,
  player: number
): GameState {
  if (
    !Number.isInteger(player) ||
    player < 0 ||
    player >= state.players.length
  ) {
    throw new Error(
      "Le joueur indiqué est invalide."
    );
  }

  /**
   * Les jokers ne peuvent être utilisés
   * qu'une fois la pyramide commencée.
   */
  const pyramidStarted =
    state.progress.revealedCards > 0;

  const allowedPhase =
    state.phase ===
      "PLAYER_TURN" ||
    state.phase ===
      "PLAYER_RESPONSE" ||
    state.phase ===
      "WAITING";

  if (
    !pyramidStarted ||
    !allowedPhase
  ) {
    throw new Error(
      "Le joker mémoire ne peut pas être utilisé maintenant."
    );
  }

  const jokerCount =
    state.memory.jokers[player];

  if (
    jokerCount === undefined
  ) {
    throw new Error(
      "Le nombre de jokers du joueur est introuvable."
    );
  }

  if (jokerCount <= 0) {
    return state;
  }

  /**
   * Empêche un joueur d'utiliser
   * plusieurs jokers pendant que
   * ses cartes sont déjà affichées.
   */
  if (
    state.memory.revealedPlayers.includes(
      player
    )
  ) {
    return state;
  }

  const jokers = [
    ...state.memory.jokers,
  ];

  jokers[player] -= 1;

  const drinks = [
    ...state.drinks,
  ];

  drinks[player] += 1;

  return {
    ...state,

    drinks,

    memory: {
      ...state.memory,

      jokers,

      revealedPlayers: [
        ...state.memory
          .revealedPlayers,

        player,
      ],
    },

    history: [
      ...state.history,

      {
        player,

        message: `Joueur ${
          player + 1
        } utilise un joker mémoire et boit 1 gorgée.`,

        timestamp: Date.now(),
      },
    ],
  };
}

export function hideMemoryJoker(
  state: GameState,
  player: number
): GameState {
  if (
    !Number.isInteger(player) ||
    player < 0 ||
    player >= state.players.length
  ) {
    throw new Error(
      "Le joueur indiqué est invalide."
    );
  }

  if (
    !state.memory.revealedPlayers.includes(
      player
    )
  ) {
    return state;
  }

  return {
    ...state,

    memory: {
      ...state.memory,

      revealedPlayers:
        state.memory.revealedPlayers.filter(
          (revealedPlayer) =>
            revealedPlayer !==
            player
        ),
    },
  };
}