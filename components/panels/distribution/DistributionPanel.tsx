import type {
  GameAction,
} from "@/lib/gameEngine/actions";

import type {
  DistributionAnswer,
  GameState,
} from "@/lib/gameEngine/types";

interface DistributionPanelProps {
  state: GameState;

  onDispatch?: (
    action: GameAction
  ) => void;
}

interface AnswerChoice {
  answer: DistributionAnswer;
  label: string;
  description?: string;
}

const ANSWERS_BY_QUESTION: Record<
  0 | 1 | 2 | 3,
  AnswerChoice[]
> = {
  0: [
    {
      answer: "RED",
      label: "Rouge",
      description: "Cœur ou carreau",
    },
    {
      answer: "BLACK",
      label: "Noir",
      description: "Pique ou trèfle",
    },
  ],

  1: [
    {
      answer: "HIGHER",
      label: "Plus",
      description:
        "La prochaine carte est plus haute",
    },
    {
      answer: "LOWER",
      label: "Moins",
      description:
        "La prochaine carte est plus basse",
    },
  ],

  2: [
    {
      answer: "INSIDE",
      label: "Intérieur",
      description:
        "Entre les deux premières cartes",
    },
    {
      answer: "OUTSIDE",
      label: "Extérieur",
      description:
        "En dehors des deux premières cartes",
    },
  ],

  3: [
    {
      answer: "SPADES",
      label: "Pique",
    },
    {
      answer: "HEARTS",
      label: "Cœur",
    },
    {
      answer: "DIAMONDS",
      label: "Carreau",
    },
    {
      answer: "CLUBS",
      label: "Trèfle",
    },
  ],
};

const QUESTION_TITLES: Record<
  0 | 1 | 2 | 3,
  string
> = {
  0: "Rouge ou noir ?",
  1: "Plus ou moins ?",
  2: "Intérieur ou extérieur ?",
  3: "Quelle couleur ?",
};

const QUESTION_NUMBERS: Record<
  0 | 1 | 2 | 3,
  string
> = {
  0: "Première carte",
  1: "Deuxième carte",
  2: "Troisième carte",
  3: "Quatrième carte",
};

function getCardLabel(
  state: GameState
): string | null {
  const result =
    state.distribution.lastResult;

  if (!result) {
    return null;
  }

  return `${result.card.valeur} ${result.card.couleur}`;
}

export default function DistributionPanel({
  state,
  onDispatch,
}: DistributionPanelProps) {
  const {
    currentPlayer,
    question,
    awaitingGive,
    lastResult,
  } = state.distribution;

  const answers =
    ANSWERS_BY_QUESTION[question];

  const cardLabel =
    getCardLabel(state);

  const buttonsDisabled =
    !onDispatch || awaitingGive;

  function answer(
    selectedAnswer: DistributionAnswer
  ) {
    if (!onDispatch || awaitingGive) {
      return;
    }

    onDispatch({
      type: "ANSWER_DISTRIBUTION",
      answer: selectedAnswer,
    });
  }

  function giveDrink(
    target: number
  ) {
    if (!onDispatch || !awaitingGive) {
      return;
    }

    onDispatch({
      type: "GIVE_DISTRIBUTION_DRINK",
      target,
    });
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-900 p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
            Distribution
          </p>

          <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
            Joueur {currentPlayer + 1}
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            {QUESTION_NUMBERS[question]}
          </p>
        </div>

        <div className="flex gap-2">
          {[0, 1, 2, 3].map(
            (questionIndex) => {
              const isCurrent =
                questionIndex === question;

              const isCompleted =
                questionIndex < question;

              return (
                <div
                  key={questionIndex}
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-black",
                    isCurrent
                      ? "border-yellow-400 bg-yellow-400 text-zinc-950"
                      : isCompleted
                        ? "border-green-400/30 bg-green-400/10 text-green-300"
                        : "border-white/10 bg-zinc-950 text-zinc-600",
                  ].join(" ")}
                >
                  {questionIndex + 1}
                </div>
              );
            }
          )}
        </div>
      </div>

      {lastResult && (
        <div
          className={[
            "mt-6 rounded-2xl border p-5",
            lastResult.correct
              ? "border-green-400/20 bg-green-400/10"
              : "border-red-400/20 bg-red-400/10",
          ].join(" ")}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p
                className={[
                  "text-sm font-black uppercase tracking-wider",
                  lastResult.correct
                    ? "text-green-300"
                    : "text-red-300",
                ].join(" ")}
              >
                {lastResult.correct
                  ? "Bonne réponse"
                  : "Mauvaise réponse"}
              </p>

              <p className="mt-1 text-sm text-zinc-300">
                La carte était :
              </p>
            </div>

            {cardLabel && (
              <div className="rounded-xl border border-white/10 bg-zinc-950 px-5 py-3 text-xl font-black text-white">
                {cardLabel}
              </div>
            )}
          </div>

          <p className="mt-4 text-sm text-zinc-300">
            {lastResult.correct
              ? "Tu peux donner une gorgée à un autre joueur."
              : `Le joueur ${
                  lastResult.player + 1
                } boit une gorgée.`}
          </p>
        </div>
      )}

      {awaitingGive ? (
        <div className="mt-8">
          <h3 className="text-xl font-black text-white">
            À qui donnes-tu une gorgée ?
          </h3>

          <p className="mt-2 text-sm text-zinc-400">
            Choisis un autre membre du gang.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {state.players.map(
              (_, playerIndex) => {
                const isCurrentPlayer =
                  playerIndex ===
                  currentPlayer;

                return (
                  <button
                    key={playerIndex}
                    type="button"
                    disabled={
                      !onDispatch ||
                      isCurrentPlayer
                    }
                    onClick={() =>
                      giveDrink(
                        playerIndex
                      )
                    }
                    className={[
                      "rounded-2xl border px-5 py-4 text-left transition",
                      isCurrentPlayer
                        ? "cursor-not-allowed border-white/5 bg-zinc-950/50 text-zinc-700"
                        : "border-white/10 bg-zinc-950 text-white hover:border-yellow-400/50 hover:bg-yellow-400/10",
                    ].join(" ")}
                  >
                    <span className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Cible
                    </span>

                    <span className="mt-1 block text-lg font-black">
                      Joueur{" "}
                      {playerIndex + 1}
                    </span>

                    {isCurrentPlayer && (
                      <span className="mt-2 block text-xs text-zinc-600">
                        Impossible de se
                        choisir
                      </span>
                    )}
                  </button>
                );
              }
            )}
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <h3 className="text-xl font-black text-white sm:text-2xl">
            {QUESTION_TITLES[question]}
          </h3>

          <div
            className={[
              "mt-5 grid gap-4",
              answers.length === 4
                ? "sm:grid-cols-2 lg:grid-cols-4"
                : "sm:grid-cols-2",
            ].join(" ")}
          >
            {answers.map(
              ({
                answer: answerValue,
                label,
                description,
              }) => (
                <button
                  key={answerValue}
                  type="button"
                  disabled={
                    buttonsDisabled
                  }
                  onClick={() =>
                    answer(answerValue)
                  }
                  className="rounded-2xl border border-white/10 bg-zinc-950 p-5 text-left transition hover:border-yellow-400/50 hover:bg-yellow-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="block text-lg font-black text-white">
                    {label}
                  </span>

                  {description && (
                    <span className="mt-2 block text-sm text-zinc-500">
                      {description}
                    </span>
                  )}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {!onDispatch && (
        <p className="mt-6 text-center text-xs text-zinc-600">
          Mode aperçu : les actions sont
          désactivées.
        </p>
      )}
    </section>
  );
}