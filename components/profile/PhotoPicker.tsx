"use client";

import {
  useRef,
} from "react";

interface PhotoPickerProps {
  onPick: (
    file: File
  ) => void;
}

export default function PhotoPicker({
  onPick,
}: PhotoPickerProps) {
  const inputRef =
    useRef<HTMLInputElement>(
      null
    );

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => {
          inputRef.current?.click();
        }}
        className="
          flex
          min-h-14
          w-full
          items-center
          justify-center
          rounded-2xl
          border
          border-[var(--color-border)]
          bg-[var(--color-surface-elevated)]
          px-4
          py-3
          font-black
          transition
          hover:border-[var(--color-primary)]
          active:scale-[0.98]
        "
      >
        📷 Choisir une photo
      </button>

      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/*"
        capture="user"
        onChange={(
          event
        ) => {
          const file =
            event.target.files?.[0];

          if (
            file
          ) {
            onPick(
              file
            );
          }

          event.target.value =
            "";
        }}
      />
    </div>
  );
}