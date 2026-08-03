import {
  startMemory,
} from "./memory";

import {
  creerPyramide,
} from "@/lib/pyramid";

import type {
  Carte,
  Valeur,
} from "@/lib/deck";

import type {
  DistributionAnswer,
  DistributionQuestion,
  GameState,
  HistoryEvent,
} from "../types";

const VALUE_ORDER: Record<
  Valeur,
  number
> = {
  As: 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  Valet: 11,
  Dame: 12,
  Roi: 13,
};

function isRed(
  card: Carte
): boolean {
  return (
    card.couleur === "♥" ||
    card.couleur === "♦"
  );
}

function isAnswerAllowed(
  question: DistributionQuestion,
  answer: DistributionAnswer
): boolean {
  switch (question) {
    case 0:
      return (
        answer === "RED" ||
        answer === "BLACK"
      );

    case 1:
      return (
        answer === "HIGHER" ||
        answer === "LOWER"
      );

    case 2:
      return (
        answer === "INSIDE" ||
        answer === "OUTSIDE"
      );

    case 3:
      return (
        answer === "SPADES" ||
        answer === "HEARTS" ||
        answer === "DIAMONDS" ||
        answer === "CLUBS"
      );

    default: {
      const exhaustiveCheck:
        never =
        question;

      throw new Error(
        `Question inconnue : ${exhaustiveCheck}`
      );
    }
  }
}

function checkAnswer(
  question: DistributionQuestion,
  answer: DistributionAnswer,
  newCard: Carte,
  playerCards: Carte[]
): boolean {
  switch (question) {
    case 0: {
      const red =
        isRed(newCard);

      return (
        (
          answer === "RED" &&
          red
        ) ||
        (
          answer === "BLACK" &&
          !red
        )
      );
    }

    case 1: {
      const firstCard =
        playerCards[0];

      if (!firstCard) {
        throw new Error(
          "La première carte du joueur est introuvable."
        );
      }

      const newValue =
        VALUE_ORDER[
          newCard.valeur
        ];

      const firstValue =
        VALUE_ORDER[
          firstCard.valeur
        ];

      if (
        newValue ===
        firstValue
      ) {
        return false;
      }

      return (
        (
          answer === "HIGHER" &&
          newValue >
            firstValue
        ) ||
        (
          answer === "LOWER" &&
          newValue <
            firstValue
        )
      );
    }

    case 2: {
      const firstCard =
        playerCards[0];

      const secondCard =
        playerCards[1];

      if (
        !firstCard ||
        !secondCard
      ) {
        throw new Error(
          "Les deux premières cartes du joueur sont introuvables."
        );
      }

      const firstValue =
        VALUE_ORDER[
          firstCard.valeur
        ];

      const secondValue =
        VALUE_ORDER[
          secondCard.valeur
        ];

      const newValue =
        VALUE_ORDER[
          newCard.valeur
        ];

      const minimum =
        Math.min(
          firstValue,
          secondValue
        );

      const maximum =
        Math.max(
          firstValue,
          secondValue
        );

      const inside =
        newValue >
          minimum &&
        newValue <
          maximum;

      const outside =
        newValue <
          minimum ||
        newValue >
          maximum;

      if (
        answer ===
        "INSIDE"
      ) {
        return inside;
      }

      return outside;
    }

    case 3: {
      switch (answer) {
        case "SPADES":
          return (
            newCard.couleur ===
            "♠"
          );

        case "HEARTS":
          return (
            newCard.couleur ===
            "♥"
          );

        case "DIAMONDS":
          return (
            newCard.couleur ===
            "♦"
          );

        case "CLUBS":
          return (
            newCard.couleur ===
            "♣"
          );

        default:
          return false;
      }
    }

    default: {
      const exhaustiveCheck:
        never =
        question;

      throw new Error(
        `Question inconnue : ${exhaustiveCheck}`
      );
    }
  }
}

function createHistoryEvent(
  player: number,
  message: string
): HistoryEvent {
  return {
    player,
    message,

    timestamp:
      Date.now(),
  };
}

function finishDistributionStep(
  state: GameState
): GameState {
  const {
    currentPlayer,
    question,
  } = state.distribution;

  if (
    currentPlayer <
    state.players.length - 1
  ) {
    return {
      ...state,

      distribution: {
        ...state.distribution,

        currentPlayer:
          currentPlayer + 1,

        question,

        awaitingGive:
          false,

        awaitingContinue:
          false,

        lastResult:
          null,

        lastDrink:
          state.distribution
            .lastDrink,
      },
    };
  }

  if (
    question < 3
  ) {
    return {
      ...state,

      distribution: {
        ...state.distribution,

        currentPlayer: 0,

        question: (
          question + 1
        ) as DistributionQuestion,

        awaitingGive:
          false,

        awaitingContinue:
          false,

        lastResult:
          null,

        lastDrink:
          state.distribution
            .lastDrink,
      },
    };
  }

  const pyramid =
    creerPyramide(
      state.deck
    );

  const totalCards =
    pyramid.reduce(
      (
        total,
        row
      ) =>
        total +
        row.length,
      0
    );

  const memoryState:
    GameState = {
    ...state,

    pyramid,

    deck: [],

    progress: {
      revealedCards: 0,
      totalCards,
      nextRow: 0,
      nextColumn: 0,
    },

    distribution: {
      ...state.distribution,

      awaitingGive:
        false,

      awaitingContinue:
        false,

      lastResult:
        null,

      lastDrink:
        state.distribution
          .lastDrink,
    },

    turn: {
      currentPlayer: 0,

      remainingPlayers: [
        ...Array(
          state.players.length
        ).keys(),
      ],

      pendingAction:
        null,
    },

    phase:
      "MEMORY",

    history: [
      ...state.history,

      createHistoryEvent(
        currentPlayer,
        "La distribution est terminée."
      ),
    ],
  };

  return startMemory(
    memoryState
  );
}

