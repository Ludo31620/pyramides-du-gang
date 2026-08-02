"use client";

import type {
  Carte,
} from "@/lib/deck";

import type {
  DistributionAnswer,
  DistributionQuestion,
  DistributionState,
} from "@/lib/gameEngine/types";

type QuestionConfiguration = {
  eyebrow: string;
  title: string;
  description: string;

  options: {
    answer: DistributionAnswer;
    label: string;
    icon: string;
  }[];
};

type DistributionScreenProps = {
  distribution: DistributionState;
  players: Carte[][];
  localPlayer: number;
  playerCount: number;

  onChangeLocalPlayer: (
    player: number
  ) => void;

  onAnswer: (
    answer: DistributionAnswer
  ) => void;

  onGiveDrink: (
    target: number
  ) => void;
};

const QUESTIONS: Record<
  DistributionQuestion,
  QuestionConfiguration
> = {
  0: {
    eyebrow: "Première carte",
    title: "Rouge ou Noir ?",

    description:
      "Devine la couleur de ta première carte.",

    options: [
      {
        answer: "RED",
        label: "Rouge",
        icon: "🔴",
      },
      {
        answer: "BLACK",
        label: "Noir",
        icon: "⚫",
      },
    ],
  },

  1: {
    eyebrow: "Deuxième carte",
    title: "Plus ou Moins ?",

    description:
      "La prochaine carte sera-t-elle plus haute ou plus basse que la première ?",

    options: [
      {
        answer: "HIGHER",
        label: "Plus",
        icon: "⬆️",
      },
      {
        answer: "LOWER",
        label: "Moins",
        icon: "⬇️",
      },
    ],
  },

  2: {
    eyebrow: "Troisième carte",
    title:
      "Intérieur ou Extérieur ?",

    description:
      "La prochaine valeur sera-t-elle comprise entre les deux premières ?",

    options: [
      {
        answer: "INSIDE",
        label: "Intérieur",
        icon: "↔️",
      },
      {
        answer: "OUTSIDE",
        label: "Extérieur",
        icon: "↗️",
      },
    ],
  },

  3: {
    eyebrow: "Quatrième carte",

    title:
      "Pique, Cœur, Carreau ou Trèfle ?",

    description:
      "Devine le symbole exact de ta quatrième carte.",

    options: [
      {
        answer: "SPADES",
        label: "Pique",
        icon: "♠",
      },
      {
        answer: "HEARTS",
        label: "Cœur",
        icon: "♥",
      },
      {
        answer: "DIAMONDS",
        label: "Carreau",
        icon: "♦",
      },
      {
        answer: "CLUBS",
        label: "Trèfle",
        icon: "♣",
      },
    ],
  },
};

function estCarteRouge(
  carte: Carte
): boolean {
  return (
    carte.couleur === "♥" ||
    carte.couleur === "♦"
  );
}

function CarteDistribution({
  carte,
}: {
  carte: Carte;
}) {
  const rouge =
    estCarteRouge(carte);

  return (
    <div
      className={[
        "flex h-36 w-24 flex-col justify-between",
        "rounded-xl border-2 bg-white p-3",
        "shadow-[0_15px_40px_rgba(0,0,0,0.35)]",

        rouge
          ? "border-red-200 text-red-600"
          : "border-zinc-300 text-zinc-950",
      ].join(" ")}
    >
      <div className="text-left">
        <p className="text-lg font-black leading-none">
          {carte.valeur}
        </p>

        <p className="mt-1 text-2xl leading-none">
          {carte.couleur}
        </p>
      </div>

      <p className="text-center text-5xl leading-none">
        {carte.couleur}
      </p>

      <div className="rotate-180 text-left">
        <p className="text-lg font-black leading-none">
          {carte.valeur}
        </p>

        <p className="mt-1 text-2xl leading-none">
          {carte.couleur}
        </p>
      </div>
    </div>
  );
}

