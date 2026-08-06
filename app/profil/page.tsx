"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import ProfileAchievementPreview from "@/components/profile/ProfileAchievementPreview";
import ProfileEditor from "@/components/profile/ProfileEditor";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStatsGrid from "@/components/profile/ProfileStatsGrid";
import ThemeCard from "@/components/ui/ThemeCard";

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
  ACHIEVEMENTS,
  createPlayerProgress,
  getLevelProgress,
  loadProgress,
} from "@/lib/profileProgress";

import type {
  PlayerProgress,
  PlayerProgressStats,
} from "@/lib/profileProgress/types";

function getPlayerRank(
  stats: PlayerProgressStats
): string {
  if (
    stats.gamesPlayed >=
      250 ||
    stats.successfulBluffs >=
      100
  ) {
    return "Légende du Gang";
  }

  if (
    stats.gamesPlayed >=
      100 ||
    stats.successfulBluffs >=
      50
  ) {
    return "Le Parrain";
  }

  if (
    stats.gamesPlayed >=
      50 ||
    stats.successfulBluffs >=
      25
  ) {
    return "Maître du Bluff";
  }

  if (
    stats.gamesPlayed >=
      10 ||
    stats.successfulBluffs >=
      10
  ) {
    return "Membre confirmé";
  }

  return "Nouvelle recrue";
}

export default function ProfilePage() {
  const [
    progress,
    setProgress,
  ] =
    useState<PlayerProgress | null>(
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

  useEffect(() => {
    const storedProfile =
      getPlayerProfile();

    const storedProgress =
      loadProgress() ??
      createPlayerProgress();

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

    setProgress(
      storedProgress
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

      const updatedProfile:
        PlayerProfile = {
        ...profile,

        avatarType:
          "PHOTO",

        avatarPhoto,
      };

      setProfile(
        updatedProfile
      );

      savePlayerProfile(
        updatedProfile
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
    const updatedProfile:
      PlayerProfile = {
      ...profile,

      avatarType:
        "DEFAULT",

      avatarId:
        selectedAvatarId,

      avatarPhoto:
        null,
    };

    setProfile(
      updatedProfile
    );

    savePlayerProfile(
      updatedProfile
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
    !progress
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

  const stats =
    progress.stats;

  const levelProgress =
    getLevelProgress(
      progress.totalXp
    );

  const winRate =
    stats.gamesPlayed >
      0
      ? Math.round(
          (
            stats.gamesWon /
            stats.gamesPlayed
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

        <div className="mt-8 space-y-8">
          <ProfileHeader
            pseudo={
              displayedPseudo
            }
            rank={
              rank
            }
            avatarType={
              profile.avatarType
            }
            avatarId={
              selectedAvatarId
            }
            avatarPhoto={
              profile.avatarPhoto
            }
            levelProgress={
              levelProgress
            }
            onPhotoSelected={
              handlePhotoSelected
            }
            onPhotoRemoved={
              handlePhotoRemoved
            }
          />

          <ThemeCard
            variant="elevated"
            className="rounded-3xl"
          >
            <div>
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
                  mt-1
                  text-2xl
                  font-black
                  text-[var(--color-text)]
                "
              >
                Modifier le profil
              </h2>
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
          </ThemeCard>

          <ProfileStatsGrid
            gamesPlayed={
              stats.gamesPlayed
            }
            gamesWon={
              stats.gamesWon
            }
            winRate={
              winRate
            }
            drinksGiven={
              stats.drinksGiven
            }
            drinksTaken={
              stats.drinksTaken
            }
            successfulBluffs={
              stats.successfulBluffs
            }
          />

          <ProfileAchievementPreview
            achievements={
              ACHIEVEMENTS
            }
            unlockedAchievements={
              progress
                .unlockedAchievements
            }
          />

          <section className="space-y-3">
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
          </section>

          <p
            className="
              pb-4
              text-center
              text-xs
              leading-5
              text-[var(--color-text-muted)]
            "
          >
            Le profil et la progression sont
            enregistrés localement sur cet
            appareil.
          </p>
        </div>
      </div>
    </main>
  );
}