"use client";

import { useEffect, useMemo, useState } from "react";

type BluffAnnouncementOverlayProps = {
  visible: boolean;

  joueur: string;
  cible: string;

  gorgées: number;

  onComplete?: () => void;
};

type EtapeAnimation =
  | "CACHE"
  | "ANNONCE"
  | "CIBLE"
  | "QUESTION"
  | "GORGEES"
  | "SORTIE";

function obtenirInitiale(nom: string) {
  const nomNettoye = nom.trim();

  if (!nomNettoye) {
    return "?";
  }

  return nomNettoye
    .charAt(0)
    .toUpperCase();
}

export default function BluffAnnouncementOverlay({
  visible,
  joueur,
  cible,
  gorgées,
  onComplete,
}: BluffAnnouncementOverlayProps) {
  const [etape, setEtape] =
    useState<EtapeAnimation>("CACHE");

  const initialeCible = useMemo(
    () => obtenirInitiale(cible),
    [cible]
  );

  useEffect(() => {
    if (!visible) {
      setEtape("CACHE");
      return;
    }

    setEtape("CACHE");

    const timers = [
      window.setTimeout(() => {
        setEtape("ANNONCE");
      }, 40),

      window.setTimeout(() => {
        setEtape("CIBLE");
      }, 480),

      window.setTimeout(() => {
        setEtape("QUESTION");
      }, 850),

      window.setTimeout(() => {
        setEtape("GORGEES");
      }, 1180),

      window.setTimeout(() => {
        setEtape("SORTIE");
      }, 2450),

      window.setTimeout(() => {
        onComplete?.();
      }, 2850),
    ];

    return () => {
      timers.forEach((timer) => {
        window.clearTimeout(timer);
      });
    };
  }, [visible, onComplete]);

  if (!visible) {
    return null;
  }

  const annonceVisible =
    etape !== "CACHE";

  const cibleVisible = [
    "CIBLE",
    "QUESTION",
    "GORGEES",
    "SORTIE",
  ].includes(etape);

  const questionVisible = [
    "QUESTION",
    "GORGEES",
    "SORTIE",
  ].includes(etape);

  const gorgeesVisibles = [
    "GORGEES",
    "SORTIE",
  ].includes(etape);

  const sortie =
    etape === "SORTIE";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${joueur} affirme avoir la carte et cible ${cible}`}
      className={`
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        overflow-hidden
        bg-black/90
        px-5
        py-8
        backdrop-blur-xl
        transition-opacity
        duration-500
        ${
          sortie
            ? "opacity-0"
            : "opacity-100"
        }
      `}
    >
      {/* Lumière principale */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[420px]
          w-[420px]
          -translate-x-1/2
          -translate-y-1/2
          animate-[announcementAura_2.4s_ease-in-out_infinite]
          rounded-full
          bg-[#FFD166]/15
          blur-3xl
        "
      />

      {/* Carte géante en arrière-plan */}
      <div
        aria-hidden="true"
        className={`
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[390px]
          w-[255px]
          -translate-x-1/2
          -translate-y-1/2
          rotate-[-8deg]
          rounded-[32px]
          border
          border-[#FFD166]/15
          bg-gradient-to-br
          from-[#24211A]/70
          via-[#121317]/70
          to-black/70
          shadow-[0_0_80px_rgba(255,209,102,0.08)]
          transition-all
          duration-1000
          ease-out
          ${
            annonceVisible
              ? "scale-100 opacity-35"
              : "scale-75 opacity-0"
          }
        `}
      >
        <div
          className="
            absolute
            inset-3
            rounded-[25px]
            border
            border-[#FFD166]/10
          "
        />

        <div
          className="
            absolute
            inset-8
            flex
            rotate-12
            items-center
            justify-center
            rounded-full
            border
            border-[#FFD166]/10
          "
        >
          <span
            className="
              text-8xl
              font-black
              text-[#FFD166]/10
            "
          >
            ?
          </span>
        </div>
      </div>

      {/* Particules */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-[14%]
          top-[20%]
          h-1.5
          w-1.5
          animate-[announcementParticleOne_2s_ease-in-out_infinite]
          rounded-full
          bg-[#FFD166]
          shadow-[0_0_14px_rgba(255,209,102,0.95)]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-[19%]
          right-[13%]
          h-2
          w-2
          animate-[announcementParticleTwo_2.4s_ease-in-out_infinite]
          rounded-full
          bg-white
          shadow-[0_0_15px_rgba(255,255,255,0.8)]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          right-[23%]
          top-[13%]
          h-1
          w-1
          animate-ping
          rounded-full
          bg-[#FFD166]
        "
      />

      {/* Contenu principal */}
      <div
        className={`
          relative
          z-10
          flex
          w-full
          max-w-md
          flex-col
          items-center
          text-center
          transition-all
          duration-500
          ease-out
          ${
            sortie
              ? "-translate-y-4 scale-105 opacity-0"
              : "translate-y-0 scale-100 opacity-100"
          }
        `}
      >
        {/* Icône */}
        <div
          className={`
            relative
            mb-6
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            border-2
            border-[#FFD166]
            bg-[#FFD166]
            text-3xl
            shadow-[0_0_35px_rgba(255,209,102,0.35)]
            transition-all
            duration-700
            ease-[cubic-bezier(0.16,1,0.3,1)]
            ${
              annonceVisible
                ? "translate-y-0 rotate-6 scale-100 opacity-100"
                : "-translate-y-8 -rotate-12 scale-50 opacity-0"
            }
          `}
        >
          🃏
        </div>

        {/* Annonce du joueur */}
        <div
          className={`
            transition-all
            duration-700
            ease-[cubic-bezier(0.16,1,0.3,1)]
            ${
              annonceVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }
          `}
        >
          <p
            className="
              mb-2
              text-[10px]
              font-black
              uppercase
              tracking-[0.32em]
              text-[#FFD166]
              sm:text-xs
            "
          >
            Une affirmation est lancée
          </p>

          <h2
            className="
              max-w-sm
              text-2xl
              font-black
              leading-tight
              text-white
              sm:text-3xl
            "
          >
            <span className="text-[#FFD166]">
              {joueur}
            </span>{" "}
            affirme avoir cette carte
          </h2>
        </div>

        {/* Séparateur */}
        <div
          className={`
            my-6
            flex
            w-full
            max-w-xs
            items-center
            gap-3
            transition-all
            duration-500
            ${
              cibleVisible
                ? "scale-x-100 opacity-100"
                : "scale-x-50 opacity-0"
            }
          `}
        >
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#FFD166]/45" />

          <div
            className="
              h-1.5
              w-1.5
              rotate-45
              bg-[#FFD166]
            "
          />

          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#FFD166]/45" />
        </div>

        {/* Avatar de la cible */}
        <div
          className={`
            relative
            transition-all
            duration-700
            ease-[cubic-bezier(0.34,1.56,0.64,1)]
            ${
              cibleVisible
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-8 scale-75 opacity-0"
            }
          `}
        >
          <div
            aria-hidden="true"
            className="
              absolute
              -inset-5
              animate-pulse
              rounded-full
              bg-[#FFD166]/15
              blur-xl
            "
          />

          <div
            className="
              relative
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              border-2
              border-[#FFD166]
              bg-[#17191F]
              text-3xl
              font-black
              text-[#FFD166]
              shadow-[0_0_30px_rgba(255,209,102,0.2)]
            "
          >
            {initialeCible}
          </div>
        </div>

        <p
          className={`
            mt-3
            text-base
            font-black
            uppercase
            tracking-[0.2em]
            text-white
            transition-all
            duration-500
            ${
              cibleVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-5 opacity-0"
            }
          `}
        >
          {cible}...
        </p>

        {/* Question */}
        <h3
          className={`
            mt-4
            text-4xl
            font-black
            leading-none
            text-white
            drop-shadow-[0_0_18px_rgba(255,209,102,0.18)]
            transition-all
            duration-500
            ease-[cubic-bezier(0.34,1.56,0.64,1)]
            sm:text-5xl
            ${
              questionVisible
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-5 scale-75 opacity-0"
            }
          `}
        >
          Le crois-tu ?
        </h3>

        {/* Nombre de gorgées */}
        <div
          className={`
            mt-7
            transition-all
            duration-600
            ease-out
            ${
              gorgeesVisibles
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-8 scale-90 opacity-0"
            }
          `}
        >
          <div
            className="
              relative
              overflow-hidden
              rounded-full
              border
              border-[#FFD166]/35
              bg-[#FFD166]/10
              px-5
              py-3
              shadow-[0_0_25px_rgba(255,209,102,0.1)]
            "
          >
            <div
              aria-hidden="true"
              className="
                absolute
                inset-y-0
                left-[-60%]
                w-1/2
                animate-[announcementShine_1.8s_ease-in-out_infinite]
                skew-x-[-20deg]
                bg-gradient-to-r
                from-transparent
                via-white/15
                to-transparent
              "
            />

            <span
              className="
                relative
                text-2xl
                font-black
                text-[#FFD166]
              "
            >
              {gorgées}
            </span>

            <span
              className="
                relative
                ml-2
                text-xs
                font-black
                uppercase
                tracking-[0.16em]
                text-white
              "
            >
              {gorgées > 1
                ? "gorgées en jeu"
                : "gorgée en jeu"}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes announcementAura {
          0%,
          100% {
            opacity: 0.45;
            transform:
              translate(-50%, -50%)
              scale(0.85);
          }

          50% {
            opacity: 0.9;
            transform:
              translate(-50%, -50%)
              scale(1.08);
          }
        }

        @keyframes announcementParticleOne {
          0%,
          100% {
            opacity: 0.2;
            transform:
              translate(0, 10px)
              scale(0.7);
          }

          50% {
            opacity: 1;
            transform:
              translate(-7px, -9px)
              scale(1.2);
          }
        }

        @keyframes announcementParticleTwo {
          0%,
          100% {
            opacity: 0.2;
            transform:
              translate(0, -8px)
              scale(0.7);
          }

          50% {
            opacity: 1;
            transform:
              translate(8px, 9px)
              scale(1.15);
          }
        }

        @keyframes announcementShine {
          0% {
            left: -60%;
          }

          55%,
          100% {
            left: 130%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}