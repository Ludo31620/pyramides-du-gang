import Link from "next/link";

import HomeMenu from "@/components/home/HomeMenu";

interface HubLinkProps {
  href: string;
  icon: string;
  title: string;
  description: string;
}

function HubLink({
  href,
  icon,
  title,
  description,
}: HubLinkProps) {
  return (
    <Link
      href={href}
      className="
        group
        flex
        min-h-28
        flex-col
        rounded-2xl
        border
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        p-4
        text-left
        transition
        duration-200
        hover:border-[var(--color-primary)]
        hover:bg-[var(--color-surface-elevated)]
        active:scale-[0.98]
      "
    >
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className="text-2xl"
        >
          {icon}
        </span>

        <span
          aria-hidden="true"
          className="
            text-xl
            text-[var(--color-text-muted)]
            transition
            group-hover:translate-x-0.5
            group-hover:text-[var(--color-primary)]
          "
        >
          ›
        </span>
      </div>

      <p
        className="
          mt-4
          font-black
          text-[var(--color-text)]
        "
      >
        {title}
      </p>

      <p
        className="
          mt-1
          text-xs
          leading-5
          text-[var(--color-text-muted)]
        "
      >
        {description}
      </p>
    </Link>
  );
}

export default function HomePage() {
  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[var(--color-background)]
        px-5
        py-6
        text-[var(--color-text)]
        transition-colors
        duration-200
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[-12rem]
          h-[24rem]
          w-[24rem]
          -translate-x-1/2
          rounded-full
          opacity-[0.06]
        "
        style={{
          backgroundColor:
            "var(--color-primary)",
        }}
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-[-10rem]
          right-[-8rem]
          h-[20rem]
          w-[20rem]
          rounded-full
          opacity-[0.04]
        "
        style={{
          backgroundColor:
            "var(--color-primary)",
        }}
      />

      <HomeMenu />

      <section
        className="
          relative
          mx-auto
          flex
          min-h-[calc(100vh-3rem)]
          w-full
          max-w-md
          flex-col
          items-center
          justify-center
          py-12
        "
      >
        <div
          aria-hidden="true"
          className="
            flex
            items-center
            gap-4
            text-3xl
            sm:text-4xl
          "
        >
          <span className="text-[var(--color-text)]">
            ♠
          </span>

          <span className="text-red-500">
            ♥
          </span>

          <span className="text-red-500">
            ♦
          </span>

          <span className="text-[var(--color-text)]">
            ♣
          </span>
        </div>

        <h1
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
          Pyramide

          <span
            className="
              mt-2
              block
              text-[var(--color-primary)]
              transition-colors
              duration-200
            "
          >
            du Gang
          </span>
        </h1>

        <p
          className="
            mt-5
            max-w-xs
            text-center
            text-sm
            leading-6
            text-[var(--color-text-muted)]
          "
        >
          Bluffe, accuse et fais boire
          le Gang.
        </p>

        <div className="mt-12 w-full space-y-4">
          <Link
            href="/creer"
            className="
              flex
              min-h-16
              w-full
              items-center
              justify-center
              gap-3
              rounded-2xl
              border
              border-[var(--color-primary)]
              bg-[var(--color-primary)]
              px-6
              py-4
              text-center
              text-lg
              font-black
              text-[var(--color-primary-text)]
              shadow-lg
              transition
              duration-200
              hover:bg-[var(--color-primary-hover)]
              active:scale-[0.98]
            "
          >
            <span aria-hidden="true">
              🎮
            </span>

            Créer une partie
          </Link>

          <Link
            href="/rejoindre"
            className="
              flex
              min-h-16
              w-full
              items-center
              justify-center
              gap-3
              rounded-2xl
              border
              border-[var(--color-border)]
              bg-[var(--color-surface)]
              px-6
              py-4
              text-center
              text-lg
              font-black
              text-[var(--color-text)]
              transition
              duration-200
              hover:border-[var(--color-primary)]
              hover:bg-[var(--color-surface-elevated)]
              active:scale-[0.98]
            "
          >
            <span aria-hidden="true">
              👥
            </span>

            Rejoindre une partie
          </Link>
        </div>

        <div
          className="
            my-8
            flex
            w-full
            items-center
            gap-4
          "
        >
          <div
            className="
              h-px
              flex-1
              bg-[var(--color-border)]
            "
          />

          <p
            className="
              text-[10px]
              font-black
              uppercase
              tracking-[0.25em]
              text-[var(--color-text-muted)]
            "
          >
            Mon espace
          </p>

          <div
            className="
              h-px
              flex-1
              bg-[var(--color-border)]
            "
          />
        </div>

        <div
          className="
            grid
            w-full
            grid-cols-2
            gap-3
          "
        >
          <HubLink
            href="/statistiques"
            icon="📊"
            title="Statistiques"
            description="Consulte tes performances."
          />

          <HubLink
            href="/succes"
            icon="🏆"
            title="Succès"
            description="Découvre tes défis débloqués."
          />

          <HubLink
            href="/premium"
            icon="🎨"
            title="Thèmes"
            description="Personnalise l’ambiance du jeu."
          />

          <HubLink
            href="/premium"
            icon="💎"
            title="Premium"
            description="Découvre tous les avantages."
          />
        </div>

        <p
          className="
            mt-8
            text-center
            text-xs
            text-[var(--color-text-muted)]
            opacity-70
          "
        >
          Chaque joueur utilise son
          propre téléphone.
        </p>
      </section>
    </main>
  );
}