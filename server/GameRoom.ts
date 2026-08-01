import {
  GameEngine,
} from "../lib/gameEngine/GameEngine";

import type {
  Carte,
} from "../lib/deck";

import type {
  GameAction,
} from "../lib/gameEngine/actions";

import type {
  GameState,
} from "../lib/gameEngine/types";

import type {
  PlayerGameState,
} from "../lib/gameEngine/publicTypes";

import type {
  PublicRoom,
} from "./types";

export class GameRoom {
  public readonly code: string;

  public readonly room: PublicRoom;

  private readonly engine:
    GameEngine;

  constructor(
    room: PublicRoom
  ) {
    this.room = room;
    this.code = room.code;

    this.engine =
      new GameEngine();

    this.engine.dispatch({
      type: "START_GAME",

      playerCount:
        room.players.length,
    });

    console.log(
      `🃏 GameEngine créé pour ${this.code} avec ${room.players.length} joueurs`
    );
  }

  public getState(): GameState {
    return this.engine.getState();
  }

  public dispatchForPlayer(
    playerIndex: number,
    action: GameAction
  ): GameState {
    const state =
      this.engine.getState();

    this.assertValidPlayerIndex(
      playerIndex,
      state
    );

    this.assertActionAllowed(
      playerIndex,
      action,
      state
    );

    return this.engine.dispatch(
      action
    );
  }

  public getStateForPlayer(
    playerIndex: number
  ): PlayerGameState {
    const state =
      this.engine.getState();

    this.assertValidPlayerIndex(
      playerIndex,
      state
    );

    const viewer =
      this.room.players[
        playerIndex
      ];

    const viewerIsHost =
      viewer?.isHost === true;

    /*
     * progress.nextRow utilise un index
     * logique qui commence par la ligne
     * du bas.
     *
     * state.pyramid utilise l'ordre
     * visuel : sommet vers bas.
     */
    const realNextRow =
      state.pyramid.length -
      1 -
      state.progress.nextRow;

    const nextCard =
      state.pyramid[
        realNextRow
      ]?.[
        state.progress.nextColumn
      ] ?? null;

    const nextCardForReveal =
      viewerIsHost &&
      state.phase === "WAITING" &&
      nextCard
        ? {
            ...nextCard,
          }
        : null;

    const visiblePlayers:
      Array<
        Array<Carte | null>
      > =
      state.players.map(
        (
          hand,
          handIndex
        ) => {
          if (
            handIndex ===
            playerIndex
          ) {
            return hand.map(
              (card) => ({
                ...card,
              })
            );
          }

          return hand.map(
            () => null
          );
        }
      );

    const publicPyramid =
      state.pyramid.map(
        (row) =>
          row.map(
            (card) => {
              if (
                card.revelee
              ) {
                return {
                  hidden: false,

                  card: {
                    ...card,
                  },
                };
              }

              return {
                hidden: true,
                card: null,
              };
            }
          )
      );

    return {
      ...state,

      viewerPlayerIndex:
        playerIndex,

      nextCardForReveal,

      players:
        visiblePlayers,

      pyramid:
        publicPyramid,

      /*
       * Le paquet restant ne doit jamais
       * être envoyé aux clients.
       */
      deck: [],

      current: {
        ...state.current,

        card:
          state.current.card
            ? {
                ...state.current.card,
              }
            : null,
      },

      distribution: {
        ...state.distribution,

        lastResult:
          state.distribution
            .lastResult
            ? {
                ...state
                  .distribution
                  .lastResult,

                card: {
                  ...state
                    .distribution
                    .lastResult
                    .card,
                },
              }
            : null,

        lastDrink:
          state.distribution
            .lastDrink
            ? {
                ...state
                  .distribution
                  .lastDrink,
              }
            : null,
      },

      memory: {
        ...state.memory,

        jokers: [
          ...state.memory.jokers,
        ],

        revealedPlayers: [
          ...state.memory
            .revealedPlayers,
        ],
      },

      progress: {
        ...state.progress,
      },

      turn: {
        ...state.turn,

        remainingPlayers: [
          ...state.turn
            .remainingPlayers,
        ],

        pendingAction:
          state.turn.pendingAction
            ? {
                ...state.turn
                  .pendingAction,

                claimedCard: {
                  ...state.turn
                    .pendingAction
                    .claimedCard,
                },
              }
            : null,
      },

      bluffResult:
        state.bluffResult
          ? {
              ...state.bluffResult,

              revealedCard:
                state.bluffResult
                  .revealedCard
                  ? {
                      ...state
                        .bluffResult
                        .revealedCard,
                    }
                  : null,
            }
          : null,

      drinks: [
        ...state.drinks,
      ],

      history:
        state.history.map(
          (event) => ({
            ...event,
          })
        ),
    };
  }

