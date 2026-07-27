"use client";

import PlayingCard, {
  type PlayingCardVariant,
} from "@/components/PlayingCard";

import type { Carte } from "@/lib/deck";

export type CardSceneVariant =
  | "gold"
  | "danger"
  | "glowing";

type CardSceneProps = {
  carte: Carte;
  titre: string;
  sousTitre?: string;
  variant?: CardSceneVariant;
  faceVisible?: boolean;
};

const SCENE_STYLES: Record<
  CardSceneVariant,
  {
    cardVariant: PlayingCardVariant;
    title: string;
    glow: string;
    particle: string;
    background: string;
  }
> = {
  gold: {
    cardVariant: "gold",
    title: "text-[#FFD166]",
    glow: "bg-[#FFD166]/30",
    particle: "bg-[#FFD166]",
    background:
      "radial-gradient(circle at center, rgba(255, 209, 102, 0.30), transparent 60%)",
  },

  danger: {
    cardVariant: "danger",
    title: "text-red-400",
    glow: "bg-red-500/30",
    particle: "bg-red-400",
    background:
      "radial-gradient(circle at center, rgba(239, 68, 68, 0.30), transparent 60%)",
  },

  glowing: {
    cardVariant: "glowing",
    title: "text-sky-300",
    glow: "bg-sky-400/25",
    particle: "bg-sky-300",
    background:
      "radial-gradient(circle at center, rgba(56, 189, 248, 0.25), transparent 60%)",
  },
};

