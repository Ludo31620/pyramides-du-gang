"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  AnimatePresence,
} from "framer-motion";

import type {
  ReactNode,
} from "react";

import {
  BluffAnnouncementAnimation,
} from "@/components/game/animations";

import {
  obtenirSocket,
} from "@/lib/socket";

import type {
  GameAction,
} from "@/lib/gameEngine/actions";

import type {
  PlayerGameState,
} from "@/lib/gameEngine/publicTypes";

interface GameContextValue {
  state:
    | PlayerGameState
    | null;

  connected: boolean;
  loading: boolean;
  error: string | null;

  dispatch: (
    action: GameAction
  ) => void;

  refreshState: () => void;

  returnToLobby: () => void;
}

interface GameProviderProps {
  children: ReactNode;
  roomCode: string;

  /**
   * Liste des pseudos dans le même ordre
   * que les joueurs du moteur.
   */
  playerNames: string[];
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

type ReturnToLobbyResult =
  | {
      success: true;
      room: {
        code: string;
      };
    }
  | {
      success: false;
      error: string;
    };

interface BluffAnimationPayload {
  giver: number;
  target: number;
  drinks: number;
  animationKey: number;
}

const GameContext =
  createContext<
    GameContextValue | null
  >(null);

export default function GameProvider({
  children,
  roomCode,
  playerNames,
}: GameProviderProps) {
  const [
    state,
    setState,
  ] =
    useState<
      PlayerGameState | null
    >(null);

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

  const [
    bluffAnimation,
    setBluffAnimation,
  ] =
    useState<
      BluffAnimationPayload | null
    >(null);

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
          code:
            roomCode,
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

  const returnToLobby =
    useCallback((): void => {
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

      setError(
        null
      );

      socket.emit(
        "game:return-to-lobby",
        {
          code:
            roomCode,
        },
        (
          result:
            ReturnToLobbyResult
        ) => {
          if (
            !result.success
          ) {
            setError(
              result.error
            );
          }

          /*
           * En cas de succès, le serveur diffuse
           * game:returned-to-lobby à tout le salon.
           *
           * La redirection sera donc déclenchée
           * par l'écouteur commun ci-dessous.
           */
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
          code:
            roomCode,
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

    function handleReturnedToLobby(
      payload: {
        code?: string;
      }
    ): void {
      if (
        payload?.code &&
        payload.code !==
          roomCode
      ) {
        return;
      }

      /*
       * Tous les joueurs quittent ensemble
       * l'écran de jeu.
       *
       * Le salon reste conservé côté serveur.
       */
      window.location.href =
        "/lobby";
    }

    function handleBluffAnimation(
      payload:
        BluffAnimationPayload
    ): void {
      if (
        !payload ||
        !Number.isInteger(
          payload.giver
        ) ||
        !Number.isInteger(
          payload.target
        ) ||
        !Number.isFinite(
          payload.drinks
        ) ||
        !Number.isFinite(
          payload.animationKey
        )
      ) {
        return;
      }

      setBluffAnimation({
        giver:
          payload.giver,

        target:
          payload.target,

        drinks:
          payload.drinks,

        animationKey:
          payload.animationKey,
      });
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

    socket.on(
      "game:returned-to-lobby",
      handleReturnedToLobby
    );

    socket.on(
      "game:bluff-animation",
      handleBluffAnimation
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

      socket.off(
        "game:returned-to-lobby",
        handleReturnedToLobby
      );

      socket.off(
        "game:bluff-animation",
        handleBluffAnimation
      );
    };
  }, [
    roomCode,
  ]);

  const completeBluffAnimation =
    useCallback((): void => {
      const currentAnimation =
        bluffAnimation;

      setBluffAnimation(
        null
      );

      if (
        !currentAnimation ||
        !state
      ) {
        return;
      }

      /*
       * Tous les joueurs ferment leur animation.
       *
       * Seul le donneur envoie GIVE au moteur,
       * afin que l'action ne soit exécutée
       * qu'une seule fois.
       */
      if (
        state.viewerPlayerIndex !==
          currentAnimation.giver ||
        state.phase !==
          "PLAYER_TURN" ||
        state.turn.currentPlayer !==
          currentAnimation.giver
      ) {
        return;
      }

      dispatch({
        type: "GIVE",

        target:
          currentAnimation.target,
      });
    }, [
      bluffAnimation,
      dispatch,
      state,
    ]);

  return (
    <GameContext.Provider
      value={{
        state,
        connected,
        loading,
        error,
        dispatch,
        refreshState,
        returnToLobby,
      }}
    >
      <AnimatePresence>
        {bluffAnimation && (
          <BluffAnnouncementAnimation
            giver={
              bluffAnimation.giver
            }
            target={
              bluffAnimation.target
            }
            playerNames={
              playerNames
            }
            drinks={
              bluffAnimation.drinks
            }
            animationKey={
              bluffAnimation.animationKey
            }
            onComplete={
              completeBluffAnimation
            }
          />
        )}
      </AnimatePresence>

      {children}
    </GameContext.Provider>
  );
}

export function useGame():
  GameContextValue {
  const context =
    useContext(
      GameContext
    );

  if (!context) {
    throw new Error(
      "useGame must be used inside GameProvider."
    );
  }

  return context;
}