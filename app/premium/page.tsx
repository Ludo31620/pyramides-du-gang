"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import ThemeButton from "@/components/ui/ThemeButton";
import ThemeCard from "@/components/ui/ThemeCard";

import {
  getUserEntitlements,
  setPremiumForTesting,
} from "@/lib/premium/storage";

import {
  getAvailableThemes,
} from "@/lib/theme/themes";

import {
  useTheme,
} from "@/lib/theme/ThemeContext";

import type {
  ThemeId,
} from "@/lib/theme/types";

export default function PremiumPage() {
  const {
    themeId,
    setTheme,
  } = useTheme();

  const [
    premium,
    setPremium,
  ] = useState(false);

  const [
    ready,
    setReady,
  ] = useState(false);

  const themes =
    getAvailableThemes();

  useEffect(() => {
    const entitlements =
      getUserEntitlements();

    setPremium(
      entitlements.premium
    );

    setReady(true);
  }, []);

  function handleTogglePremium():
    void {
    const nextPremium =
      !premium;

    const entitlements =
      setPremiumForTesting(
        nextPremium
      );

    setPremium(
      entitlements.premium
    );

    if (
      !entitlements.premium &&
      themeId !== "classic"
    ) {
      setTheme(
        "classic"
      );
    }
  }

  function handleSelectTheme(
    nextThemeId: ThemeId,
    isPremiumTheme: boolean
  ): void {
    if (
      isPremiumTheme &&
      !premium
    ) {
      return;
    }

    setTheme(
      nextThemeId
    );
  }

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
          <p
            className="
              text-xs
              font-black
              uppercase
              tracking-[0.25em]
              text-[var(--color-primary)]
            "
          >
            Pyramide du Gang
          </p>

          <h1 className="mt-3 text-4xl font-black uppercase leading-tight">
            Premium
          </h1>

          <p
            className="
              mt-4
              text-sm
              leading-7
              text-[var(--color-text-muted)]
            "
          >
            Débloque des thèmes
            exclusifs, les statistiques
            personnelles, l’historique
            des parties et les variantes
            personnalisées.
          </p>

          <div className="mt-7 space-y-3">
            <ThemeCard
              as="div"
              variant="elevated"
              className="rounded-2xl p-4 shadow-none sm:p-4"
            >
              <p className="font-black">
                🎨 Thèmes exclusifs
              </p>

              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Personnalise l’ambiance
                du jeu.
              </p>
            </ThemeCard>

            <ThemeCard
              as="div"
              variant="elevated"
              className="rounded-2xl p-4 shadow-none sm:p-4"
            >
              <p className="font-black">
                📊 Statistiques
              </p>

              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Suis tes bluffs,
                victoires et sanctions.
              </p>
            </ThemeCard>

            <ThemeCard
              as="div"
              variant="elevated"
              className="rounded-2xl p-4 shadow-none sm:p-4"
            >
              <p className="font-black">
                📜 Historique
              </p>

              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Retrouve les résultats
                de tes anciennes parties.
              </p>
            </ThemeCard>

            <ThemeCard
              as="div"
              variant="elevated"
              className="rounded-2xl p-4 shadow-none sm:p-4"
            >
              <p className="font-black">
                ⚙️ Variantes
                personnalisées
              </p>

              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Adapte certaines règles
                à ton groupe.
              </p>
            </ThemeCard>
          </div>

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

            <h2 className="mt-2 text-2xl font-black">
              Choisis ton thème
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
              Le changement est appliqué
              immédiatement et conservé
              sur cet appareil.
            </p>

            <div className="mt-6 space-y-3">
              {themes.map(
                (
                  availableTheme
                ) => {
                  const selected =
                    availableTheme.id ===
                    themeId;

                  const locked =
                    availableTheme.premium &&
                    !premium;

                  return (
                    <button
                      key={
                        availableTheme.id
                      }
                      type="button"
                      disabled={
                        locked
                      }
                      onClick={() =>
                        handleSelectTheme(
                          availableTheme.id,
                          availableTheme.premium
                        )
                      }
                      className={`
                        flex
                        w-full
                        items-center
                        gap-4
                        rounded-2xl
                        border
                        px-4
                        py-4
                        text-left
                        transition
                        duration-200
                        active:scale-[0.99]
                        disabled:cursor-not-allowed
                        ${
                          selected
                            ? `
                                border-[var(--color-primary)]
                                bg-[var(--color-primary)]
                                text-[var(--color-primary-text)]
                              `
                            : `
                                border-[var(--color-border)]
                                bg-[var(--color-surface-elevated)]
                                text-[var(--color-text)]
                              `
                        }
                        ${
                          locked
                            ? "opacity-55"
                            : ""
                        }
                      `}
                    >
                      <span
                        aria-hidden="true"
                        className="text-2xl"
                      >
                        {
                          availableTheme.icon
                        }
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="font-black">
                            {
                              availableTheme.name
                            }
                          </span>

                          {availableTheme.premium && (
                            <span
                              className={`
                                rounded-full
                                px-2
                                py-1
                                text-[10px]
                                font-black
                                uppercase
                                tracking-wider
                                ${
                                  selected
                                    ? "bg-black/15"
                                    : "bg-[var(--color-primary)] text-[var(--color-primary-text)]"
                                }
                              `}
                            >
                              Premium
                            </span>
                          )}
                        </span>

                        <span
                          className={`
                            mt-1
                            block
                            text-sm
                            ${
                              selected
                                ? "opacity-75"
                                : "text-[var(--color-text-muted)]"
                            }
                          `}
                        >
                          {
                            availableTheme.description
                          }
                        </span>
                      </span>

                      <span
                        aria-hidden="true"
                        className="text-lg font-black"
                      >
                        {locked
                          ? "🔒"
                          : selected
                            ? "✓"
                            : "›"}
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </section>

          <ThemeCard
            as="div"
            variant="elevated"
            className="mt-8 rounded-2xl p-5 text-center shadow-none sm:p-5"
          >
            <p className="text-sm text-[var(--color-text-muted)]">
              Achat unique prévu
            </p>

            <p className="mt-2 text-4xl font-black text-[var(--color-primary)]">
              4,99 €
            </p>

            <p className="mt-2 text-xs text-[var(--color-text-muted)]">
              Aucun abonnement
            </p>
          </ThemeCard>

          {ready && (
            <div className="mt-8">
              <ThemeButton
                type="button"
                variant={
                  premium
                    ? "secondary"
                    : "primary"
                }
                onClick={
                  handleTogglePremium
                }
                className={
                  premium
                    ? "border-[var(--color-success)] text-[var(--color-success)]"
                    : ""
                }
              >
                {premium
                  ? "Premium activé"
                  : "Activer Premium pour tester"}
              </ThemeButton>

              <p className="mt-3 text-center text-xs text-[var(--color-text-muted)]">
                Bouton temporaire
                réservé au développement.
              </p>
            </div>
          )}
        </ThemeCard>
      </div>
    </main>
  );
}