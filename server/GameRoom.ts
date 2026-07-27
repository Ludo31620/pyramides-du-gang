import { GameEngine } from "../lib/gameEngine/GameEngine";

import type { Carte } from "../lib/deck";
import type { GameState } from "../lib/gameEngine/types";
import type { PublicRoom } from "./types";

export interface PlayerGameState
  extends Omit<
    GameState,
    "players" | "pyramid"
  > {
  viewerPlayerIndex: number;

  players: Array<
    Array<Carte | null>
  >;

  pyramid: Array<
    Array<Carte | null>
  >;
}

type CarteAvecRevelation =
  Carte & {
    revelee?: boolean;
  };

export class GameRoom {
  public readonly code: string;

  public readonly room: PublicRoom;

  private readonly engine: GameEngine;

  constructor(room: PublicRoom) {
    this.room = room;
    this.code = room.code;

    this.engine = new GameEngine();

    this.engine.dispatch({
      type: "START_GAME",
      playerCount: room.players.length,
    });

    console.log(
      `🃏 GameEngine créé pour ${this.code} avec ${room.players.length} joueurs`
    );
  }

  public getState(): GameState {
    return this.engine.getState();
  }

  public getStateForPlayer(
    playerIndex: number
  ): PlayerGameState {
    const state =
      this.engine.getState();

    if (
      !Number.isInteger(playerIndex) ||
      playerIndex < 0 ||
      playerIndex >= state.players.length
    ) {
      throw new Error(
        `Index joueur invalide : ${playerIndex}.`
      );
    }

    return {
      ...state,

      viewerPlayerIndex:
        playerIndex,

      players:
        state.players.map(
          (hand, handIndex) => {
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
        ),

      pyramid:
        state.pyramid.map(
          (row) =>
            row.map((card) => {
              const cardWithReveal =
                card as CarteAvecRevelation;

              if (
                cardWithReveal.revelee
              ) {
                return {
                  ...card,
                };
              }

              return null;
            })
        ),

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
}