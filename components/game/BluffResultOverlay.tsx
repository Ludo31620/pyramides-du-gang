"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import ProfileAvatar from "@/components/profile/ProfileAvatar";

import {
  lireSessionPartie,
  type StoredRoomPlayer,
} from "@/lib/gameSession";

import type {
  BluffResult,
} from "@/lib/gameEngine/types";

type BluffResultOverlayProps = {
  result:
    BluffResult | null;

  visible:
    boolean;

  onComplete:
    () => void;
};

const DUREE_AFFICHAGE =
  3000;

function getPlayerFallbackName(
  playerIndex: number
): string {
  return `Joueur ${playerIndex + 1}`;
}

export default function BluffResultOverlay({
  result,
  visible,
  onComplete,
}: BluffResultOverlayProps) {
  const onCompleteRef =
    useRef(onComplete);

  const [
    roomPlayers,
    setRoomPlayers,
  ] =
    useState<StoredRoomPlayer[]>(
      []
    );

  useEffect(() => {
    onCompleteRef.current =
      onComplete;
  }, [
    onComplete,
  ]);

  useEffect(() => {
    const session =
      lireSessionPartie();

    setRoomPlayers(
      session?.players ??
        []
    );
  }, []);

  useEffect(() => {
    if (
      !visible ||
      !result
    ) {
      return;
    }

    const timer =
      window.setTimeout(
        () => {
          onCompleteRef.current();
        },
        DUREE_AFFICHAGE
      );

    return () => {
      window.clearTimeout(
        timer
      );
    };
  }, [
    visible,
    result,
  ]);

  if (
    !visible ||
    !result
  ) {
    return null;
  }

  const giverPlayer =
    roomPlayers[
      result.giver
    ];

  const targetPlayer =
    roomPlayers[
      result.target
    ];

  const punishedPlayer =
    roomPlayers[
      result.punishedPlayer
    ];

  const giverName =
    giverPlayer?.pseudo ??
    getPlayerFallbackName(
      result.giver
    );

  const targetName =
    targetPlayer?.pseudo ??
    getPlayerFallbackName(
      result.target
    );

  const punishedPlayerName =
    punishedPlayer?.pseudo ??
    getPlayerFallbackName(
      result.punishedPlayer
    );

  const drinksLabel =
    result.drinks > 1
      ? "gorgées"
      : "gorgée";

  const isBelieved =
    result.outcome ===
    "BELIEVED";

  const isTruth =
    result.outcome ===
    "TRUTH";

  const isBluff =
    result.outcome ===
    "BLUFF";

  const accentClasses =
    isTruth
      ? {
          text:
            "text-emerald-400",

          border:
            "border-emerald-400/35",

          background:
            "bg-emerald-400/10",

          glow:
            "bg-emerald-400/20",

          progress:
            "bg-emerald-400",
        }
      : isBluff
        ? {
            text:
              "text-red-400",

            border:
              "border-red-500/40",

            background:
              "bg-red-500/10",

            glow:
              "bg-red-500/20",

            progress:
              "bg-red-500",
          }
        : {
            text:
              "text-[#FFD166]",

            border:
              "border-[#FFD166]/30",

            background:
              "bg-[#FFD166]/10",

            glow:
              "bg-[#FFD166]/20",

            progress:
              "bg-[#FFD166]",
          };

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        overflow-hidden
        bg-black/90
        px-4
        backdrop-blur-md
      "
      role="dialog"
      aria-modal="true"
      aria-label="Résultat du bluff"
    >
      <div
        className={`
          bluff-result-glow
          absolute
          h-72
          w-72
          rounded-full
          blur-3xl
          ${accentClasses.glow}
        `}
      />

      <div
        className={`
          bluff-result-card
          relative
          w-full
          max-w-md
          overflow-hidden
          rounded-[2rem]
          border
          bg-[#111318]
          p-6
          text-center
          shadow-[0_0_80px_rgba(255,209,102,0.18)]
          sm:p-8
          ${accentClasses.border}
        `}
      >
        <div
          className={`
            absolute
            inset-x-0
            top-0
            h-1
            ${accentClasses.progress}
          `}
        />

        <div
          className="
            grid
            grid-cols-[1fr_auto_1fr]
            items-center
            gap-3
          "
        >
          <div
            className="
              rounded-2xl
              border
              border-white/10
              bg-black/25
              p-3
            "
          >
            <ProfileAvatar
              size="medium"
              avatarType={
                giverPlayer
                  ?.avatarType ??
                "DEFAULT"
              }
              avatarId={
                giverPlayer
                  ?.avatarId ??
                "fox"
              }
              avatarPhoto={
                giverPlayer
                  ?.avatarPhoto ??
                null
              }
            />

            <p
              className="
                mt-3
                truncate
                text-sm
                font-black
                text-white
              "
            >
              {giverName}
            </p>

            <p
              className="
                mt-1
                text-[10px]
                font-black
                uppercase
                tracking-wider
                text-zinc-500
              "
            >
              Annonceur
            </p>
          </div>

          <div
            aria-hidden="true"
            className={`
              text-2xl
              font-black
              ${accentClasses.text}
            `}
          >
            →
          </div>

          <div
            className={`
              rounded-2xl
              border
              p-3
              ${accentClasses.border}
              ${accentClasses.background}
            `}
          >
            <ProfileAvatar
              size="medium"
              avatarType={
                targetPlayer
                  ?.avatarType ??
                "DEFAULT"
              }
              avatarId={
                targetPlayer
                  ?.avatarId ??
                "fox"
              }
              avatarPhoto={
                targetPlayer
                  ?.avatarPhoto ??
                null
              }
            />

            <p
              className="
                mt-3
                truncate
                text-sm
                font-black
                text-white
              "
            >
              {targetName}
            </p>

            <p
              className={`
                mt-1
                text-[10px]
                font-black
                uppercase
                tracking-wider
                ${accentClasses.text}
              `}
            >
              Cible
            </p>
          </div>
        </div>

        {isBelieved && (
          <>
            <div className="bluff-result-icon mt-6 text-6xl">
              🍺
            </div>

            <p
              className="
                mt-4
                text-xs
                font-black
                uppercase
                tracking-[0.3em]
                text-[#FFD166]
              "
            >
              Bluff accepté
            </p>

            <h2
              className="
                mt-3
                text-3xl
                font-black
                text-white
              "
            >
              {targetName} a cru
              {` ${giverName}`}
            </h2>
          </>
        )}

        {isTruth && (
          <>
            <div className="bluff-result-icon mt-6 text-6xl">
              ✅
            </div>

            <p
              className="
                mt-4
                text-xs
                font-black
                uppercase
                tracking-[0.3em]
                text-emerald-400
              "
            >
              Vérité
            </p>

            <h2
              className="
                mt-3
                text-3xl
                font-black
                text-white
              "
            >
              {giverName} disait vrai
            </h2>

            {result.revealedCard && (
              <div
                className="
                  mx-auto
                  mt-6
                  flex
                  h-40
                  w-28
                  items-center
                  justify-center
                  rounded-2xl
                  border-2
                  border-white/20
                  bg-white
                  shadow-[0_20px_60px_rgba(0,0,0,0.45)]
                "
              >
                <div
                  className={[
                    "text-center",

                    result.revealedCard
                      .couleur ===
                      "♥" ||
                    result.revealedCard
                      .couleur ===
                      "♦"
                      ? "text-red-600"
                      : "text-zinc-950",
                  ].join(" ")}
                >
                  <p className="text-4xl font-black">
                    {
                      result
                        .revealedCard
                        .valeur
                    }
                  </p>

                  <p className="mt-1 text-5xl leading-none">
                    {
                      result
                        .revealedCard
                        .couleur
                    }
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {isBluff && (
          <>
            <div className="bluff-result-icon mt-6 text-7xl">
              ❌
            </div>

            <p
              className="
                mt-4
                text-xs
                font-black
                uppercase
                tracking-[0.3em]
                text-red-500
              "
            >
              Bluff détecté
            </p>

            <h2
              className="
                mt-3
                text-4xl
                font-black
                text-white
              "
            >
              Menteur !
            </h2>

            <p
              className="
                mt-4
                text-sm
                leading-6
                text-zinc-500
              "
            >
              {giverName} ne possédait
              aucune carte de cette
              valeur.
            </p>
          </>
        )}

        <div
          className={`
            mt-7
            rounded-3xl
            border
            px-5
            py-5
            ${accentClasses.border}
            ${accentClasses.background}
          `}
        >
          <ProfileAvatar
            size="large"
            avatarType={
              punishedPlayer
                ?.avatarType ??
              "DEFAULT"
            }
            avatarId={
              punishedPlayer
                ?.avatarId ??
              "fox"
            }
            avatarPhoto={
              punishedPlayer
                ?.avatarPhoto ??
              null
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
            {punishedPlayerName}
          </p>

          <p
            className={`
              mt-1
              text-xs
              font-black
              uppercase
              tracking-wider
              ${accentClasses.text}
            `}
          >
            doit boire
          </p>

          <p
            className={`
              mt-3
              text-6xl
              font-black
              leading-none
              ${accentClasses.text}
            `}
          >
            +{result.drinks}
          </p>

          <p
            className={`
              mt-2
              text-sm
              font-black
              uppercase
              tracking-[0.2em]
              ${accentClasses.text}
            `}
          >
            {drinksLabel}
          </p>
        </div>

        <div className="mt-8 h-1 overflow-hidden rounded-full bg-zinc-800">
          <div
            className={`
              bluff-result-progress
              h-full
              rounded-full
              ${accentClasses.progress}
            `}
          />
        </div>
      </div>

      <style>{`
        @keyframes bluff-result-enter {
          0% {
            opacity: 0;
            transform:
              translateY(30px)
              scale(0.88);
          }

          65% {
            opacity: 1;
            transform:
              translateY(-4px)
              scale(1.03);
          }

          100% {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        @keyframes bluff-result-icon {
          0% {
            opacity: 0;
            transform:
              rotate(-15deg)
              scale(0.25);
          }

          70% {
            opacity: 1;
            transform:
              rotate(5deg)
              scale(1.15);
          }

          100% {
            opacity: 1;
            transform:
              rotate(0)
              scale(1);
          }
        }

        @keyframes bluff-result-glow {
          0%,
          100% {
            opacity: 0.35;
            transform:
              scale(0.85);
          }

          50% {
            opacity: 0.8;
            transform:
              scale(1.2);
          }
        }

        @keyframes bluff-result-progress {
          from {
            width: 100%;
          }

          to {
            width: 0%;
          }
        }

        .bluff-result-card {
          animation:
            bluff-result-enter
            450ms
            cubic-bezier(
              0.22,
              1,
              0.36,
              1
            )
            both;
        }

        .bluff-result-icon {
          animation:
            bluff-result-icon
            650ms
            cubic-bezier(
              0.34,
              1.56,
              0.64,
              1
            )
            both;
        }

        .bluff-result-glow {
          animation:
            bluff-result-glow
            1800ms
            ease-in-out
            infinite;
        }

        .bluff-result-progress {
          animation:
            bluff-result-progress
            ${DUREE_AFFICHAGE}ms
            linear
            forwards;
        }

        @media (
          prefers-reduced-motion:
          reduce
        ) {
          .bluff-result-card,
          .bluff-result-icon,
          .bluff-result-glow,
          .bluff-result-progress {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}