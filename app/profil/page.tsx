"use client";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ProfileEditor from "@/components/profile/ProfileEditor";
import ThemeCard from "@/components/ui/ThemeCard";

import {
  getAllAchievements,
} from "@/lib/achievements/achievements";

import {
  getUnlockedAchievements,
} from "@/lib/achievements/storage";

import {
  imageFileToDataUrl,
  resizeAvatar,
} from "@/lib/profile/image";

import {
  getPlayerProfile,
  resetPlayerProfile,
  savePlayerProfile,
} from "@/lib/profile/storage";

import {
  DEFAULT_PLAYER_PROFILE,
} from "@/lib/profile/types";

import type {
  PlayerProfile,
} from "@/lib/profile/types";

import {
  getPlayerLifetimeStats,
} from "@/lib/stats/storage";

import type {
  PlayerLifetimeStats,
} from "@/lib/stats/types";

function getPlayerRank(
  stats: PlayerLifetimeStats
): string {
  if (
    stats.gamesPlayed >= 250 ||
    stats.successfulBluffs >= 100
  ) {
    return "Légende du Gang";
  }

  if (
    stats.gamesPlayed >= 100 ||
    stats.successfulBluffs >= 50
  ) {
    return "Le Parrain";
  }

  if (
    stats.gamesPlayed >= 50 ||
    stats.successfulBluffs >= 25
  ) {
    return "Maître du Bluff";
  }

  if (
    stats.gamesPlayed >= 10 ||
    stats.successfulBluffs >= 10
  ) {
    return "Membre confirmé";
  }

  return "Nouvelle recrue";
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number | string;
}) {
  return (
    <ThemeCard
      as="div"
      variant="elevated"
      className="
        rounded-2xl
        p-4
        shadow-none
        sm:p-4
      "
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="text-2xl"
        >
          {icon}
        </span>

        <div className="min-w-0">
          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-wider
              text-[var(--color-text-muted)]
            "
          >
            {label}
          </p>

          <p
            className="
              mt-1
              text-xl
              font-black
              text-[var(--color-text)]
            "
          >
            {value}
          </p>
        </div>
      </div>
    </ThemeCard>
  );
}

