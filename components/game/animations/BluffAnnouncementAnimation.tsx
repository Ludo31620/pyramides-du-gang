"use client";

import {
  getPlayerName,
} from "@/lib/gameEngine/getPlayerName";

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

  playerNames: string[];

  drinks: number;
  animationKey: number;
  onComplete: () => void;
}

type AnimationStage =
  | "ARRIVAL"
  | "PLAYER"
  | "CLAIM"
  | "CARDS"
  | "LEAVING";

const HIDDEN_CARD: Carte = {
  valeur: "As",
  couleur: "♠",
  revelee: false,
};

export default function BluffAnnouncementAnimation({
  giver,
  target,
  playerNames,
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
  }, [
    onComplete,
  ]);

  useEffect(() => {
    completedRef.current =
      false;

    setStage(
      "ARRIVAL"
    );

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
      setStage(
        "PLAYER"
      );

      if (
        typeof navigator !==
          "undefined" &&
        "vibrate" in navigator
      ) {
        navigator.vibrate?.(
          35
        );
      }
    }, 400);

    addTimer(() => {
      setStage(
        "CLAIM"
      );
    }, 850);

    addTimer(() => {
      setStage(
        "CARDS"
      );

      if (
        typeof navigator !==
          "undefined" &&
        "vibrate" in navigator
      ) {
        navigator.vibrate?.(
          [
            25,
            30,
            45,
          ]
        );
      }
    }, 1350);

    addTimer(() => {
      setStage(
        "LEAVING"
      );
    }, 2400);

    addTimer(() => {
      if (
        completedRef.current
      ) 
      


      {
        
        return;
      }

      completedRef.current =
        true;

      onCompleteRef.current();
    }, 2750);

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
  }, [
    animationKey,
  ]);

const giverName =
  getPlayerName(
    playerNames,
    giver
  );

