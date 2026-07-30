"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import { obtenirSocket } from "@/lib/socket";


import type {
  GameAction,
} from "@/lib/gameEngine/actions";

import type {
  GameState,
} from "@/lib/gameEngine/types";

export interface PlayerGameState
  extends GameState {
  viewerPlayerIndex: number;
}

interface GameContextValue {
  state: PlayerGameState | null;
  connected: boolean;
  loading: boolean;
  error: string | null;

  dispatch: (
    action: GameAction
  ) => void;

  refreshState: () => void;
}

interface GameProviderProps {
  children: ReactNode;
  roomCode: string;
}

type GameGetResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

type GameActionResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

const GameContext =
  createContext<GameContextValue | null>(
    null
  );

export default function GameProvider({
  children,
  roomCode,
}: GameProviderProps) {
  const [
    state,
    setState,
  ] =
    useState<PlayerGameState | null>(
      null
    );

  const [
    connected,
    setConnected,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );

  const refreshState =
    useCallback((): void => {
      const socket =
        obtenirSocket();

      if (!socket.connected) {
        return;
      }

      setLoading(true);

      socket.emit(
        "game:get",
        {
          code: roomCode,
        },
        (
          result:
            GameGetResult
        ) => {
          if (
            !result.success
          ) {
            setError(
              result.error
            );

            setLoading(false);
          }
        }
      );
    }, [
      roomCode,
    ]);

  useEffect(() => {
    const socket =
      obtenirSocket();

    function handleConnect(): void {
      setConnected(true);
      setError(null);

      socket.emit(
        "game:get",
        {
          code: roomCode,
        },
        (
          result:
            GameGetResult
        ) => {
          if (
            !result.success
          ) {
            setError(
              result.error
            );

            setLoading(false);
          }
        }
      );
    }

    function handleDisconnect(): void {
      setConnected(false);
    }

    function handleGameState(
      nextState:
        PlayerGameState
    ): void {
      setState(
        nextState
      );

      setLoading(false);
      setError(null);
    }

    function handleGameError(
      payload: {
        error?: string;
      }
    ): void {
      setError(
        payload.error ??
          "Une erreur de jeu est survenue."
      );
    }

    socket.on(
      "connect",
      handleConnect
    );

    socket.on(
      "disconnect",
      handleDisconnect
    );

    socket.on(
      "game:state",
      handleGameState
    );

    socket.on(
      "game:error",
      handleGameError
    );

    if (
      socket.connected
    ) {
      handleConnect();
    } else {
      socket.connect();
    }

    return () => {
      socket.off(
        "connect",
        handleConnect
      );

      socket.off(
        "disconnect",
        handleDisconnect
      );

      socket.off(
        "game:state",
        handleGameState
      );

      socket.off(
        "game:error",
        handleGameError
      );
    };
  }, [
    roomCode,
  ]);

  const dispatch =
    useCallback(
      (
        action: GameAction
      ): void => {
        const socket =
          obtenirSocket();

        if (
          !socket.connected
        ) {
          setError(
            "La connexion au serveur est interrompue."
          );

          return;
        }

        socket.emit(
          "game:action",
          {
            code:
              roomCode,

            action,
          },
          (
            result:
              GameActionResult
          ) => {
            if (
              !result.success
            ) {
              setError(
                result.error
              );
            }
          }
        );
      },
      [
        roomCode,
      ]
    );

  return (
    <GameContext.Provider
      value={{
        state,
        connected,
        loading,
        error,
        dispatch,
        refreshState,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const context =
    useContext(GameContext);

  if (!context) {
    throw new Error(
      "useGame must be used inside GameProvider."
    );
  }

  return context;
}