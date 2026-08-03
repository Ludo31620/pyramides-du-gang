import {
  DEFAULT_PLAYER_PROFILE,
  type PlayerProfile,
} from "./types";

const STORAGE_KEY =
  "pyramides-player-profile";

export function getPlayerProfile():
  PlayerProfile {
  if (
    typeof window ===
    "undefined"
  ) {
    return DEFAULT_PLAYER_PROFILE;
  }

  try {
    const value =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!value) {
      return DEFAULT_PLAYER_PROFILE;
    }

    return {
      ...DEFAULT_PLAYER_PROFILE,
      ...JSON.parse(value),
    };
  } catch {
    return DEFAULT_PLAYER_PROFILE;
  }
}

export function savePlayerProfile(
  profile: PlayerProfile
): void {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(profile)
  );
}

export function updatePlayerProfile(
  partial: Partial<PlayerProfile>
): PlayerProfile {
  const profile =
    getPlayerProfile();

  const updated = {
    ...profile,
    ...partial,
  };

  savePlayerProfile(
    updated
  );

  return updated;
}

export function resetPlayerProfile():
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