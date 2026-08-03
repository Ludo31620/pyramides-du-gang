"use client";

interface PhotoActionSheetProps {
  open: boolean;

  hasPhoto: boolean;

  onTakePhoto: () => void;

  onChoosePhoto: () => void;

  onRemovePhoto: () => void;

  onClose: () => void;
}

export default function PhotoActionSheet({
  open,
  hasPhoto,
  onTakePhoto,
  onChoosePhoto,
  onRemovePhoto,
  onClose,
}: PhotoActionSheetProps) {
  if (!open) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        aria-label="Fermer le menu photo"
        onClick={onClose}
        className="
          fixed
          inset-0
          z-[190]
          cursor-default
          bg-black/70
          backdrop-blur-sm
        "
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-label="Modifier la photo de profil"
        className="
          fixed
          inset-x-3
          bottom-3
          z-[200]
          mx-auto
          w-auto
          max-w-md
          rounded-[2rem]
          border
          border-[var(--color-border)]
          bg-[var(--color-surface)]
          p-5
          text-[var(--color-text)]
          shadow-2xl
        "
      >
        <div className="text-center">
          <div
            className="
              mx-auto
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-[var(--color-primary)]
              text-xl
              text-[var(--color-primary-text)]
            "
          >
            📷
          </div>

          <h2
            className="
              mt-4
              text-xl
              font-black
            "
          >
            Modifier la photo
          </h2>

          <p
            className="
              mt-2
              text-sm
              text-[var(--color-text-muted)]
            "
          >
            Choisis comment ajouter ton
            avatar personnalisé.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={onTakePhoto}
            className="
              flex
              min-h-14
              w-full
              items-center
              gap-4
              rounded-2xl
              border
              border-[var(--color-border)]
              bg-[var(--color-surface-elevated)]
              px-5
              py-4
              text-left
              font-black
              transition
              hover:border-[var(--color-primary)]
              active:scale-[0.98]
            "
          >
            <span
              aria-hidden="true"
              className="text-xl"
            >
              📸
            </span>

            <span>
              Prendre une photo
            </span>

            <span
              aria-hidden="true"
              className="
                ml-auto
                text-[var(--color-text-muted)]
              "
            >
              ›
            </span>
          </button>

          <button
            type="button"
            onClick={onChoosePhoto}
            className="
              flex
              min-h-14
              w-full
              items-center
              gap-4
              rounded-2xl
              border
              border-[var(--color-border)]
              bg-[var(--color-surface-elevated)]
              px-5
              py-4
              text-left
              font-black
              transition
              hover:border-[var(--color-primary)]
              active:scale-[0.98]
            "
          >
            <span
              aria-hidden="true"
              className="text-xl"
            >
              🖼️
            </span>

            <span>
              Choisir dans la galerie
            </span>

            <span
              aria-hidden="true"
              className="
                ml-auto
                text-[var(--color-text-muted)]
              "
            >
              ›
            </span>
          </button>

          {hasPhoto && (
            <button
              type="button"
              onClick={onRemovePhoto}
              className="
                flex
                min-h-14
                w-full
                items-center
                gap-4
                rounded-2xl
                border
                border-red-500/40
                bg-red-500/10
                px-5
                py-4
                text-left
                font-black
                text-red-400
                transition
                hover:border-red-500
                hover:bg-red-500/15
                active:scale-[0.98]
              "
            >
              <span
                aria-hidden="true"
                className="text-xl"
              >
                🗑️
              </span>

              <span>
                Supprimer la photo
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="
              min-h-14
              w-full
              rounded-2xl
              px-5
              py-4
              font-black
              text-[var(--color-text-muted)]
              transition
              hover:bg-[var(--color-surface-elevated)]
              hover:text-[var(--color-text)]
              active:scale-[0.98]
            "
          >
            Annuler
          </button>
        </div>
      </section>
    </>
  );
}