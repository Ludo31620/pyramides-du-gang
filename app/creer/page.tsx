"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreerPartie() {
  const router = useRouter();

  const [pseudo, setPseudo] = useState("");
  const [joueurs, setJoueurs] = useState(4);

  function creerPartie() {
    if (!pseudo.trim()) {
      alert("Entre un pseudo avant de créer la partie");
      return;
    }

    const code = `PG-${Math.floor(1000 + Math.random() * 9000)}`;

    sessionStorage.setItem(
      "pyramides-partie",
      JSON.stringify({
        pseudo,
        joueurs,
        code,
      })
    );

    router.push("/lobby");
  }

  return (
    <main className="min-h-screen bg-[#111111] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        <h1 className="text-4xl font-bold text-yellow-500 text-center">
          Créer une partie
        </h1>

        <div className="mt-10 space-y-6">

          <div>
            <label className="block mb-2">
              Ton pseudo
            </label>

            <input
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              placeholder="Ex : Ludo"
              className="w-full rounded-xl bg-zinc-800 p-4 border border-zinc-700"
            />
          </div>

          <div>
            <label className="block mb-2">
              Nombre de joueurs
            </label>

            <select
              value={joueurs}
              onChange={(e) => setJoueurs(Number(e.target.value))}
              className="w-full rounded-xl bg-zinc-800 p-4 border border-zinc-700"
            >
              {[2,3,4,5,6,7,8,9,10].map((n) => (
                <option key={n} value={n}>
                  {n} joueurs
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={creerPartie}
            className="w-full bg-yellow-500 text-black font-bold py-4 rounded-xl"
          >
            Créer la partie
          </button>

        </div>

      </div>
    </main>
  );
}