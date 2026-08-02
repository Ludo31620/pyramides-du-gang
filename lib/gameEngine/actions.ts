import type {
  DistributionAnswer,
} from "./types";

export type GameAction =
  | {
      type: "START_GAME";
      playerCount: number;
    }
  | {
      type: "START_MEMORY";
    }
  | {
      type: "TICK_MEMORY";
    }
  | {
      type: "USE_MEMORY_JOKER";
      player: number;
    }
  | {
      type: "HIDE_MEMORY_JOKER";
      player: number;
    }
  | {
      type: "ANSWER_DISTRIBUTION";
      answer: DistributionAnswer;
    }
  | {
      type: "GIVE_DISTRIBUTION_DRINK";
      target: number;
    }
  | {
      type: "CONTINUE_DISTRIBUTION";
    }
  | {
      type: "REVEAL_CARD";
    }
  | {
      type: "PASS";
    }
  | {
      type: "GIVE";
      target: number;
    }
  | {
      type: "BELIEVE";
    }
  | {
      type: "DOUBT";
    }
  | {
      type: "CONTINUE_AFTER_BLUFF";
    }
  | {
      type: "NEXT_PLAYER";
    }
  | {
      type: "NEXT_CARD";
    }
  | {
      type: "END_GAME";
    };
