import { Carte } from "@/lib/deck";
import PlayingCard from "./PlayingCard";

type PyramidProps = {
  pyramide: Carte[][];
  onCardClick?: (
    ligne: number,
    colonne: number
  ) => void;
};

export default function Pyramid({
  pyramide,
  onCardClick,
}: PyramidProps) {
  return (
    <div className="space-y-4">
      {pyramide.map((ligne, indexLigne) => (
        <div
          key={indexLigne}
          className="flex justify-center gap-3"
        >
          {ligne.map((carte, indexCarte) => (
            <PlayingCard
              key={indexCarte}
              carte={carte}
              onClick={() =>
                onCardClick?.(
                  indexLigne,
                  indexCarte
                )
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}