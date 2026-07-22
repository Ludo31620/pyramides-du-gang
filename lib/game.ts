export function generateGameCode() {
  const letters = "PG";
  const numbers = Math.floor(1000 + Math.random() * 9000);

  return `${letters}-${numbers}`;
}