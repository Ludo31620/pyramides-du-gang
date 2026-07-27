import type {
  GameState,
} from "@/lib/gameEngine/types";

interface PlayerListProps {
  state: GameState;
}

export default function PlayerList({
  state,
}: PlayerListProps) {
  return (
    <section className="rounded-xl bg-zinc-900 p-6">
      <h2 className="text-2xl font-bold text-yellow-500">
        Joueurs
      </h2>

      <div className="mt-4 space-y-3">
        {state.players.map(
          (hand, playerIndex) => {
            const isCurrentPlayer =
              state.turn.currentPlayer ===
              playerIndex;

            const isRemaining =
              state.turn.remainingPlayers.includes(
                playerIndex
              );

            const drinks =
              state.drinks[playerIndex] ??
              0;

            const jokers =
              state.memory.jokers[
                playerIndex
              ] ?? 0;

            const memoryVisible =
              state.memory.revealedPlayers.includes(
                playerIndex
              );

            return (
              <article
                key={playerIndex}
                className={[
                  "rounded-xl border p-4",
                  isCurrentPlayer
                    ? "border-yellow-500 bg-yellow-500/10"
                    : "border-zinc-700 bg-zinc-800",
                ].join(" ")}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold">
                      Joueur{" "}
                      {playerIndex + 1}
                    </p>

                    <p className="text-sm text-zinc-400">
                      {hand.length} carte(s)
                      en main
                    </p>
                  </div>

                  <div className="text-right text-sm">
                    <p>
                      Gorgées :{" "}
                      <span className="font-bold">
                        {drinks}
                      </span>
                    </p>

                    <p>
                      Jokers :{" "}
                      <span className="font-bold">
                        {jokers}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold uppercase">
                  {isCurrentPlayer && (
                    <span className="rounded-full bg-yellow-500 px-3 py-1 text-black">
                      Joueur actif
                    </span>
                  )}

                  {isRemaining && (
                    <span className="rounded-full bg-blue-900 px-3 py-1 text-blue-200">
                      Doit encore jouer
                    </span>
                  )}

                  {memoryVisible && (
                    <span className="rounded-full bg-purple-900 px-3 py-1 text-purple-200">
                      Mémoire visible
                    </span>
                  )}
                </div>
              </article>
            );
          }
        )}
      </div>
    </section>
  );
}