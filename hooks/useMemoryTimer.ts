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

  const phase =
    state?.phase ?? null;

  const remainingSeconds =
    state?.memory.remainingSeconds ?? 0;

  const viewerPlayerIndex =
    state?.viewerPlayerIndex ?? null;

  const viewerIsHost =
    viewerPlayerIndex === 0;

  useEffect(() => {
    if (
      phase !== "MEMORY" ||
      remainingSeconds <= 0 ||
      !viewerIsHost
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
    phase,
    remainingSeconds,
    viewerIsHost,
    dispatch,
  ]);
}