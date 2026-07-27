import ActionPanel from "@/components/game/ActionPanel";

type NextCardPanelProps = {
  visible: boolean;
  message?: string;
  onNextCard: () => void;
};

export default function NextCardPanel({
  visible,
  message,
  onNextCard,
}: NextCardPanelProps) {
  if (!visible) {
    return null;
  }

  return (
    <div className="mt-6">
      <ActionPanel
        eyebrow="Tour terminé"
        icon="🍻"
        title="La carte est terminée"
        description={
          message ??
          "Préparez-vous pour la carte suivante."
        }
        highlighted
        actions={[
          {
            id: "carte-suivante",
            label:
              "Révéler la carte suivante",
            icon: "🃏",
            variant:
              "primary",
            onClick: onNextCard,
          },
        ]}
      />
    </div>
  );
}