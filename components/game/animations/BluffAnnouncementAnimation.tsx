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

interface BluffAnnouncementAnimationProps {
  giver: number;
  target: number;
  drinks: number;
  animationKey: number;
  onComplete: () => void;
}

type AnimationStage =
  | "ARRIVAL"
  | "ATTACK"
  | "DRINKS"
  | "LEAVING";

const HIDDEN_CARD: Carte = {
  valeur: "As",
  couleur: "♠",
  revelee: false,
};

export default function BluffAnnouncementAnimation({
  giver,
  target,
  drinks,
  animationKey,
  onComplete,
}: BluffAnnouncementAnimationProps) {
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
      setStage("ATTACK");

      if (
        typeof navigator !==
          "undefined" &&
        "vibrate" in navigator
      ) {
        navigator.vibrate?.(
          [30, 25, 45]
        );
      }
    }, 550);

    addTimer(() => {
      setStage("DRINKS");
    }, 1150);

    addTimer(() => {
      setStage("LEAVING");
    }, 2250);

    addTimer(() => {
      if (
        completedRef.current
      ) {
        return;
      }

      completedRef.current =
        true;

      onCompleteRef.current();
    }, 2550);

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

  const showAttack =
    stage === "ATTACK" ||
    stage === "DRINKS" ||
    stage === "LEAVING";

  const showDrinks =
    stage === "DRINKS" ||
    stage === "LEAVING";

  const leaving =
    stage === "LEAVING";

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
        `Le joueur ${giver + 1} attaque ` +
        `le joueur ${target + 1} avec ` +
        `${drinks} ${drinkLabel.toLowerCase()}.`
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
          leaving
            ? 0
            : 1,
      }}
      exit={{
        opacity: 0,
      }}
      transition={{
        duration:
          leaving
            ? 0.28
            : 0.18,
        ease: "easeOut",
      }}
    >
      <motion.div
        aria-hidden="true"
        className="
          absolute
          h-[440px]
          w-[440px]
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
            leaving
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

      {stage === "ATTACK" && (
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
              0.55,
              0,
            ],
          }}
          transition={{
            duration: 0.24,
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
              leaving
                ? 0
                : 1,
            y: 0,
          }}
          transition={{
            duration: 0.35,
            delay: 0.1,
          }}
        >
          Annonce de bluff
        </motion.p>

        <motion.div
          className="
            relative
            mt-7
            flex
            h-[250px]
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
              leaving
                ? 0
                : 1,

            y:
              leaving
                ? -50
                : 0,

            scale:
              stage === "ATTACK"
                ? [
                    1,
                    1.1,
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
                leaving
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
                stage === "ATTACK"
                  ? 0.3
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
              scale-[1.2]
              sm:scale-[1.35]
            "
            animate={{
              filter:
                showAttack
                  ? "drop-shadow(0 0 26px rgba(255, 209, 102, 0.65))"
                  : "drop-shadow(0 0 0 rgba(255, 209, 102, 0))",
            }}
            transition={{
              duration: 0.3,
            }}
          >
            <PlayingCard
              card={HIDDEN_CARD}
              faceUp={false}
              size="lg"
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="
            mt-3
            flex
            min-h-32
            flex-col
            items-center
            justify-center
          "
          initial={{
            opacity: 0,
            y: 24,
            scale: 0.82,
          }}
          animate={{
            opacity:
              showAttack &&
              !leaving
                ? 1
                : 0,

            y:
              showAttack
                ? 0
                : 24,

            scale:
              showAttack
                ? [
                    0.82,
                    1.08,
                    1,
                  ]
                : 0.82,
          }}
          transition={{
            duration: 0.46,

            ease: [
              0.34,
              1.56,
              0.64,
              1,
            ],
          }}
        >
          <p
            className="
              text-2xl
              font-black
              text-white
              sm:text-3xl
            "
          >
            Joueur {giver + 1}
          </p>

          <motion.p
            className="
              my-2
              text-sm
              font-black
              uppercase
              tracking-[0.3em]
              text-zinc-400
            "
            initial={{
              opacity: 0,
              scale: 0.6,
            }}
            animate={{
              opacity:
                showAttack
                  ? 1
                  : 0,
              scale:
                showAttack
                  ? 1
                  : 0.6,
            }}
            transition={{
              delay: 0.12,
              duration: 0.3,
              ease: "easeOut",
            }}
          >
            attaque
          </motion.p>

          <p
            className="
              text-2xl
              font-black
              text-yellow-400
              sm:text-3xl
            "
          >
            Joueur {target + 1}
          </p>
        </motion.div>

        <motion.div
          className="
            mt-5
            flex
            min-h-20
            items-center
            justify-center
          "
          initial={{
            opacity: 0,
            y: 22,
            scale: 0.5,
          }}
          animate={{
            opacity:
              showDrinks &&
              !leaving
                ? 1
                : 0,

            y:
              showDrinks
                ? 0
                : 22,

            scale:
              showDrinks
                ? [
                    0.5,
                    1.3,
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
          <div
            className="
              inline-flex
              items-baseline
              gap-3
              rounded-2xl
              border
              border-yellow-400/25
              bg-yellow-400/10
              px-7
              py-4
              shadow-[0_0_35px_rgba(250,204,21,0.12)]
            "
          >
            <span
              className="
                text-5xl
                font-black
                leading-none
                text-yellow-400
                drop-shadow-[0_0_20px_rgba(250,204,21,0.45)]
              "
            >
              {drinks}
            </span>

            <span
              className="
                text-sm
                font-black
                uppercase
                tracking-[0.2em]
                text-white
              "
            >
              {drinkLabel}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}