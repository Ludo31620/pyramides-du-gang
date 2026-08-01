import PyramidCard from "./PyramidCard";

import type {
  PlayerGameState,
} from "@/lib/gameEngine/publicTypes";

interface CurrentCardProps {
  state: PlayerGameState;
}

export default function CurrentCard({
  state,
}: CurrentCardProps) {
  const current = state.current;

  return (
    <section className="rounded-3xl border border-yellow-500/20 bg-zinc-900 p-8">
      <h2 className="text-center text-3xl font-black text-yellow-400">
        Carte révélée
      </h2>

      <div className="mt-8 flex justify-center">
        {current.card ? (
          <PyramidCard
            card={current.card}
            hidden={false}
            size="large"
          />
        ) : (
          <div className="flex h-40 w-28 items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 text-zinc-500">
            Aucune carte
          </div>
        )}
      </div>

      {current.card ? (
        <div className="mt-8 text-center">
          <p className="text-zinc-400">
            Ligne de la pyramide
          </p>

          <p className="mt-2 text-4xl font-black text-yellow-400">
            {current.row + 1} gorgée
            {current.row > 0 ? "s" : ""}
          </p>
        </div>
      ) : (
        <p className="mt-8 text-center text-zinc-500">
          Révèle une carte pour commencer.
        </p>
      )}
    </section>
  );
}