const targetName =
  getPlayerName(
    playerNames,
    target
  );

  const showPlayer =
    stage === "PLAYER" ||
    stage === "CLAIM" ||
    stage === "CARDS" ||
    stage === "LEAVING";

  const showClaim =
    stage === "CLAIM" ||
    stage === "CARDS" ||
    stage === "LEAVING";

  const showCards =
    stage === "CARDS" ||
    stage === "LEAVING";

  const leaving =
    stage === "LEAVING";

  return (
    <motion.div
      key={
        animationKey
      }
      role="dialog"
      aria-modal="true"
      aria-label={
      `${giverName} affirme à ${targetName}
posséder une carte de la même valeur.
${drinks} gorgée${drinks > 1 ? "s" : ""}
sont en jeu.`
      }
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        overflow-hidden
        bg-black/95
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
            ? 0.32
            : 0.2,

        ease:
          "easeOut",
      }}
    >
      <motion.div
        aria-hidden="true"
        className="
          absolute
          h-[520px]
          w-[520px]
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
              : showClaim
                ? 1
                : 0.55,

          scale:
            showCards
              ? 1.18
              : 1,
        }}
        transition={{
          duration: 0.7,
          ease:
            "easeOut",
        }}
      />

      {stage === "CARDS" && (
        <motion.div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            bg-yellow-100
          "
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: [
              0,
              0.3,
              0,
            ],
          }}
          transition={{
            duration: 0.28,
            ease:
              "easeOut",
          }}
        />
      )}

      <div
        className="
          relative
          flex
          w-full
          max-w-lg
          flex-col
          items-center
          justify-center
          text-center
        "
      >
        <motion.div
          aria-hidden="true"
          className="
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-full
            border
            border-yellow-400/25
            bg-yellow-400/10
            text-5xl
            shadow-[0_0_40px_rgba(250,204,21,0.18)]
          "
          initial={{
            opacity: 0,
            scale: 0.3,
            rotate: -25,
          }}
          animate={{
            opacity:
              leaving
                ? 0
                : 1,

            scale:
              showPlayer
                ? 1
                : [
                    0.3,
                    1.18,
                    1,
                  ],

            rotate:
              showPlayer
                ? 0
                : [
                    -25,
                    8,
                    0,
                  ],
          }}
          transition={{
            duration: 0.55,

            ease: [
              0.34,
              1.56,
              0.64,
              1,
            ],
          }}
        >
          🎭
        </motion.div>

        <motion.p
          className="
            mt-7
            text-sm
            font-black
            uppercase
            tracking-[0.32em]
            text-zinc-500
          "
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity:
              showPlayer &&
              !leaving
                ? 1
                : 0,

            y:
              showPlayer
                ? 0
                : 12,
          }}
          transition={{
            duration: 0.3,
            ease:
              "easeOut",
          }}
        >
          Joueur
        </motion.p>

        <motion.h2
          className="
            mt-1
            text-5xl
            font-black
            leading-none
            text-white
            sm:text-6xl
          "
          initial={{
            opacity: 0,
            y: 28,
            scale: 0.75,
          }}
          animate={{
            opacity:
              showPlayer &&
              !leaving
                ? 1
                : 0,

            y:
              showPlayer
                ? 0
                : 28,

            scale:
              showPlayer
                ? [
                    0.75,
                    1.1,
                    1,
                  ]
                : 0.75,
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
          {giverName}
        </motion.h2>

        <motion.div
          className="
            mt-7
            flex
            min-h-32
            flex-col
            items-center
            justify-center
          "
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity:
              showClaim &&
              !leaving
                ? 1
                : 0,

            y:
              showClaim
                ? 0
                : 30,
          }}
          transition={{
            duration: 0.45,

            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
        >
          <motion.p
            className="
              text-sm
              font-black
              uppercase
              tracking-[0.4em]
              text-yellow-400
              sm:text-base
            "
            initial={{
              opacity: 0,
              scale: 0.7,
            }}
            animate={{
              opacity:
                showClaim
                  ? 1
                  : 0,

              scale:
                showClaim
                  ? 1
                  : 0.7,
            }}
            transition={{
              duration: 0.3,
            }}
          >
            Affirme
          </motion.p>

          <motion.p
            className="
              mt-4
              max-w-md
              text-3xl
              font-black
              uppercase
              leading-tight
              text-white
              sm:text-4xl
            "
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.85,
            }}
            animate={{
              opacity:
                showClaim &&
                !leaving
                  ? 1
                  : 0,

              y:
                showClaim
                  ? 0
                  : 20,

              scale:
                showClaim
                  ? [
                      0.85,
                      1.05,
                      1,
                    ]
                  : 0.85,
            }}
            transition={{
              duration: 0.5,

              delay: 0.08,

              ease: [
                0.34,
                1.56,
                0.64,
                1,
              ],
            }}
          >
            Avoir la même valeur
          </motion.p>
        </motion.div>

        <motion.div
          className="
            relative
            mt-5
            flex
            h-40
            w-full
            items-center
            justify-center
          "
          initial={{
            opacity: 0,
            y: 45,
            scale: 0.75,
          }}
          animate={{
            opacity:
              showCards &&
              !leaving
                ? 1
                : 0,

            y:
              showCards
                ? 0
                : 45,

            scale:
              showCards
                ? [
                    0.75,
                    1.08,
                    1,
                  ]
                : 0.75,
          }}
          transition={{
            duration: 0.55,

            ease: [
              0.34,
              1.56,
              0.64,
              1,
            ],
          }}
        >
          <motion.div
            className="
              absolute
              -translate-x-9
              -rotate-12
              drop-shadow-[0_0_24px_rgba(250,204,21,0.35)]
            "
            animate={{
              y:
                showCards
                  ? [
                      18,
                      -8,
                      0,
                    ]
                  : 18,

              rotate:
                showCards
                  ? [
                      -22,
                      -9,
                      -12,
                    ]
                  : -22,
            }}
            transition={{
              duration: 0.58,

              ease: [
                0.34,
                1.56,
                0.64,
                1,
              ],
            }}
          >
            <PlayingCard
              card={
                HIDDEN_CARD
              }
              faceUp={false}
              size="md"
            />
          </motion.div>

          <motion.div
            className="
              absolute
              translate-x-9
              rotate-12
              drop-shadow-[0_0_24px_rgba(250,204,21,0.35)]
            "
            animate={{
              y:
                showCards
                  ? [
                      18,
                      -8,
                      0,
                    ]
                  : 18,

              rotate:
                showCards
                  ? [
                      22,
                      9,
                      12,
                    ]
                  : 22,
            }}
            transition={{
              duration: 0.58,

              delay: 0.06,

              ease: [
                0.34,
                1.56,
                0.64,
                1,
              ],
            }}
          >
            <PlayingCard
              card={
                HIDDEN_CARD
              }
              faceUp={false}
              size="md"
            />
          </motion.div>
        </motion.div>

        <motion.p
          className="
            mt-3
            text-xs
            font-black
            uppercase
            tracking-[0.24em]
            text-zinc-500
          "
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity:
              showCards &&
              !leaving
                ? 1
                : 0,
          }}
          transition={{
            duration: 0.35,
            delay: 0.18,
          }}
        >
          À {targetName}
        </motion.p>
      </div>
    </motion.div>
  );
}