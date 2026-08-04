"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  motion,
} from "framer-motion";

import ProfileAvatar from "@/components/profile/ProfileAvatar";

import type {
  PlayerAvatarType,
} from "@/lib/profile/types";

type AnnouncementVariant =
  | "DEFAULT"
  | "SUCCESS"
  | "DANGER"
  | "DRINK";

interface AnnouncementPlayer {
  pseudo: string;

  avatarType:
    PlayerAvatarType;

  avatarId:
    string | null;

  avatarPhoto:
    string | null;
}

interface GameAnnouncementProps {
  announcementKey: number;

  eyebrow?: string;

  title: string;

  subtitle?: string;

  icon?: string;

  player?:
    AnnouncementPlayer;

  drinks?: number;

  variant?:
    AnnouncementVariant;

  onComplete: () => void;
}

const DISPLAY_DURATION_MS =
  3000;

const DISPLAY_DURATION_SECONDS =
  DISPLAY_DURATION_MS / 1000;

const VARIANT_CLASSES = {
  DEFAULT: {
    border:
      "border-yellow-400/30",

    glow:
      "bg-yellow-400/20",

    line:
      "bg-yellow-400",

    eyebrow:
      "text-yellow-400",

    shadow:
      "shadow-[0_0_55px_rgba(250,204,21,0.18)]",

    drink:
      "text-yellow-400",
  },

  SUCCESS: {
    border:
      "border-emerald-400/35",

    glow:
      "bg-emerald-400/20",

    line:
      "bg-emerald-400",

    eyebrow:
      "text-emerald-400",

    shadow:
      "shadow-[0_0_55px_rgba(52,211,153,0.18)]",

    drink:
      "text-emerald-400",
  },

  DANGER: {
    border:
      "border-red-500/40",

    glow:
      "bg-red-500/20",

    line:
      "bg-red-500",

    eyebrow:
      "text-red-400",

    shadow:
      "shadow-[0_0_55px_rgba(239,68,68,0.2)]",

    drink:
      "text-red-400",
  },

  DRINK: {
    border:
      "border-orange-400/40",

    glow:
      "bg-orange-400/20",

    line:
      "bg-orange-400",

    eyebrow:
      "text-orange-300",

    shadow:
      "shadow-[0_0_55px_rgba(251,146,60,0.2)]",

    drink:
      "text-orange-300",
  },
} as const;

