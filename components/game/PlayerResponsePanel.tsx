"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import ActionPanel from "@/components/game/ActionPanel";
import GameOverlay from "@/components/game/GameOverlay";

import type { PendingAction } from "@/lib/gameEngine/types";

type PlayerResponsePanelProps = {
  action: PendingAction | null;
  estMaReponse: boolean;
  onBelieve: () => void;
  onDoubt: () => void;
};

const DUREE_OVERLAY_CIBLE = 1300;

export default function PlayerResponsePanel({
  action,
  estMaReponse,
  onBelieve,
  onDoubt,
}: PlayerResponsePanelProps) {
  const [
    overlayCibleOuvert,
    setOverlayCibleOuvert,
  ] = useState(false);

  const derniereActionAffichee =
    useRef<string | null>(null);

  useEffect(() => {
    if (
      !action ||
      !estMaReponse
    ) {
      setOverlayCibleOuvert(
        false
      );

      return;
    }

    const identifiantAction =
      JSON.stringify({
        giver: action.giver,
        target: action.target,
        drinks: action.drinks,
        claimedCard:
          action.claimedCard,
      });

    if (
      derniereActionAffichee.current ===
      identifiantAction
    ) {
      return;
    }

    derniereActionAffichee.current =
      identifiantAction;

    setOverlayCibleOuvert(true);

    const timer =
      window.setTimeout(() => {
        setOverlayCibleOuvert(
          false
        );
      }, DUREE_OVERLAY_CIBLE);

    return () => {
      window.clearTimeout(timer);
    };
  }, [action, estMaReponse]);

  if (
    !action ||
    !estMaReponse
  ) {
    return null;
  }

  const texteGorgees =
    action.drinks > 1
      ? "gorgées"
      : "gorgée";

  const bieres =
    "🍺".repeat(
      Math.min(action.drinks, 5)
    );

  return (
    <>
      <GameOverlay
        open={overlayCibleOuvert}
        eyebrow="Attention"
        icon="🎯"
        title="Tu as été choisi !"
        description={`Le joueur ${
          action.giver + 1
        } te donne ${
          action.drinks
        } ${texteGorgees}. ${bieres}`}
        tone="yellow"
        vibrate
      />

      {!overlayCibleOuvert && (
        <div className="mt-6">
          <ActionPanel
            eyebrow="À toi de répondre"
            icon="🤨"
            title={`Joueur ${
              action.giver + 1
            } te donne ${
              action.drinks
            } ${texteGorgees}`}
            description="Tu peux accepter de boire ou contester son annonce."
            highlighted
            actions={[
              {
                id: "boire",
                label: "Je bois",
                icon: "🍺",
                variant:
                  "primary",
                onClick:
                  onBelieve,
              },
              {
                id: "menteur",
                label:
                  "Menteur !",
                icon: "⚡",
                variant:
                  "danger",
                onClick:
                  onDoubt,
              },
            ]}
          />
        </div>
      )}
    </>
  );
}