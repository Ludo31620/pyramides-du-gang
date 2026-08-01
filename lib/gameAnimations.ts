import type {
  Carte,
} from "@/lib/deck";

import type {
  BluffOutcome,
} from "@/lib/gameEngine/types";

export type GameAnimationType =
  | "REVEAL_CARD"
  | "BLUFF_ANNOUNCEMENT"
  | "BLUFF_RESULT";

interface BaseGameAnimation {
  /**
   * Identifiant unique de l’animation.
   *
   * Il permet à React et Framer Motion
   * de distinguer deux animations
   * successives de même type.
   */
  animationKey: number;

  /**
   * Type discriminant utilisé par
   * le GameProvider.
   */
  type: GameAnimationType;
}

export interface RevealCardAnimation
  extends BaseGameAnimation {
  type: "REVEAL_CARD";

  card: Carte;
  drinks: number;
}

export interface BluffAnnouncementAnimationPayload
  extends BaseGameAnimation {
  type: "BLUFF_ANNOUNCEMENT";

  giver: number;
  target: number;
  drinks: number;
}

export interface BluffResultAnimationPayload
  extends BaseGameAnimation {
  type: "BLUFF_RESULT";

  giver: number;
  target: number;
  drinks: number;

  outcome: BluffOutcome;

  punishedPlayer: number;

  /**
   * Carte révélée lorsque la cible
   * conteste et que le donneur disait vrai.
   *
   * Elle reste null pour BELIEVED
   * ou pour un bluff découvert.
   */
  revealedCard:
    | Carte
    | null;
}

export type GameAnimation =
  | RevealCardAnimation
  | BluffAnnouncementAnimationPayload
  | BluffResultAnimationPayload;

export type BluffResponseType =
  | "BELIEVE"
  | "DOUBT";

export interface RequestRevealAnimationPayload {
  code: string;
}

export interface RequestBluffAnnouncementPayload {
  code: string;
  target: number;
}

export interface RequestBluffResultPayload {
  code: string;
  response: BluffResponseType;
}

export type GameAnimationRequestResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

export function isGameAnimation(
  value: unknown
): value is GameAnimation {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const animation =
    value as Record<
      string,
      unknown
    >;

  if (
    !Number.isFinite(
      animation.animationKey
    )
  ) {
    return false;
  }

  switch (animation.type) {
    case "REVEAL_CARD":
      return (
        isCard(animation.card) &&
        Number.isFinite(
          animation.drinks
        )
      );

    case "BLUFF_ANNOUNCEMENT":
      return (
        Number.isInteger(
          animation.giver
        ) &&
        Number.isInteger(
          animation.target
        ) &&
        Number.isFinite(
          animation.drinks
        )
      );

    case "BLUFF_RESULT":
      return (
        Number.isInteger(
          animation.giver
        ) &&
        Number.isInteger(
          animation.target
        ) &&
        Number.isFinite(
          animation.drinks
        ) &&
        Number.isInteger(
          animation.punishedPlayer
        ) &&
        isBluffOutcome(
          animation.outcome
        ) &&
        (
          animation.revealedCard ===
            null ||
          isCard(
            animation.revealedCard
          )
        )
      );

    default:
      return false;
  }
}

function isCard(
  value: unknown
): value is Carte {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const card =
    value as Record<
      string,
      unknown
    >;

  return (
    typeof card.valeur ===
      "string" &&
    typeof card.couleur ===
      "string" &&
    typeof card.revelee ===
      "boolean"
  );
}

function isBluffOutcome(
  value: unknown
): value is BluffOutcome {
  return (
    value === "BELIEVED" ||
    value === "TRUTH" ||
    value === "BLUFF"
  );
}