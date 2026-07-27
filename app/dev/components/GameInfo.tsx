import type {
  GameState,
} from "@/lib/gameEngine/types";

interface GameInfoProps {
  state: GameState;
}

export default function GameInfo({
  state,
}: GameInfoProps) {
  const activePlayer =
    state.turn.currentPlayer + 1;

  return (
    <section className="rounded-xl bg-zinc-900 p-6">
      <h2 className="text-2xl font-bold">
        État de la partie
      </h2>

      <div className="mt-5 space-y-3 text-lg">
        <p>
          Phase :{" "}
          <span className="font-bold text-yellow-500">
            {state.phase}
          </span>
        </p>

        <p>
          Progression :{" "}
          <span className="font-bold">
            {state.progress.revealedCards}
            {" / "}
            {state.progress.totalCards}
          </span>
        </p>

        <p>
          Joueur actif :{" "}
          <span className="font-bold">
            Joueur {activePlayer}
          </span>
        </p>

        <p>
          Joueurs restants :{" "}
          <span className="font-bold">
            {
              state.turn
                .remainingPlayers
                .length
            }
          </span>
        </p>

        <p>
          Prochaine position :{" "}
          <span className="font-bold">
            ligne{" "}
            {state.progress.nextRow + 1},
            carte{" "}
            {state.progress.nextColumn + 1}
          </span>
        </p>
      </div>

      {state.current.card && (
        <div className="mt-6 rounded-xl bg-zinc-800 p-5">
          <p className="text-zinc-400">
            Carte actuellement révélée
          </p>

          <p className="mt-2 text-4xl font-bold">
            {state.current.card.valeur}
            {state.current.card.couleur}
          </p>

          <p className="mt-3 text-zinc-400">
            Ligne de valeur :{" "}
            {state.current.row + 1}{" "}
            gorgée(s)
          </p>
        </div>
      )}
    </section>
  );
}