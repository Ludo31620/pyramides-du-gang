import {
  applyCompletedGame,
  createPlayerProgress,
} from "./profileProgress";

import {
  loadProgress,
  saveProgress,
} from "./storage";

import type {
  CompletedGameProgressInput,
  ProgressUpdateResult,
} from "./types";

export function recordCompletedGame(
  input:
    CompletedGameProgressInput
): ProgressUpdateResult {
  const currentProgress =
    loadProgress() ??
    createPlayerProgress();

  const result =
    applyCompletedGame(
      currentProgress,
      input
    );

  saveProgress(
    result.progress
  );

  return result;
}