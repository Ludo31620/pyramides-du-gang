"use client";

import { useState } from "react";
import {
  creerPaquet,
  melangerPaquet,
} from "@/lib/deck";
import PlayingCard from "@/components/PlayingCard";

export default function DevPage() {
  const [cartes, setCartes] = useState(creerPaquet());

  function melanger() {
    setCartes(melangerPaquet(cartes));
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <h1 className="text-4xl font-bold text-yellow-500">
        🧪 Laboratoire
      </h1>

      <p className="mt-4 text-xl">
        Nombre de cartes : {cartes.length}
      </p>

      <button
        onClick={melanger}
        className="mt-6 bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold"
      >
        Mélanger le paquet
      </button>

      <div className="grid grid-cols-4 gap-4 mt-8">
        {cartes.map((carte, index) => (
          <PlayingCard
            key={index}
            carte={carte}
          />
        ))}
      </div>
    </main>
  );
}