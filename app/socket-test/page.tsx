"use client";

import {
  useEffect,
  useState,
} from "react";

import type { Socket } from "socket.io-client";

import { obtenirSocket } from "@/lib/socket";

type EtatConnexion =
  | "CONNEXION"
  | "CONNECTE"
  | "DECONNECTE"
  | "ERREUR";

export default function SocketTestPage() {
  const [etat, setEtat] =
    useState<EtatConnexion>("CONNEXION");

  const [socketId, setSocketId] =
    useState<string | null>(null);

  const [messageErreur, setMessageErreur] =
    useState<string | null>(null);

  useEffect(() => {
    const socket: Socket =
      obtenirSocket();

    function gererConnexion(): void {
      setEtat("CONNECTE");
      setSocketId(socket.id ?? null);
      setMessageErreur(null);
    }

    function gererDeconnexion(): void {
      setEtat("DECONNECTE");
      setSocketId(null);
    }

    function gererErreur(
      erreur: Error
    ): void {
      console.error(
        "Erreur Socket.IO :",
        erreur
      );

      setEtat("ERREUR");
      setMessageErreur(erreur.message);
    }

    socket.on(
      "connect",
      gererConnexion
    );

    socket.on(
      "disconnect",
      gererDeconnexion
    );

    socket.on(
      "connect_error",
      gererErreur
    );

    if (!socket.connected) {
      socket.connect();
    } else {
      gererConnexion();
    }

    return () => {
      socket.off(
        "connect",
        gererConnexion
      );

      socket.off(
        "disconnect",
        gererDeconnexion
      );

      socket.off(
        "connect_error",
        gererErreur
      );
    };
  }, []);

  const estConnecte =
    etat === "CONNECTE";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#111111] px-6 text-white">
      <section className="w-full max-w-md rounded-2xl bg-zinc-900 p-6 text-center">
        <h1 className="text-3xl font-black text-yellow-500">
          Test multijoueur
        </h1>

        <p className="mt-2 text-zinc-400">
          Connexion entre le navigateur et
          Socket.IO
        </p>

        <div className="mt-8 rounded-xl bg-black/30 p-6">
          <p className="text-5xl">
            {estConnecte ? "🟢" : "🟠"}
          </p>

          <h2 className="mt-4 text-2xl font-bold">
            {etat === "CONNEXION" &&
              "Connexion en cours..."}

            {etat === "CONNECTE" &&
              "Connexion réussie"}

            {etat === "DECONNECTE" &&
              "Connexion interrompue"}

            {etat === "ERREUR" &&
              "Erreur de connexion"}
          </h2>

          {socketId && (
            <div className="mt-5 rounded-xl bg-zinc-800 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Identifiant Socket
              </p>

              <p className="mt-2 break-all font-mono text-sm text-yellow-500">
                {socketId}
              </p>
            </div>
          )}

          {messageErreur && (
            <p className="mt-5 rounded-xl bg-red-950 p-4 text-sm text-red-300">
              {messageErreur}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}