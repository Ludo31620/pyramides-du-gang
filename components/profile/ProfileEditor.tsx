"use client";

import ThemeButton from "@/components/ui/ThemeButton";

import AvatarPicker from "./AvatarPicker";

interface ProfileEditorProps {
  pseudo: string;

  onPseudoChange: (
    value: string
  ) => void;

  selectedAvatarId: string;

  onAvatarSelect: (
    avatarId: string
  ) => void;

  onSave: () => void;

  onReset: () => void;

  savedMessage:
    | string
    | null;
}

export default function ProfileEditor({
  pseudo,
  onPseudoChange,
  selectedAvatarId,
  onAvatarSelect,
  onSave,
  onReset,
  savedMessage,
}: ProfileEditorProps) {
  return (
    <section className="mt-9">
      <p
        className="
          text-xs
          font-black
          uppercase
          tracking-[0.22em]
          text-[var(--color-primary)]
        "
      >
        Personnalisation
      </p>

      <h2
        className="
          mt-2
          text-2xl
          font-black
        "
      >
        Modifier mon profil
      </h2>

      <label
        htmlFor="profile-pseudo"
        className="
          mt-6
          block
          text-sm
          font-black
        "
      >
        Pseudo
      </label>

      <input
        id="profile-pseudo"
        type="text"
        value={pseudo}
        maxLength={24}
        autoComplete="nickname"
        onChange={(event) =>
          onPseudoChange(
            event.target.value
          )
        }
        className="
          mt-2
          min-h-14
          w-full
          rounded-2xl
          border
          border-[var(--color-border)]
          bg-[var(--color-surface-elevated)]
          px-4
          py-3
          font-bold
          text-[var(--color-text)]
          outline-none
          transition
          placeholder:text-[var(--color-text-muted)]
          focus:border-[var(--color-primary)]
        "
      />

      <div className="mt-7">
        <AvatarPicker
          selectedAvatarId={
            selectedAvatarId
          }
          onSelectAvatar={
            onAvatarSelect
          }
        />
      </div>

      <p
        className="
          mt-4
          text-center
          text-xs
          leading-5
          text-[var(--color-text-muted)]
        "
      >
        Pour utiliser une photo,
        appuie directement sur le
        petit bouton caméra de
        l’avatar.
      </p>

      <div className="mt-7 space-y-3">
        <ThemeButton
          type="button"
          variant="primary"
          onClick={onSave}
        >
          Enregistrer
        </ThemeButton>

        <ThemeButton
          type="button"
          variant="secondary"
          onClick={onReset}
        >
          Réinitialiser
        </ThemeButton>

        {savedMessage && (
          <p
            role="status"
            className="
              text-center
              text-sm
              font-black
              text-[var(--color-success)]
            "
          >
            ✓ {savedMessage}
          </p>
        )}
      </div>
    </section>
  );
}