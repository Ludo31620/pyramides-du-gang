import {
  BUILT_IN_AVATARS,
} from "@/lib/profile/avatars";

import type {
  PlayerAvatarType,
} from "@/lib/profile/types";

interface ProfileAvatarProps {
  avatarType:
    PlayerAvatarType;

  avatarId:
    string | null;

  avatarPhoto:
    string | null;

  size?:
    "small" |
    "medium" |
    "large";

  className?: string;
}

const SIZE_CLASSES = {
  small:
    "h-12 w-12 text-2xl",

  medium:
    "h-16 w-16 text-3xl",

  large:
    "h-24 w-24 text-5xl",
} as const;

export default function ProfileAvatar({
  avatarType,
  avatarId,
  avatarPhoto,
  size = "large",
  className = "",
}: ProfileAvatarProps) {
  const builtInAvatar =
    BUILT_IN_AVATARS.find(
      (
        avatar
      ) =>
        avatar.id ===
        avatarId
    ) ??
    BUILT_IN_AVATARS[0];

  const shouldDisplayPhoto =
    avatarType ===
      "PHOTO" &&
    typeof avatarPhoto ===
      "string" &&
    avatarPhoto.length > 0;

  return (
    <div
      className={`
        relative
        flex
        shrink-0
        items-center
        justify-center
        overflow-hidden
        rounded-full
        border
        border-[var(--color-primary)]
        bg-[var(--color-primary)]
        text-[var(--color-primary-text)]
        shadow-lg
        ${SIZE_CLASSES[size]}
        ${className}
      `}
    >
      {shouldDisplayPhoto ? (
        <img
          src={avatarPhoto}
          alt="Avatar personnalisé"
          className="
            h-full
            w-full
            object-cover
          "
        />
      ) : avatarType ===
        "NONE" ? (
        <span
          aria-hidden="true"
        >
          👤
        </span>
      ) : (
        <span
          aria-hidden="true"
        >
          {
            builtInAvatar
              ?.emoji ??
            "👤"
          }
        </span>
      )}
    </div>
  );
}