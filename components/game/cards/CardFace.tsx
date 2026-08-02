
import Image from "next/image";

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

type CourtValue =
  | "Valet"
  | "Dame"
  | "Roi";

type FullArtKey =
  `${CourtValue}-${Carte["couleur"]}`;

const COURT_IMAGES: Record<
  CourtValue,
  string
> = {
  Valet:
    "/images/cards/court/valet-v5.png",

  Dame:
    "/images/cards/court/dame-v5.png",

  Roi:
    "/images/cards/court/roi-v5.png",
};

const FULL_ART_IMAGES: Partial<
  Record<
    FullArtKey,
    string
  >
> = {
  "Roi-♥":
    "/images/cards/full-art/roi-coeur.png",

  "Roi-♦":
    "/images/cards/full-art/roi-carreau.png",

  "Roi-♣":
    "/images/cards/full-art/roi-trefle.png",

  "Roi-♠":
    "/images/cards/full-art/roi-pique.png",

  "Dame-♥":
    "/images/cards/full-art/dame-coeur.png",

  "Dame-♦":
    "/images/cards/full-art/dame-carreau.png",

  "Dame-♣":
    "/images/cards/full-art/dame-trefle.png",

  "Dame-♠":
    "/images/cards/full-art/dame-pique.png",

  "Valet-♥":
    "/images/cards/full-art/valet-coeur.png",

  "Valet-♦":
    "/images/cards/full-art/valet-carreau.png",

  "Valet-♣":
    "/images/cards/full-art/valet-trefle.png",

  "Valet-♠":
    "/images/cards/full-art/valet-pique.png",
};

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

function isCourtCard(
  value: Valeur
): value is CourtValue {
  return (
    value === "Valet" ||
    value === "Dame" ||
    value === "Roi"
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

interface CourtFigureProps {
  value: CourtValue;
}

function CourtFigure({
  value,
}: CourtFigureProps) {
  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        inset-x-[10%]
        bottom-[5%]
        top-[10%]
        z-10
      "
    >
      <Image
        src={
          COURT_IMAGES[
            value
          ]
        }
        alt=""
        fill
        unoptimized
        sizes="280px"
        draggable={false}
        className="
          select-none
          object-contain
          object-center
          drop-shadow-[0_4px_3px_rgba(0,0,0,0.12)]
        "
      />
    </div>
  );
}

interface FullArtFigureProps {
  image: string;
}

function FullArtFigure({
  image,
}: FullArtFigureProps) {
  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        inset-0
        z-10
        overflow-hidden
        rounded-[inherit]
      "
    >
      <Image
        src={image}
        alt=""
        fill
        unoptimized
        sizes="280px"
        draggable={false}
        className="
          select-none
          object-cover
          object-center
          scale-[1.03]
        "
      />
    </div>
  );
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

  const courtValue =
    isCourtCard(
      card.valeur
    )
      ? card.valeur
      : null;

  const fullArtKey:
    | FullArtKey
    | null =
    courtValue
      ? `${courtValue}-${card.couleur}`
      : null;

  const fullArtImage =
    fullArtKey
      ? FULL_ART_IMAGES[
          fullArtKey
        ]
      : undefined;

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
      {!fullArtImage && (
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-white/95 via-[#FCFAF5] to-[#F2EEE5]" />
      )}

      {!fullArtImage && (
        <div className="pointer-events-none absolute inset-[3%] z-[1] rounded-[inherit] border border-black/[0.06]" />
      )}

      {fullArtImage ? (
        <FullArtFigure
          image={
            fullArtImage
          }
        />
      ) : courtValue ? (
        <CourtFigure
          value={
            courtValue
          }
        />
      ) : null}

      <div
        className={joinClasses(
          "absolute left-[8%] top-[5%] z-20 flex flex-col items-center font-black",
          fullArtImage
            ? joinClasses(
                CARD_VALUE_CLASSES[
                  size
                ],
                "scale-[0.72] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]"
              )
            : CARD_VALUE_CLASSES[
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

      {numericCard && (
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
      )}

      <div
        className={joinClasses(
          "absolute bottom-[5%] right-[8%] z-20 flex rotate-180 flex-col items-center font-black",
          fullArtImage
            ? joinClasses(
                CARD_VALUE_CLASSES[
                  size
                ],
                "scale-[0.72] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]"
              )
            : CARD_VALUE_CLASSES[
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