export default function DistributionScreen({
  distribution,
  players,
  localPlayer,
  playerCount,
  onChangeLocalPlayer,
  onAnswer,
  onGiveDrink,
}: DistributionScreenProps) {
  const joueurActif =
    distribution.currentPlayer;

  const estMonTour =
    joueurActif === localPlayer;

  const question =
    QUESTIONS[
      distribution.question
    ];

  const resultat =
    distribution.lastResult;

  const resultatPersonnel =
    resultat?.player === localPlayer
      ? resultat
      : null;

  const derniereGorgee =
    distribution.lastDrink;

  const gorgeeRecue =
    derniereGorgee?.target ===
    localPlayer
      ? derniereGorgee
      : null;

  const gorgeeDonnee =
    derniereGorgee?.giver ===
    localPlayer
      ? derniereGorgee
      : null;

  const mainLocale =
    players[localPlayer] ?? [];

  const cibles =
    Array.from(
      {
        length:
          playerCount,
      },
      (_, index) => index
    ).filter(
      (index) =>
        index !== joueurActif
    );

  return (
    <main className="min-h-screen bg-[#0B0E13] px-4 py-8 text-white">
      <div className="mx-auto w-full max-w-2xl">
        <header className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[#FFD166]">
            Pyramide du Gang
          </p>

          <h1 className="mt-3 text-4xl font-black">
            Distribution
          </h1>

          <p className="mt-2 text-zinc-400">
            Chaque joueur reçoit ses
            quatre cartes
          </p>
        </header>

        <section className="mt-6 rounded-2xl border border-[#292C34] bg-[#181A20] p-4">
          <label
            htmlFor="distribution-local-player"
            className="block text-center text-xs font-black uppercase tracking-wider text-zinc-500"
          >
            Téléphone simulé
          </label>

          <select
            id="distribution-local-player"
            value={localPlayer}
            onChange={(event) =>
              onChangeLocalPlayer(
                Number(
                  event.target.value
                )
              )
            }
            className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-center font-bold text-white"
          >
            {players.map(
              (_, index) => (
                <option
                  key={index}
                  value={index}
                >
                  Joueur{" "}
                  {index + 1}
                </option>
              )
            )}
          </select>
        </section>

        <section className="mt-6 rounded-2xl border border-[#292C34] bg-[#181A20] p-5 text-center">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
            Joueur actif
          </p>

          <p className="mt-2 text-3xl font-black text-[#FFD166]">
            Joueur{" "}
            {joueurActif + 1}
          </p>

          <p className="mt-2 text-sm text-zinc-400">
            Carte{" "}
            {distribution.question + 1}{" "}
            sur 4
          </p>
        </section>

        {gorgeeRecue && (
          <section className="mt-6 rounded-2xl border border-orange-400/50 bg-orange-500/15 p-6 text-center">
            <p className="text-6xl">
              🍺
            </p>

            <h2 className="mt-3 text-3xl font-black text-orange-300">
              Tu bois 1 gorgée !
            </h2>

            <p className="mt-3 text-zinc-200">
              Le joueur{" "}
              {gorgeeRecue.giver + 1}{" "}
              t’a donné 1 gorgée.
            </p>
          </section>
        )}

        {gorgeeDonnee && (
          <section className="mt-6 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-center">
            <p className="text-4xl">
              🍻
            </p>

            <p className="mt-3 font-bold text-emerald-200">
              Tu as donné 1 gorgée au
              joueur{" "}
              {gorgeeDonnee.target + 1}.
            </p>
          </section>
        )}

        {mainLocale.length > 0 && (
          <section className="mt-6 rounded-2xl border border-[#292C34] bg-[#181A20] p-5">
            <p className="text-center text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
              Tes cartes
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {mainLocale.map(
                (
                  carte,
                  index
                ) => (
                  <CarteDistribution
                    key={`${carte.valeur}-${carte.couleur}-${index}`}
                    carte={carte}
                  />
                )
              )}
            </div>
          </section>
        )}

        {resultatPersonnel && (
          <section
            className={[
              "mt-6 rounded-2xl border p-5 text-center",

              resultatPersonnel.correct
                ? "border-emerald-500/40 bg-emerald-500/10"
                : "border-red-500/40 bg-red-500/10",
            ].join(" ")}
          >
            <p className="text-5xl">
              {resultatPersonnel.correct
                ? "✅"
                : "❌"}
            </p>

            <h2 className="mt-3 text-2xl font-black">
              {resultatPersonnel.correct
                ? "Bonne réponse !"
                : "Mauvaise réponse !"}
            </h2>

            <div className="mt-5 flex justify-center">
              <CarteDistribution
                carte={
                  resultatPersonnel.card
                }
              />
            </div>

            <p className="mt-4 font-bold text-zinc-200">
              {resultatPersonnel.correct
                ? distribution.awaitingGive
                  ? "Tu peux donner 1 gorgée."
                  : "Ta gorgée a été donnée."
                : "Tu bois 1 gorgée."}
            </p>
          </section>
        )}

        {!estMonTour && (
          <section className="mt-6 rounded-2xl border border-[#292C34] bg-[#181A20] p-6 text-center">
            <p className="text-5xl">
              ⏳
            </p>

            <h2 className="mt-4 text-2xl font-black">
              En attente
            </h2>

            <p className="mt-2 text-zinc-400">
              Le joueur{" "}
              {joueurActif + 1} doit
              répondre.
            </p>
          </section>
        )}

        {estMonTour &&
          !distribution.awaitingGive && (
            <section className="mt-6 rounded-2xl border border-[#FFD166]/30 bg-[#181A20] p-6 text-center">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#FFD166]">
                {question.eyebrow}
              </p>

              <h2 className="mt-3 text-3xl font-black">
                {question.title}
              </h2>

              <p className="mx-auto mt-3 max-w-md text-zinc-400">
                {question.description}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {question.options.map(
                  (option) => (
                    <button
                      key={
                        option.answer
                      }
                      type="button"
                      onClick={() =>
                        onAnswer(
                          option.answer
                        )
                      }
                      className="rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-5 text-lg font-black transition hover:border-[#FFD166] hover:bg-zinc-800 active:scale-[0.98]"
                    >
                      <span
                        className={[
                          "mr-2",

                          option.answer ===
                            "HEARTS" ||
                          option.answer ===
                            "DIAMONDS"
                            ? "text-red-500"
                            : "text-white",
                        ].join(" ")}
                      >
                        {option.icon}
                      </span>

                      {option.label}
                    </button>
                  )
                )}
              </div>
            </section>
          )}

        {estMonTour &&
          distribution.awaitingGive && (
            <section className="mt-6 rounded-2xl border border-emerald-500/30 bg-[#181A20] p-6 text-center">
              <p className="text-5xl">
                🍻
              </p>

              <h2 className="mt-3 text-2xl font-black">
                Donne 1 gorgée
              </h2>

              <p className="mt-2 text-zinc-400">
                Choisis le joueur qui
                devra boire.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {cibles.map(
                  (cible) => (
                    <button
                      key={cible}
                      type="button"
                      onClick={() =>
                        onGiveDrink(
                          cible
                        )
                      }
                      className="rounded-xl bg-[#FFD166] px-5 py-4 font-black text-[#111318] transition hover:bg-[#FFE08A] active:scale-[0.98]"
                    >
                      Joueur{" "}
                      {cible + 1}
                    </button>
                  )
                )}
              </div>
            </section>
          )}
      </div>
    </main>
  );
}