  private assertValidPlayerIndex(
    playerIndex: number,
    state: GameState
  ): void {
    if (
      !Number.isInteger(
        playerIndex
      ) ||
      playerIndex < 0 ||
      playerIndex >=
        state.players.length
    ) {
      throw new Error(
        `Index joueur invalide : ${playerIndex}.`
      );
    }
  }

  private assertHost(
    playerIndex: number
  ): void {
    const player =
      this.room.players[
        playerIndex
      ];

    if (
      !player ||
      !player.isHost
    ) {
      throw new Error(
        "Seul l'hôte peut effectuer cette action."
      );
    }
  }

  private assertActionAllowed(
    playerIndex: number,
    action: GameAction,
    state: GameState
  ): void {
    switch (action.type) {
      case "START_GAME": {
        throw new Error(
          "La partie est déjà démarrée."
        );
      }

      case "ANSWER_DISTRIBUTION": {
        if (
          state.phase !==
            "DISTRIBUTION" ||
          state.distribution
            .currentPlayer !==
            playerIndex ||
          state.distribution
            .awaitingGive
        ) {
          throw new Error(
            "Ce n'est pas à toi de répondre."
          );
        }

        return;
      }

      case "GIVE_DISTRIBUTION_DRINK": {
        if (
          state.phase !==
            "DISTRIBUTION" ||
          state.distribution
            .currentPlayer !==
            playerIndex ||
          !state.distribution
            .awaitingGive
        ) {
          throw new Error(
            "Tu ne peux pas donner cette gorgée."
          );
        }

        return;
      }

      case "START_MEMORY":
      case "TICK_MEMORY":
      case "REVEAL_CARD":
      case "CONTINUE_AFTER_BLUFF":
      case "NEXT_PLAYER":
      case "NEXT_CARD": {
        this.assertHost(
          playerIndex
        );

        return;
      }

      case "USE_MEMORY_JOKER":
      case "HIDE_MEMORY_JOKER": {
        if (
          action.player !==
          playerIndex
        ) {
          throw new Error(
            "Tu ne peux utiliser que ton propre joker mémoire."
          );
        }

        return;
      }

      case "PASS":
      case "GIVE": {
        if (
          state.phase !==
            "PLAYER_TURN" ||
          state.turn
            .currentPlayer !==
            playerIndex
        ) {
          throw new Error(
            "Ce n'est pas ton tour."
          );
        }

        return;
      }

      case "BELIEVE":
      case "DOUBT": {
        const pendingAction =
          state.turn
            .pendingAction;

        if (
          state.phase !==
            "PLAYER_RESPONSE" ||
          !pendingAction ||
          pendingAction.target !==
            playerIndex
        ) {
          throw new Error(
            "Seule la cible peut répondre à cette annonce."
          );
        }

        return;
      }

      case "END_GAME": {
        this.assertHost(
          playerIndex
        );

        return;
      }

      default: {
        const exhaustiveCheck: never =
          action;

        throw new Error(
          `Action inconnue : ${JSON.stringify(
            exhaustiveCheck
          )}`
        );
      }
    }
  }
}