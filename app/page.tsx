"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  useRouter,
} from "next/navigation";

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
        border-white/10
        bg-zinc-900
        px-5
        py-4
        text-left
        text-white
        transition
        hover:border-yellow-400/30
        hover:bg-yellow-400/10
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
        className="ml-auto text-zinc-600"
      >
        ›
      </span>
    </button>
  );
}

export default function HomePage() {
  const router =
    useRouter();

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

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#0B0E13] px-5 py-6 text-white">
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[-14rem]
          h-[30rem]
          w-[30rem]
          -translate-x-1/2
          rounded-full
          bg-yellow-400/10
          blur-[110px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-[-16rem]
          right-[-12rem]
          h-[28rem]
          w-[28rem]
          rounded-full
          bg-amber-800/10
          blur-[120px]
        "
      />

      <motion.button
        type="button"
        aria-label="Ouvrir le menu"
        onClick={openMenu}
        initial={{
          opacity: 0,
          scale: 0.8,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.35,
          delay: 0.5,
        }}
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
          border-white/10
          bg-zinc-900/90
          text-xl
          shadow-lg
          backdrop-blur-md
          transition
          hover:border-yellow-400/30
          hover:bg-zinc-800
          active:scale-95
        "
      >
        ⚙️
      </motion.button>

      <section className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md flex-col items-center justify-center">
        <motion.div
          aria-hidden="true"
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
          }}
          className="flex items-center gap-4 text-3xl sm:text-4xl"
        >
          <span className="text-zinc-100">
            ♠
          </span>

          <span className="text-red-500">
            ♥
          </span>

          <span className="text-red-500">
            ♦
          </span>

          <span className="text-zinc-100">
            ♣
          </span>
        </motion.div>

        <motion.h1
          initial={{
            opacity: 0,
            y: 24,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.08,
          }}
          className="
            mt-8
            text-center
            text-5xl
            font-black
            uppercase
            leading-[0.9]
            tracking-[-0.05em]
            sm:text-6xl
          "
        >
          Pyramides

          <span className="mt-2 block text-yellow-400">
            du Gang
          </span>
        </motion.h1>

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.18,
          }}
          className="mt-16 w-full space-y-4"
        >
          <button
            type="button"
            onClick={() =>
              router.push(
                "/creer"
              )
            }
            className="
              min-h-16
              w-full
              rounded-2xl
              bg-yellow-400
              px-6
              py-4
              text-lg
              font-black
              text-zinc-950
              shadow-[0_0_35px_rgba(250,204,21,0.16)]
              transition
              hover:bg-yellow-300
              active:scale-[0.98]
            "
          >
            Créer une partie
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/rejoindre"
              )
            }
            className="
              min-h-16
              w-full
              rounded-2xl
              border
              border-white/10
              bg-zinc-900
              px-6
              py-4
              text-lg
              font-black
              text-white
              transition
              hover:border-yellow-400/30
              hover:bg-zinc-800
              active:scale-[0.98]
            "
          >
            Rejoindre une partie
          </button>
        </motion.div>
      </section>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Fermer le menu"
              onClick={closeMenu}
              className="
                fixed
                inset-0
                z-40
                cursor-default
                bg-black/70
                backdrop-blur-sm
              "
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
              }}
            />

            <motion.section
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="
                fixed
                inset-x-3
                bottom-3
                z-50
                mx-auto
                max-h-[85vh]
                max-w-md
                overflow-y-auto
                rounded-[2rem]
                border
                border-white/10
                bg-zinc-950
                p-5
                shadow-2xl
                sm:bottom-auto
                sm:top-1/2
                sm:-translate-y-1/2
              "
              initial={{
                opacity: 0,
                y: 50,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 50,
                scale: 0.96,
              }}
              transition={{
                duration: 0.25,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
                    Pyramides du Gang
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
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/10
                    bg-zinc-900
                    text-zinc-300
                    transition
                    hover:bg-zinc-800
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
                  className="mt-5 text-sm font-bold text-yellow-400"
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
                <div className="mt-6 space-y-5 text-sm leading-7 text-zinc-300">
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
                    Pyramides du Gang
                  </h3>

                  <p className="mt-2 text-sm text-zinc-500">
                    Version 1.0.0
                  </p>

                  <div className="mt-8 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-5">
                    <p className="text-sm text-zinc-400">
                      Développé par
                    </p>

                    <p className="mt-2 text-xl font-black text-yellow-400">
                      Ludovic Bataille
                    </p>
                  </div>

                  <p className="mt-6 text-xs text-zinc-600">
                    © 2026
                  </p>
                </div>
              )}

              {menuPage ===
                "NEWS" && (
                <div className="mt-7 rounded-2xl border border-white/10 bg-zinc-900 p-5">
                  <p className="text-xs font-black uppercase tracking-wider text-yellow-400">
                    Version 1.0.0
                  </p>

                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    Première version de
                    Pyramides du Gang :
                    multijoueur en ligne,
                    reconnexion automatique,
                    bluff et pyramide
                    synchronisés.
                  </p>
                </div>
              )}
            </motion.section>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}