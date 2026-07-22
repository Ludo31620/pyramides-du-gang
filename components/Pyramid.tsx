import { Carte } from "@/lib/deck";
import PlayingCard from "./PlayingCard";

type PyramidProps = {
  pyramide: Carte[][];
};

export default function Pyramid({
  pyramide,
}: PyramidProps) {
  return (
    <div className="space-y-4">
      {pyramide.map((ligne, index) => (
        <div
          key={index}
          className="flex justify-center gap-3"
        >
          {ligne.map((carte, i) => (
            <PlayingCard
              key={i}
              carte={carte}
            />
          ))}
        </div>
      ))}
    </div>
  );
}