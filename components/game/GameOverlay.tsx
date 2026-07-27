"use client";

import {
  useEffect,
  useState,
} from "react";

type OverlayTone =
  | "yellow"
  | "red"
  | "green";

type OverlayAction = {
  id: string;
  label: string;
  icon?: string;
  variant?:
    | "primary"
    | "secondary"
    | "danger";
  onClick: () => void;
};

type GameOverlayProps = {
  open: boolean;
  eyebrow?: string;
  icon: string;
  title: string;
  description?: string;
  tone?: OverlayTone;
  actions?: OverlayAction[];
  vibrate?: boolean;
};

const DUREE_FERMETURE = 250;

export default function GameOverlay({
  open,
  eyebrow,
  icon,
  title,
  description,
  tone = "yellow",
  actions = [],
  vibrate = false,
}: GameOverlayProps) {
  const [affiche, setAffiche] =
    useState(open);

  const [anime, setAnime] =
    useState(false);

  useEffect(() => {
    if (open) {
      setAffiche(true);

      const animationFrame =
        window.requestAnimationFrame(
          () => {
            setAnime(true);
          }
        );

      if (
        vibrate &&
        "vibrate" in navigator
      ) {
        navigator.vibrate([
          80,
          40,
          120,
        ]);
      }

      return () => {
        window.cancelAnimationFrame(
          animationFrame
        );
      };
    }

    setAnime(false);

    const timer =
      window.setTimeout(() => {
        setAffiche(false);
      }, DUREE_FERMETURE);

    return () => {
      window.clearTimeout(timer);
    };
  }, [open, vibrate]);

  if (!affiche) {
    return null;
  }

  const styles = {
    yellow: {
      glow:
        "bg-[#FFD166]/25",
      border:
        "border-[#FFD166]/60",
      eyebrow:
        "text-[#FFD166]",
      iconBackground:
        "bg-[#FFD166]/15",
      button:
        "bg-[#FFD166] text-[#111318] hover:bg-[#FFE08A]",
    },

    red: {
      glow:
        "bg-red-500/25",
      border:
        "border-red-500/60",
      eyebrow:
        "text-red-400",
      iconBackground:
        "bg-red-500/15",
      button:
        "bg-red-500 text-white hover:bg-red-400",
    },

    green: {
      glow:
        "bg-emerald-500/25",
      border:
        "border-emerald-500/60",
      eyebrow:
        "text-emerald-400",
      iconBackground:
        "bg-emerald-500/15",
      button:
        "bg-emerald-500 text-white hover:bg-emerald-400",
    },
  }[tone];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className={`
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        overflow-hidden
        bg-black/80
        px-4
        py-8
        backdrop-blur-md
        transition-opacity
        duration-300
        motion-reduce:transition-none
        ${
          anime
            ? "opacity-100"
            : "opacity-0"
        }
      `}
    >
      <div
        aria-hidden="true"
        className={`
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-72
          w-72
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          blur-3xl
          transition-all
          duration-500
          ${styles.glow}
          ${
            anime
              ? "scale-100 opacity-100"
              : "scale-50 opacity-0"
          }
        `}
      />

      <div
        className={`
          relative
          w-full
          max-w-md
          overflow-hidden
          rounded-3xl
          border
          bg-[#15171D]
          p-6
          text-center
          shadow-2xl
          transition-all
          duration-500
          ease-[cubic-bezier(0.22,1,0.36,1)]
          motion-reduce:transition-none
          sm:p-8
          ${styles.border}
          ${
            anime
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-8 scale-90 opacity-0"
          }
        `}
      >
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-b
            from-white/[0.04]
            to-transparent
          "
        />

        <div className="relative">
          {eyebrow && (
            <p
              className={`
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

          <div
            className={`
              mx-auto
              mt-5
              flex
              h-24
              w-24
              items-center
              justify-center
              rounded-full
              text-6xl
              shadow-inner
              ${styles.iconBackground}
              ${
                anime
                  ? "animate-[bounce_0.7s_ease-out_1]"
                  : ""
              }
            `}
          >
            {icon}
          </div>

          <h2 className="mt-6 text-3xl font-black text-white sm:text-4xl">
            {title}
          </h2>

          {description && (
            <p className="mx-auto mt-4 max-w-sm text-base leading-relaxed text-zinc-300">
              {description}
            </p>
          )}

          {actions.length > 0 && (
            <div className="mt-7 grid gap-3">
              {actions.map(
                (action) => {
                  const variant =
                    action.variant ??
                    "primary";

                  const classes =
                    variant ===
                    "danger"
                      ? "bg-red-500 text-white hover:bg-red-400"
                      : variant ===
                          "secondary"
                        ? "border border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800"
                        : styles.button;

                  return (
                    <button
                      key={
                        action.id
                      }
                      type="button"
                      onClick={
                        action.onClick
                      }
                      className={`
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-3
                        rounded-2xl
                        px-5
                        py-4
                        text-lg
                        font-black
                        transition
                        active:scale-[0.98]
                        ${classes}
                      `}
                    >
                      {action.icon && (
                        <span
                          aria-hidden="true"
                          className="text-xl"
                        >
                          {
                            action.icon
                          }
                        </span>
                      )}

                      <span>
                        {
                          action.label
                        }
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}