export default function ProfilePage() {
  const [
    stats,
    setStats,
  ] =
    useState<PlayerLifetimeStats | null>(
      null
    );

  const [
    profile,
    setProfile,
  ] =
    useState<PlayerProfile>(
      DEFAULT_PLAYER_PROFILE
    );

  const [
    pseudo,
    setPseudo,
  ] = useState(
    DEFAULT_PLAYER_PROFILE.pseudo
  );

  const [
    selectedAvatarId,
    setSelectedAvatarId,
  ] =
    useState<string>(
      DEFAULT_PLAYER_PROFILE
        .avatarId ??
        "fox"
    );

  const [
    unlockedCount,
    setUnlockedCount,
  ] = useState(0);

  const [
    ready,
    setReady,
  ] = useState(false);

  const [
    savedMessage,
    setSavedMessage,
  ] =
    useState<string | null>(
      null
    );

  const totalAchievements =
    useMemo(
      () =>
        getAllAchievements()
          .length,
      []
    );

  useEffect(() => {
    const storedProfile =
      getPlayerProfile();

    setProfile(
      storedProfile
    );

    setPseudo(
      storedProfile.pseudo
    );

    setSelectedAvatarId(
      storedProfile.avatarId ??
        "fox"
    );

    setStats(
      getPlayerLifetimeStats()
    );

    setUnlockedCount(
      getUnlockedAchievements()
        .length
    );

    setReady(true);
  }, []);

  useEffect(() => {
    if (!savedMessage) {
      return;
    }

    const timeoutId =
      window.setTimeout(
        () => {
          setSavedMessage(
            null
          );
        },
        2500
      );

    return () => {
      window.clearTimeout(
        timeoutId
      );
    };
  }, [
    savedMessage,
  ]);

  function handleSaveProfile():
    void {
    const normalizedPseudo =
      pseudo
        .trim()
        .slice(
          0,
          24
        );

    const updatedProfile:
      PlayerProfile = {
      ...profile,

      pseudo:
        normalizedPseudo ||
        "Joueur",

      avatarId:
        profile.avatarType ===
          "DEFAULT"
          ? selectedAvatarId
          : profile.avatarId,
    };

    savePlayerProfile(
      updatedProfile
    );

    setProfile(
      updatedProfile
    );

    setPseudo(
      updatedProfile.pseudo
    );

    setSavedMessage(
      "Profil enregistré"
    );
  }

  async function handlePhotoSelected(
    file: File
  ): Promise<void> {
    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      setSavedMessage(
        "Le fichier choisi n’est pas une image"
      );

      return;
    }

    try {
      const dataUrl =
        await imageFileToDataUrl(
          file
        );

      const avatarPhoto =
        await resizeAvatar(
          dataUrl,
          256
        );

      setProfile(
        (
          currentProfile
        ) => ({
          ...currentProfile,

          avatarType:
            "PHOTO",

          avatarPhoto,
        })
      );

      setSavedMessage(
        "Photo ajoutée"
      );
    } catch {
      setSavedMessage(
        "Impossible de traiter cette photo"
      );
    }
  }

  function handlePhotoRemoved():
    void {
    setProfile(
      (
        currentProfile
      ) => ({
        ...currentProfile,

        avatarType:
          "DEFAULT",

        avatarId:
          selectedAvatarId,

        avatarPhoto:
          null,
      })
    );

    setSavedMessage(
      "Photo supprimée"
    );
  }

  function handleAvatarSelect(
    avatarId: string
  ): void {
    setSelectedAvatarId(
      avatarId
    );

    setProfile(
      (
        currentProfile
      ) => ({
        ...currentProfile,

        avatarType:
          "DEFAULT",

        avatarId,

        avatarPhoto:
          null,
      })
    );
  }

  function handleResetProfile():
    void {
    resetPlayerProfile();

    const resetProfile = {
      ...DEFAULT_PLAYER_PROFILE,
    };

    setProfile(
      resetProfile
    );

    setPseudo(
      resetProfile.pseudo
    );

    setSelectedAvatarId(
      resetProfile.avatarId ??
        "fox"
    );

    setSavedMessage(
      "Profil réinitialisé"
    );
  }

  if (
    !ready ||
    !stats
  ) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[var(--color-background)]
          px-5
          text-[var(--color-text)]
        "
      >
        <p
          className="
            text-sm
            font-bold
            text-[var(--color-text-muted)]
          "
        >
          Chargement du profil…
        </p>
      </main>
    );
  }

  const bluffSuccessRate =
    stats.bluffsAttempted > 0
      ? Math.round(
          (
            stats.successfulBluffs /
            stats.bluffsAttempted
          ) * 100
        )
      : 0;

  const rank =
    getPlayerRank(
      stats
    );

  const displayedPseudo =
    pseudo.trim() ||
    profile.pseudo ||
    "Joueur";

  return (
    <main
      className="
        min-h-screen
        bg-[var(--color-background)]
        px-5
        py-6
        text-[var(--color-text)]
        transition-colors
        duration-200
      "
    >
      <div className="mx-auto w-full max-w-md">
        <Link
          href="/"
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            font-bold
            text-[var(--color-text-muted)]
            transition
            hover:text-[var(--color-text)]
          "
        >
          ← Retour
        </Link>

        <ThemeCard
          variant="highlighted"
          className="mt-8"
        >
          <div className="text-center">
            <ProfileAvatar
              avatarType={
                profile.avatarType
              }
              avatarId={
                selectedAvatarId
              }
              avatarPhoto={
                profile.avatarPhoto
              }
              onPhotoSelected={
                handlePhotoSelected
              }
              onPhotoRemoved={
                handlePhotoRemoved
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
              "
            >
              {displayedPseudo}
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
              <span aria-hidden="true">
                👑
              </span>

              <span className="text-sm font-black">
                {rank}
              </span>
            </div>
          </div>

          <ProfileEditor
            pseudo={
              pseudo
            }
            onPseudoChange={
              setPseudo
            }
            selectedAvatarId={
              selectedAvatarId
            }
            onAvatarSelect={
              handleAvatarSelect
            }
            onSave={
              handleSaveProfile
            }
            onReset={
              handleResetProfile
            }
            savedMessage={
              savedMessage
            }
          />

          <div
            className="
              mt-10
              grid
              grid-cols-2
              gap-3
            "
          >
            <StatCard
              icon="🎮"
              label="Parties"
              value={
                stats.gamesPlayed
              }
            />

            <StatCard
              icon="🏆"
              label="Succès"
              value={
                `${unlockedCount} / ${totalAchievements}`
              }
            />

            <StatCard
              icon="🍻"
              label="Données"
              value={
                stats.drinksGiven
              }
            />

            <StatCard
              icon="🥴"
              label="Reçues"
              value={
                stats.drinksReceived
              }
            />

            <StatCard
              icon="🎭"
              label="Bluffs"
              value={
                stats.bluffsAttempted
              }
            />

            <StatCard
              icon="📈"
              label="Réussite"
              value={
                `${bluffSuccessRate} %`
              }
            />
          </div>

          <div className="mt-8 space-y-3">
            <Link
              href="/statistiques"
              className="
                flex
                min-h-14
                w-full
                items-center
                justify-between
                rounded-2xl
                border
                border-[var(--color-border)]
                bg-[var(--color-surface-elevated)]
                px-5
                py-4
                font-black
                transition
                hover:border-[var(--color-primary)]
                active:scale-[0.98]
              "
            >
              <span>
                📊 Statistiques détaillées
              </span>

              <span
                aria-hidden="true"
                className="text-[var(--color-text-muted)]"
              >
                ›
              </span>
            </Link>

            <Link
              href="/succes"
              className="
                flex
                min-h-14
                w-full
                items-center
                justify-between
                rounded-2xl
                border
                border-[var(--color-border)]
                bg-[var(--color-surface-elevated)]
                px-5
                py-4
                font-black
                transition
                hover:border-[var(--color-primary)]
                active:scale-[0.98]
              "
            >
              <span>
                🏆 Voir les succès
              </span>

              <span
                aria-hidden="true"
                className="text-[var(--color-text-muted)]"
              >
                ›
              </span>
            </Link>

            <Link
              href="/premium"
              className="
                flex
                min-h-14
                w-full
                items-center
                justify-between
                rounded-2xl
                border
                border-[var(--color-primary)]
                bg-[var(--color-primary)]
                px-5
                py-4
                font-black
                text-[var(--color-primary-text)]
                transition
                hover:bg-[var(--color-primary-hover)]
                active:scale-[0.98]
              "
            >
              <span>
                💎 Découvrir Premium
              </span>

              <span aria-hidden="true">
                ›
              </span>
            </Link>
          </div>

          <p
            className="
              mt-6
              text-center
              text-xs
              leading-5
              text-[var(--color-text-muted)]
            "
          >
            Le profil est enregistré
            localement sur cet appareil.
          </p>
        </ThemeCard>
      </div>
    </main>
  );
}