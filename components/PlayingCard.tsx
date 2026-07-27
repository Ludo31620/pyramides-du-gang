"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import type { Carte } from "@/lib/deck";

export type PlayingCardSize =
  | "small"
  | "medium"
  | "large"
  | "cinematic";

export type PlayingCardVariant =
  | "normal"
  | "glowing"
  | "gold"
  | "danger";

type PlayingCardProps = {
  carte: Carte;
  onClick?: () => void;
  faceVisible?: boolean;
  size?: PlayingCardSize;
  variant?: PlayingCardVariant;
};

const DUREE_EFFET_REVELATION =
  850;

const SIZE_CLASSES: Record<
  PlayingCardSize,
  {
    container: string;
    cornerValue: string;
    cornerSuit: string;
    centerSuit: string;
    backIcon: string;
  }
> = {
  small: {
    container: "h-24 w-16",
    cornerValue: "text-sm",
    cornerSuit: "text-base",
    centerSuit: "text-3xl",
    backIcon: "text-3xl",
  },

  medium: {
    container: "h-36 w-24",
    cornerValue: "text-xl",
    cornerSuit: "text-2xl",
    centerSuit: "text-5xl",
    backIcon: "text-4xl",
  },

  large: {
    container: "h-52 w-36",
    cornerValue: "text-2xl",
    cornerSuit: "text-3xl",
    centerSuit: "text-7xl",
    backIcon: "text-5xl",
  },

  cinematic: {
    container:
      "h-[270px] w-[190px]",
    cornerValue: "text-3xl",
    cornerSuit: "text-4xl",
    centerSuit: "text-8xl",
    backIcon: "text-7xl",
  },
};

const VARIANT_CLASSES: Record<
  PlayingCardVariant,
  {
    container: string;
    border: string;
    glow: string;
  }
> = {
  normal: {
    container: "",
    border: "",
    glow: "",
  },

  glowing: {
    container:
      "drop-shadow-[0_0_20px_rgba(255,209,102,0.55)]",
    border:
      "ring-2 ring-[#FFD166]/80",
    glow:
      "bg-[#FFD166]/25",
  },

  gold: {
    container:
      "drop-shadow-[0_0_26px_rgba(255,209,102,0.7)]",
    border:
      "ring-2 ring-[#FFD166]",
    glow:
      "bg-[#FFD166]/35",
  },

  danger: {
    container:
      "drop-shadow-[0_0_26px_rgba(239,68,68,0.65)]",
    border:
      "ring-2 ring-red-500",
    glow:
      "bg-red-500/30",
  },
};

