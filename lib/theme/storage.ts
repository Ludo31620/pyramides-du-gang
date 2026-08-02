import {
  DEFAULT_THEME_ID,
  GAME_THEMES,
} from "./themes";

import type {
  ThemeId,
} from "./types";

const THEME_STORAGE_KEY =
  "pyramide-du-gang-theme";

function isThemeId(
  value: string
): value is ThemeId {
  return (
    value in GAME_THEMES
  );
}

export function getStoredThemeId():
  ThemeId {
  if (
    typeof window ===
    "undefined"
  ) {
    return DEFAULT_THEME_ID;
  }

  const storedThemeId =
    window.localStorage.getItem(
      THEME_STORAGE_KEY
    );

  if (
    !storedThemeId ||
    !isThemeId(
      storedThemeId
    )
  ) {
    return DEFAULT_THEME_ID;
  }

  return storedThemeId;
}

export function saveThemeId(
  themeId: ThemeId
): void {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  window.localStorage.setItem(
    THEME_STORAGE_KEY,
    themeId
  );
}