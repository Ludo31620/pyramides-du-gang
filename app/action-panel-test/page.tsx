"use client";

import {
  useState,
} from "react";

import ActionPanel from "@/components/game/ActionPanel";

type EcranTest =
  | "ACTION"
  | "CIBLE"
  | "REPONSE"
  | "ATTENTE";

export default function ActionPanelTestPage() {
  const [ecran, setEcran] =
    useState<EcranTest>("ACTION");

  return (
    <main className="min-h-screen bg-[#0B0E13] px-4 py-8 text-white">
      <div className="mx-auto w-full max-w-md">
        <header className="mb-8 text-center">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#FFD166]">
            Pyramides du Gang
          </p>

          <h1 className="mt-3 text-3xl font-black">
            Test ActionPanel
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Test des différents états
            de jeu
          </p>
        </header>

        {ecran === "ACTION" && (
          <ActionPanel
            eyebrow="À toi de jouer"
            icon="🎭"
            title="Que veux-tu faire ?"
            description="Tu peux annoncer que tu possèdes cette valeur ou passer ton tour."
            highlighted
            actions={[
              {
                id: "bluff",
                label: "Bluff",
                icon: "🃏",
                variant: "primary",
                onClick: () =>
                  setEcran("CIBLE"),
              },
              {
                id: "passer",
                label: "Passer",
                variant: "secondary",
                onClick: () =>
                  setEcran("ATTENTE"),
              },
            ]}
            footer="La carte active vaut 3 gorgées."
          />
        )}

        {ecran === "CIBLE" && (
          <ActionPanel
            eyebrow="Bluff"
            icon="🎯"
            title="Choisis ta cible"
            description="Cette personne devra boire ou contester ton annonce."
            highlighted
            actions={[
              {
                id: "joueur-2",
                label: "Joueur 2",
                icon: "2",
                variant: "secondary",
                onClick: () =>
                  setEcran("REPONSE"),
              },
              {
                id: "joueur-3",
                label: "Joueur 3",
                icon: "3",
                variant: "secondary",
                onClick: () =>
                  setEcran("REPONSE"),
              },
              {
                id: "retour",
                label: "Retour",
                icon: "←",
                variant: "ghost",
                onClick: () =>
                  setEcran("ACTION"),
              },
            ]}
          />
        )}

        {ecran === "REPONSE" && (
          <ActionPanel
            eyebrow="À toi de répondre"
            icon="🤨"
            title="Joueur 1 te donne 3 gorgées"
            description="Tu peux accepter de boire ou contester son annonce."
            highlighted
            actions={[
              {
                id: "boire",
                label: "Je bois",
                icon: "🍺",
                variant: "primary",
                onClick: () =>
                  setEcran("ATTENTE"),
              },
              {
                id: "menteur",
                label: "Menteur !",
                icon: "⚡",
                variant: "danger",
                onClick: () =>
                  setEcran("ATTENTE"),
              },
            ]}
          />
        )}

        {ecran === "ATTENTE" && (
          <ActionPanel
            eyebrow="Tour en cours"
            icon="⏳"
            title="En attente"
            description="Les autres joueurs terminent leur action."
            actions={[
              {
                id: "recommencer",
                label:
                  "Recommencer le test",
                variant: "ghost",
                onClick: () =>
                  setEcran("ACTION"),
              },
            ]}
          />
        )}
      </div>
    </main>
  );
}