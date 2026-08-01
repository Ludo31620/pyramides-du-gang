import type {
  CSSProperties,
} from "react";

import type {
  Carte,
  Valeur,
} from "@/lib/deck";

import type {
  PlayingCardSize,
} from "./cardUtils";

import {
  CARD_CENTER_SUIT_CLASSES,
  CARD_CORNER_CLASSES,
  CARD_PIP_CLASSES,
  CARD_VALUE_CLASSES,
  getShortValue,
  getSuitColorClass,
  joinClasses,
} from "./cardUtils";

interface CardFaceProps {
  card: Carte;
  size?: PlayingCardSize;
  className?: string;
}

interface PipPosition {
  x: number;
  y: number;
  rotate?: boolean;
}

const TOP_LEFT: PipPosition = {
  x: 31,
  y: 20,
};

const TOP_CENTER: PipPosition = {
  x: 50,
  y: 20,
};

const TOP_RIGHT: PipPosition = {
  x: 69,
  y: 20,
};

const UPPER_LEFT: PipPosition = {
  x: 31,
  y: 36,
};

const UPPER_CENTER: PipPosition = {
  x: 50,
  y: 36,
};

const UPPER_RIGHT: PipPosition = {
  x: 69,
  y: 36,
};

const CENTER_LEFT: PipPosition = {
  x: 31,
  y: 50,
};

const CENTER: PipPosition = {
  x: 50,
  y: 50,
};

const CENTER_RIGHT: PipPosition = {
  x: 69,
  y: 50,
};

const LOWER_LEFT: PipPosition = {
  x: 31,
  y: 64,
  rotate: true,
};

const LOWER_CENTER: PipPosition = {
  x: 50,
  y: 64,
  rotate: true,
};

const LOWER_RIGHT: PipPosition = {
  x: 69,
  y: 64,
  rotate: true,
};

const BOTTOM_LEFT: PipPosition = {
  x: 31,
  y: 80,
  rotate: true,
};

const BOTTOM_CENTER: PipPosition = {
  x: 50,
  y: 80,
  rotate: true,
};

const BOTTOM_RIGHT: PipPosition = {
  x: 69,
  y: 80,
  rotate: true,
};

const PIP_LAYOUTS: Partial<
  Record<
    Valeur,
    PipPosition[]
  >
> = {
  As: [
    CENTER,
  ],

  "2": [
    TOP_CENTER,
    BOTTOM_CENTER,
  ],

  "3": [
    TOP_CENTER,
    CENTER,
    BOTTOM_CENTER,
  ],

  "4": [
    TOP_LEFT,
    TOP_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_RIGHT,
  ],

  "5": [
    TOP_LEFT,
    TOP_RIGHT,
    CENTER,
    BOTTOM_LEFT,
    BOTTOM_RIGHT,
  ],

  "6": [
    TOP_LEFT,
    TOP_RIGHT,
    CENTER_LEFT,
    CENTER_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_RIGHT,
  ],

  "7": [
    TOP_LEFT,
    TOP_RIGHT,
    UPPER_CENTER,
    CENTER_LEFT,
    CENTER_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_RIGHT,
  ],

  "8": [
    TOP_LEFT,
    TOP_RIGHT,
    UPPER_CENTER,
    CENTER_LEFT,
    CENTER_RIGHT,
    LOWER_CENTER,
    BOTTOM_LEFT,
    BOTTOM_RIGHT,
  ],

  "9": [
    TOP_LEFT,
    TOP_RIGHT,
    UPPER_LEFT,
    UPPER_RIGHT,
    CENTER,
    LOWER_LEFT,
    LOWER_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_RIGHT,
  ],

  "10": [
    {
      x: 31,
      y: 15,
    },
    {
      x: 69,
      y: 15,
    },
    {
      x: 41,
      y: 32,
    },
    {
      x: 59,
      y: 32,
    },
    CENTER_LEFT,
    CENTER_RIGHT,
    {
      x: 41,
      y: 68,
      rotate: true,
    },
    {
      x: 59,
      y: 68,
      rotate: true,
    },
    {
      x: 31,
      y: 85,
      rotate: true,
    },
    {
      x: 69,
      y: 85,
      rotate: true,
    },
  ],
};

function isNumericCard(
  value: Valeur
): boolean {
  return (
    value === "As" ||
    value === "2" ||
    value === "3" ||
    value === "4" ||
    value === "5" ||
    value === "6" ||
    value === "7" ||
    value === "8" ||
    value === "9" ||
    value === "10"
  );
}

function getPipStyle(
  position: PipPosition
): CSSProperties {
  return {
    left:
      `${position.x}%`,

    top:
      `${position.y}%`,

    transform:
      position.rotate
        ? "translate(-50%, -50%) rotate(180deg)"
        : "translate(-50%, -50%)",
  };
}

export default function CardFace({
  card,
  size = "md",
  className,
}: CardFaceProps) {
  const shortValue =
    getShortValue(
      card.valeur
    );

  const colorClass =
    getSuitColorClass(
      card.couleur
    );

  const pipLayout =
    PIP_LAYOUTS[
      card.valeur
    ] ?? [];

  const numericCard =
    isNumericCard(
      card.valeur
    );

  return (
    <div
      aria-label={
        `${card.valeur} ${card.couleur}`
      }
      className={joinClasses(
        "relative h-full w-full overflow-hidden border border-[#D6C08D] bg-[#FCFAF5]",
        "shadow-[inset_0_0_18px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.18)]",
        CARD_CORNER_CLASSES[
          size
        ],
        colorClass,
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-white/90 via-[#FCFAF5] to-[#EEE9DE]" />

      <div className="pointer-events-none absolute inset-[3%] z-0 rounded-[inherit] border border-black/[0.06]" />

      <div
        className={joinClasses(
          "absolute left-[9%] top-[6%] z-20 flex flex-col items-center font-black",
          CARD_VALUE_CLASSES[
            size
          ]
        )}
      >
        <span>
          {shortValue}
        </span>

        <span className="mt-[1px] scale-[0.62] leading-none">
          {card.couleur}
        </span>
      </div>

      {numericCard ? (
        <div className="absolute inset-[10%] z-10">
          {pipLayout.map(
            (
              position,
              index
            ) => {
              const isAce =
                card.valeur ===
                "As";

              return (
                <span
                  key={`${card.valeur}-${index}`}
                  aria-hidden="true"
                  style={
                    getPipStyle(
                      position
                    )
                  }
                  className={joinClasses(
                    "absolute flex items-center justify-center font-black leading-none",
                    isAce
                      ? CARD_CENTER_SUIT_CLASSES[
                          size
                        ]
                      : CARD_PIP_CLASSES[
                          size
                        ]
                  )}
                >
                  {
                    card.couleur
                  }
                </span>
              );
            }
          )}
        </div>
      ) : (
        <div
          className={joinClasses(
            "absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center",
            CARD_CENTER_SUIT_CLASSES[
              size
            ]
          )}
        >
          <span className="font-black">
            {shortValue}
          </span>

          <span className="mt-1 font-black">
            {card.couleur}
          </span>
        </div>
      )}

      <div
        className={joinClasses(
          "absolute bottom-[6%] right-[9%] z-20 flex rotate-180 flex-col items-center font-black",
          CARD_VALUE_CLASSES[
            size
          ]
        )}
      >
        <span>
          {shortValue}
        </span>

        <span className="mt-[1px] scale-[0.62] leading-none">
          {card.couleur}
        </span>
      </div>

      <div className="pointer-events-none absolute inset-x-[12%] top-0 z-30 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
    </div>
  );
}