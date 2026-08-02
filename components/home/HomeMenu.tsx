"use client";

import {
  useEffect,
  useState,
} from "react";

import ThemeCard from "@/components/ui/ThemeCard";

type MenuPage =
  | "MENU"
  | "RULES"
  | "ABOUT"
  | "NEWS";

interface MenuItemProps {
  icon: string;
  label: string;
  onClick: () => void;
}

function MenuItem({
  icon,
  label,
  onClick,
}: MenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex
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
        text-[var(--color-text)]
        transition
        duration-200
        hover:border-[var(--color-primary)]
        active:scale-[0.98]
      "
    >
      <span
        aria-hidden="true"
        className="text-xl"
      >
        {icon}
      </span>

      <span className="font-black">
        {label}
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
  );
}

export default function HomeMenu() {
  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);

  const [
    menuPage,
    setMenuPage,
  ] =
    useState<MenuPage>(
      "MENU"
    );

  function closeMenu(): void {
    setMenuOpen(false);
  }

  function openMenu(): void {
    setMenuPage(
      "MENU"
    );

    setMenuOpen(true);
  }

  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent
    ): void {
      if (
        event.key ===
        "Escape"
      ) {
        closeMenu();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const previousOverflow =
      document.body.style
        .overflow;

    document.body.style
      .overflow = "hidden";

    return () => {
      document.body.style
        .overflow =
        previousOverflow;
    };
  }, [menuOpen]);

  return (
    <>
      <button
        type="button"
        aria-label="Ouvrir le menu"
        onClick={openMenu}
        className="
          absolute
          right-5
          top-5
          z-20
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          border
          border-[var(--color-border)]
          bg-[var(--color-surface)]
          text-xl
          text-[var(--color-text)]
          shadow-md
          transition
          duration-200
          hover:border-[var(--color-primary)]
          hover:bg-[var(--color-surface-elevated)]
          active:scale-95
        "
      >
        ⚙️
      </button>

      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={closeMenu}
            className="
              fixed
              inset-0
              z-40
              cursor-default
              animate-[homeOverlayAppear_0.18s_ease-out_both]
              bg-black/70
            "
          />

          <ThemeCard
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            variant="default"
            className="
              fixed
              inset-x-3
              bottom-3
              z-50
              mx-auto
              max-h-[85vh]
              max-w-md
              animate-[homeMenuSlideUp_0.22s_ease-out_both]
              overflow-y-auto
              rounded-[2rem]
              p-5
              shadow-lg
              sm:bottom-auto
              sm:top-1/2
              sm:-translate-y-1/2
              sm:p-5
            "
          >
            <div className="flex items-center justify-between gap-4">
              <div>
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

                <h2 className="mt-1 text-2xl font-black">
                  {menuPage ===
                  "MENU"
                    ? "Menu"
                    : menuPage ===
                        "RULES"
                      ? "Règles"
                      : menuPage ===
                          "ABOUT"
                        ? "À propos"
                        : "Nouveautés"}
                </h2>
              </div>

              <button
                type="button"
                aria-label="Fermer"
                onClick={closeMenu}
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[var(--color-border)]
                  bg-[var(--color-surface-elevated)]
                  text-[var(--color-text-muted)]
                  transition
                  duration-200
                  hover:border-[var(--color-primary)]
                  hover:text-[var(--color-text)]
                  active:scale-95
                "
              >
                ✕
              </button>
            </div>

            {menuPage !==
              "MENU" && (
              <button
                type="button"
                onClick={() =>
                  setMenuPage(
                    "MENU"
                  )
                }
                className="
                  mt-5
                  text-sm
                  font-bold
                  text-[var(--color-primary)]
                  transition
                  hover:opacity-80
                "
              >
                ← Retour
              </button>
            )}

            {menuPage ===
              "MENU" && (
              <div className="mt-7 space-y-3">
                <MenuItem
                  icon="📖"
                  label="Règles"
                  onClick={() =>
                    setMenuPage(
                      "RULES"
                    )
                  }
                />

                <MenuItem
                  icon="👤"
                  label="À propos"
                  onClick={() =>
                    setMenuPage(
                      "ABOUT"
                    )
                  }
                />

                <MenuItem
                  icon="🆕"
                  label="Nouveautés"
                  onClick={() =>
                    setMenuPage(
                      "NEWS"
                    )
                  }
                />
              </div>
            )}

            {menuPage ===
              "RULES" && (
              <div
                className="
                  mt-6
                  space-y-5
                  text-sm
                  leading-7
                  text-[var(--color-text-muted)]
                "
              >
                <p>
                  Chaque joueur répond
                  à quatre questions et
                  reçoit quatre cartes.
                </p>

                <p>
                  Mémorise ta main avant
                  le début de la pyramide.
                  Tes cartes restent ensuite
                  secrètes.
                </p>

                <p>
                  Lorsqu’une carte est
                  révélée, tu peux annoncer
                  posséder la même valeur
                  et choisir une cible.
                </p>

                <p>
                  La cible peut te croire
                  ou répondre
                  « Menteur ! ».
                </p>
              </div>
            )}

            {menuPage ===
              "ABOUT" && (
              <div className="mt-8 text-center">
                <div className="text-4xl">
                  ♠ ♥ ♦ ♣
                </div>

                <h3 className="mt-6 text-2xl font-black">
                  Pyramide du Gang
                </h3>

                <p
                  className="
                    mt-2
                    text-sm
                    text-[var(--color-text-muted)]
                  "
                >
                  Version 1.0.0
                </p>

                <ThemeCard
                  as="div"
                  variant="elevated"
                  className="
                    mt-8
                    rounded-2xl
                    p-5
                    text-center
                    shadow-none
                    sm:p-5
                  "
                >
                  <p
                    className="
                      text-sm
                      text-[var(--color-text-muted)]
                    "
                  >
                    Développé par
                  </p>

                  <p
                    className="
                      mt-2
                      text-xl
                      font-black
                      text-[var(--color-primary)]
                    "
                  >
                    Ludovic Bataille
                  </p>
                </ThemeCard>

                <p
                  className="
                    mt-6
                    text-xs
                    text-[var(--color-text-muted)]
                    opacity-60
                  "
                >
                  © 2026
                </p>
              </div>
            )}

            {menuPage ===
              "NEWS" && (
              <ThemeCard
                as="div"
                variant="elevated"
                className="
                  mt-7
                  rounded-2xl
                  p-5
                  shadow-none
                  sm:p-5
                "
              >
                <p
                  className="
                    text-xs
                    font-black
                    uppercase
                    tracking-wider
                    text-[var(--color-primary)]
                  "
                >
                  Version 1.0.0
                </p>

                <p
                  className="
                    mt-3
                    text-sm
                    leading-7
                    text-[var(--color-text-muted)]
                  "
                >
                  Première version de
                  Pyramide du Gang :
                  multijoueur en ligne,
                  reconnexion automatique,
                  bluff et pyramide
                  synchronisés.
                </p>
              </ThemeCard>
            )}
          </ThemeCard>
        </>
      )}
    </>
  );
}