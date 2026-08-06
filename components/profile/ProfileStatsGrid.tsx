"use client";

import ThemeCard from "@/components/ui/ThemeCard";

interface ProfileStatsGridProps {
  gamesPlayed: number;

  gamesWon: number;

  winRate: number;

  drinksGiven: number;

  drinksTaken: number;

  successfulBluffs: number;
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
      "
    >
      <div
        className="
          flex
          items-center
          gap-3
        "
      >
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

export default function ProfileStatsGrid({
  gamesPlayed,
  gamesWon,
  winRate,
  drinksGiven,
  drinksTaken,
  successfulBluffs,
}: ProfileStatsGridProps) {
  return (
    <section>
      <div
        className="
          flex
          items-end
          justify-between
          gap-4
        "
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
            Statistiques
          </p>

          <h2
            className="
              mt-1
              text-2xl
              font-black
              text-[var(--color-text)]
            "
          >
            Ton parcours
          </h2>
        </div>

        <span
          className="
            text-xs
            font-bold
            text-[var(--color-text-muted)]
          "
        >
          Depuis le début
        </span>
      </div>

      <div
        className="
          mt-4
          grid
          grid-cols-2
          gap-3
        "
      >
        <StatCard
          icon="🎮"
          label="Parties"
          value={
            gamesPlayed
          }
        />

        <StatCard
          icon="🏆"
          label="Victoires"
          value={
            gamesWon
          }
        />

        <StatCard
          icon="📈"
          label="Taux de victoire"
          value={
            `${winRate} %`
          }
        />

        <StatCard
          icon="🍻"
          label="Gorgées données"
          value={
            drinksGiven
          }
        />

        <StatCard
          icon="🥴"
          label="Gorgées reçues"
          value={
            drinksTaken
          }
        />

        <StatCard
          icon="🎭"
          label="Bluffs réussis"
          value={
            successfulBluffs
          }
        />
      </div>
    </section>
  );
}