export function answerDistribution(
  state: GameState,
  answer: DistributionAnswer
): GameState {
  if (
    state.phase !==
    "DISTRIBUTION"
  ) {
    throw new Error(
      "La partie n’est pas dans la phase de distribution."
    );
  }

  if (
    state.distribution
      .awaitingGive
  ) {
    throw new Error(
      "Le joueur doit d’abord donner sa gorgée."
    );
  }

  if (
    state.distribution
      .awaitingContinue
  ) {
    throw new Error(
      "Le joueur doit d’abord continuer."
    );
  }

  const {
    currentPlayer,
    question,
  } = state.distribution;

  if (
    !isAnswerAllowed(
      question,
      answer
    )
  ) {
    throw new Error(
      "Cette réponse ne correspond pas à la question actuelle."
    );
  }

  const playerCards =
    state.players[
      currentPlayer
    ];

  if (!playerCards) {
    throw new Error(
      "Le joueur actuel est introuvable."
    );
  }

  if (
    playerCards.length !==
    question
  ) {
    throw new Error(
      "Le nombre de cartes du joueur ne correspond pas à la question actuelle."
    );
  }

  const [
    drawnCard,
    ...remainingDeck
  ] = state.deck;

  if (!drawnCard) {
    throw new Error(
      "Le paquet ne contient plus assez de cartes."
    );
  }

  const correct =
    checkAnswer(
      question,
      answer,
      drawnCard,
      playerCards
    );

  const players =
    state.players.map(
      (
        cards,
        index
      ) => {
        if (
          index !==
          currentPlayer
        ) {
          return cards;
        }

        return [
          ...cards,
          drawnCard,
        ];
      }
    );

  const result = {
    player:
      currentPlayer,

    question,

    answer,

    card:
      drawnCard,

    correct,
  };

  const drinks = [
    ...state.drinks,
  ];

  if (!correct) {
    drinks[
      currentPlayer
    ] += 1;
  }

  return {
    ...state,

    players,

    deck:
      remainingDeck,

    drinks,

    distribution: {
      ...state.distribution,

      awaitingGive:
        correct,

      awaitingContinue:
        !correct,

      lastResult:
        result,

      lastDrink:
        null,
    },

    history: [
      ...state.history,

      createHistoryEvent(
        currentPlayer,

        correct
          ? `Joueur ${
              currentPlayer + 1
            } a bien répondu.`
          : `Joueur ${
              currentPlayer + 1
            } s’est trompé et boit 1 gorgée.`
      ),
    ],
  };
}

export function giveDistributionDrink(
  state: GameState,
  target: number
): GameState {
  if (
    state.phase !==
    "DISTRIBUTION"
  ) {
    throw new Error(
      "La partie n’est pas dans la phase de distribution."
    );
  }

  if (
    !state.distribution
      .awaitingGive ||
    state.distribution
      .awaitingContinue ||
    !state.distribution
      .lastResult
      ?.correct
  ) {
    throw new Error(
      "Aucune gorgée de distribution n’est à donner."
    );
  }

  if (
    !Number.isInteger(
      target
    ) ||
    target < 0 ||
    target >=
      state.players.length
  ) {
    throw new Error(
      "La cible choisie est invalide."
    );
  }

  const giver =
    state.distribution
      .currentPlayer;

  if (
    target ===
    giver
  ) {
    throw new Error(
      "Un joueur ne peut pas se donner sa propre gorgée."
    );
  }

  const drinks = [
    ...state.drinks,
  ];

  drinks[target] += 1;

  const updatedState:
    GameState = {
    ...state,

    drinks,

    distribution: {
      ...state.distribution,

      awaitingGive:
        false,

      awaitingContinue:
        false,

      lastDrink: {
        giver,
        target,
      },
    },

    history: [
      ...state.history,

      createHistoryEvent(
        giver,

        `Joueur ${
          giver + 1
        } donne 1 gorgée au joueur ${
          target + 1
        }.`
      ),
    ],
  };

const playerStats =
  state.gameStats.players.map(
    (
      stats,
      playerIndex
    ) => {
      if (
        playerIndex !==
        giver
      ) {
        return stats;
      }

      return {
        ...stats,

        drinksGiven:
          stats.drinksGiven + 1,
      };
    }
  );

  return finishDistributionStep(
    updatedState
  );
}

export function continueDistribution(
  state: GameState
): GameState {
  if (
    state.phase !==
    "DISTRIBUTION"
  ) {
    throw new Error(
      "La partie n’est pas dans la phase de distribution."
    );
  }

  if (
    !state.distribution
      .awaitingContinue
  ) {
    throw new Error(
      "Aucun résultat de distribution n’attend de continuation."
    );
  }

  if (
    !state.distribution
      .lastResult ||
    state.distribution
      .lastResult.correct
  ) {
    throw new Error(
      "Seule une mauvaise réponse peut être continuée."
    );
  }

  return finishDistributionStep({
    ...state,

    distribution: {
      ...state.distribution,

      awaitingContinue:
        false,
    },
  });
}