export default function CardScene({
  carte,
  titre,
  sousTitre,
  variant = "gold",
  faceVisible = false,
}: CardSceneProps) {
  const styles =
    SCENE_STYLES[variant];

  return (
    <div
      className="
        relative
        flex
        min-h-full
        w-full
        items-center
        justify-center
        overflow-hidden
        px-6
        py-10
      "
    >
      {/* Ambiance lumineuse */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          animate-[sceneBackground_2.4s_ease-out_forwards]
        "
        style={{
          background:
            styles.background,
        }}
      />

      {/* Halo derrière la carte */}
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
          animate-[sceneGlow_2.4s_ease-out_forwards]
          rounded-full
          blur-3xl
          ${styles.glow}
        `}
      />

      {/* Particules */}
      <div
        aria-hidden="true"
        className={`
          particle
          particle-one
          ${styles.particle}
        `}
      />

      <div
        aria-hidden="true"
        className={`
          particle
          particle-two
          ${styles.particle}
        `}
      />

      <div
        aria-hidden="true"
        className={`
          particle
          particle-three
          ${styles.particle}
        `}
      />

      <div
        aria-hidden="true"
        className={`
          particle
          particle-four
          ${styles.particle}
        `}
      />

      <div
        className="
          relative
          z-10
          flex
          flex-col
          items-center
          text-center
        "
      >
        <div
          className="
            animate-[sceneTitle_2.4s_ease-out_forwards]
          "
        >
          <p
            className={`
              text-xs
              font-black
              uppercase
              tracking-[0.42em]
              ${styles.title}
            `}
          >
            {titre}
          </p>
        </div>

        <div
          className="
            mt-8
            animate-[sceneCardEntrance_2.4s_cubic-bezier(0.16,1,0.3,1)_forwards]
          "
        >
          <div
            className="
              animate-[sceneCardFloat_2.8s_ease-in-out_infinite]
            "
          >
            <PlayingCard
              carte={carte}
              size="cinematic"
              variant={
                styles.cardVariant
              }
              faceVisible={
                faceVisible
              }
            />
          </div>
        </div>

        {sousTitre && (
          <div
            className="
              mt-9
              animate-[sceneSubtitle_2.4s_ease-out_forwards]
            "
          >
            <p
              className="
                max-w-xs
                text-3xl
                font-black
                text-white
                drop-shadow-lg
              "
            >
              {sousTitre}
            </p>
          </div>
        )}
      </div>

      <style>{`
        .particle {
          position: absolute;
          z-index: 5;
          height: 7px;
          width: 7px;
          border-radius: 9999px;
          box-shadow:
            0 0 14px
            currentColor;
        }

        .particle-one {
          left: 15%;
          top: 28%;
          animation:
            particleOne 2.4s
            ease-out forwards;
        }

        .particle-two {
          right: 16%;
          top: 35%;
          animation:
            particleTwo 2.4s
            ease-out forwards;
        }

        .particle-three {
          bottom: 25%;
          left: 21%;
          animation:
            particleThree 2.4s
            ease-out forwards;
        }

        .particle-four {
          bottom: 22%;
          right: 20%;
          animation:
            particleFour 2.4s
            ease-out forwards;
        }

        @keyframes sceneBackground {
          0% {
            opacity: 0;
            transform: scale(0.45);
          }

          35% {
            opacity: 1;
          }

          100% {
            opacity: 0.45;
            transform: scale(1.35);
          }
        }

        @keyframes sceneGlow {
          0% {
            opacity: 0;
            transform:
              translate(-50%, -50%)
              scale(0.25);
          }

          45% {
            opacity: 1;
          }

          70% {
            transform:
              translate(-50%, -50%)
              scale(1.1);
          }

          100% {
            opacity: 0.55;
            transform:
              translate(-50%, -50%)
              scale(1);
          }
        }

        @keyframes sceneTitle {
          0% {
            opacity: 0;
            transform:
              translateY(-20px);
          }

          25%,
          100% {
            opacity: 1;
            transform:
              translateY(0);
          }
        }

        @keyframes sceneCardEntrance {
          0% {
            opacity: 0;
            transform:
              translateY(-150px)
              scale(0.7)
              rotateZ(-8deg);
          }

          20% {
            opacity: 1;
          }

          55% {
            transform:
              translateY(0)
              scale(1.06)
              rotateZ(2deg);
          }

          75% {
            transform:
              translateY(0)
              scale(0.97)
              rotateZ(-1deg);
          }

          100% {
            opacity: 1;
            transform:
              translateY(0)
              scale(1)
              rotateZ(0);
          }
        }

        @keyframes sceneCardFloat {
          0%,
          100% {
            transform:
              translateY(0)
              rotateZ(0deg);
          }

          50% {
            transform:
              translateY(-5px)
              rotateZ(0.4deg);
          }
        }

        @keyframes sceneSubtitle {
          0%,
          55% {
            opacity: 0;
            transform:
              translateY(18px)
              scale(0.9);
          }

          75% {
            opacity: 1;
            transform:
              translateY(0)
              scale(1.06);
          }

          100% {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        @keyframes particleOne {
          0%,
          35% {
            opacity: 0;
            transform:
              translate(0, 0)
              scale(0);
          }

          55% {
            opacity: 1;
          }

          100% {
            opacity: 0;
            transform:
              translate(65px, -90px)
              scale(1.6);
          }
        }

        @keyframes particleTwo {
          0%,
          38% {
            opacity: 0;
            transform:
              translate(0, 0)
              scale(0);
          }

          58% {
            opacity: 1;
          }

          100% {
            opacity: 0;
            transform:
              translate(-70px, -80px)
              scale(1.4);
          }
        }

        @keyframes particleThree {
          0%,
          40% {
            opacity: 0;
            transform:
              translate(0, 0)
              scale(0);
          }

          60% {
            opacity: 1;
          }

          100% {
            opacity: 0;
            transform:
              translate(75px, 65px)
              scale(1.5);
          }
        }

        @keyframes particleFour {
          0%,
          42% {
            opacity: 0;
            transform:
              translate(0, 0)
              scale(0);
          }

          62% {
            opacity: 1;
          }

          100% {
            opacity: 0;
            transform:
              translate(-75px, 70px)
              scale(1.5);
          }
        }

        @media (
          prefers-reduced-motion:
          reduce
        ) {
          .particle,
          div {
            animation-duration:
              0.01ms !important;
            animation-iteration-count:
              1 !important;
          }
        }
      `}</style>
    </div>
  );
}