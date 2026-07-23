export type GameAction =

  | {

      type: "START_GAME";

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

      type: "NEXT_PLAYER";

    }

  | {

      type: "NEXT_CARD";

    }

  | {

      type: "END_GAME";

    };