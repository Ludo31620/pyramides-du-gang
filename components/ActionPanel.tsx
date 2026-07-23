"use client";

type ActionPanelProps = {
  joueur: number;
  onDonner: () => void;
  onPasser: () => void;
};


export default function ActionPanel({
  joueur,
  onDonner,
  onPasser,
}: ActionPanelProps) {


  return (

    <div className="mt-6 bg-zinc-900 rounded-xl p-5">

      <h2 className="text-2xl font-bold text-yellow-500">
        🎯 Joueur {joueur + 1}
      </h2>


      <p className="mt-3 text-xl">
        Que fais-tu ?
      </p>



      <div className="flex gap-4 mt-4">


        <button
          onClick={onDonner}
          className="
          bg-red-500
          text-black
          px-5
          py-3
          rounded-xl
          font-bold
          "
        >
          🍺 Donner des gorgées
        </button>



        <button
          onClick={onPasser}
          className="
          bg-gray-400
          text-black
          px-5
          py-3
          rounded-xl
          font-bold
          "
        >
          ⏭️ Passer
        </button>


      </div>

    </div>

  );
}