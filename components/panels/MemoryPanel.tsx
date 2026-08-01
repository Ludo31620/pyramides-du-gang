"use client";

import PlayerHand from "@/components/players/PlayerHand";

import type {
  PlayerGameState,
} from "@/lib/gameEngine/publicTypes";

type MemoryPanelProps = {
  state: PlayerGameState;
};

const MEMORY_DURATION_SECONDS = 60;

export default function MemoryPanel({
  state,
}: MemoryPanelProps) {
  const remainingSeconds =
    state.memory.remainingSeconds;

  const progressPercentage = Math.max(
    0,
    Math.min(
      100,
      (
        remainingSeconds /
        MEMORY_DURATION_SECONDS
      ) * 100
    )
  );

  const isUrgent =
    remainingSeconds <= 10;

  const cards =
    state.players[
      state.viewerPlayerIndex
    ] ?? [];

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 p-5 shadow-2xl sm:p-8">
      <div className="text-center">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
          Phase de préparation
        </p>

        <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
          MÉMORISATION
        </h2>

        <p className="mt-3 text-sm text-zinc-400 sm:text-base">
          Observe attentivement tes cartes.
        </p>
      </div>

      <div className="mt-8">
        <div className="flex items-end justify-between gap-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
            Temps restant
          </p>

          <p
            className={
              isUrgent
                ? "animate-pulse text-3xl font-black text-red-500"
                : "text-3xl font-black text-yellow-400"
            }
          >
            {remainingSeconds}

            <span className="ml-1 text-base">
              s
            </span>
          </p>
        </div>

        <div className="mt-3 h-4 overflow-hidden rounded-full border border-white/10 bg-black/50 p-1">
          <div
            className={
              isUrgent
                ? "h-full rounded-full bg-red-500 transition-[width] duration-1000 ease-linear"
                : "h-full rounded-full bg-yellow-400 transition-[width] duration-1000 ease-linear"
            }
            style={{
              width: `${progressPercentage}%`,
            }}
          />
        </div>

        {isUrgent && (
          <p className="mt-3 animate-pulse text-center text-sm font-black uppercase tracking-widest text-red-400">
            Dépêche-toi !
          </p>
        )}
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-3 sm:p-5">
        <PlayerHand
          cards={cards}
        />
      </div>

      <p className="mt-6 text-center text-sm leading-6 text-zinc-500">
        À la fin du compte à rebours,
        tes cartes seront cachées et tu
        devras les mémoriser.
      </p>
    </section>
  );
}