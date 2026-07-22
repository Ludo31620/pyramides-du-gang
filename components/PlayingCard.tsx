import { Carte } from "@/lib/deck";

type PlayingCardProps = {
  carte: Carte;
};

export default function PlayingCard({
  carte,
}: PlayingCardProps) {
  const estRouge =
    carte.couleur === "♥" ||
    carte.couleur === "♦";

  return (
    <div className="w-20 h-28 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center font-bold">
      <p
        className={`text-xl ${
          estRouge
            ? "text-red-600"
            : "text-black"
        }`}
      >
        {carte.valeur}
      </p>

      <p
        className={`text-3xl ${
          estRouge
            ? "text-red-600"
            : "text-black"
        }`}
      >
        {carte.couleur}
      </p>
    </div>
  );
}