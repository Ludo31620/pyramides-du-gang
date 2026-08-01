export function getPlayerName(
  playerNames: string[],
  playerIndex: number
): string {
  const pseudo =
    playerNames[
      playerIndex
    ]?.trim();

  if (pseudo) {
    return pseudo;
  }

  return `Joueur ${
    playerIndex + 1
  }`;
}