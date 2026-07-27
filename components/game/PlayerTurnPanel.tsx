"use client";

import {
  useEffect,
  useState,
} from "react";

import ActionPanel from "@/components/game/ActionPanel";

type PlayerTurnPanelProps = {
  visible: boolean;
  drinks: number;
  targets: number[];
  onPass: () => void;
  onChooseTarget: (
    target: number
  ) => void;
};

export default function PlayerTurnPanel({
  visible,
  drinks,
  targets,
  onPass,
  onChooseTarget,
}: PlayerTurnPanelProps) {
  const [
    targetSelectionOpen,
    setTargetSelectionOpen,
  ] = useState(false);

  useEffect(() => {
    if (!visible) {
      setTargetSelectionOpen(
        false
      );
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  const drinksLabel =
    drinks > 1
      ? "gorgées"
      : "gorgée";

  function chooseTarget(
    target: number
  ): void {
    setTargetSelectionOpen(
      false
    );

    onChooseTarget(target);
  }

  if (targetSelectionOpen) {
    return (
      <div className="mt-6">
        <ActionPanel
          eyebrow="Bluff"
          icon="🎯"
          title="Choisis ta cible"
          description="Cette personne devra boire ou contester ton annonce."
          highlighted
          footer={`Cette carte vaut ${drinks} ${drinksLabel}.`}
          actions={[
            ...targets.map(
              (target) => ({
                id: `joueur-${target}`,
                label: `Joueur ${
                  target + 1
                }`,
                icon: "👤",
                variant:
                  "secondary" as const,
                onClick: () =>
                  chooseTarget(
                    target
                  ),
              })
            ),
            {
              id: "annuler",
              label: "Annuler",
              icon: "↩️",
              variant:
                "ghost" as const,
              onClick: () =>
                setTargetSelectionOpen(
                  false
                ),
            },
          ]}
        />
      </div>
    );
  }

  return (
    <div className="mt-6">
      <ActionPanel
        eyebrow="À toi de jouer"
        icon="🎭"
        title="Que veux-tu faire ?"
        description="Tu peux annoncer que tu possèdes cette valeur ou passer ton tour."
        highlighted
        footer={`Cette carte vaut ${drinks} ${drinksLabel}.`}
        actions={[
          {
            id: "bluff",
            label: "Bluff",
            icon: "🃏",
            variant: "primary",
            onClick: () =>
              setTargetSelectionOpen(
                true
              ),
          },
          {
            id: "passer",
            label: "Passer",
            icon: "⏭️",
            variant:
              "secondary",
            onClick: onPass,
          },
        ]}
      />
    </div>
  );
}