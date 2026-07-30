"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import {
  Badge,
  Button,
  Card,
  Panel,
} from "@/components/ui";

import { theme } from "@/lib/theme";

const FEATURES = [
  {
    icon: "🃏",
    title: "Mémorise tes cartes",
    description:
      "Observe ta main, retiens-la bien… puis interdiction de la consulter.",
  },
  {
    icon: "🎭",
    title: "Bluffe le gang",
    description:
      "Prétends posséder la bonne carte et fais boire ta cible.",
  },
  {
    icon: "⚠️",
    title: "Démasque les menteurs",
    description:
      "Crois ton adversaire ou accuse-le de mentir à tes risques et périls.",
  },
] as const;

const RULES = [
  {
    number: "01",
    title: "Observe",
    description:
      "Mémorise les quatre cartes secrètes qui composent ta main.",
  },
  {
    number: "02",
    title: "Bluffe",
    description:
      "Lorsqu’une valeur identique apparaît dans la pyramide, attaque un joueur.",
  },
  {
    number: "03",
    title: "Décide",
    description:
      "La cible choisit de boire ou de crier « Menteur ! ».",
  },
] as const;

export default function HomePage() {
  const router = useRouter();

  function handleCreateGame(): void {
    router.push("/creer");
  }

  function handleJoinGame(): void {
    router.push("/rejoindre");
  }

  function handleDiscoverRules(): void {
    document
      .getElementById("regles")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0B0E13] text-white">
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[-16rem]
          h-[34rem]
          w-[34rem]
          -translate-x-1/2
          rounded-full
          bg-[#FFD166]/10
          blur-[120px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          right-[-12rem]
          top-[30rem]
          h-[28rem]
          w-[28rem]
          rounded-full
          bg-amber-900/10
          blur-[120px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.025]
          [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)]
          [background-size:48px_48px]
        "
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between py-6 sm:py-8">
          <motion.div
            initial={{
              opacity: 0,
              x: -20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: theme.animation.normal,
              ease: theme.animation.easing,
            }}
            className="flex items-center gap-3"
          >
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                border
                border-[#FFD166]/30
                bg-[#FFD166]/10
                text-xl
                shadow-[0_0_30px_rgba(255,209,102,0.15)]
              "
            >
              △
            </div>

            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-white">
                Pyramides
              </p>

              <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#FFD166]">
                du Gang
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: theme.animation.normal,
              ease: theme.animation.easing,
              delay: 0.1,
            }}
          >
            <Badge variant="gold">
              Dossier secret
            </Badge>
          </motion.div>
        </header>

        <section
          className="
            grid
            flex-1
            items-center
            gap-12
            py-12
            lg:grid-cols-[1.1fr_0.9fr]
            lg:gap-16
            lg:py-20
          "
        >
          <div className="text-center lg:text-left">
            <motion.div
              initial={{
                opacity: 0,
                y: 16,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: theme.animation.normal,
                ease: theme.animation.easing,
                delay: 0.1,
              }}
              className="mb-6"
            >
              <Badge variant="gray">
                Jeu de mémoire, de bluff et de trahison
              </Badge>
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
                duration: theme.animation.slow,
                ease: theme.animation.easing,
                delay: 0.18,
              }}
              className="
                text-5xl
                font-black
                uppercase
                leading-[0.92]
                tracking-[-0.05em]
                sm:text-6xl
                lg:text-7xl
                xl:text-8xl
              "
            >
              Entre dans
              <span
                className="
                  mt-2
                  block
                  bg-gradient-to-r
                  from-[#FFE08A]
                  via-[#FFD166]
                  to-[#D9A928]
                  bg-clip-text
                  text-transparent
                "
              >
                le gang
              </span>
            </motion.h1>

            <motion.p
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: theme.animation.normal,
                ease: theme.animation.easing,
                delay: 0.28,
              }}
              className="
                mx-auto
                mt-7
                max-w-2xl
                text-base
                leading-7
                text-zinc-400
                sm:text-lg
                lg:mx-0
              "
            >
              Mémorise tes cartes, infiltre la pyramide et bluffe
              tes adversaires. Ici, une accusation peut retourner
              toute la partie.
            </motion.p>

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: theme.animation.normal,
                ease: theme.animation.easing,
                delay: 0.36,
              }}
              className="
                mx-auto
                mt-9
                grid
                max-w-md
                gap-3
                sm:grid-cols-2
                lg:mx-0
              "
            >
              <Button
                size="lg"
                fullWidth
                onClick={handleCreateGame}
                rightIcon={
                  <span aria-hidden="true">
                    →
                  </span>
                }
              >
                Créer une partie
              </Button>

              <Button
                variant="secondary"
                size="lg"
                fullWidth
                onClick={handleJoinGame}
              >
                Rejoindre une partie
              </Button>

              <div className="sm:col-span-2">
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={handleDiscoverRules}
                >
                  Voir les règles
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                duration: theme.animation.slow,
                delay: 0.48,
              }}
              className="
                mt-7
                flex
                flex-wrap
                items-center
                justify-center
                gap-x-6
                gap-y-2
                text-sm
                font-semibold
                text-zinc-500
                lg:justify-start
              "
            >
              <span>De 2 à 9 joueurs</span>

              <span className="hidden text-[#FFD166] sm:inline">
                •
              </span>

              <span>Chacun joue sur son téléphone</span>
            </motion.div>
          </div>

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.94,
              rotateY: -8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotateY: 0,
            }}
            transition={{
              duration: 0.6,
              ease: theme.animation.easing,
              delay: 0.2,
            }}
            className="relative mx-auto w-full max-w-lg"
          >
            <div
              aria-hidden="true"
              className="
                absolute
                inset-8
                rounded-[2rem]
                bg-[#FFD166]/15
                blur-[60px]
              "
            />

            <Panel className="relative p-5 sm:p-7">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p
                    className="
                      text-xs
                      font-black
                      uppercase
                      tracking-[0.22em]
                      text-[#FFD166]
                    "
                  >
                    Dossier nº 001
                  </p>

                  <h2 className="mt-2 text-2xl font-black">
                    La pyramide
                  </h2>
                </div>

                <Badge variant="danger">
                  Confidentiel
                </Badge>
              </div>

              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((row) => (
                  <div
                    key={row}
                    className="flex justify-center gap-2"
                  >
                    {Array.from({
                      length: 6 - row,
                    }).map((_, index) => (
                      <motion.div
                        key={`${row}-${index}`}
                        initial={{
                          opacity: 0,
                          y: 10,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          duration: theme.animation.fast,
                          delay:
                            0.5 +
                            row * 0.05 +
                            index * 0.025,
                        }}
                        className="
                          flex
                          h-16
                          w-11
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-[#FFD166]/20
                          bg-gradient-to-br
                          from-[#252830]
                          to-[#111318]
                          shadow-lg
                          sm:h-20
                          sm:w-14
                          sm:rounded-xl
                        "
                      >
                        <span
                          aria-hidden="true"
                          className="
                            text-xs
                            font-black
                            text-[#FFD166]/50
                            sm:text-sm
                          "
                        >
                          △
                        </span>
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>

              <div
                className="
                  mt-7
                  flex
                  items-center
                  justify-between
                  rounded-2xl
                  border
                  border-white/10
                  bg-black/20
                  px-4
                  py-3
                "
              >
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-500">
                    Prochaine mission
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    Mémoriser les cartes
                  </p>
                </div>

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-[#FFD166]
                    font-black
                    text-[#111318]
                  "
                >
                  60
                </div>
              </div>
            </Panel>
          </motion.div>
        </section>

        <section className="border-t border-white/5 py-16 sm:py-20">
          <div
            className="
              grid
              gap-4
              md:grid-cols-3
            "
          >
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.25,
                }}
                transition={{
                  duration: theme.animation.normal,
                  ease: theme.animation.easing,
                  delay: index * 0.08,
                }}
              >
                <Card
                  icon={
                    <span className="text-xl">
                      {feature.icon}
                    </span>
                  }
                  title={feature.title}
                  className="h-full"
                >
                  <p className="text-sm leading-6 text-zinc-400">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section
          id="regles"
          className="
            scroll-mt-8
            border-t
            border-white/5
            py-16
            sm:py-24
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              duration: theme.animation.normal,
              ease: theme.animation.easing,
            }}
            className="mx-auto mb-10 max-w-2xl text-center"
          >
            <Badge variant="gold">
              Comment jouer
            </Badge>

            <h2
              className="
                mt-5
                text-3xl
                font-black
                uppercase
                tracking-tight
                sm:text-4xl
              "
            >
              Trois étapes.

              <span className="block text-[#FFD166]">
                Une seule vérité.
              </span>
            </h2>

            <p className="mt-4 leading-7 text-zinc-400">
              La pyramide révèle les cartes une par une. Le reste
              dépend de ta mémoire et de ton talent pour mentir.
            </p>
          </motion.div>

          <div className="grid gap-4 lg:grid-cols-3">
            {RULES.map((rule, index) => (
              <motion.div
                key={rule.number}
                initial={{
                  opacity: 0,
                  y: 24,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.25,
                }}
                transition={{
                  duration: theme.animation.normal,
                  ease: theme.animation.easing,
                  delay: index * 0.08,
                }}
              >
                <Card
                  variant={
                    index === 1
                      ? "gold"
                      : "default"
                  }
                  className="h-full"
                >
                  <span
                    className="
                      text-4xl
                      font-black
                      text-[#FFD166]/30
                    "
                  >
                    {rule.number}
                  </span>

                  <h3 className="mt-5 text-xl font-black text-white">
                    {rule.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    {rule.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              duration: theme.animation.normal,
              ease: theme.animation.easing,
            }}
            className="mx-auto mt-12 grid max-w-md gap-3"
          >
            <Button
              size="lg"
              fullWidth
              onClick={handleCreateGame}
            >
              Créer une partie
            </Button>

            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={handleJoinGame}
            >
              Rejoindre une partie
            </Button>
          </motion.div>
        </section>

        <footer
          className="
            flex
            flex-col
            items-center
            justify-between
            gap-3
            border-t
            border-white/5
            py-8
            text-center
            text-xs
            text-zinc-600
            sm:flex-row
            sm:text-left
          "
        >
          <p>
            Pyramides du Gang — Jeu de bluff entre amis
          </p>

          <p>
            by{" "}
            <span className="font-bold text-[#FFD166]">
              Ludo B
            </span>
          </p>
        </footer>
      </div>
    </main>
  );
}