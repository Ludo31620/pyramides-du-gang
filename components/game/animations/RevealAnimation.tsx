"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

import PlayingCard from "@/components/game/cards/PlayingCard";

import type {
  Carte,
} from "@/lib/deck";

interface RevealAnimationProps {
  card: Carte;
  drinks: number;
  animationKey: number;
  onComplete: () => void;
}

type AnimationStage =
  | "ARRIVAL"
  | "FLIP"
  | "DRINKS"
  | "LEAVING";

export default function RevealAnimation({
  card,
  drinks,
  animationKey,
  onComplete,
}: RevealAnimationProps) {
  const [
    stage,
    setStage,
  ] = useState<AnimationStage>(
    "ARRIVAL"
  );

  const completedRef =
    useRef(false);

  const onCompleteRef =
    useRef(onComplete);

  const timersRef =
    useRef<number[]>([]);

  useEffect(() => {
    onCompleteRef.current =
      onComplete;
  }, [onComplete]);

  useEffect(() => {
    completedRef.current =
      false;

    setStage("ARRIVAL");

    function addTimer(
      callback: () => void,
      delay: number
    ): void {
      const timer =
        window.setTimeout(
          callback,
          delay
        );

      timersRef.current.push(
        timer
      );
    }

    addTimer(() => {
      setStage("FLIP");

      if (
        typeof navigator !==
          "undefined" &&
        "vibrate" in navigator
      ) {
        navigator.vibrate?.(
          [35, 25, 55]
        );
      }
    }, 600);

    addTimer(() => {
      setStage("DRINKS");
    }, 1250);

    addTimer(() => {
      setStage("LEAVING");
    }, 2350);

    addTimer(() => {
      if (
        completedRef.current
      ) {
        return;
      }

      completedRef.current =
        true;

      onCompleteRef.current();
    }, 2700);

    return () => {
      timersRef.current.forEach(
        (timer) => {
          window.clearTimeout(
            timer
          );
        }
      );

      timersRef.current = [];
    };
  }, [animationKey]);

  const faceUp =
    stage === "FLIP" ||
    stage === "DRINKS" ||
    stage === "LEAVING";

  const showImpact =
    stage === "FLIP";

  const showDrinks =
    stage === "DRINKS";

  const drinkLabel =
    drinks === 1
      ? "GORGÉE"
      : "GORGÉES";

  return (
    <motion.div
      key={animationKey}
      role="dialog"
      aria-modal="true"
      aria-label={
        `Carte révélée : ` +
        `${card.valeur} ${card.couleur}, ` +
        `${drinks} ${drinkLabel.toLowerCase()}`
      }
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        overflow-hidden
        bg-black/90
        px-5
        py-8
        backdrop-blur-md
      "
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity:
          stage === "LEAVING"
            ? 0
            : 1,
      }}
      exit={{
        opacity: 0,
      }}
      transition={{
        duration:
          stage === "LEAVING"
            ? 0.3
            : 0.2,
        ease: "easeOut",
      }}
    >
      <motion.div
        aria-hidden="true"
        className="
          absolute
          h-[430px]
          w-[430px]
          rounded-full
          bg-yellow-400/10
          blur-3xl
        "
        initial={{
          opacity: 0,
          scale: 0.4,
        }}
        animate={{
          opacity:
            stage === "LEAVING"
              ? 0
              : 1,
          scale:
            showDrinks
              ? 1.2
              : 1,
        }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
      />

      {showImpact && (
        <motion.div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            bg-white
          "
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: [
              0,
              0.65,
              0,
            ],
          }}
          transition={{
            duration: 0.25,
            ease: "easeOut",
          }}
        />
      )}

      <div
        className="
          relative
          flex
          w-full
          max-w-sm
          flex-col
          items-center
          justify-center
          text-center
        "
      >
        <motion.p
          className="
            mb-7
            text-xs
            font-black
            uppercase
            tracking-[0.35em]
            text-yellow-400
            sm:text-sm
          "
          initial={{
            opacity: 0,
            y: -15,
          }}
          animate={{
            opacity:
              stage === "LEAVING"
                ? 0
                : 1,
            y: 0,
          }}
          transition={{
            duration: 0.35,
            delay: 0.1,
          }}
        >
          Carte révélée
        </motion.p>

        <motion.div
          className="
            relative
            flex
            h-[300px]
            w-full
            items-center
            justify-center
          "
          initial={{
            opacity: 0,
            y: 180,
            scale: 0.4,
            rotateZ: -14,
          }}
          animate={{
            opacity:
              stage === "LEAVING"
                ? 0
                : 1,

            y:
              stage === "LEAVING"
                ? -60
                : 0,

            scale:
              showImpact
                ? [
                    1,
                    1.12,
                    1,
                  ]
                : 1,

            rotateZ: 0,
          }}
          transition={{
            opacity: {
              duration: 0.3,
            },

            y: {
              duration:
                stage ===
                "LEAVING"
                  ? 0.3
                  : 0.6,

              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            },

            scale: {
              duration:
                showImpact
                  ? 0.32
                  : 0.6,

              ease: "easeOut",
            },

            rotateZ: {
              duration: 0.6,

              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            },
          }}
        >
          <motion.div
            className="
              origin-center
              scale-[1.35]
              sm:scale-[1.55]
            "
            animate={{
              filter:
                showImpact ||
                showDrinks
                  ? "drop-shadow(0 0 28px rgba(255, 209, 102, 0.65))"
                  : "drop-shadow(0 0 0 rgba(255, 209, 102, 0))",
            }}
            transition={{
              duration: 0.3,
            }}
          >
            <PlayingCard
              card={card}
              faceUp={faceUp}
              size="lg"
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="
            mt-7
            flex
            min-h-24
            flex-col
            items-center
            justify-center
          "
          initial={{
            opacity: 0,
            y: 25,
            scale: 0.5,
          }}
          animate={{
            opacity:
              showDrinks
                ? 1
                : 0,

            y:
              showDrinks
                ? 0
                : 25,

            scale:
              showDrinks
                ? [
                    0.5,
                    1.28,
                    1,
                  ]
                : 0.5,
          }}
          transition={{
            duration: 0.48,

            ease: [
              0.34,
              1.56,
              0.64,
              1,
            ],
          }}
        >
          <span
            className="
              text-5xl
              font-black
              leading-none
              text-yellow-400
              drop-shadow-[0_0_22px_rgba(250,204,21,0.45)]
              sm:text-6xl
            "
          >
            {drinks}
          </span>

          <span
            className="
              mt-2
              text-xl
              font-black
              uppercase
              tracking-[0.22em]
              text-white
              sm:text-2xl
            "
          >
            {drinkLabel}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}