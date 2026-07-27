import ActionPanel from "@/components/game/ActionPanel";

type PlayerWaitingPanelProps = {
  visible: boolean;
  activePlayer: number;
};

export default function PlayerWaitingPanel({
  visible,
  activePlayer,
}: PlayerWaitingPanelProps) {
  if (!visible) {
    return null;
  }

  return (
    <div className="mt-6">
      <ActionPanel
        eyebrow="Tour en cours"
        icon="⏳"
        title="En attente"
        description={`Le joueur ${activePlayer} est en train de jouer.`}
      />
    </div>
  );
}