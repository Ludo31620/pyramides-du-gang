"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  motion,
} from "framer-motion";

interface GameAnnouncementProps {
  announcementKey: number;
  eyebrow?: string;
  title: string;
  icon?: string;
  onComplete: () => void;
}

const DISPLAY_DURATION_MS =
  3000;

const DISPLAY_DURATION_SECONDS =
  DISPLAY_DURATION_MS / 1000;

export default function GameAnnouncement({
  announcementKey,
  eyebrow,
  title,
  icon,
  onComplete,
}: GameAnnouncementProps) {
  const onCompleteRef =
    useRef(onComplete);

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
        bg-black/45
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
        ease: "easeOut",
      }}
    >
      <motion.div
        aria-hidden="true"
        className="
          absolute
          h-72
          w-72
          rounded-full
          bg-yellow-400/20
          blur-3xl
        "
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
          ease: "easeOut",
        }}
      />

      <motion.section
        className="
          relative
          w-full
          max-w-lg
          overflow-hidden
          rounded-[2rem]
          border
          border-yellow-400/30
          bg-zinc-950/95
          px-6
          py-9
          text-center
          shadow-[0_0_55px_rgba(250,204,21,0.18)]
          sm:px-10
          sm:py-12
        "
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
          className="
            absolute
            inset-x-0
            top-0
            h-1
            bg-yellow-400
          "
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

            ease: "easeOut",
          }}
        />

        {icon && (
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
          <p className="mt-5 text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
            {eyebrow}
          </p>
        )}

        <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
          {title}
        </h2>
      </motion.section>
    </motion.div>
  );
}