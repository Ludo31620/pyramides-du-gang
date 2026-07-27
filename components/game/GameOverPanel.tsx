import ActionPanel from "@/components/game/ActionPanel";

type GameOverPanelProps = {
  visible: boolean;
  onRestart: () => void;
};

export default function GameOverPanel({
  visible,
  onRestart,
}: GameOverPanelProps) {
  if (!visible) {
    return null;
  }

  return (
    <div className="mt-6">
      <ActionPanel
        eyebrow="Partie terminée"
        icon="🏁"
        title="Pyramide terminée"
        description="Toutes les cartes ont été jouées."
        highlighted
        actions={[
          {
            id: "nouvelle-partie",
            label: "Créer une nouvelle partie",
            icon: "🔄",
            variant: "primary",
            onClick: onRestart,
          },
        ]}
      />
    </div>
  );
}