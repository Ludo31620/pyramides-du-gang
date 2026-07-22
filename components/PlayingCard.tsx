import { Carte } from "@/lib/deck";

type PlayingCardProps = {
  carte: Carte;
  onClick?: () => void;
};

export default function PlayingCard({
  carte,
  onClick,
}: PlayingCardProps) {
  if (!carte.revelee) {
    return (
      <button
        onClick={onClick}
        className="w-20 h-28 rounded-xl bg-blue-700 border-2 border-white shadow-lg flex items-center justify-center"
      >
        <span className="text-white text-3xl font-bold">
          🂠
        </span>
      </button>
    );
  }

  const estRouge =
    carte.couleur === "♥" ||
    carte.couleur === "♦";

  return (
    <button
      onClick={onClick}
      className="w-20 h-28 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center font-bold"
    >
      <p
        className={`text-xl ${
          estRouge ? "text-red-600" : "text-black"
        }`}
      >
        {carte.valeur}
      </p>

      <p
        className={`text-3xl ${
          estRouge ? "text-red-600" : "text-black"
        }`}
      >
        {carte.couleur}
      </p>
    </button>
  );
}