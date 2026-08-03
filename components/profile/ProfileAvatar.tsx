"use client";

import {
  useRef,
  useState,
} from "react";

import {
  BUILT_IN_AVATARS,
} from "@/lib/profile/avatars";

import type {
  PlayerAvatarType,
} from "@/lib/profile/types";

import PhotoActionSheet from "./PhotoActionSheet";

interface ProfileAvatarProps {
  avatarType:
    PlayerAvatarType;

  avatarId:
    string | null;

  avatarPhoto:
    string | null;

  size?:
    | "small"
    | "medium"
    | "large";

  className?: string;

  onPhotoSelected?: (
    file: File
  ) => void;

  onPhotoRemoved?: () => void;
}

const SIZE_CLASSES = {
  small:
    "h-12 w-12 text-2xl",

  medium:
    "h-16 w-16 text-3xl",

  large:
    "h-24 w-24 text-5xl",
} as const;

const CAMERA_SIZE_CLASSES = {
  small:
    "h-7 w-7 text-xs -bottom-1 -right-1",

  medium:
    "h-9 w-9 text-sm -bottom-1 -right-1",

  large:
    "h-11 w-11 text-lg -bottom-1 -right-1",
} as const;

export default function ProfileAvatar({
  avatarType,
  avatarId,
  avatarPhoto,
  size = "large",
  className = "",
  onPhotoSelected,
  onPhotoRemoved,
}: ProfileAvatarProps) {
  const cameraInputRef =
    useRef<HTMLInputElement>(
      null
    );

  const galleryInputRef =
    useRef<HTMLInputElement>(
      null
    );

  const [
    actionSheetOpen,
    setActionSheetOpen,
  ] = useState(false);

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

  function handlePickedFile(
    file:
      | File
      | undefined
  ): void {
    if (!file) {
      return;
    }

    setActionSheetOpen(
      false
    );

    onPhotoSelected?.(
      file
    );
  }

  function handleRemovePhoto():
    void {
    setActionSheetOpen(
      false
    );

    onPhotoRemoved?.();
  }

  return (
    <>
      <div
        className={`
          relative
          mx-auto
          w-fit
          ${className}
        `}
      >
        <div
          className={`
            flex
            shrink-0
            items-center
            justify-center
            overflow-hidden
            rounded-full
            border-2
            border-[var(--color-primary)]
            bg-[var(--color-primary)]
            text-[var(--color-primary-text)]
            shadow-lg
            ${SIZE_CLASSES[size]}
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

        {onPhotoSelected && (
          <button
            type="button"
            aria-label="Modifier la photo de profil"
            title="Modifier la photo"
            onClick={() => {
              setActionSheetOpen(
                true
              );
            }}
            className={`
              absolute
              z-10
              flex
              items-center
              justify-center
              rounded-full
              border-2
              border-[var(--color-background)]
              bg-[var(--color-primary)]
              text-[var(--color-primary-text)]
              shadow-lg
              transition
              hover:bg-[var(--color-primary-hover)]
              active:scale-90
              ${CAMERA_SIZE_CLASSES[size]}
            `}
          >
            <span
              aria-hidden="true"
            >
              📷
            </span>
          </button>
        )}

        <input
          ref={cameraInputRef}
          hidden
          type="file"
          accept="image/*"
          capture="user"
          onChange={(
            event
          ) => {
            handlePickedFile(
              event.target
                .files?.[0]
            );

            event.target.value =
              "";
          }}
        />

        <input
          ref={galleryInputRef}
          hidden
          type="file"
          accept="image/*"
          onChange={(
            event
          ) => {
            handlePickedFile(
              event.target
                .files?.[0]
            );

            event.target.value =
              "";
          }}
        />
      </div>

      <PhotoActionSheet
        open={
          actionSheetOpen
        }
        hasPhoto={
          shouldDisplayPhoto
        }
        onTakePhoto={() => {
          cameraInputRef.current
            ?.click();
        }}
        onChoosePhoto={() => {
          galleryInputRef.current
            ?.click();
        }}
        onRemovePhoto={
          handleRemovePhoto
        }
        onClose={() => {
          setActionSheetOpen(
            false
          );
        }}
      />
    </>
  );
}