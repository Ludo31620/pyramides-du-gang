"use client";

import { useState } from "react";

export default function Lobby() {
  const [code, setCode] = useState("");

  function creerCode() {
    const nombre = Math.floor(1000 + Math.random() * 9000);
    setCode(`PG-${nombre}`);
  }

  return (
    <main className="min-h-screen bg-[#111111] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">

        <h1 className="text-4xl font-bold text-yellow-500">
          🏛️ Lobby
        </h1>

        {!code ? (
          <button
            onClick={creerCode}
            className="mt-10 w-full bg-yellow-500 text-black font-bold py-4 rounded-xl"
          >
            Créer une partie
          </button>
        ) : (
          <div className="mt-10 space-y-6">

            <p className="text-gray-400">
              Code de la partie
            </p>

            <p className="text-5xl font-bold text-yellow-500">
              {code}
            </p>

            <div className="bg-zinc-900 rounded-xl p-5">
              <p>
                👑 Hôte
              </p>

              <p className="mt-2 text-gray-400">
                En attente des joueurs...
              </p>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}