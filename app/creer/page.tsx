"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const MIN_PLAYER_COUNT = 2;
const MAX_PLAYER_COUNT = 9;

export default function CreerPartie() {
  const router = useRouter();

  const [pseudo, setPseudo] = useState("");
  const [joueurs, setJoueurs] = useState(4);

  function creerPartie(): void {
    const pseudoNettoye = pseudo.trim();

    if (!pseudoNettoye) {
      alert("Entre un pseudo avant de créer la partie");
      return;
    }

    if (
      !Number.isInteger(joueurs) ||
      joueurs < MIN_PLAYER_COUNT ||
      joueurs > MAX_PLAYER_COUNT
    ) {
      alert(
        `Le nombre de joueurs doit être compris entre ${MIN_PLAYER_COUNT} et ${MAX_PLAYER_COUNT}.`
      );
      return;
    }

    const code =
      `PG-${Math.floor(1000 + Math.random() * 9000)}`;

    sessionStorage.setItem(
      "pyramides-partie",
      JSON.stringify({
        pseudo: pseudoNettoye,
        joueurs,
        code,
      })
    );

    router.push("/lobby");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#111111] px-6 text-white">
      <div className="w-full max-w-md">
        <h1 className="text-center text-4xl font-bold text-yellow-500">
          Créer une partie
        </h1>

        <div className="mt-10 space-y-6">
          <div>
            <label
              htmlFor="pseudo"
              className="mb-2 block"
            >
              Ton pseudo
            </label>

            <input
              id="pseudo"
              type="text"
              value={pseudo}
              onChange={(event) =>
                setPseudo(event.target.value)
              }
              placeholder="Ex : Ludo"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4"
            />
          </div>

          <div>
            <label
              htmlFor="joueurs"
              className="mb-2 block"
            >
              Nombre de joueurs
            </label>

            <select
              id="joueurs"
              value={joueurs}
              onChange={(event) =>
                setJoueurs(
                  Number(event.target.value)
                )
              }
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4"
            >
              {Array.from(
                {
                  length:
                    MAX_PLAYER_COUNT -
                    MIN_PLAYER_COUNT +
                    1,
                },
                (_, index) =>
                  index + MIN_PLAYER_COUNT
              ).map((nombre) => (
                <option
                  key={nombre}
                  value={nombre}
                >
                  {nombre} joueurs
                </option>
              ))}
            </select>

            <p className="mt-2 text-sm text-zinc-400">
              De 2 à 9 joueurs maximum
            </p>
          </div>

          <button
            type="button"
            onClick={creerPartie}
            className="w-full rounded-xl bg-yellow-500 py-4 font-bold text-black"
          >
            Créer la partie
          </button>
        </div>
      </div>
    </main>
  );
}