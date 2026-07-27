"use client";

import {
  useState,
} from "react";

import GameInfo from "./components/GameInfo";
import PlayerList from "./components/PlayerList";

import {
  GameEngine,
} from "@/lib/gameEngine/GameEngine";

import type {
  GameState,
} from "@/lib/gameEngine/types";

const PLAYER_COUNT = 4;

export default function DevPage() {
  const [engine] = useState(
    () => new GameEngine()
  );

  const [
    partie,
    setPartie,
  ] = useState<GameState>(() =>
    engine.dispatch({
      type: "START_GAME",
      playerCount: PLAYER_COUNT,
    })
  );

  function nouvellePartie(): void {
    const newState =
      engine.dispatch({
        type: "START_GAME",
        playerCount: PLAYER_COUNT,
      });

    setPartie(newState);
  }

  function revelerCarteSuivante(): void {
    const newState =
      engine.dispatch({
        type: "NEXT_CARD",
      });

    setPartie(newState);
  }

  function passer(): void {
    const newState =
      engine.dispatch({
        type: "PASS",
      });

    setPartie(newState);
  }

  return (
    <main className="min-h-screen bg-zinc-950 p-4 text-white sm:p-8">
      <div className="mx-auto w-full max-w-5xl">
        <header>
          <h1 className="text-4xl font-bold text-yellow-500">
            🧪 Laboratoire V2
          </h1>

          <p className="mt-2 text-zinc-400">
            Interface de test du Game
            Engine
          </p>

          <button
            type="button"
            onClick={nouvellePartie}
            className="mt-6 rounded-xl bg-yellow-500 px-6 py-3 font-bold text-black transition hover:bg-yellow-400"
          >
            Nouvelle partie
          </button>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <GameInfo state={partie} />

          <PlayerList state={partie} />
        </div>

        <section className="mt-6 flex flex-wrap gap-4 rounded-xl bg-zinc-900 p-6">
          <h2 className="w-full text-2xl font-bold">
            Actions disponibles
          </h2>

          {partie.phase ===
            "WAITING" && (
            <button
              type="button"
              onClick={
                revelerCarteSuivante
              }
              className="rounded-xl bg-yellow-500 px-6 py-3 font-bold text-black transition hover:bg-yellow-400"
            >
              🎴 Révéler la prochaine
              carte
            </button>
          )}

          {partie.phase ===
            "PLAYER_TURN" && (
            <button
              type="button"
              onClick={passer}
              className="rounded-xl bg-zinc-700 px-6 py-3 font-bold text-white transition hover:bg-zinc-600"
            >
              Joueur{" "}
              {
                partie.turn
                  .currentPlayer + 1
              }{" "}
              passe
            </button>
          )}

          {partie.phase ===
            "GAME_OVER" && (
            <div className="w-full rounded-xl bg-green-900 p-5">
              <p className="text-2xl font-bold">
                🏁 Partie terminée
              </p>
            </div>
          )}

          {![
            "WAITING",
            "PLAYER_TURN",
            "GAME_OVER",
          ].includes(partie.phase) && (
            <p className="text-zinc-400">
              Les contrôles de la phase{" "}
              <span className="font-bold text-white">
                {partie.phase}
              </span>{" "}
              seront ajoutés dans le
              prochain panneau.
            </p>
          )}
        </section>

        <section className="mt-6 rounded-xl bg-zinc-900 p-6">
          <h2 className="text-2xl font-bold text-yellow-500">
            Historique
          </h2>

          {partie.history.length ===
          0 ? (
            <p className="mt-4 text-zinc-400">
              Aucun événement enregistré.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {partie.history
                .slice()
                .reverse()
                .map(
                  (
                    event,
                    index
                  ) => (
                    <article
                      key={`${event.timestamp}-${index}`}
                      className="rounded-lg bg-zinc-800 p-4"
                    >
                      <p>
                        {event.message}
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        Joueur{" "}
                        {event.player + 1}
                      </p>
                    </article>
                  )
                )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}