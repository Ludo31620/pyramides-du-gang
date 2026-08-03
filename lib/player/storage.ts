const PLAYER_ID_STORAGE_KEY =
  "pyramide-du-gang-player-id";

function generatePlayerId(): string {
  return crypto.randomUUID();
}

export function getPlayerId(): string {
  if (
    typeof window ===
    "undefined"
  ) {
    return "";
  }

  const existingId =
    localStorage.getItem(
      PLAYER_ID_STORAGE_KEY
    );

  if (existingId) {
    return existingId;
  }

  const newId =
    generatePlayerId();

  localStorage.setItem(
    PLAYER_ID_STORAGE_KEY,
    newId
  );

  return newId;
}