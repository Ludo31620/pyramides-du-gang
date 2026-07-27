"use client";

import {
  useEffect,
  useState,
} from "react";

import CardScene from "@/components/game/CardScene";

import type { Carte } from "@/lib/deck";

type CardRevealOverlayProps = {
  card: Carte | null;
  visible: boolean;
  drinks: number;
  onComplete?: () => void;
};

const DELAI_RETOURNEMENT = 550;
const DUREE_SCENE = 2400;

export default function CardRevealOverlay({
  card,
  visible,
  drinks,
  onComplete,
}: CardRevealOverlayProps) {
  const [
    faceVisible,
    setFaceVisible,
  ] = useState(false);

  useEffect(() => {
    if (!visible || !card) {
      setFaceVisible(false);
      return;
    }

    setFaceVisible(false);

    if (
      typeof navigator !==
        "undefined" &&
      "vibrate" in navigator
    ) {
      navigator.vibrate([
        35,
        45,
        80,
      ]);
    }

    const timerRetournement =
      window.setTimeout(() => {
        setFaceVisible(true);
      }, DELAI_RETOURNEMENT);

    const timerFermeture =
      window.setTimeout(() => {
        setFaceVisible(false);
        onComplete?.();
      }, DUREE_SCENE);

    return () => {
      window.clearTimeout(
        timerRetournement
      );

      window.clearTimeout(
        timerFermeture
      );
    };
  }, [
    visible,
    card,
    onComplete,
  ]);

  if (!visible || !card) {
    return null;
  }

  const texteGorgees = `${drinks} ${
    drinks > 1
      ? "gorgées"
      : "gorgée"
  }`;

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        overflow-hidden
        bg-black/90
        backdrop-blur-md
      "
      role="dialog"
      aria-modal="true"
      aria-label="Révélation de la nouvelle carte"
    >
      <CardScene
        carte={card}
        titre="Nouvelle carte"
        sousTitre={texteGorgees}
        variant="gold"
        faceVisible={faceVisible}
      />
    </div>
  );
}