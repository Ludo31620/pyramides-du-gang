"use client";

import { useState } from "react";

import BluffAnnouncementOverlay from "@/components/game/BluffAnnouncementOverlay";

export default function BluffTestPage() {
  const [visible, setVisible] =
    useState(false);

  return (
    <main
      className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-[#111111]
        px-6
        text-white
      "
    >
      <div className="text-center">
        <h1
          className="
            mb-3
            text-3xl
            font-black
          "
        >
          Test animation bluff
        </h1>

        <p className="mb-8 text-sm text-zinc-500">
          Vérification visuelle avant
          intégration dans la partie.
        </p>

        <button
          type="button"
          onClick={() =>
            setVisible(true)
          }
          className="
            rounded-2xl
            bg-[#FFD166]
            px-6
            py-4
            font-black
            uppercase
            tracking-wider
            text-[#111318]
            transition-transform
            active:scale-95
          "
        >
          Lancer le bluff
        </button>
      </div>

      <BluffAnnouncementOverlay
        visible={visible}
        joueur="Ludo"
        cible="Maylann"
        gorgées={3}
        onComplete={() =>
          setVisible(false)
        }
      />
    </main>
  );
}
