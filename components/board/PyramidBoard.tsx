import PyramidCard from "./PyramidCard";

import type { GameState } from "@/lib/gameEngine/types";

interface PyramidBoardProps {
  state: GameState;
}

export default function PyramidBoard({
  state,
}: PyramidBoardProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-900 p-8">
      <h2 className="mb-8 text-center text-3xl font-black text-yellow-400">
        Pyramide
      </h2>

      <div className="flex flex-col items-center gap-4">
        {state.pyramid.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex justify-center gap-3"
          >
            {row.map((card, columnIndex) => (
              <PyramidCard
                key={`${rowIndex}-${columnIndex}`}
                card={card}
                size="medium"
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}