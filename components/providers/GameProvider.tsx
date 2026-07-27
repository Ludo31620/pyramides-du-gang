"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import {
  GameEngine,
} from "@/lib/gameEngine/GameEngine";

import type {
  GameAction,
} from "@/lib/gameEngine/actions";

import type {
  GameState,
} from "@/lib/gameEngine/types";

interface GameContextValue {
  state: GameState;

  /**
   * Envoie une action au moteur,
   * met à jour React puis retourne
   * le nouvel état de la partie.
   */
  dispatch: (
    action: GameAction
  ) => GameState;
}

interface GameProviderProps {
  children: ReactNode;

  /**
   * Nombre réel de joueurs provenant
   * du lobby.
   *
   * Cette propriété est volontairement
   * obligatoire afin d'empêcher le jeu
   * de démarrer avec une valeur par défaut.
   */
  playerCount: number;
}

const GameContext =
  createContext<GameContextValue | null>(
    null
  );

export default function GameProvider({
  children,
  playerCount,
}: GameProviderProps) {
  /**
   * Une seule instance du moteur est créée
   * pendant toute la durée de la page.
   */
  const [engine] = useState(
    () => new GameEngine()
  );

  /**
   * Le moteur crée l'état initial avec
   * le nombre réel de joueurs du lobby.
   *
   * React ne possède qu'une copie de cet
   * état destinée à rafraîchir l'interface.
   */
  const [state, setState] =
    useState<GameState>(() =>
      engine.dispatch({
        type: "START_GAME",
        playerCount,
      })
    );

  const dispatch = useCallback(
    (action: GameAction): GameState => {
      const nextState =
        engine.dispatch(action);

      setState(nextState);

      return nextState;
    },
    [engine]
  );

  return (
    <GameContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

/**
 * Permet à un composant placé dans
 * GameProvider d'accéder au jeu.
 */
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