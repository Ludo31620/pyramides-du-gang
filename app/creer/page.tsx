"use client";

import { useState } from "react";
import { generateGameCode } from "@/lib/game";

export default function CreerPartie() {
  const [pseudo, setPseudo] = useState("");
  const [joueurs, setJoueurs] = useState(4);
  const [code, setCode] = useState("");

  function creerPartie() {
    const nouveauCode = generateGameCode();
    setCode(nouveauCode);
  }

  return (
    <main className="min-h-screen bg-[#111111] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        <h1 className="text-4xl font-bold text-yellow-500 text-center">
          Créer une partie
        </h1>

        <div className="mt-8 space-y-5">

          <input
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            placeholder="Ton pseudo"
            className="w-full rounded-xl bg-zinc-800 border border-zinc-700 p-4"
          />

          <div>
            <label className="block mb-2">
              Nombre de joueurs
            </label>

            <select
              value={joueurs}
              onChange={(e) => setJoueurs(Number(e.target.value))}
              className="w-full rounded-xl bg-zinc-800 border border-zinc-700 p-4"
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
            className="w-full bg-yellow-500 text-black font-bold rounded-xl py-4"
          >
            Créer la partie
          </button>

          {code && (
            <div className="bg-zinc-900 border border-yellow-500 rounded-xl p-5 text-center">
              <p className="text-gray-400">
                Code de la partie
              </p>

              <p className="text-4xl font-bold text-yellow-500 mt-2">
                {code}
              </p>
            </div>
          )}

        </div>

      </div>
    </main>
  );
}