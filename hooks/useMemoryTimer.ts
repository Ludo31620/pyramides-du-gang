"use client";

import {
  useEffect,
} from "react";

import {
  useGame,
} from "@/components/providers/GameProvider";

export function useMemoryTimer(): void {
  const {
    state,
    dispatch,
  } = useGame();

  useEffect(() => {
    if (
      state.phase !== "MEMORY" ||
      state.memory.remainingSeconds <= 0
    ) {
      return;
    }

    const timeoutId =
      window.setTimeout(() => {
        dispatch({
          type: "TICK_MEMORY",
        });
      }, 1000);

    return () => {
      window.clearTimeout(
        timeoutId
      );
    };
  }, [
    state.phase,
    state.memory.remainingSeconds,
    dispatch,
  ]);
}