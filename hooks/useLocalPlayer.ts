"use client";

import {
  useEffect,
  useState,
} from "react";

const STORAGE_LOCAL_PLAYER_KEY =
  "pyramides-local-player";

export function useLocalPlayer() {
  const [localPlayer, setLocalPlayer] =
    useState(0);

  useEffect(() => {
    const joueurSauvegarde =
      sessionStorage.getItem(
        STORAGE_LOCAL_PLAYER_KEY
      );

    if (joueurSauvegarde === null) {
      return;
    }

    const indexJoueur =
      Number(joueurSauvegarde);

    if (
      Number.isInteger(indexJoueur) &&
      indexJoueur >= 0
    ) {
      setLocalPlayer(indexJoueur);
    }
  }, []);

  function changerJoueurLocal(
    playerIndex: number
  ): void {
    if (
      !Number.isInteger(playerIndex) ||
      playerIndex < 0
    ) {
      return;
    }

    sessionStorage.setItem(
      STORAGE_LOCAL_PLAYER_KEY,
      playerIndex.toString()
    );

    setLocalPlayer(playerIndex);
  }

  return {
    localPlayer,
    changerJoueurLocal,
  };
}