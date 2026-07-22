"use client";

import { useEffect, useState } from "react";

type Partie = {
  pseudo: string;
  joueurs: number;
  code: string;
};

export default function Lobby() {
  const [partie, setPartie] = useState<Partie | null>(null);

  useEffect(() => {
    const sauvegarde = sessionStorage.getItem("pyramides-partie");

    if (sauvegarde) {
      setPartie(JSON.parse(sauvegarde));
    }
  }, []);

  if (!partie) {
    return (
      <main className="min-h-screen bg-[#111111] text-white flex items-center justify-center">
        Chargement...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#111111] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">

        <h1 className="text-4xl font-bold text-yellow-500">
          🏛️ Lobby
        </h1>

        <div className="mt-8 bg-zinc-900 rounded-xl p-6">

          <p className="text-gray-400">
            Code de la partie
          </p>

          <p className="text-5xl font-bold text-yellow-500 mt-2">
            {partie.code}
          </p>

        </div>


        <div className="mt-6 bg-zinc-900 rounded-xl p-6">

          <h2 className="text-xl font-bold">
            Joueurs (1/{partie.joueurs})
          </h2>

          <div className="mt-4 text-left">

            <p>
              👑 {partie.pseudo}
            </p>

          </div>

        </div>


        <button
          className="mt-8 w-full bg-yellow-500 text-black font-bold py-4 rounded-xl"
        >
          Lancer la partie
        </button>


      </div>
    </main>
  );
}