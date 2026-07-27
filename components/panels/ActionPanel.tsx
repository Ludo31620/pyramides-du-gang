import DistributionPanel from "@/components/panels/distribution/DistributionPanel";
import MemoryPanel from "@/components/panels/MemoryPanel";
import PlayerTurnPanel from "@/components/panels/PlayerTurnPanel";
import WaitingPanel from "@/components/panels/WaitingPanel";
import ResponsePanel from "@/components/panels/ResponsePanel";
import BluffResultPanel from "@/components/panels/BluffResultPanel";


import type {
  GameAction,
} from "@/lib/gameEngine/actions";

import type {
  GameState,
} from "@/lib/gameEngine/types";

interface ActionPanelProps {
  state: GameState;

  /**
   * Facultatif afin que les pages de test
   * puissent toujours afficher le panneau
   * sans posséder de GameProvider.
   */
  onDispatch?: (
    action: GameAction
  ) => void;
}

interface PlaceholderPanelProps {
  eyebrow: string;
  title: string;
  description: string;
}

function PlaceholderPanel({
  eyebrow,
  title,
  description,
}: PlaceholderPanelProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-900 p-6 sm:p-8">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
        {title}
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
        {description}
      </p>
    </section>
  );
}

export default function ActionPanel({
  state,
  onDispatch,
}: ActionPanelProps) {
  switch (state.phase) {
    case "DISTRIBUTION":
      return (
        <DistributionPanel
          state={state}
          onDispatch={onDispatch}
        />
      );

    case "MEMORY":
      return (
        <MemoryPanel
          state={state}
        />
      );

    case "WAITING":
      return (
        <WaitingPanel
          state={state}
          onDispatch={onDispatch}
        />
      );

    case "PLAYER_TURN":
      return (
        <PlayerTurnPanel
          state={state}
          onDispatch={onDispatch}
        />
      );

    case "PLAYER_RESPONSE":
  return (
    <ResponsePanel
      state={state}
      onDispatch={onDispatch}
    />
  );

case "BLUFF_RESULT":
  return (
    <BluffResultPanel
      state={state}
      onDispatch={onDispatch}
    />
  );

    case "GAME_OVER":
      return (
        <PlaceholderPanel
          eyebrow="Fin de partie"
          title="Dossier classé"
          description="Toutes les cartes de la pyramide ont été révélées."
        />
      );

    default: {
      const exhaustiveCheck: never =
        state.phase;

      throw new Error(
        `Unhandled phase: ${exhaustiveCheck}`
      );
    }
  }
}