export default function GameAnnouncement({
  announcementKey,
  eyebrow,
  title,
  subtitle,
  icon,
  player,
  drinks,
  variant = "DEFAULT",
  onComplete,
}: GameAnnouncementProps) {
  const onCompleteRef =
    useRef(onComplete);

  const styles =
    VARIANT_CLASSES[
      variant
    ];

  useEffect(() => {
    onCompleteRef.current =
      onComplete;
  }, [
    onComplete,
  ]);

  useEffect(() => {
    const timeoutId =
      window.setTimeout(
        () => {
          onCompleteRef.current();
        },
        DISPLAY_DURATION_MS
      );

    return () => {
      window.clearTimeout(
        timeoutId
      );
    };
  }, [
    announcementKey,
  ]);

  return (
    <motion.div
      key={announcementKey}
      aria-live="assertive"
      className="
        pointer-events-none
        fixed
        inset-0
        z-[9000]
        flex
        items-center
        justify-center
        overflow-hidden
        bg-black/55
        px-5
        backdrop-blur-sm
      "
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: [
          0,
          1,
          1,
          0,
        ],
      }}
      transition={{
        duration:
          DISPLAY_DURATION_SECONDS,

        times: [
          0,
          0.08,
          0.88,
          1,
        ],

        ease:
          "easeOut",
      }}
    >
      <motion.div
        aria-hidden="true"
        className={`
          absolute
          h-72
          w-72
          rounded-full
          blur-3xl
          ${styles.glow}
        `}
        initial={{
          opacity: 0,
          scale: 0.45,
        }}
        animate={{
          opacity: [
            0,
            1,
            0.65,
            0,
          ],

          scale: [
            0.45,
            1.15,
            1,
            1.3,
          ],
        }}
        transition={{
          duration:
            DISPLAY_DURATION_SECONDS,

          ease:
            "easeOut",
        }}
      />

      <motion.section
        className={`
          relative
          w-full
          max-w-lg
          overflow-hidden
          rounded-[2rem]
          border
          bg-zinc-950/95
          px-6
          py-9
          text-center
          sm:px-10
          sm:py-12
          ${styles.border}
          ${styles.shadow}
        `}
        initial={{
          opacity: 0,
          scale: 0.7,
          y: 40,
        }}
        animate={{
          opacity: [
            0,
            1,
            1,
            0,
          ],

          scale: [
            0.7,
            1.06,
            1,
            0.95,
          ],

          y: [
            40,
            0,
            0,
            -18,
          ],
        }}
        transition={{
          duration:
            DISPLAY_DURATION_SECONDS,

          times: [
            0,
            0.1,
            0.88,
            1,
          ],

          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
      >
        <motion.div
          aria-hidden="true"
          className={`
            absolute
            inset-x-0
            top-0
            h-1
            ${styles.line}
          `}
          initial={{
            scaleX: 0,
          }}
          animate={{
            scaleX: [
              0,
              1,
              1,
              0,
            ],
          }}
          transition={{
            duration:
              DISPLAY_DURATION_SECONDS,

            times: [
              0,
              0.12,
              0.88,
              1,
            ],

            ease:
              "easeOut",
          }}
        />

        {player && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.55,
              y: 18,
            }}
            animate={{
              opacity: 1,

              scale: [
                0.55,
                1.12,
                1,
              ],

              y: [
                18,
                0,
                0,
              ],
            }}
            transition={{
              duration: 0.6,

              ease: [
                0.34,
                1.56,
                0.64,
                1,
              ],
            }}
          >
            <ProfileAvatar
              size="large"
              avatarType={
                player.avatarType
              }
              avatarId={
                player.avatarId
              }
              avatarPhoto={
                player.avatarPhoto
              }
            />

            <p
              className="
                mt-4
                truncate
                text-xl
                font-black
                text-white
              "
            >
              {player.pseudo}
            </p>
          </motion.div>
        )}

        {!player && icon && (
          <motion.div
            className="text-5xl sm:text-6xl"
            initial={{
              opacity: 0,
              scale: 0.4,
              rotate: -12,
            }}
            animate={{
              opacity: 1,

              scale: [
                0.4,
                1.2,
                1,
              ],

              rotate: [
                -12,
                5,
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
            {icon}
          </motion.div>
        )}

        {eyebrow && (
          <p
            className={`
              mt-5
              text-xs
              font-black
              uppercase
              tracking-[0.3em]
              ${styles.eyebrow}
            `}
          >
            {eyebrow}
          </p>
        )}

        <h2
          className="
            mt-3
            text-3xl
            font-black
            uppercase
            tracking-tight
            text-white
            sm:text-5xl
          "
        >
          {title}
        </h2>

        {typeof drinks ===
          "number" && (
          <motion.div
            className="mt-5"
            initial={{
              opacity: 0,
              scale: 0.55,
            }}
            animate={{
              opacity: 1,

              scale: [
                0.55,
                1.2,
                1,
              ],
            }}
            transition={{
              delay: 0.18,
              duration: 0.55,

              ease: [
                0.34,
                1.56,
                0.64,
                1,
              ],
            }}
          >
            <p
              className={`
                text-6xl
                font-black
                leading-none
                sm:text-7xl
                ${styles.drink}
              `}
            >
              +{drinks}
            </p>

            <p
              className={`
                mt-2
                text-sm
                font-black
                uppercase
                tracking-[0.2em]
                ${styles.drink}
              `}
            >
              gorgée
              {drinks > 1
                ? "s"
                : ""}
            </p>
          </motion.div>
        )}

        {subtitle && (
          <p
            className="
              mx-auto
              mt-5
              max-w-sm
              text-sm
              font-semibold
              leading-6
              text-zinc-400
              sm:text-base
            "
          >
            {subtitle}
          </p>
        )}
      </motion.section>
    </motion.div>
  );
}