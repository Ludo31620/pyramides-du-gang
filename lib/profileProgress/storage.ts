import type {
  PlayerProgress,
} from "./types";

const STORAGE_KEY =
  "pyramides-player-progress";

export function loadProgress():
  | PlayerProgress
  | null {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  const raw =
    localStorage.getItem(
      STORAGE_KEY
    );

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(
      raw
    ) as PlayerProgress;
  } catch {
    return null;
  }
}

export function saveProgress(
  progress: PlayerProgress
): void {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      progress
    )
  );
}

export function deleteProgress():
  void {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  localStorage.removeItem(
    STORAGE_KEY
  );
}