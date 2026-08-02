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
  const current =
    state.current;

  const revealedCards =
    state.progress
      .revealedCards;

  const totalCards =
    state.progress
      .totalCards;

  const progressPercentage =
    totalCards > 0
      ? Math.min(
          100,
          (
            revealedCards /
            totalCards
          ) * 100
        )
      : 0;

  const drinks =
    current.row + 1;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 p-4 shadow-xl sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
          Carte révélée
        </p>

        <div className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-xs font-black text-yellow-400">
          🃏 {revealedCards}/{totalCards}
        </div>
      </div>

      <div className="mt-3 h-1 overflow-hidden rounded-full bg-black/40">
        <div
          className="h-full rounded-full bg-yellow-400 transition-[width] duration-500"
          style={{
            width:
              `${progressPercentage}%`,
          }}
        />
      </div>

      <div className="mt-4 flex items-center justify-center">
        {current.card ? (
          <PyramidCard
            card={
              current.card
            }
            hidden={false}
            size="large"
          />
        ) : (
          <div className="flex h-32 w-24 items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 px-3 text-center text-xs font-bold text-zinc-500">
            Aucune carte
          </div>
        )}
      </div>

      {current.card ? (
        <div className="mt-4 flex justify-center">
          <div className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-center">
            <span className="text-sm font-black text-yellow-400">
              {drinks} gorgée
              {drinks > 1
                ? "s"
                : ""}
            </span>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-center text-xs text-zinc-500">
          Révèle une carte pour commencer.
        </p>
      )}
    </section>
  );
}