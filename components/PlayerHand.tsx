import { Carte } from "@/lib/deck";
import PlayingCard from "./PlayingCard";

type PlayerHandProps = {
  nom: string;
  cartes: Carte[];
};

export default function PlayerHand({
  nom,
  cartes,
}: PlayerHandProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-yellow-500 mb-4">
        {nom}
      </h2>

      <div className="flex flex-wrap gap-3">
        {cartes.map((carte, index) => (
          <PlayingCard
            key={index}
            carte={carte}
          />
        ))}
      </div>
    </div>
  );
}