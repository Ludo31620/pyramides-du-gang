"use client";

import {
  useState,
} from "react";

import GameOverlay from "@/components/game/GameOverlay";

const GAME_SESSION_KEY =
  "pyramides-partie";

export default function GameHomeButton() {
  const [
    confirmationOpen,
    setConfirmationOpen,
  ] = useState(false);

  function returnHome(): void {
    /*
     * On supprime uniquement les informations
     * de la partie actuelle.
     *
     * Le token du joueur reste conservé.
     */
    window.sessionStorage.removeItem(
      GAME_SESSION_KEY
    );

    /*
     * Navigation complète afin de fermer
     * proprement la connexion Socket.IO
     * de la partie en cours.
     */
    window.location.href =
      "/";
  }

  return (
    <>
      <button
        type="button"
        aria-label="Retourner à l’accueil"
        title="Accueil"
        onClick={() => {
          setConfirmationOpen(
            true
          );
        }}
        className="
          fixed
          left-3
          top-3
          z-[140]
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          border
          border-white/10
          bg-zinc-900/90
          text-lg
          text-white
          shadow-lg
          backdrop-blur-md
          transition
          hover:border-yellow-400/30
          hover:bg-zinc-800
          active:scale-95
          sm:left-5
          sm:top-5
        "
      >
        🏠
      </button>

      <GameOverlay
        open={
          confirmationOpen
        }
        eyebrow="Quitter la partie"
        icon="🏠"
        title="Retourner à l’accueil ?"
        description="Tu quitteras la partie en cours. Cette action ne peut pas être annulée."
        tone="red"
        actions={[
          {
            id:
              "cancel-home",

            label:
              "Continuer la partie",

            variant:
              "secondary",

            onClick: () => {
              setConfirmationOpen(
                false
              );
            },
          },

          {
            id:
              "confirm-home",

            label:
              "Retour à l’accueil",

            icon:
              "🏠",

            variant:
              "danger",

            onClick:
              returnHome,
          },
        ]}
      />
    </>
  );
}