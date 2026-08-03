"use client";

import {
  BUILT_IN_AVATARS,
} from "@/lib/profile/avatars";

interface AvatarPickerProps {
  selectedAvatarId:
    string;

  onSelectAvatar: (
    avatarId: string
  ) => void;
}

export default function AvatarPicker({
  selectedAvatarId,
  onSelectAvatar,
}: AvatarPickerProps) {
  return (
    <div>
      <p className="text-sm font-black">
        Choisir un avatar
      </p>

      <p
        className="
          mt-1
          text-xs
          leading-5
          text-[var(--color-text-muted)]
        "
      >
        L’avatar sélectionné sera utilisé
        sur ton profil et, prochainement,
        dans les parties multijoueur.
      </p>

      <div
        className="
          mt-4
          grid
          grid-cols-4
          gap-3
        "
      >
        {BUILT_IN_AVATARS.map(
          (
            avatar
          ) => {
            const selected =
              avatar.id ===
              selectedAvatarId;

            return (
              <button
                key={
                  avatar.id
                }
                type="button"
                title={
                  avatar.name
                }
                aria-label={
                  `Choisir l’avatar ${avatar.name}`
                }
                aria-pressed={
                  selected
                }
                onClick={() => {
                  onSelectAvatar(
                    avatar.id
                  );
                }}
                className={`
                  flex
                  aspect-square
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  text-3xl
                  transition
                  duration-200
                  active:scale-95
                  ${
                    selected
                      ? `
                          border-[var(--color-primary)]
                          bg-[var(--color-primary)]
                          text-[var(--color-primary-text)]
                          shadow-lg
                        `
                      : `
                          border-[var(--color-border)]
                          bg-[var(--color-surface-elevated)]
                          hover:border-[var(--color-primary)]
                        `
                  }
                `}
              >
                {
                  avatar.emoji
                }
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}