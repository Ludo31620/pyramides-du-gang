"use client";

import type {
  KeyboardEvent,
} from "react";

import {
  motion,
} from "framer-motion";

import type {
  Carte,
} from "@/lib/deck";

import CardBack from "./CardBack";
import CardFace from "./CardFace";
import CardFlip from "./CardFlip";

import type {
  PlayingCardSize,
} from "./cardUtils";

import {
  CARD_CORNER_CLASSES,
  CARD_SIZE_CLASSES,
  getCardLabel,
  joinClasses,
} from "./cardUtils";

interface PlayingCardProps {
  card: Carte;
  faceUp?: boolean;
  size?: PlayingCardSize;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function PlayingCard({
  card,
  faceUp = false,
  size = "md",
  selected = false,
  disabled = false,
  onClick,
  className,
}: PlayingCardProps) {
  const interactive =
    Boolean(onClick) && !disabled;

  function activate(): void {
    if (!interactive || !onClick) {
      return;
    }

    onClick();
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLDivElement>
  ): void {
    if (!interactive) {
      return;
    }

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      activate();
    }
  }

  return (
    <motion.div
      role={
        interactive
          ? "button"
          : undefined
      }
      tabIndex={
        interactive ? 0 : undefined
      }
      aria-disabled={
        disabled || undefined
      }
      aria-label={
        faceUp
          ? getCardLabel(card)
          : "Carte cachée"
      }
      onClick={activate}
      onKeyDown={handleKeyDown}
      whileTap={
        interactive
          ? {
              scale: 0.96,
            }
          : undefined
      }
      initial={{
        opacity: 0,
        scale: 0.92,
      }}
      animate={{
        opacity: disabled ? 0.45 : 1,
        scale: 1,
        y: selected ? -4 : 0,
      }}
      transition={{
        duration: 0.22,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={joinClasses(
        "relative aspect-[63/88] shrink-0 select-none outline-none",
        CARD_SIZE_CLASSES[size],
        CARD_CORNER_CLASSES[size],
        interactive &&
          "cursor-pointer touch-manipulation",
        selected &&
          "shadow-[0_0_0_2px_#FFD166,0_0_30px_rgba(255,209,102,0.35)]",
        interactive &&
          "focus-visible:ring-2 focus-visible:ring-[#FFD166] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0B0E13]",
        className
      )}
    >
      <CardFlip
        faceUp={faceUp}
        front={
          <CardFace
            card={card}
            size={size}
          />
        }
        back={
          <CardBack
            size={size}
          />
        }
      />
    </motion.div>
  );
}