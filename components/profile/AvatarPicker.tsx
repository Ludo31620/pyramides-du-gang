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
        sur ton profil et dans les parties
        multijoueur.
      </p>

      <div
        className="
          mt-4
          grid
          grid-cols-3
          gap-3
          sm:grid-cols-4
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
                  relative
                  aspect-square
                  overflow-hidden
                  rounded-2xl
                  border-2
                  bg-zinc-950
                  transition
                  duration-200
                  active:scale-95
                  ${
                    selected
                      ? `
                          border-[var(--color-primary)]
                          shadow-[0_0_20px_rgba(250,204,21,0.28)]
                        `
                      : `
                          border-[var(--color-border)]
                          hover:border-[var(--color-primary)]
                        `
                  }
                `}
              >
                <img
                  src={
                    avatar.image
                  }
                  alt={
                    avatar.name
                  }
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />

                {selected && (
                  <span
                    aria-hidden="true"
                    className="
                      absolute
                      bottom-1
                      right-1
                      flex
                      h-6
                      w-6
                      items-center
                      justify-center
                      rounded-full
                      border-2
                      border-zinc-950
                      bg-[var(--color-primary)]
                      text-xs
                      font-black
                      text-[var(--color-primary-text)]
                    "
                  >
                    ✓
                  </span>
                )}
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}