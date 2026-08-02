import Hand from "@/components/game/Hand";

import type {
  Carte,
} from "@/lib/deck";

type MemoryScreenProps = {
  cards: Array<Carte | null>;
  seconds: number;
  durationSeconds?: number;
  hidden?: boolean;
  playerName?: string;
  variant?:
    | "MEMORIZATION"
    | "JOKER";
  className?: string;
};

function formaterTemps(
  seconds: number
): string {
  const safeSeconds =
    Math.max(
      0,
      Math.floor(seconds)
    );

  const minutes =
    Math.floor(
      safeSeconds / 60
    );

  const remainingSeconds =
    safeSeconds % 60;

  if (minutes === 0) {
    return String(
      remainingSeconds
    );
  }

  return `${minutes}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

export default function MemoryScreen({
  cards,
  seconds,
  durationSeconds = 60,
  hidden = false,
  playerName,
  variant = "MEMORIZATION",
  className = "",
}: MemoryScreenProps) {
  const tempsFormate =
    formaterTemps(seconds);

  const chronoTermine =
    seconds <= 0;

  const isJoker =
    variant === "JOKER";

  const safeDuration =
    Math.max(
      1,
      durationSeconds
    );

  const progression =
    Math.min(
      100,
      Math.max(
        0,
        (seconds /
          safeDuration) *
          100
      )
    );

  return (
    <main
      className={[
        "relative flex min-h-screen items-center justify-center overflow-hidden",
        "bg-[#0B0E13] px-4 py-10 text-white",
        className,
      ].join(" ")}
    >
      <div className="pointer-events-none absolute left-1/2 top-[-170px] h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-[#FFD166]/10 blur-[100px]" />

      <div className="pointer-events-none absolute bottom-[-180px] right-[-100px] h-[380px] w-[380px] rounded-full bg-[#7B5CFA]/10 blur-[110px]" />

      <section className="relative z-10 mx-auto w-full max-w-3xl">
        <header className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#FFD166]/50 bg-[#181A20] shadow-[0_0_30px_rgba(255,209,102,0.12)]">
            <span
              aria-hidden="true"
              className="text-3xl"
            >
              🧠
            </span>
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.35em] text-[#FFD166] sm:text-sm">
            Pyramide du Gang
          </p>

          <h1 className="mt-3 text-3xl font-black sm:text-5xl">
            {isJoker
              ? "Joker mémoire"
              : hidden
                ? "Cartes mémorisées"
                : "Mémorisez vos cartes"}
          </h1>

          {playerName && (
            <p className="mt-3 text-sm font-bold text-zinc-400">
              Main de{" "}
              <span className="text-white">
                {playerName}
              </span>
            </p>
          )}
        </header>

        <div className="mt-10 rounded-[28px] border border-[#2B2E36] bg-[#15171D]/90 px-2 py-8 shadow-[0_25px_70px_rgba(0,0,0,0.45)] backdrop-blur sm:px-8 sm:py-10">
          <Hand
            cards={cards}
            hidden={hidden}
            cardSize="medium"
          />
        </div>

        <div className="mt-8 flex justify-center">
          <div
            className={[
              "relative flex h-28 w-28 items-center justify-center rounded-full",
              "border-2 bg-[#15171D]",
              chronoTermine
                ? "border-[#7B5CFA] shadow-[0_0_35px_rgba(123,92,250,0.25)]"
                : "border-[#FFD166] shadow-[0_0_35px_rgba(255,209,102,0.18)]",
            ].join(" ")}
          >
            <div className="absolute inset-[7px] rounded-full border border-white/5" />

            <div className="relative text-center">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                Temps
              </p>

              <p
                className={[
                  "mt-1 font-mono text-4xl font-black",
                  chronoTermine
                    ? "text-[#9B87FF]"
                    : "text-[#FFD166]",
                ].join(" ")}
              >
                {tempsFormate}
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-xl text-center">
          <p className="text-lg font-black text-white">
            {isJoker
              ? "Mémorisez rapidement votre main."
              : hidden
                ? "Vos cartes sont maintenant cachées."
                : "Retenez bien les valeurs et les couleurs."}
          </p>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            {isJoker
              ? "Vous buvez 1 gorgée. Vos cartes seront recachées automatiquement."
              : hidden
                ? "La partie va continuer. Gardez votre main en mémoire."
                : "Elles disparaîtront automatiquement lorsque le compte à rebours sera terminé."}
          </p>
        </div>

        <div className="mx-auto mt-8 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-[#252832]">
          <div
            className={[
              "h-full rounded-full transition-all duration-500",
              hidden
                ? "bg-[#7B5CFA]"
                : "bg-[#FFD166]",
            ].join(" ")}
            style={{
              width: hidden
                ? "100%"
                : `${progression}%`,
            }}
          />
        </div>
      </section>
    </main>
  );
}