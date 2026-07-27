"use client";

import type {
  ReactNode,
} from "react";

import {
  motion,
} from "framer-motion";

import {
  joinClasses,
} from "./cardUtils";

interface CardFlipProps {
  faceUp: boolean;
  front: ReactNode;
  back: ReactNode;
  className?: string;
}

export default function CardFlip({
  faceUp,
  front,
  back,
  className,
}: CardFlipProps) {
  return (
    <motion.div
      className={joinClasses(
        "relative h-full w-full",
        className
      )}
      initial={false}
      animate={{
        rotateY: faceUp ? 180 : 0,
      }}
      transition={{
        duration: 0.42,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility:
            "hidden",
        }}
      >
        {back}
      </div>

      <div
        className="absolute inset-0"
        style={{
          transform: "rotateY(180deg)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility:
            "hidden",
        }}
      >
        {front}
      </div>
    </motion.div>
  );
}