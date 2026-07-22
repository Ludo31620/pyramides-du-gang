"use client";

import { useState } from "react";

import {
  creerPaquet,
  melangerPaquet,
  distribuerCartes,
} from "@/lib/deck";

import { creerPyramide } from "@/lib/pyramid";

import PlayingCard from "@/components/PlayingCard";
import PlayerHand from "@/components/PlayerHand";
import Pyramid from "@/components/Pyramid";

export default function DevPage() {
  const [cartes, setCartes] = useState(creerPaquet());

  function melanger() {
    setCartes(melangerPaquet(cartes));
  }

  const { mains, paquetRestant } = distribuerCartes(cartes, 4);

  const pyramide = creerPyramide(paquetRestant);

  const cartesRestantes = paquetRestant.slice(15);

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

      <h2 className="text-3xl font-bold text-yellow-500 mt-10 mb-4">
        🎴 Paquet complet
      </h2>

      <div className="grid grid-cols-4 gap-4">
        {cartes.map((carte, index) => (
          <PlayingCard
            key={index}
            carte={carte}
          />
        ))}
      </div>

      <h2 className="text-3xl font-bold text-yellow-500 mt-12 mb-6">
        👥 Distribution
      </h2>

      <PlayerHand
        nom="Joueur 1"
        cartes={mains[0]}
      />

      <PlayerHand
        nom="Joueur 2"
        cartes={mains[1]}
      />

      <PlayerHand
        nom="Joueur 3"
        cartes={mains[2]}
      />

      <PlayerHand
        nom="Joueur 4"
        cartes={mains[3]}
      />

      <h2 className="text-3xl font-bold text-yellow-500 mt-12 mb-6">
        🔺 Pyramide
      </h2>

      <Pyramid pyramide={pyramide} />

      <div className="mt-12">
        <h2 className="text-3xl font-bold text-yellow-500">
          📦 Cartes restantes
        </h2>

        <p className="mt-2 text-xl">
          {cartesRestantes.length} cartes restantes
        </p>
      </div>
    </main>
  );
}