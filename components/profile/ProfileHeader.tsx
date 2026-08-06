"use client";

import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ThemeCard from "@/components/ui/ThemeCard";

import type {
  PlayerAvatarType,
} from "@/lib/profile/types";

import type {
  LevelProgress,
} from "@/lib/profileProgress/types";

interface ProfileHeaderProps {
  pseudo: string;

  rank: string;

  avatarType:
    PlayerAvatarType;

  avatarId:
    string | null;

  avatarPhoto:
    string | null;

  levelProgress:
    LevelProgress;

  onPhotoSelected?: (
    file: File
  ) => void;

  onPhotoRemoved?: () => void;
}

export default function ProfileHeader({
  pseudo,
  rank,
  avatarType,
  avatarId,
  avatarPhoto,
  levelProgress,
  onPhotoSelected,
  onPhotoRemoved,
}: ProfileHeaderProps) {
  const progressPercent =
    Math.min(
      100,
      Math.max(
        0,
        Math.round(
          levelProgress
            .progressRatio *
            100
        )
      )
    );

  return (
    <ThemeCard
      variant="highlighted"
      className="
        overflow-hidden
        p-0
      "
    >
      <div
        className="
          relative
          overflow-hidden
          px-6
          pb-7
          pt-8
          text-center
        "
      >
        <div
          aria-hidden="true"
          className="
            absolute
            left-1/2
            top-0
            h-48
            w-48
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[var(--color-primary)]
            opacity-15
            blur-3xl
          "
        />

        <div className="relative">
          <ProfileAvatar
            avatarType={
              avatarType
            }
            avatarId={
              avatarId
            }
            avatarPhoto={
              avatarPhoto
            }
            size="large"
            onPhotoSelected={
              onPhotoSelected
            }
            onPhotoRemoved={
              onPhotoRemoved
            }
          />

          <p
            className="
              mt-5
              text-xs
              font-black
              uppercase
              tracking-[0.25em]
              text-[var(--color-primary)]
            "
          >
            Profil joueur
          </p>

          <h1
            className="
              mt-2
              break-words
              text-4xl
              font-black
              tracking-tight
              text-[var(--color-text)]
            "
          >
            {pseudo}
          </h1>

          <div
            className="
              mt-4
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-[var(--color-border)]
              bg-[var(--color-surface-elevated)]
              px-4
              py-2
            "
          >
            <span
              aria-hidden="true"
            >
              👑
            </span>

            <span
              className="
                text-sm
                font-black
                text-[var(--color-text)]
              "
            >
              {rank}
            </span>
          </div>
        </div>
      </div>

      <div
        className="
          border-t
          border-[var(--color-border)]
          bg-[var(--color-surface-elevated)]
          px-6
          py-5
        "
      >
        <div
          className="
            flex
            items-end
            justify-between
            gap-4
          "
        >
          <div>
            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.2em]
                text-[var(--color-text-muted)]
              "
            >
              Progression
            </p>

            <p
              className="
                mt-1
                text-2xl
                font-black
                text-[var(--color-text)]
              "
            >
              Niveau{" "}
              {
                levelProgress
                  .level
              }
            </p>
          </div>

          <p
            className="
              text-right
              text-sm
              font-black
              text-[var(--color-primary)]
            "
          >
            {
              levelProgress
                .currentLevelXp
            }
            {" / "}
            {
              levelProgress
                .requiredXpForNextLevel
            }
            {" XP"}
          </p>
        </div>

        <div
          className="
            mt-4
            h-3
            overflow-hidden
            rounded-full
            bg-[var(--color-background)]
          "
          role="progressbar"
          aria-label="Progression vers le prochain niveau"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={
            progressPercent
          }
        >
          <div
            className="
              h-full
              rounded-full
              bg-[var(--color-primary)]
              transition-[width]
              duration-500
            "
            style={{
              width:
                `${progressPercent}%`,
            }}
          />
        </div>

        <div
          className="
            mt-3
            flex
            items-center
            justify-between
            text-xs
            font-bold
            text-[var(--color-text-muted)]
          "
        >
          <span>
            {
              levelProgress
                .totalXp
            }
            {" XP au total"}
          </span>

          <span>
            {
              progressPercent
            }
            %
          </span>
        </div>
      </div>
    </ThemeCard>
  );
}