export default function PlayingCard({
  carte,
  onClick,
  faceVisible,
  size = "medium",
  variant = "normal",
}: PlayingCardProps) {
  const estRouge =
    carte.couleur === "♥" ||
    carte.couleur === "♦";

  const estVisible =
    faceVisible ?? carte.revelee;

  const estCliquable =
    Boolean(onClick) && !estVisible;

  const sizeClasses =
    SIZE_CLASSES[size];

  const variantClasses =
    VARIANT_CLASSES[variant];

  const visibilitePrecedente =
    useRef(estVisible);

  const [
    animationRevelation,
    setAnimationRevelation,
  ] = useState(false);

  useEffect(() => {
    const vientEtreRevelee =
      !visibilitePrecedente.current &&
      estVisible;

    visibilitePrecedente.current =
      estVisible;

    if (!vientEtreRevelee) {
      return;
    }

    setAnimationRevelation(true);

    const timer =
      window.setTimeout(() => {
        setAnimationRevelation(false);
      }, DUREE_EFFET_REVELATION);

    return () => {
      window.clearTimeout(timer);
    };
  }, [estVisible]);

  return (
    <div
      className={`
        relative
        shrink-0
        transition-transform
        duration-500
        ease-out
        motion-reduce:transition-none
        ${sizeClasses.container}
        ${variantClasses.container}
        ${
          animationRevelation
            ? "-translate-y-1 scale-110"
            : "translate-y-0 scale-100"
        }
      `}
      style={{
        perspective: "1000px",
      }}
    >
      {(animationRevelation ||
        variant !== "normal") && (
        <div
          aria-hidden="true"
          className={`
            pointer-events-none
            absolute
            -inset-3
            rounded-3xl
            blur-xl
            ${
              animationRevelation
                ? "animate-pulse bg-[#FFD166]/30"
                : variantClasses.glow
            }
          `}
        />
      )}

      {animationRevelation && (
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -inset-1
            rounded-2xl
            border-2
            border-[#FFD166]/80
            shadow-[0_0_30px_rgba(255,209,102,0.65)]
          "
        />
      )}

      <button
        type="button"
        onClick={
          estCliquable
            ? onClick
            : undefined
        }
        disabled={!estCliquable}
        aria-label={
          estVisible
            ? `${carte.valeur} de ${carte.couleur}`
            : "Carte face cachée"
        }
        className={`
          relative
          h-full
          w-full
          rounded-2xl
          transition-transform
          duration-700
          ease-[cubic-bezier(0.22,1,0.36,1)]
          motion-reduce:transition-none
          ${variantClasses.border}
          ${
            estVisible
              ? "cursor-default"
              : estCliquable
                ? "cursor-pointer active:scale-95"
                : "cursor-default"
          }
        `}
        style={{
          transformStyle:
            "preserve-3d",
          transform: estVisible
            ? "rotateY(180deg)"
            : "rotateY(0deg)",
        }}
      >
        {/* Dos de carte */}
        <div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            overflow-hidden
            rounded-2xl
            border-2
            border-white/70
            bg-gradient-to-br
            from-blue-950
            via-blue-700
            to-blue-500
            shadow-xl
          "
          style={{
            backfaceVisibility:
              "hidden",
            WebkitBackfaceVisibility:
              "hidden",
          }}
        >
          <div
            aria-hidden="true"
            className="
              absolute
              inset-2
              rounded-xl
              border
              border-white/30
            "
          />

          <div
            aria-hidden="true"
            className="
              absolute
              inset-4
              rotate-45
              rounded-lg
              border
              border-white/20
            "
          />

          <div
            aria-hidden="true"
            className="
              absolute
              inset-[22%]
              rounded-full
              border
              border-white/15
            "
          />

          <span
            className={`
              relative
              drop-shadow-lg
              ${sizeClasses.backIcon}
            `}
          >
            🂠
          </span>
        </div>

        {/* Face de carte */}
        <div
          className="
            absolute
            inset-0
            overflow-hidden
            rounded-2xl
            border
            border-zinc-200
            bg-white
            shadow-xl
          "
          style={{
            backfaceVisibility:
              "hidden",
            WebkitBackfaceVisibility:
              "hidden",
            transform:
              "rotateY(180deg)",
          }}
        >
          <div
            aria-hidden="true"
            className={`
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-br
              from-white/80
              via-transparent
              to-[#FFD166]/20
              transition-opacity
              duration-500
              ${
                animationRevelation
                  ? "opacity-100"
                  : "opacity-0"
              }
            `}
          />

          <div
            className={`
              absolute
              left-[10%]
              top-[7%]
              font-bold
              leading-none
              ${
                estRouge
                  ? "text-red-600"
                  : "text-black"
              }
            `}
          >
            <p
              className={
                sizeClasses.cornerValue
              }
            >
              {carte.valeur}
            </p>

            <p
              className={`
                mt-1
                ${sizeClasses.cornerSuit}
              `}
            >
              {carte.couleur}
            </p>
          </div>

          <div
            className={`
              flex
              h-full
              items-center
              justify-center
              font-bold
              ${
                estRouge
                  ? "text-red-600"
                  : "text-black"
              }
              ${sizeClasses.centerSuit}
            `}
          >
            {carte.couleur}
          </div>

          <div
            className={`
              absolute
              bottom-[7%]
              right-[10%]
              rotate-180
              font-bold
              leading-none
              ${
                estRouge
                  ? "text-red-600"
                  : "text-black"
              }
            `}
          >
            <p
              className={
                sizeClasses.cornerValue
              }
            >
              {carte.valeur}
            </p>

            <p
              className={`
                mt-1
                ${sizeClasses.cornerSuit}
              `}
            >
              {carte.couleur}
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}